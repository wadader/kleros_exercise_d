import { useEffect, useState } from "react";
import useGameStore from "../../store/game";
import { headToHeadSocket } from "../socket/socket";

function useCreatorSocket() {
  const [hasJoinerPlayed, setHasJoinerPlayed] = useState(false);
  const [hasCreatorTimedOut, setHasCreatorTimedOut] = useState(false);

  const identifier = useGameStore().values.identifier;

  useEffect(() => {
    if (identifier === undefined) return;
    headToHeadSocket.connect();
    headToHeadSocket.emit("game:creator:created", identifier);

    function onPlayed(): void {
      console.log("game:joiner-played");
      setHasJoinerPlayed(true);
    }

    function onCreatorTimedOut() {
      setHasCreatorTimedOut(true);
    }

    headToHeadSocket.on("game:joiner-played", onPlayed);
    headToHeadSocket.on("game:joiner-creatorTimedOut", onCreatorTimedOut);

    return () => {
      headToHeadSocket.off("game:joiner-played", onPlayed);
      headToHeadSocket.off("game:joiner-creatorTimedOut", onCreatorTimedOut);
    };
  }, [identifier]);

  return { hasJoinerPlayed, hasCreatorTimedOut };
}

export default useCreatorSocket;
