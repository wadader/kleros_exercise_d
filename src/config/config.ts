import ky from "ky";
import { getPublicClient, createConfig } from "@wagmi/core";
import { defineChain, http } from "viem";
// import { sepolia } from "viem/chains";
import { env_Vars } from "./env";

const mode = import.meta.env.MODE as Mode;

const envEndpoints = {
  development: {
    backend: "http://localhost:6001/api/v1",
    domain: "localhost:5173",
    socket: "http://localhost:6001",
  },
} as const;

const BACKEND = envEndpoints[mode].backend;

// const DOMAIN = envEndpoints[mode].domain;

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
  credentials: "include",
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
});

// const SELECTED_CHAIN = sepolia;
const SELECTED_CHAIN = ganache;

const transports = {
  [SELECTED_CHAIN.id]: http(env_Vars.INFURA_ENDPOINT),
} as const;

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
  transports,
  SELECTED_CHAIN,
  publicClient
};

type Mode = "development";
