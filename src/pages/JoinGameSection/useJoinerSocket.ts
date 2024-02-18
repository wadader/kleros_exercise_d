import { useEffect, useState } from "react";
import useGameStore from "../../store/game";
import { headToHeadSocket } from "../../features/socket/socket";
import { showNotification } from "@mantine/notifications";
import { Winner } from "../SolveGameSection/useSolveGame";
import { EthAddress } from "../../types/identifier";

function useJoinerSocket() {
  const [winner, setWinner] = useState<Winner>();
  const [winnerAddress, setWinnerAddress] = useState<EthAddress>();
  const [hasJoinerTimedOut, setHasJoinerTimedOut] = useState(false);

  const identifier = useGameStore().values.identifier;

  useEffect(() => {
    console.log("identifier:", identifier);

    if (identifier === undefined) return;

    headToHeadSocket.connect();
    headToHeadSocket.emit("game:joiner:joined", identifier);

    function onSolved(
      _winner: Winner,
      _winnerAddress: EthAddress | undefined
    ): void {
      console.log("onSolved:", _winner, _winnerAddress);
      const winnerString =
        _winner === "draw" ? `It's a draw` : `The Winner is ${_winner}`;
      setWinner(_winner);
      if (_winnerAddress) setWinnerAddress(_winnerAddress);
      showNotification({ title: "Game Solved", message: winnerString });
    }

    headToHeadSocket.on("game:creator-solved", onSolved);

    return () => {
      headToHeadSocket.off("game:creator-solved", onSolved);
    };
  }, [identifier]);

  return { hasJoinerTimedOut, winner, winnerAddress };
}

export default useJoinerSocket;
