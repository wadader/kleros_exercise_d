import { AuthenticationStatus } from "@rainbow-me/rainbowkit";
import { create } from "zustand";

const useSiweStore = create<SiweStore>()((set) => ({
  authenticationStatus: "unauthenticated",
  signIn() {
    set({ authenticationStatus: "authenticated" });
  },
  signOut() {
    set({ authenticationStatus: "unauthenticated" });
  },
  setIsLoading() {
    set({ authenticationStatus: "loading" });
  },
}));

export default useSiweStore;

interface SiweStore {
  authenticationStatus: AuthenticationStatus;
  signIn: () => void;
  signOut: () => void;
  setIsLoading: () => void;
}
