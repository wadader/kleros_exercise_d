import { useEffect } from "react";
import useGameStore from "../../store/game";
import { headToHeadSocket } from "./socket";

function useJoinerSocket():void {
  useEffect(() => {
    const identifier = useGameStore().values.identifier;
    if (identifier===undefined) return;
    headToHeadSocket.connect();
    headToHeadSocket.emit("game:joiner:joined", identifier);

    function onSolved():void {
      console.log("creator-solved");
    }

    headToHeadSocket.on("game:creator-solved", onSolved);

    return () => {
      headToHeadSocket.off("game:creator-solved", onSolved);
    };
  }, []);
}

export default useJoinerSocket;
