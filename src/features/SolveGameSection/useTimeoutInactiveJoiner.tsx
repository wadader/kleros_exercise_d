import { useWalletClient } from "wagmi";
import { EthAddress, EthHash, isHash } from "../../types/identifier";
import useWalletInteractionStore from "../../store/walletInteraction";
import { RPS_ARTIFACT } from "../../config/artifacts/RPS";
import { useState } from "react";
import { gameApi } from "../../config/config";
import { BACKEND_REFERENCE_TIMEOUT } from "../consts";

function useTimeoutInactiveJoiner(contractAddress: EthAddress | undefined) {
  const [hasJoinerTimedOut, setHasJoinerTimeout] = useState<true>();
  const { data: walletClient } = useWalletClient();

  async function timeoutInactiveJoiner() {
    try {
      if (walletClient === undefined || contractAddress === undefined) return;
      useWalletInteractionStore.getState().setStartInteraction();

      const { abi } = RPS_ARTIFACT;

      const timeoutJoinerTxHash = await walletClient.writeContract({
        abi,
        functionName: "j2Timeout",
        address: contractAddress,
      });

      if (!isHash(timeoutJoinerTxHash)) {
        console.error("hash not as expected. Report error");
        return;
      }

      const timeoutJoinerResponse = await timeoutJoiner(
        timeoutJoinerTxHash,
        contractAddress
      );

      setHasJoinerTimeout(timeoutJoinerResponse.joinerHasTimedOut);

      useWalletInteractionStore.getState().setHasExitedInteraction();
    } catch (e) {
      console.error("createGame-error", e);
      useWalletInteractionStore.getState().setHasExitedInteraction();
    }
  }

  return { timeoutInactiveJoiner, hasJoinerTimedOut };
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
}

interface JoinerTimedOutResponse {
  joinerHasTimedOut: true;
  message: "game over";
}
