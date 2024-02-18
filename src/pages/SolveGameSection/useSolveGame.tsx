import { usePublicClient, useWalletClient } from "wagmi";
import { Moves } from "../../types/game";
import useWalletInteractionStore from "../../store/walletInteraction";
import { RPS_ARTIFACT } from "../../config/artifacts/RPS";
import { isHash, type EthAddress, EthHash } from "../../types/identifier";
import { gameApi } from "../../config/config";
import { BACKEND_REFERENCE_TIMEOUT as BACKEND_TIMEOUT } from "../../features/consts";
import { useState } from "react";
import { GameOverReqBody } from "./useTimeoutInactiveJoiner";
import { showNotification } from "@mantine/notifications";
import showTxFailedNotification from "../../features/TransactionFailedNotification";

function useSolveGame({ move, salt, contractAddress }: SolveGameArgs) {
  const [winner, setWinner] = useState<Winner>();
  const [winnerAddress, setWinnerAddress] = useState<EthAddress>();

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

      if (joinerMove === Moves.Null)
        throw new Error("joiner hasn't played yet");

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

      const solveGameTxReceipt = await publicClient.waitForTransactionReceipt({
        hash: solveGameTxHash,
      });

      if (solveGameTxReceipt.status === "reverted") {
        showTxFailedNotification();
        return;
      }

      const { winner, winnerAddress } = await solveGameBackend(
        solveGameTxHash,
        contractAddress,
        move,
        salt
      );

      setWinner(winner);
      setWinnerAddress(winnerAddress);

      useWalletInteractionStore.getState().setHasExitedInteraction();
    } catch (e) {
      console.error("useSolveGame-error", e);
      useWalletInteractionStore.getState().setHasExitedInteraction();
    }
  }

  return { solveGame, winner, winnerAddress };
}

export default useSolveGame;

async function solveGameBackend(
  solveGameTx: EthHash,
  contractAddress: EthAddress,
  move: Moves,
  salt: string
) {
  const solveGameReqBody: SolveGameReqBody = {
    contractAddress,
    gameEndTxHash: solveGameTx,
    creatorMove: {
      move,
      salt,
    },
  };
  return await gameApi
    .post("over", {
      json: solveGameReqBody,
      timeout: BACKEND_TIMEOUT,
    })
    .json<SolveGameResponse>();
}

export interface SolveGameArgs {
  move: Moves;
  salt: string | undefined;
  contractAddress: EthAddress | undefined;
}

interface SolveGameResponse {
  solved: true;
  winner: Winner;
  winnerAddress?: EthAddress;
}

export type Winner = "draw" | "incomplete" | "creator" | "joiner";

interface SolveGameReqBody extends GameOverReqBody {
  creatorMove: {
    move: Moves;
    salt: string;
  };
}
