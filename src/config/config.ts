import ky from "ky";

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

export {  SOCKET_URL, saltApi, gameApi, authApi };

type Mode = "development";
