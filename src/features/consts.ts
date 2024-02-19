import { moves } from "../types/game";

const ONE_MINUTE_IN_MILLISECONDS = 120_000;
const FIVE_MINUTES_IN_SECONDS = 300;

// as the contract TIMEOUT is fixed, I am declaring the value here as a const. For a varying value, I could fetch from the contract when using it;
const CONTRACT_TIMEOUT = FIVE_MINUTES_IN_SECONDS;
const BACKEND_REFERENCE_TIMEOUT = ONE_MINUTE_IN_MILLISECONDS;

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

export { INPUTS, BACKEND_REFERENCE_TIMEOUT, CONTRACT_TIMEOUT };
