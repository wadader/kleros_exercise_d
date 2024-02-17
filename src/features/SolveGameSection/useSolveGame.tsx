import { usePublicClient, useWalletClient } from "wagmi";
import { Move } from "../../types/game";
import useWalletInteractionStore from "../../store/walletInteraction";
import { RPS_ARTIFACT } from "../../config/artifacts/RPS";
import { isHash, type EthAddress } from "../../types/identifier";

function useSolveGame({ move, salt, contractAddress }: SolveGameArgs) {
  const { data: walletClient } = useWalletClient();
  const publicClient = usePublicClient();

  async function solveGame() {
    try {
      useWalletInteractionStore.getState().setStartInteraction();
      if (
        publicClient === undefined ||
        walletClient === undefined ||
        contractAddress === undefined ||
        salt === undefined
      )
        throw Error("some values missing");

      const joinerMove = await publicClient.readContract({
        abi: RPS_ARTIFACT.abi,
        address: contractAddress,
        functionName: "c2",
      });

      if (joinerMove === Move.Null) throw new Error("joiner hasn't played yet");

      const solveGameArgs = [move, salt] as const;

      const solveGameTxHash = await walletClient.writeContract({
        address: contractAddress,
        abi: RPS_ARTIFACT.abi,
        functionName: "solve",
        args: solveGameArgs,
      });

      if (!isHash(solveGameTxHash)) {
        console.error("hash not as expected. Report error");
        return;
      }

      useWalletInteractionStore.getState().setHasExitedInteraction();
    } catch (e) {
      console.error("useSolveGame-error", e);
      useWalletInteractionStore.getState().setHasExitedInteraction();
    }
  }

  return { solveGame };
}

export default useSolveGame;

export interface SolveGameArgs {
  move: Move;
  salt: string | undefined;
  contractAddress: EthAddress | undefined;
}
