import { GameSocket } from "./types";
import { io } from "socket.io-client";
import { SOCKET_URL } from "../../config/config";

export const headToHeadSocket: GameSocket = io(SOCKET_URL, {
    autoConnect: false,
    withCredentials: true,
  });
  