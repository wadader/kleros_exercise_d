import { useState } from "react";
import { Moves, isValidMove } from "../../types/game";
import useGameStore from "../../store/game";

function useJoinValues() {
  const [moveState, setMoveState] = useState<Moves>(Moves.Rock);
  const lastAction = useGameStore((state) => state.values.lastAction);

  function updateMoveState(_moveOption: string | null) {
    const move = Number(_moveOption);
    if (isValidMove(move)) setMoveState(move);
  }

  const move = {
    value: moveState,
    setter: updateMoveState,
  } as const;

  return {
    move,
    lastAction,
  };
}

export default useJoinValues;
