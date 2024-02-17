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

function SolveGameSection() {
  const [canEdit, setCanEdit] = useState(false);

  const {
    savedMovedState,
    setMoveState,
    savedSalt,
    setSalt,
    selectedContract,
    lastAction,
  } = useSolveGameValues();

  const { hasJoinerPlayed } = useCreatorSocket();

  const navigate = useNavigate();

  const solveGameArgs: SolveGameArgs = {
    move: savedMovedState,
    salt: savedSalt,
    contractAddress: selectedContract,
  };

  const { solveGame, winner } = useSolveGame(solveGameArgs);

  const { hasTimedOut } = useTimeout(lastAction, CONTRACT_TIMEOUT);

  function enableEdit() {
    if (canEdit) return;
    setCanEdit(true);
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
  const canTimeout = hasTimedOut && !hasJoinerPlayed;

  useEffect(() => {
    console.log();

    if (savedMovedState === Moves.Null || selectedContract === undefined)
      navigate("/");

    const getSaltController = new AbortController();
    const { signal: getSaltSignal } = getSaltController;

    if (!canEdit && noSavedSalt) {
      // if salt is not saved in localStorage: maybe the user has changed browsers or systems -> fetch it from the backend
      // not as secure as localStorage, but the point is to demonstrate a full-stack app. It is secured with SIWE(sign-in-with-ethereum) though.
      async function fetchSalt() {
        const { salt } = await saltApi
          .get(`salt?contractAddress=${selectedContract}`, {
            signal: getSaltSignal,
          })
          .json<getSaltForGameResponse>();
        setSalt(salt);
      }
      fetchSalt().catch((err) => {
        if (err.name === "AbortError") {
          console.log("aborted fetchSalt on cleanup");
        } else {
          console.error(err);
        }
      });
    }

    return () => {
      getSaltController.abort();
    };
  }, []);

  return (
    <Stack>
      <Center>
        <Title order={3}>{selectedContract}</Title>
      </Center>
      {winner !== undefined && (
        <Center>
          <Text>{winner}</Text>
        </Center>
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
        <Text> Disabled until joiner plays</Text>
        <Center>
          <Button onClick={solveGame} disabled={!hasJoinerPlayed} my={10}>
            Solve
          </Button>
        </Center>
      </Container>
      <Button disabled={!canTimeout}>Claim Timeout</Button>
    </Stack>
  );
}

export default SolveGameSection;

interface getSaltForGameResponse {
  salt: string;
}
