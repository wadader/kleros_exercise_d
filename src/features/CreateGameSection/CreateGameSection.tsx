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
import { Moves, moves } from "../../types/game";
import useCreateGame from "./useCreateGame";
import type { UseCreateGameArgs } from "./useCreateGame";

import { isEthAddress } from "../../types/identifier";
import useSiweStore from "../../store/siwe";
import { parseEther } from "viem";
import { INPUTS } from "../consts";
import { useNavigate } from "react-router-dom";

function CreateGameSection() {
  const createValues = useCreateValues();

  const { stake, competitor, move, validationErrors } = createValues;

  const createGameArgs = getCreateGameArgs(createValues);

  const navigate = useNavigate();

  const { createGame, createGameTxHash } = useCreateGame(
    createGameArgs,
    navigate
  );

  const { authenticationStatus } = useSiweStore();
  const isAuthenticated = authenticationStatus === "authenticated";

  const canCreateGame = Boolean(
    createGameArgs !== undefined && isAuthenticated
  );

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
        onChange={(e) => {
          competitor.setter(e.target.value);
        }}
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

      {createGameTxHash !== undefined && (
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

  if (
    joinerAddress !== undefined &&
    isEthAddress(joinerAddress) &&
    move.value !== Moves.Null
  )
    return {
      move: move.value,
      joinerAddress,
      value: parseEther(String(stake.value)),
    };
}

type CreateGameValues = ReturnType<typeof useCreateValues>;
