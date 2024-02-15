import { usePublicClient, useWalletClient } from "wagmi";
import { RPS_ARTIFACT } from "../../config/artifacts/RPS";
import { Move } from "../../types/game";
import { EthAddress } from "../../types/identifier";
import useWalletInteractionStore from "../../store/walletInteraction";

function useJoinGame({ move, contractAddress }: JoinGameArgs) {
  // const { data: walletClient } = useWalletClient();
  const publicClient = usePublicClient();

  async function joinGame() {
    try {
      useWalletInteractionStore.getState().setStartInteraction();
      if (!publicClient || !contractAddress) return;
      const stake = await publicClient.readContract({
        abi: RPS_ARTIFACT.abi,
        address: contractAddress,
        functionName: "stake",
      });

      console.log("stake:", stake);

      useWalletInteractionStore.getState().setHasExitedInteraction();
    } catch (e) {
      console.error("useJoinGame-error", e);
      useWalletInteractionStore.getState().setHasExitedInteraction();
    }
  }

  return { joinGame };
}

export default useJoinGame;

interface JoinGameArgs {
  move: Move;
  contractAddress: EthAddress | undefined;
}
