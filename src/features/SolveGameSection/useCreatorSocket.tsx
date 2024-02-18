import { useEffect, useState } from "react";
import useGameStore from "../../store/game";
import { headToHeadSocket } from "../socket/socket";
import { showNotification } from "@mantine/notifications";

function useCreatorSocket() {
  const [hasJoinerPlayed, setHasJoinerPlayed] = useState(false);
  const [hasCreatorTimedOut, setHasCreatorTimedOut] = useState(false);

  const identifier = useGameStore().values.identifier;

  useEffect(() => {
    if (identifier === undefined) return;
    headToHeadSocket.connect();
    headToHeadSocket.emit("game:creator:created", identifier);

    function onPlayed(): void {
      showNotification({
        title: "Game Played",
        message: "Joiner has played game. Can solve now",
      });
      setHasJoinerPlayed(true);
    }

    function onCreatorTimedOut() {
      showNotification({
        title: "Creator Timed Out",
        message:
          "Creator was inactive for an extended period. Joiner has triggered a timeout",
      });
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
