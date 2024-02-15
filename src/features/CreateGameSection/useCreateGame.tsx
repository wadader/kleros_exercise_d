import { useWalletClient } from "wagmi";
import { RPS_ARTIFACT } from "../../config/artifacts/RPS";
import { Move } from "../../types/game";
import { EthAddress, Hash, isHash } from "../../types/identifier";
import { useState } from "react";
import ky from "ky";
import { BACKEND } from "../../config/config";
import { encodePacked, keccak256, parseGwei, toHex } from "viem";
import useWalletInteractionStore from "../../store/walletInteraction";

function useCreateGame(createGameArgs: UseCreateGameArgs) {
  const [createGameTxHash, setCreateGameTxHash] = useState<Hash>();
  const { data: walletClient } = useWalletClient();

  async function createGame() {
    try {
      useWalletInteractionStore.getState().setStartInteraction();
      if (!walletClient || !createGameArgs) return;

      const { move, joinerAddress, value } = createGameArgs;

      const { hashedMove, salt } = await getHashedMove(move);

      const { abi, bytecode, gasEstimates } = RPS_ARTIFACT;
      const createdTxHash = await walletClient.deployContract({
        abi,
        bytecode: bytecode,
        args: [hashedMove, joinerAddress],
        value,
        gas: BigInt(Number(gasEstimates.creation.totalCost) * 2),
      });
      if (!isHash(createdTxHash)) {
        return console.error("hash not as expected. Report error");
      }

      console.log("createdTxHash:", createdTxHash);

      const response = await createGameBackendReference(createdTxHash, salt);
      console.log("response:", response);
      setCreateGameTxHash(createdTxHash);
      useWalletInteractionStore.getState().setHasExitedInteraction();
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
    .post("game", { json: createGameReqBody, timeout: TIMEOUT })
    .json<CreateGameResponse>();
}

const saltApi = ky.create({
  prefixUrl: `${BACKEND}/salt`,
  credentials: "include",
});

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
}

interface GenerateSaltResponse {
  salt: string;
}

const TWO_MINUTES = 120000;
const TIMEOUT = TWO_MINUTES;
