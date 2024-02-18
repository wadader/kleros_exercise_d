import { useWalletClient } from "wagmi";
import { RPS_ARTIFACT } from "../../config/artifacts/RPS";
import type { Moves } from "../../types/game";
import type { EthAddress, EthHash } from "../../types/identifier";
import { isHash } from "../../types/identifier";
import { useState } from "react";
import { gameApi, publicClient, saltApi } from "../../config/config";
import { encodePacked, keccak256 } from "viem";
import useWalletInteractionStore from "../../store/walletInteraction";
import useGameStore from "../../store/game";
import type { NavigateFunction } from "react-router-dom";
import showTxFailedNotification from "../../features/TransactionFailedNotification";
import { BACKEND_REFERENCE_TIMEOUT } from "../../features/consts";

function useCreateGame(
  createGameArgs: UseCreateGameArgs,
  navigate: NavigateFunction
) {
  const [createGameTxHash, setCreateGameTxHash] = useState<EthHash>();
  const { data: walletClient } = useWalletClient();

  async function createGame() {
    try {
      useWalletInteractionStore.getState().setStartInteraction();
      if (walletClient === undefined || createGameArgs === undefined) return;

      const { move, joinerAddress, value } = createGameArgs;

      const { hashedMove, salt } = await getHashedMove(move);

      const { abi, bytecodeFiftenSecondTimeout, gasEstimates } = RPS_ARTIFACT;
      const createdTxHash = await walletClient.deployContract({
        abi,
        bytecode: bytecodeFiftenSecondTimeout,
        args: [hashedMove, joinerAddress],
        value,
        gas: BigInt(Number(gasEstimates.creation.totalCost) * 2),
      });
      if (!isHash(createdTxHash)) {
        console.error("hash not as expected. Report error");
        return;
      }

      const createGameTxReceipt = await publicClient.waitForTransactionReceipt({
        hash: createdTxHash,
      });

      if (createGameTxReceipt.status === "reverted") {
        showTxFailedNotification();
        return;
      }

      const { createdGameAddress, creatorIdentifier, lastAction } =
        await createGameBackendReference(createdTxHash, salt);
      useGameStore.getState().saveCreatedGame({
        salt,
        creatorIdentifier,
        createdTime: lastAction,
        createdContractAddress: createdGameAddress,
      });
      setCreateGameTxHash(createdTxHash);
      useWalletInteractionStore.getState().setHasExitedInteraction();
      navigate("/solve");
    } catch (e) {
      console.error("createGame-error", e);
      useWalletInteractionStore.getState().setHasExitedInteraction();
    }
  }

  return { createGameTxHash, createGame };
}

export default useCreateGame;

async function generateSalt() {
  return await saltApi.post("salt").json<GenerateSaltResponse>();
}

async function getHashedMove(move: Moves) {
  const { salt } = await generateSalt();
  const hashedMove = keccak256(
    encodePacked(["uint8", "uint256"], [move, BigInt(salt)])
  );
  return { salt, hashedMove };
}

async function createGameBackendReference(
  gameCreationTxHash: EthHash,
  salt: string
) {
  const createGameReqBody: CreateGameReqBody = {
    gameCreationTxHash,
    salt,
  };
  return await gameApi
    .post("game", {
      json: createGameReqBody,
      timeout: BACKEND_REFERENCE_TIMEOUT,
    })
    .json<CreateGameResponse>();
}

export type UseCreateGameArgs = CreateGameConstructorArgs | undefined;

interface CreateGameConstructorArgs {
  move: Moves;
  joinerAddress: EthAddress;
  value: bigint;
}

interface CreateGameReqBody {
  gameCreationTxHash: EthHash;
  salt: string;
}

interface CreateGameResponse {
  ok: true;
  message: "game record saved";
  creatorIdentifier: string;
  createdGameAddress: EthAddress;
  lastAction: number;
}

interface GenerateSaltResponse {
  salt: string;
}
