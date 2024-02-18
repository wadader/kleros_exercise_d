import { useState } from "react";
import { isValidMove } from "../../types/game";
import { isEthAddress } from "../../types/identifier";
import useGameStore from "../../store/game";
import { INPUTS } from "../../features/consts";

function useCreateValues() {
  const [stakeState, setStakeState] = useState<string | number>(0);
  const [joinerAddress, setJoinerAddress] = useState<string>("");
  const moveState = useGameStore((state) => state.values.creatorMove);
  const setMoveState = useGameStore((state) => state.setters.creatorMove);

  const stake = {
    value: stakeState,
    setter: setStakeState,
  } as const;

  const competitor = {
    value: joinerAddress,
    setter: setJoinerAddress,
  } as const;

  function updateMoveState(_moveOption: string | null) {
    const move = Number(_moveOption);
    if (isValidMove(move)) {
      setMoveState(move);
    }
  }

  const move = {
    value: moveState,
    setter: updateMoveState,
  } as const;

  let competitorAddressError: string | undefined;
  if (joinerAddress !== undefined && !isEthAddress(joinerAddress))
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
