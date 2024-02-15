import {
  Button,
  Center,
  NumberInput,
  Select,
  Stack,
  Text,
  TextInput,
} from "@mantine/core";
import useCreateValues from "./useCreateValues";
import { moves } from "../../types/game";
import { INPUTS } from "./consts";
import useCreateGame, { UseCreateGameArgs } from "./useCreateGame";
import { isEthAddress } from "../../types/identifier";
import useSiweStore from "../../store/siwe";
import { parseEther } from "viem";

function CreateGameSection() {
  const createValues = useCreateValues();

  const { stake, competitor, move, validationErrors } = createValues;

  const createGameArgs = getCreateGameArgs(createValues);

  const { createGame, createGameTxHash } = useCreateGame(createGameArgs);

  const { authenticationStatus } = useSiweStore();
  const isAuthenticated = authenticationStatus === "authenticated";

  const canCreateGame = Boolean(createGameArgs && isAuthenticated);

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

      <Button disabled={!canCreateGame} onClick={createGame}>
        Create Game
      </Button>

      {createGameTxHash && (
        <Center>
          <Text>Create Game Tx Hash:{createGameTxHash}</Text>
        </Center>
      )}
    </Stack>
  );
}

export default CreateGameSection;

function getCreateGameArgs({
  competitor,
  move,
  stake,
}: CreateGameValues): UseCreateGameArgs {
  const joinerAddress = competitor.value;

  if (joinerAddress && isEthAddress(joinerAddress))
    return {
      move: move.value,
      joinerAddress: joinerAddress,
      value: parseEther(String(stake.value)),
    };
}

type CreateGameValues = ReturnType<typeof useCreateValues>;
