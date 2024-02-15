import { create } from "zustand";

const useWalletInteractionStore = create<WalletInteractionStore>()((set) => ({
  isInteractingWithWallet: false,
  setStartInteraction() {
    set({ isInteractingWithWallet: true });
  },
  setHasExitedInteraction() {
    set({ isInteractingWithWallet: false });
  },
}));

export default useWalletInteractionStore;

interface WalletInteractionStore {
  isInteractingWithWallet: boolean;
  setHasExitedInteraction: () => void;
  setStartInteraction: () => void;
}
