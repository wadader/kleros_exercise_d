import { moves } from "../../types/game";

const INPUTS = {
  moves: {
    label: "Moves",
    description: "Which move do you want to play",
    data: moves,
  },
} as const;

export { INPUTS };
