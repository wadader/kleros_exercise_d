import { useCallback, useEffect, useState } from "react";
import { useDelay } from "react-use-precision-timer";

// calculates timeout fairly accurately:
//  We get lastAction value from the smartContract.
//  Add the timeout time period
//  and enable the timeout option after the delay

function useTimeout(
  lastActionInSeconds: bigint,
  timeoutPeriodInSeconds: number
) {
  const [hasTimedOut, setHasTimedOut] = useState(false);

  const timeOut = useCallback(() => setHasTimedOut(true), []);

  const timeoutPeriodInMilliseconds =
    timeoutPeriodInSeconds * 1000 + bufferTime;
  const lastActionsInMilliseconds = Number(lastActionInSeconds) * 1000;

  const onceTimer = useDelay(timeoutPeriodInMilliseconds, timeOut);
  useEffect(() => {
    onceTimer.start(lastActionsInMilliseconds);
  }, []);

  return { hasTimedOut };
}

const TEN_SECONDS = 10_000;

// block.timestamp is accurate to ~10 seconds, so we have a bit of a buffer
const bufferTime = TEN_SECONDS;

export default useTimeout;
