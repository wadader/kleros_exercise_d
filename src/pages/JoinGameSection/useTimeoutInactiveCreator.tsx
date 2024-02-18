import { useWalletClient } from "wagmi";
import { EthAddress, EthHash, isHash } from "../../types/identifier";
import useWalletInteractionStore from "../../store/walletInteraction";
import { RPS_ARTIFACT } from "../../config/artifacts/RPS";
import { useState } from "react";
import { gameApi, publicClient } from "../../config/config";
import { BACKEND_REFERENCE_TIMEOUT } from "../../features/consts";
import showTxFailedNotification from "../../features/TransactionFailedNotification";

function useTimeoutInactiveCreator(contractAddress: EthAddress | undefined) {
  const [creatorTimedOutTxHash, setCreatorTimedOutTxHash] = useState<EthHash>();

  const { data: walletClient } = useWalletClient();

  async function timeoutInactiveCreator() {
    try {
      if (walletClient === undefined || contractAddress === undefined) return;
      useWalletInteractionStore.getState().setStartInteraction();

      const { abi } = RPS_ARTIFACT;

      const timeoutCreatorTxHash = await walletClient.writeContract({
        abi,
        functionName: "j1Timeout",
        address: contractAddress,
      });

      if (!isHash(timeoutCreatorTxHash)) {
        console.error("hash not as expected. Report error");
        return;
      }

      const timeoutCreatorTxReceipt =
        await publicClient.waitForTransactionReceipt({
          hash: timeoutCreatorTxHash,
        });

      if (timeoutCreatorTxReceipt.status === "reverted") {
        showTxFailedNotification();
        return;
      }

      await timeoutJoiner(timeoutCreatorTxHash, contractAddress);

      setCreatorTimedOutTxHash(timeoutCreatorTxHash);

      useWalletInteractionStore.getState().setHasExitedInteraction();
    } catch (e) {
      console.error("createGame-error", e);
      useWalletInteractionStore.getState().setHasExitedInteraction();
    }
  }

  return { timeoutInactiveCreator, creatorTimedOutTxHash };
}

export default useTimeoutInactiveCreator;

async function timeoutJoiner(
  solveGameTx: EthHash,
  contractAddress: EthAddress
) {
  const timeoutJoinerReqBody: GameOverReqBody = {
    contractAddress,
    gameEndTxHash: solveGameTx,
    hasCreatorTimedOut: true,
  };
  return await gameApi
    .post("over", {
      json: timeoutJoinerReqBody,
      timeout: BACKEND_REFERENCE_TIMEOUT,
    })
    .json<CreatorTimedOutResponse>();
}

export interface GameOverReqBody {
  contractAddress: EthAddress;
  gameEndTxHash: EthHash;
  hasCreatorTimedOut?: true; // this discriminator is required in the case joiner and creator are the same
}

interface CreatorTimedOutResponse {
  creatorHasTimedOut: true;
  message: "game over";
}
