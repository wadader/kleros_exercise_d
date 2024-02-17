import { useState } from "react";
import { Move, isValidMove } from "../../types/game";

function useCreateValues() {
  const [moveState, setMoveState] = useState<Move>(Move.Rock);

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
  };
}

export default useCreateValues;
