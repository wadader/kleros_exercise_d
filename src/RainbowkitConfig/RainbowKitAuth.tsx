import {
  AuthenticationStatus,
  createAuthenticationAdapter,
} from "@rainbow-me/rainbowkit";
import ky from "ky";
import { SiweMessage } from "siwe";
import { BACKEND } from "../config/config";
import { useState } from "react";

const authApi = ky.create({
  prefixUrl: `${BACKEND}/auth`,
  credentials: "include",
});

function useSiweAuth() {
  const [status, setStatus] = useState<AuthenticationStatus>("unauthenticated");

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
        setStatus("loading");
        const verifyRes = await authApi.post("verify", {
          json: { message, signature },
        });

        if (verifyRes.ok) setStatus("authenticated");
        else setStatus("unauthenticated");
        return Boolean(verifyRes.ok);
      } catch (e) {
        console.error("auth error:", e);
        setStatus("unauthenticated");
        return false;
      }
    },
    signOut: async () => {
      try {
        setStatus("loading");
        await authApi.post("logout");
        setStatus("unauthenticated");
      } catch (e) {
        console.error("auth error:", e);
        setStatus("authenticated");
      }
    },
  });

  return { status, authenticationAdapter };
}

export default useSiweAuth;
