import { useState } from "react";
import { Move, isValidMove } from "../../types/game";
import { isEthAddress } from "../../types/identifier";
import { INPUTS } from "./consts";

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

  let competitorAddressError: string | undefined;
  if (competitorAddress && !isEthAddress(competitorAddress))
    competitorAddressError = INPUTS.competitor.errors.invalidAddress;

  const validationErrors = {
    competitorAddressError,
  } as const;

  return {
    stake,
    competitor,
    move,
    validationErrors,
  };
}

export default useCreateValues;
