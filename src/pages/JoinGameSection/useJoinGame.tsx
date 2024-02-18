import {  useWalletClient } from "wagmi";
import { RPS_ARTIFACT } from "../../config/artifacts/RPS";
import type { Moves } from "../../types/game";
import type { EthAddress, EthHash } from "../../types/identifier";
import { isHash } from "../../types/identifier";

import useWalletInteractionStore from "../../store/walletInteraction";
import { gameApi, publicClient } from "../../config/config";
import { BACKEND_REFERENCE_TIMEOUT } from "../../features/consts";
import showTxFailedNotification from "../../features/TransactionFailedNotification";
import useGameStore from "../../store/game";
import { useState } from "react";

function useJoinGame({ move, contractAddress }: JoinGameArgs) {
  const [joinGameTx, setJoinGameTx] = useState<EthHash>();
  const { data: walletClient } = useWalletClient();

  async function joinGame() {
    try {
      useWalletInteractionStore.getState().setStartInteraction();
      if (
        publicClient === undefined ||
        contractAddress === undefined ||
        walletClient === undefined
      )
        return;

      const { abi, gasEstimates } = RPS_ARTIFACT;
      const stake = await publicClient.readContract({
        abi: abi,
        address: contractAddress,
        functionName: "stake",
      });

      const joinGameTxHash = await walletClient.writeContract({
        address: contractAddress,
        abi: abi,
        functionName: "play",
        value: stake,
        args: [move],
        gas: BigInt(Number(gasEstimates.external["play(uint8)"]) * 2),
      });

      if (!isHash(joinGameTxHash)) {
        console.error("hash not as expected. Report error");
        return;
      }
      const joinGameTxReceipt = await publicClient.waitForTransactionReceipt({
        hash: joinGameTxHash,
      });

      if (joinGameTxReceipt.status === "reverted") {
        showTxFailedNotification();
        return;
      }

      const { lastAction, joinerIdentifier } = await joinGameBackend(
        joinGameTxHash,
        contractAddress
      );

      setJoinGameTx(joinGameTxHash);

      useGameStore.getState().setters.lastAction(lastAction);
      useGameStore.getState().setters.identifier(joinerIdentifier);

      useWalletInteractionStore.getState().setHasExitedInteraction();
    } catch (e) {
      console.error("useJoinGame-error", e);
      showTxFailedNotification();
      useWalletInteractionStore.getState().setHasExitedInteraction();
    }
  }

  return { joinGame, joinGameTx };
}

export default useJoinGame;

async function joinGameBackend(
  playGameTxHash: EthHash,
  contractAddress: EthAddress
) {
  console.log("joinGameBackend:", playGameTxHash);
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
  lastAction: number;
  joinerIdentifier: string;
}
