import { useState } from "react";
import { Move, isValidMove } from "../../types/game";
import { ComboboxItem } from "@mantine/core";

function useCreateValues() {
  const [stakeState, setStakeState] = useState<string | number>(0);
  const [competitorAddress, setCompetitorAddress] = useState("");
  const [moveState, setMoveState] = useState<Move>(Move.Rock);

  const stake = {
    value: stakeState,
    setter: setStakeState,
  } as const;

  const competitor = {
    value: competitorAddress,
    setter: setCompetitorAddress,
  } as const;

  function updateMoveState(_moveOption: string | null) {
    const move = Number(_moveOption);
    if (isValidMove(move)) setMoveState(move);
  }

  const move = {
    value: moveState,
    setter: updateMoveState,
  } as const;

  return {
    stake,
    competitor,
    move,
  };
}

export default useCreateValues;
