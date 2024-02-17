import { useEffect, useState } from "react";
import useGameStore from "../../store/game";
import { headToHeadSocket } from "../socket/socket";

function useCreatorSocket() {
  const [hasJoinerPlayed, setHasJoinerPlayed] = useState(false);

  const identifier = useGameStore().values.identifier;

  useEffect(() => {
    if (identifier === undefined) return;
    headToHeadSocket.connect();
    headToHeadSocket.emit("game:creator:created", identifier);

    function onPlayed(): void {
      console.log("game:joiner-played");
      setHasJoinerPlayed(true);
    }

    headToHeadSocket.on("game:joiner-played", onPlayed);

    return () => {
      headToHeadSocket.off("game:joiner-played", onPlayed);
    };
  }, [identifier]);

  return { hasJoinerPlayed };
}

export default useCreatorSocket;
