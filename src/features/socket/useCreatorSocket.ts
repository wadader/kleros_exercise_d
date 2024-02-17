import { useEffect } from "react";
import useGameStore from "../../store/game";
import { headToHeadSocket } from "./socket";

function useCreatorSocket(): void {
  useEffect(() => {
    const identifier = useGameStore().values.identifier;
    if (identifier === undefined) return;
    headToHeadSocket.connect();
    headToHeadSocket.emit("game:creator:created", identifier);

    function onPlayed(): void {
      console.log("joiner-played");
    }

    headToHeadSocket.on("game:joiner-played", onPlayed);

    return () => {
      headToHeadSocket.off("game:joiner-played", onPlayed);
    };
  }, []);
}

export default useCreatorSocket;
