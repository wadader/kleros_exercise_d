import type { Socket } from "socket.io-client";

export interface Game_ServerToClientEvents {
  "game:joiner-played": () => void;
  "game:creator-solved": (winner: Winner) => void;
  "game:joiner-creatorTimedOut": () => void;
  "game:creator-joinerTimedOut": () => void;
}

export interface Game_ClientToServerEvents {
  "game:creator:created": (gameIdentifier: string) => void;
  "game:joiner:joined": (gameIdentifier: string) => void;
}

export type GameSocket = Socket<
  Game_ServerToClientEvents,
  Game_ClientToServerEvents
>;

type Winner = "draw" | "incomplete" | "creator" | "joiner";
