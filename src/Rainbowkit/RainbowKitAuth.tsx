import { createAuthenticationAdapter } from "@rainbow-me/rainbowkit";

import { SiweMessage } from "siwe";
import useSiweStore from "../store/siwe";
import { BACKEND, authApi } from "../config/config";

function useSiweAuth() {
  const authenticationStatus = useSiweStore(
    (state) => state.authenticationStatus
  );

  return { authenticationStatus };
}

export default useSiweAuth;

export const authenticationAdapter = createAuthenticationAdapter({
  getNonce: async () => {
    const response = await authApi.get("nonce");
    return await response.text();
  },
  createMessage: ({ nonce, address, chainId }) => {
    return new SiweMessage({
      domain: window.location.host,
      address,
      statement: "Sign in with Ethereum to the app.",
      uri: window.location.origin,
      version: "1",
      chainId,
      nonce: nonce,
    });
  },
  getMessageBody: ({ message }) => {
    return message.prepareMessage();
  },
  verify: async ({ message, signature }) => {
    try {
      useSiweStore.getState().setIsLoading();

      const verifyRes = await authApi.post("verify", {
        json: { message, signature },
      });

      if (verifyRes.ok) useSiweStore.getState().signIn();
      else useSiweStore.getState().signOut();
      return Boolean(verifyRes.ok);
    } catch (e) {
      console.error("auth error:", e);
      useSiweStore.getState().signOut();
      return false;
    }
  },
  signOut: async () => {
    try {
      useSiweStore.getState().setIsLoading();
      await authApi.post("logout");
      useSiweStore.getState().signOut();
    } catch (e) {
      console.error("auth error:", e);
    }
  },
});
