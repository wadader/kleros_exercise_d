import { moves } from "../types/game";

const TWO_MINUTES = 120000;
const BACKEND_REFERENCE_TIMEOUT = TWO_MINUTES;

const INPUTS = {
  stake: {
    label: "Stake",
    description: "How much eth do you want to stake",
    placeholder: 0.05,
    decimals: 3,
    step: 0.005,
  },
  competitor: {
    label: "Competitor Address",
    description: "Address of the player you're playing with",
    placeholder: "0xb8fa673cB7D3887A3DB45e02D2e5a4DE24beb8e8",
    errors: { invalidAddress: "Invalid address" },
  },
  moves: {
    label: "Moves",
    description: "Which move do you want to play",
    data: moves,
  },
  salt: {
    label: "Salt Used",
    description: "The salt used when the game was created",
  },
} as const;

export { INPUTS, BACKEND_REFERENCE_TIMEOUT };
