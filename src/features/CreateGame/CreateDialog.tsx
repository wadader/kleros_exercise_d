import { Button, NumberInput, Select, Stack, TextInput } from "@mantine/core";
import useCreateValues from "./useCreateValues";
import { moves } from "../../types/game";

function CreateDialog() {
  const { stake, competitor, move } = useCreateValues();

  return (
    <Stack>
      <NumberInput
        label={INPUTS.stake.label}
        description={INPUTS.stake.description}
        decimalScale={INPUTS.stake.decimals}
        step={INPUTS.stake.step}
        onChange={stake.setter}
        value={stake.value}
        allowNegative={false}
        fixedDecimalScale={true}
      />

      <TextInput
        label={INPUTS.competitor.label}
        description={INPUTS.competitor.description}
        placeholder={INPUTS.competitor.placeholder}
        onChange={(e) => competitor.setter(e.target.value)}
        value={competitor.value}
      />

      <Select
        label={INPUTS.moves.label}
        description={INPUTS.moves.description}
        onChange={move.setter}
        value={String(move.value)}
        data={moves}
      />

      <Button>Create Game</Button>
    </Stack>
  );
}

export default CreateDialog;

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
  },
  moves: {
    label: "Moves",
    description: "Which move do you want to play",
    data: moves,
  },
} as const;
