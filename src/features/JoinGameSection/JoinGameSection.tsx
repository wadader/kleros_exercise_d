import { Button, Center, Select, Stack, Text } from "@mantine/core";
import useCreateValues from "./useJoinValues";
import { moves } from "../../types/game";
import { INPUTS } from "./consts";

import useSiweStore from "../../store/siwe";
import useJoinGame from "./useJoinGame";
import useGameStore from "../../store/game";

function JoinGameSection() {
  const createValues = useCreateValues();

  const { move } = createValues;

  const selectedContract = useGameStore(
    (state) => state.values.selectedContract
  );
  const { joinGame } = useJoinGame({
    move: move.value,
    contractAddress: selectedContract,
  });

  const { authenticationStatus } = useSiweStore();
  const isAuthenticated = authenticationStatus === "authenticated";

  const canJoinGame = Boolean(isAuthenticated);

  return (
    <Stack my={20}>
      <Center>
        <Text>Selected Contract:{selectedContract}</Text>
      </Center>
      <Select
        label={INPUTS.moves.label}
        description={INPUTS.moves.description}
        onChange={move.setter}
        value={String(move.value)}
        data={moves}
      />

      <Button disabled={!canJoinGame} onClick={joinGame}>
        Join Game
      </Button>
    </Stack>
  );
}

export default JoinGameSection;

type CreateGameValues = ReturnType<typeof useCreateValues>;
