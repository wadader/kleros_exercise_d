export enum Moves {
  Null,
  Rock,
  Paper,
  Scissors,
  Spock,
  Lizard,
}

export function isValidMove(moveOption: number | null): moveOption is Moves {
  if (moveOption === null) return false;
  if (moveOption in Moves) return true;
  return false;
}

export const moves = [
  { value: String(Moves.Rock), label: "Rock" },
  { value: String(Moves.Paper), label: "Paper" },
  { value: String(Moves.Scissors), label: "Scissors" },
  { value: String(Moves.Spock), label: "Spock" },
  { value: String(Moves.Lizard), label: "Lizard" },
] as const;
