import { usePublicClient, useWalletClient } from "wagmi";
import { RPS_ARTIFACT } from "../../config/artifacts/RPS";
import type { Moves } from "../../types/game";
import type { EthAddress, EthHash } from "../../types/identifier";
import { isHash } from "../../types/identifier";

import useWalletInteractionStore from "../../store/walletInteraction";
import { gameApi } from "../../config/config";
import { BACKEND_REFERENCE_TIMEOUT } from "../consts";

function useJoinGame({ move, contractAddress }: JoinGameArgs) {
  const { data: walletClient } = useWalletClient();
  const publicClient = usePublicClient();

  async function joinGame() {
    try {
      useWalletInteractionStore.getState().setStartInteraction();
      if (
        publicClient === undefined ||
        contractAddress === undefined ||
        walletClient === undefined
      )
        return;
      const stake = await publicClient.readContract({
        abi: RPS_ARTIFACT.abi,
        address: contractAddress,
        functionName: "stake",
      });

      const joinGameTxHash = await walletClient.writeContract({
        address: contractAddress,
        abi: RPS_ARTIFACT.abi,
        functionName: "play",
        value: stake,
        args: [move],
      });

      if (!isHash(joinGameTxHash)) {
        console.error("hash not as expected. Report error");
        return;
      }

      const res = joinGameBackend(joinGameTxHash, contractAddress);
      useWalletInteractionStore.getState().setHasExitedInteraction();
    } catch (e) {
      console.error("useJoinGame-error", e);
      useWalletInteractionStore.getState().setHasExitedInteraction();
    }
  }

  return { joinGame };
}

export default useJoinGame;

async function joinGameBackend(
  playGameTxHash: EthHash,
  contractAddress: EthAddress
) {
  const joinGameReqBody: JoinGameReqBody = {
    playGameTxHash,
    contractAddress,
  };
  return await gameApi
    .post("move", {
      json: joinGameReqBody,
      timeout: BACKEND_REFERENCE_TIMEOUT,
    })
    .json<JoinGameResponse>();
}

interface JoinGameArgs {
  move: Moves;
  contractAddress: EthAddress | undefined;
}

interface JoinGameReqBody {
  contractAddress: EthAddress;
  playGameTxHash: EthHash;
}

interface JoinGameResponse {
  ok: true;
  message: "joiner played game";
}
