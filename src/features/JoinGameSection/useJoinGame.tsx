import { usePublicClient, useWalletClient } from "wagmi";
import { RPS_ARTIFACT } from "../../config/artifacts/RPS";
import { Move } from "../../types/game";
import { EthAddress, Hash, isHash } from "../../types/identifier";
import useWalletInteractionStore from "../../store/walletInteraction";
import { BACKEND } from "../../config/config";
import ky from "ky";
import { BACKEND_REFERENCE_TIMEOUT } from "../consts";

function useJoinGame({ move, contractAddress }: JoinGameArgs) {
  const { data: walletClient } = useWalletClient();
  const publicClient = usePublicClient();

  async function joinGame() {
    try {
      useWalletInteractionStore.getState().setStartInteraction();
      if (!publicClient || !contractAddress || !walletClient) return;
      const stake = await publicClient.readContract({
        abi: RPS_ARTIFACT.abi,
        address: contractAddress,
        functionName: "stake",
      });

      console.log("stake:", stake);

      const joinGameTxHash = await walletClient.writeContract({
        address: contractAddress,
        abi: RPS_ARTIFACT.abi,
        functionName: "play",
        value: stake,
        args: [move],
      });

      if (!isHash(joinGameTxHash)) {
        return console.error("hash not as expected. Report error");
      }

      const res = joinGameBackendReference(joinGameTxHash, contractAddress);
      console.log("res:", res);
      useWalletInteractionStore.getState().setHasExitedInteraction();
    } catch (e) {
      console.error("useJoinGame-error", e);
      useWalletInteractionStore.getState().setHasExitedInteraction();
    }
  }

  return { joinGame };
}

export default useJoinGame;

async function joinGameBackendReference(
  playGameTxHash: Hash,
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

const gameApi = ky.create({
  prefixUrl: `${BACKEND}/game`,
  credentials: "include",
});

interface JoinGameArgs {
  move: Move;
  contractAddress: EthAddress | undefined;
}

interface JoinGameReqBody {
  contractAddress: EthAddress;
  playGameTxHash: Hash;
}

interface JoinGameResponse {
  ok: true;
  message: "joiner played game";
}
