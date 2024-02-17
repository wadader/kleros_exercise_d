import useGameStore from "../../store/game";

function useSolveGameValues() {
  const savedMovedState = useGameStore((state) => state.values.creatorMove);
  const setMoveState = useGameStore((state) => state.setters.creatorMove);
  const savedSalt = useGameStore((state) => state.values.salt);
  const setSalt = useGameStore((state) => state.setters.salt);
  const selectedContract = useGameStore(
    (state) => state.values.selectedContract
  );

  return {
    savedMovedState,
    setMoveState,
    savedSalt,
    setSalt,
    selectedContract,
  };
}

export default useSolveGameValues;
