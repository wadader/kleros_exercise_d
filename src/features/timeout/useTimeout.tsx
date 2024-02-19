import { useCallback, useEffect, useState } from "react";
import { useDelay } from "react-use-precision-timer";

// calculates timeout fairly accurately:
//  We get lastAction value from the smartContract.
//  Add the timeout time period
//  and enable the timeout option after the delay

function useTimeout(
  lastActionInSeconds: number | undefined,
  timeoutPeriodInSeconds: number
) {
  const [hasTimeoutPeriodElapsed, setHasTimeoutPeriodElapsed] = useState(false);

  const timeOut = useCallback(() => setHasTimeoutPeriodElapsed(true), []);

  const timeoutPeriodInMilliseconds =
    timeoutPeriodInSeconds * 1000 + bufferTime;
  const lastActionsInMilliseconds = Number(lastActionInSeconds) * 1000;

  const onceTimer = useDelay(timeoutPeriodInMilliseconds, timeOut);

  useEffect(() => {
    if (lastActionInSeconds === undefined) return;
    onceTimer.start(lastActionsInMilliseconds);
  }, [lastActionInSeconds]);

  return { hasTimeoutPeriodElapsed };
}

// block.timestamp is accurate to ~10 seconds, so we have a bit of a buffer
const TWELVE_SECONDS = 12_000;

const bufferTime = TWELVE_SECONDS;

export default useTimeout;
