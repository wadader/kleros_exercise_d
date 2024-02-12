import { Button, NumberInput, Select, Stack, TextInput } from "@mantine/core";
import useCreateValues from "./useCreateValues";
import { moves } from "../../types/game";
import { INPUTS } from "./consts";

function CreateDialog() {
  const { stake, competitor, move, validationErrors } = useCreateValues();

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
        error={validationErrors.competitorAddressError}
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
