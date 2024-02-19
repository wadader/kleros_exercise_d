import { create } from "zustand";
import { immer } from "zustand/middleware/immer";
import type { EthAddress } from "../types/identifier";
import { Moves } from "../types/game";

const useGameStore = create<GameStore>()(
  immer((set) => ({
    values: {
      salt: undefined,
      identifier: undefined,
      selectedContract: undefined,
      creatorMove: Moves.Null,
      lastAction: undefined,
    },
    setters: {
      salt: (newSalt) => {
        set((state) => {
          state.values.salt = newSalt;
        });
      },
      identifier: (newIdentifier) => {
        set((state) => {
          state.values.identifier = newIdentifier;
        });
      },
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
      lastAction: (latestAction) => {
        set((state) => {
          state.values.lastAction = latestAction;
        });
      },
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
    resetGame() {
      set({
        values: {
          salt: undefined,
          identifier: undefined,
          selectedContract: undefined,
          creatorMove: Moves.Null,
          lastAction: undefined,
        },
      });
    },
  }))
);

export default useGameStore;

interface GameStore {
  values: {
    salt: string | undefined;
    identifier: string | undefined;
    selectedContract: EthAddress | undefined;
    creatorMove: Moves;
    lastAction: number | undefined;
  };

  setters: {
    salt: (newSalt: string) => void;
    identifier: (newIdentifier: string) => void;
    selectedContract: (newSelectedContract: EthAddress) => void;
    creatorMove: (move: Moves) => void;
    lastAction: (latestAction: number) => void;
  };
  saveCreatedGame: (createdGameDetails: CreatedGameDetails) => void;
  resetGame: () => void;
}

interface CreatedGameDetails {
  salt: string;
  creatorIdentifier: string;
  createdContractAddress: EthAddress;
  createdTime: number;
}
