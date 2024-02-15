import {
  AuthenticationStatus,
  createAuthenticationAdapter,
} from "@rainbow-me/rainbowkit";
import ky from "ky";
import { SiweMessage } from "siwe";
import { BACKEND } from "../config/config";
import { useState } from "react";
import useSiweStore from "../store/siwe";

const authApi = ky.create({
  prefixUrl: `${BACKEND}/auth`,
  credentials: "include",
});

function useSiweAuth() {
  // const [status, setStatus] = useState<AuthenticationStatus>("unauthenticated");

  const authenticationStatus = useSiweStore(
    (state) => state.authenticationStatus
  );
  const signIn = useSiweStore((state) => state.signIn);
  const signOut = useSiweStore((state) => state.signOut);
  const setIsLoading = useSiweStore((state) => state.setIsLoading);

  const authenticationAdapter = createAuthenticationAdapter({
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
        setIsLoading();
        const verifyRes = await authApi.post("verify", {
          json: { message, signature },
        });

        if (verifyRes.ok) signIn();
        else signOut();
        return Boolean(verifyRes.ok);
      } catch (e) {
        console.error("auth error:", e);
        signOut();
        return false;
      }
    },
    signOut: async () => {
      try {
        setIsLoading();
        await authApi.post("logout");
        signOut();
      } catch (e) {
        console.error("auth error:", e);
        signIn();
      }
    },
  });

  return { authenticationStatus, authenticationAdapter };
}

export default useSiweAuth;
