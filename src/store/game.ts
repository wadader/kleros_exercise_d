import { create } from "zustand";
import { persist } from "zustand/middleware";
import { immer } from "zustand/middleware/immer";
import type { EthAddress } from "../types/identifier";
import { Moves } from "../types/game";

const useGameStore = create<GameStore>()(
  persist(
    immer((set) => ({
      values: {
        salt: undefined,
        identifier: undefined,
        selectedContract: undefined,
        creatorMove: Moves.Null,
        lastAction: 0,
      },

      saveCreatedGame: ({
        salt,
        creatorIdentifier,
        createdContractAddress: selectedContract,
        createdTime,
      }) => {
        set((state) => {
          state.values.salt = salt;
          state.values.identifier = creatorIdentifier;
          state.values.selectedContract = selectedContract;
          state.values.lastAction = createdTime;
        });
      },
      setters: {
          salt: (newSalt) => {
            set((state) => {
              state.values.salt = newSalt;
            });
          },
        //   identifier: (newIdentifier) => {
        //     set((state) => {
        //       state.values.identifier = newIdentifier;
        //     });
        //   },
          selectedContract: (newSelectedContract) => {
            set((state) => {
              state.values.selectedContract = newSelectedContract;
            });
          },
        creatorMove: (selectedMove) => {
          set((state) => {
            state.values.creatorMove = selectedMove;
          });
        },
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
    creatorMove: Moves;
    lastAction: number;
  };

  setters: {
    salt: (newSalt: string) => void;
    // identifier: (newIdentifier: string) => void;
    selectedContract: (newSelectedContract: EthAddress) => void;
    creatorMove: (move: Moves) => void;
  };
  saveCreatedGame: (createdGameDetails: CreatedGameDetails) => void;
}

interface CreatedGameDetails {
  salt: string;
  creatorIdentifier: string;
  createdContractAddress: EthAddress;
  createdTime: number;
}
