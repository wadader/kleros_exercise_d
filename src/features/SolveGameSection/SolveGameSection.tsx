import {
  Button,
  Center,
  Container,
  Select,
  Stack,
  Switch,
  Text,
  TextInput,
  Title,
} from "@mantine/core";
import { useEffect, useState } from "react";
import { Moves, isValidMove, moves } from "../../types/game";
import { CONTRACT_TIMEOUT, INPUTS } from "../consts";
import { saltApi } from "../../config/config";
import { useNavigate } from "react-router-dom";
import useSolveGame, { SolveGameArgs } from "./useSolveGame";
import useSolveGameValues from "./useSolveGameValues";
import useCreatorSocket from "./useCreatorSocket";
import useTimeout from "../timeout/useTimeout";
import useTimeoutInactiveJoiner from "./useTimeoutInactiveJoiner";

function SolveGameSection() {
  const [canEditState, setCanEditState] = useState(false);

  const {
    savedMovedState,
    setMoveState,
    savedSalt,
    setSalt,
    selectedContract,
    lastAction,
  } = useSolveGameValues();

  const { hasJoinerPlayed, hasCreatorTimedOut } = useCreatorSocket();

  const navigate = useNavigate();

  const solveGameArgs: SolveGameArgs = {
    move: savedMovedState,
    salt: savedSalt,
    contractAddress: selectedContract,
  };

  const { solveGame, winner, winnerAddress } = useSolveGame(solveGameArgs);
  const { timeoutInactiveJoiner, timeoutJoinerTxHash } =
    useTimeoutInactiveJoiner(selectedContract);

  const { hasTimeoutPeriodElapsed } = useTimeout(lastAction, CONTRACT_TIMEOUT);

  const isWinner = winner !== undefined;

  const canEdit = canEditState && !isWinner;

  function enableEdit() {
    if (!canEditState || isWinner) return;
    setCanEditState(true);
  }

  function editMove(_moveOption: string | null) {
    if (!canEdit) return;

    const move = Number(_moveOption);
    if (isValidMove(move)) {
      setMoveState(move);
    }
  }

  function editSalt(editedSalt: string) {
    if (!canEdit) return;
    setSalt(editedSalt);
  }

  const noSavedSalt = savedSalt === undefined || savedSalt === "";

  const canTimeout =
    hasTimeoutPeriodElapsed &&
    !timeoutJoinerTxHash &&
    !isWinner &&
    !hasCreatorTimedOut;

  const canSolve =
    !timeoutJoinerTxHash && hasJoinerPlayed && !isWinner && !hasCreatorTimedOut;

  useEffect(() => {
    if (savedMovedState === Moves.Null || selectedContract === undefined)
      navigate("/");
    //   return () => {
    //     getSaltController.abort();
    //   };
  }, []);

  // ! I was planning a feature to allows users to solve the game from a separate browser system by retrieving the salt from the backend.
  // ! However, the scope of this assignment is considerabe already so I have commented it out and left that feature incomplete.

  // * if salt is not saved in localStorage: maybe the user has changed browsers or systems -> fetch it from the backend
  // * not as secure as localStorage, but the point is to demonstrate a full-stack app. It is secured with SIWE(sign-in-with-ethereum) though.

  // const getSaltController = new AbortController();
  // const { signal: getSaltSignal } = getSaltController;

  // if (!canEdit && noSavedSalt) {

  //   async function fetchSalt() {
  //     const { salt } = await saltApi
  //       .get(`salt?contractAddress=${selectedContract}`, {
  //         signal: getSaltSignal,
  //       })
  //       .json<getSaltForGameResponse>();
  //     setSalt(salt);
  //   }
  //   fetchSalt().catch((err) => {
  //     if (err.name === "AbortError") {
  //       console.log("aborted fetchSalt on cleanup");
  //     } else {
  //       console.error(err);
  //     }
  //   });
  // }

  return (
    <Stack>
      <Center>
        <Title order={3}>{selectedContract}</Title>
      </Center>
      {timeoutJoinerTxHash && (
        <Title order={4}>
          Joiner Has Timed Out - TimeoutTxHash: {timeoutJoinerTxHash}
        </Title>
      )}

      {timeoutJoinerTxHash && (
        <Title order={4}>
          Joiner Has Timed Out - TimeoutTxHash: {timeoutJoinerTxHash}
        </Title>
      )}

      {hasCreatorTimedOut && (
        <Stack>
          <Title order={4}>Joiner has triggered a timeout on the creator</Title>
        </Stack>
      )}
      <Select
        label={INPUTS.moves.label}
        description={INPUTS.moves.description}
        onChange={editMove}
        value={String(savedMovedState)}
        data={moves}
        disabled={!canEdit}
      />
      <TextInput
        label={INPUTS.salt.label}
        description={INPUTS.salt.description}
        onChange={(event) => {
          editSalt(event.target.value);
        }}
        value={savedSalt}
        disabled={!canEdit}
      />
      <Center>
        <Switch
          label={"Edit values manually"}
          description="WARNING: This is irreversible"
          checked={canEdit}
          onChange={enableEdit}
        />
      </Center>
      <Container>
        {!hasJoinerPlayed && <Text> Disabled until joiner plays</Text>}
        <Center>
          <Button onClick={solveGame} disabled={!canSolve} my={10}>
            Solve
          </Button>
        </Center>
      </Container>
      {!hasJoinerPlayed && (
        <Stack>
          {!canTimeout && !winner && <Text>Cannot Timeout yet. Wait </Text>}

          <Button disabled={!canTimeout} onClick={timeoutInactiveJoiner}>
            Time
          </Button>
          <Button onClick={timeoutInactiveJoiner}>Claim Timeout</Button>
        </Stack>
      )}
    </Stack>
  );
}

export default SolveGameSection;

interface getSaltForGameResponse {
  salt: string;
}
