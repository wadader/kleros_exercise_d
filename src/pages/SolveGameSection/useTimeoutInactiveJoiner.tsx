import { useWalletClient } from "wagmi";
import { EthAddress, EthHash, isHash } from "../../types/identifier";
import useWalletInteractionStore from "../../store/walletInteraction";
import { RPS_ARTIFACT } from "../../config/artifacts/RPS";
import { useState } from "react";
import { gameApi, publicClient } from "../../config/config";
import { BACKEND_REFERENCE_TIMEOUT } from "../../features/consts";
import showTxFailedNotification from "../../features/TransactionFailedNotification";
import useGameStore from "../../store/game";

function useTimeoutInactiveJoiner(contractAddress: EthAddress | undefined) {
  const [timeoutJoinerTxHash, setTimeoutJoinerTxHash] = useState<EthHash>();

  const { data: walletClient } = useWalletClient();

  async function timeoutInactiveJoiner() {
    try {
      if (walletClient === undefined || contractAddress === undefined) return;
      useWalletInteractionStore.getState().setStartInteraction();

      const { abi } = RPS_ARTIFACT;

      const txHash = await walletClient.writeContract({
        abi,
        functionName: "j2Timeout",
        address: contractAddress,
      });

      if (!isHash(txHash)) {
        console.error("hash not as expected. Report error");
        return;
      }

      const timeoutJoinerTxReceipt =
        await publicClient.waitForTransactionReceipt({
          hash: txHash,
        });

      if (timeoutJoinerTxReceipt.status === "reverted") {
        showTxFailedNotification();
        return;
      }

      const timeoutJoinerResponse = await timeoutJoiner(
        txHash,
        contractAddress
      );

      setTimeoutJoinerTxHash(txHash);

      useGameStore.getState().resetGame();

      useWalletInteractionStore.getState().setHasExitedInteraction();
    } catch (e) {
      console.error("createGame-error", e);
      useWalletInteractionStore.getState().setHasExitedInteraction();
    }
  }

  return { timeoutInactiveJoiner, timeoutJoinerTxHash };
}

export default useTimeoutInactiveJoiner;

async function timeoutJoiner(
  solveGameTx: EthHash,
  contractAddress: EthAddress
) {
  const timeoutJoinerReqBody: GameOverReqBody = {
    contractAddress,
    gameEndTxHash: solveGameTx,
  };
  return await gameApi
    .post("over", {
      json: timeoutJoinerReqBody,
      timeout: BACKEND_REFERENCE_TIMEOUT,
    })
    .json<JoinerTimedOutResponse>();
}

export interface GameOverReqBody {
  contractAddress: EthAddress;
  gameEndTxHash: EthHash;
  hasCreatorTimedOut?: true; // this discriminator is required in the case joiner and creator are the same
}

interface JoinerTimedOutResponse {
  joinerHasTimedOut: true;
  message: "game over";
}
