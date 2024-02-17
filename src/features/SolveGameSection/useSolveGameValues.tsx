import useGameStore from "../../store/game";

function useSolveGameValues() {
  const savedMovedState = useGameStore((state) => state.values.creatorMove);
  const setMoveState = useGameStore((state) => state.setters.creatorMove);
  const savedSalt = useGameStore((state) => state.values.salt);
  const setSalt = useGameStore((state) => state.setters.salt);
  const selectedContract = useGameStore(
    (state) => state.values.selectedContract
  );
  const lastAction = useGameStore((state) => state.values.lastAction);

  return {
    savedMovedState,
    setMoveState,
    savedSalt,
    setSalt,
    selectedContract,
    lastAction,
  };
}

export default useSolveGameValues;
