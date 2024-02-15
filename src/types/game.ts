export enum Move {
  Null,
  Rock,
  Paper,
  Scissors,
  Spock,
  Lizard,
}

export function isValidMove(moveOption: number | null): moveOption is Move {
  if (moveOption) return Number(moveOption) in Move;
  return false;
}

export const moves = [
  { value: String(Move.Rock), label: "Rock" },
  { value: String(Move.Paper), label: "Paper" },
  { value: String(Move.Scissors), label: "Scissors" },
  { value: String(Move.Spock), label: "Spock" },
  { value: String(Move.Lizard), label: "Lizard" },
] as const;

console.log("moves:", moves);
