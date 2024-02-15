import { create } from "zustand";
import { persist } from "zustand/middleware";
import { immer } from "zustand/middleware/immer";
import { EthAddress } from "../types/identifier";

const useGameStore = create<GameStore>()(
  persist(
    immer((set) => ({
      values: {
        salt: undefined,
        identifier: undefined,
        selectedContract: undefined,
      },
      setters: {
        salt: (newSalt) =>
          set((state) => {
            state.values.salt = newSalt;
          }),
        identifier: (newIdentifier) =>
          set((state) => {
            state.values.identifier = newIdentifier;
          }),
        selectedContract: (newSelectedContract) =>
          set((state) => {
            state.values.selectedContract = newSelectedContract;
          }),
      },
    })),
    { name: "game-storage", partialize: (state) => ({ values: state.values }) }
  )
);

export default useGameStore;

interface GameStore {
  values: {
    salt: string | undefined;
    identifier: string | undefined;
    selectedContract: EthAddress | undefined;
  };
  setters: {
    salt: (newSalt: string) => void;
    identifier: (newIdentifier: string) => void;
    selectedContract: (newSelectedContract: EthAddress) => void;
  };
}
