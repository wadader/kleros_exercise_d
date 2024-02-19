import ky from "ky";
import { getPublicClient, createConfig } from "@wagmi/core";
import { defineChain, http } from "viem";
import { sepolia } from "viem/chains";
import { env_Vars } from "./env";

const mode = import.meta.env.MODE as Mode;

const envEndpoints = {
  development: {
    backend: "http://localhost:6001/api/v1",
    domain: "localhost:5173",
    socket: "http://localhost:6001",
  },
  staging: {
    backend: "https://backend.mbaexplores.dev/api/v1",
    socket: "https://backend.mbaexplores.dev/",
  },
} as const;

const BACKEND = envEndpoints[mode].backend;

const SOCKET_URL = envEndpoints[mode].socket;

const saltApi = ky.create({
  prefixUrl: `${BACKEND}/salt`,
  credentials: "include",
});

const gameApi = ky.create({
  prefixUrl: `${BACKEND}/game`,
  credentials: "include",
});

const authApi = ky.create({
  prefixUrl: `${BACKEND}/auth`,
});

const ganache = defineChain({
  id: 1337,
  name: "Ganache",
  nativeCurrency: {
    decimals: 18,
    name: "Ganache Ether",
    symbol: "GETH",
  },
  rpcUrls: {
    default: {
      http: ["http://127.0.0.1:7545"],
    },
  },
  testnet: true,
});

const SELECTED_CHAIN = sepolia;
// const SELECTED_CHAIN = ganache;

const publicClientConfig = createConfig({
  chains: [SELECTED_CHAIN],
  transports: {
    [SELECTED_CHAIN.id]: http(),
  },
});

const publicClient = getPublicClient(publicClientConfig);

export {
  SOCKET_URL,
  saltApi,
  gameApi,
  authApi,
  ganache,
  SELECTED_CHAIN,
  publicClient,
};

type Mode = "development";
