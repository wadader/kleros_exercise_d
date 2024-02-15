const mode = import.meta.env.MODE as Mode;

const envEndpoints = {
  development: {
    backend: "http://localhost:6001/api/v1",
    domain: "localhost:5173",
    socket: "http://localhost:6001",
  },
} as const;

const BACKEND = envEndpoints[mode].backend;

const DOMAIN = envEndpoints[mode].domain;

const SOCKET_URL = envEndpoints[mode].socket;

export { BACKEND, SOCKET_URL };

type Mode = "development";
