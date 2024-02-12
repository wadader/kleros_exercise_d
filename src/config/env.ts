import { Buffer } from "buffer";

class Env_Variables {
  constructor(env_args: Env_Variables_Constructor_Args) {
    if (!env_args.WALLET_CONNECT_PROJECT_ID) {
      throw new Error("WALLET_CONNECT_PROJECT_ID not defined");
    }

    if (!env_args.INFURA_ENDPOINT) {
      throw new Error("INFURA_ENDPOINT not defined");
    }

    this.WALLET_CONNECT_PROJECT_ID = env_args.WALLET_CONNECT_PROJECT_ID;
    this.INFURA_ENDPOINT = env_args.INFURA_ENDPOINT;
  }
  readonly WALLET_CONNECT_PROJECT_ID: string;
  readonly INFURA_ENDPOINT: string;
}

const envArgs: Env_Variables_Constructor_Args = {
  WALLET_CONNECT_PROJECT_ID: import.meta.env.VITE_WALLETCONNECT_PROJECT_ID,
  INFURA_ENDPOINT: import.meta.env.VITE_INFURA_ENDPOINT,
};

export const env_Vars = new Env_Variables(envArgs);

interface Env_Variables_Constructor_Args {
  WALLET_CONNECT_PROJECT_ID: string | undefined;
  INFURA_ENDPOINT: string | undefined;
}

window.global = window.global ?? window;
window.Buffer = window.Buffer ?? Buffer;
window.process = window.process ?? { env: {} }; // Minimal process polyfill

export {};
