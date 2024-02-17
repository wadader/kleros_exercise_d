import { useWalletClient } from "wagmi";
import { RPS_ARTIFACT } from "../../config/artifacts/RPS";
import type { Move } from "../../types/game";
import type { EthAddress, Hash } from "../../types/identifier";
import { isHash } from "../../types/identifier";

import { useState } from "react";
import ky from "ky";
import { BACKEND, saltApi } from "../../config/config";
import { encodePacked, keccak256 } from "viem";
import useWalletInteractionStore from "../../store/walletInteraction";
import useGameStore from "../../store/game";
import { BACKEND_REFERENCE_TIMEOUT } from "../consts";
import type { NavigateFunction } from "react-router-dom";

function useCreateGame(
  createGameArgs: UseCreateGameArgs,
  navigate: NavigateFunction
) {
  const [createGameTxHash, setCreateGameTxHash] = useState<Hash>();
  const { data: walletClient } = useWalletClient();

  async function createGame() {
    console.table({ walletClient, createGameArgs });
    try {
      useWalletInteractionStore.getState().setStartInteraction();
      if (walletClient === undefined || createGameArgs === undefined) return;

      const { move, joinerAddress, value } = createGameArgs;

      const { hashedMove, salt } = await getHashedMove(move);

      const { abi, bytecode, gasEstimates } = RPS_ARTIFACT;
      const createdTxHash = await walletClient.deployContract({
        abi,
        bytecode,
        args: [hashedMove, joinerAddress],
        value,
        gas: BigInt(Number(gasEstimates.creation.totalCost) * 2),
      });
      if (!isHash(createdTxHash)) {
        console.error("hash not as expected. Report error");
        return;
      }

      console.log("createdTxHash:", createdTxHash);

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

async function getHashedMove(move: Move) {
  const { salt } = await generateSalt();
  const hashedMove = keccak256(
    encodePacked(["uint8", "uint256"], [move, BigInt(salt)])
  );
  return { salt, hashedMove };
}

async function createGameBackendReference(
  gameCreationTxHash: Hash,
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

const gameApi = ky.create({
  prefixUrl: `${BACKEND}/game`,
  credentials: "include",
});

export type UseCreateGameArgs = CreateGameConstructorArgs | undefined;

interface CreateGameConstructorArgs {
  move: Move;
  joinerAddress: EthAddress;
  value: bigint;
}

interface CreateGameReqBody {
  gameCreationTxHash: Hash;
  salt: string;
}

interface CreateGameResponse {
  ok: true;
  message: "game record saved";
  creatorIdentifier: string;
  createdGameAddress: EthAddress;
  lastAction: bigint;
}

interface GenerateSaltResponse {
  salt: string;
}
