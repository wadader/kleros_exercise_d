import { Button, Center, Select, Stack, Text, Title } from "@mantine/core";
import useJoinValues from "./useJoinValues";
import { Moves, moves } from "../../types/game";

import useSiweStore from "../../store/siwe";
import useJoinGame from "./useJoinGame";
import useGameStore from "../../store/game";
import { useNavigate } from "react-router-dom";
import { useEffect } from "react";
import { CONTRACT_TIMEOUT, INPUTS } from "../../features/consts";
import useTimeout from "../../features/timeout/useTimeout";
import useTimeoutInactiveCreator from "./useTimeoutInactiveCreator";
import useJoinerSocket from "./useJoinerSocket";

function JoinGameSection() {
  const joinValues = useJoinValues();

  const { move, lastAction } = joinValues;

  const { hasTimeoutPeriodElapsed } = useTimeout(lastAction, CONTRACT_TIMEOUT);

  const selectedContract = useGameStore(
    (state) => state.values.selectedContract
  );

  const { hasJoinerTimedOut, winner, winnerAddress } = useJoinerSocket();

  const { timeoutInactiveCreator, creatorTimedOutTxHash } =
    useTimeoutInactiveCreator(selectedContract);

  console.table({ hasTimeoutPeriodElapsed, creatorTimedOutTxHash });

  const { joinGame, joinGameTx } = useJoinGame({
    move: move.value,
    contractAddress: selectedContract,
  });

  const { authenticationStatus } = useSiweStore();
  const isAuthenticated = authenticationStatus === "authenticated";

  const canJoinGame = Boolean(
    isAuthenticated &&
      !joinGameTx &&
      !hasJoinerTimedOut &&
      !creatorTimedOutTxHash
  );

  const canTimeout = hasTimeoutPeriodElapsed && !creatorTimedOutTxHash;

  const navigate = useNavigate();

  useEffect(() => {
    if (!isAuthenticated) navigate("/");
  }, [isAuthenticated, navigate]);

  return (
    <Stack>
      <Center>
        <Text>Selected Contract:{selectedContract}</Text>
      </Center>

      {winner && (
        <Stack>
          <Title order={4}>Winner: {winner}</Title>
          {winnerAddress && (
            <Title order={4}>Winner Address: {winnerAddress}</Title>
          )}
        </Stack>
      )}

      {joinGameTx && (
        <Stack>
          <Title order={5}>JoinGameTx: {joinGameTx}</Title>
          {!winner && <Text>Join Game Tx Sent. Waiting for solution</Text>}
        </Stack>
      )}

      {creatorTimedOutTxHash && (
        <Title order={4}>
          Creator Has Timed Out - TimeoutTxHash: {creatorTimedOutTxHash}
        </Title>
      )}

      <Select
        label={INPUTS.moves.label}
        description={INPUTS.moves.description}
        onChange={move.setter}
        value={String(move.value)}
        data={moves}
        disabled={!canJoinGame}
        allowDeselect={false}
      />

      <Button disabled={!canJoinGame} onClick={joinGame}>
        Join Game
      </Button>
      {joinGameTx && (
        <Stack my={15}>
          {!hasTimeoutPeriodElapsed && !creatorTimedOutTxHash && (
            <Text>Cannot Timeout yet. Wait </Text>
          )}
          <Button disabled={!canTimeout} onClick={timeoutInactiveCreator}>
            Claim Timeout
          </Button>
        </Stack>
      )}
    </Stack>
  );
}

export default JoinGameSection;
