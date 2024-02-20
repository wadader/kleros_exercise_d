import { Center, Container, Loader, Stack, Text } from "@mantine/core";
import { useQuery } from "@tanstack/react-query";
import { gameApi } from "../../config/config";
import { useAccount } from "wagmi";
import GameItem from "./GameItem/GameItem";
import useSiweStore from "../../store/siwe";

function GamesList() {
  const { address } = useAccount();
  const { data: gamesResponse } = useQuery({
    queryKey: ["games-list", address],
    queryFn: async () => await getGamesList(address),
    refetchInterval: ONE_SECOND,
  });

  const games = gamesResponse?.gamesForJoiner;

  const authenticationStatus = useSiweStore(
    (state) => state.authenticationStatus
  );
  const isSignedIn = authenticationStatus === "authenticated";

  return (
    <Stack mt={50}>
      {isSignedIn ? (
        games !== undefined ? (
          games.length > 0 ? (
            games.map((game) => (
              <GameItem
                key={game.contractAddress}
                contractAddress={game.contractAddress}
              />
            ))
          ) : (
            <Center>
              <Loader />
            </Center>
          )
        ) : (
          <Container>
            <Text>No games for this user</Text>
          </Container>
        )
      ) : (
        <Container>
          <Text>Not Signed In</Text>
        </Container>
      )}
    </Stack>
  );
}

export default GamesList;

async function getGamesList(joinerAddress: string | undefined) {
  try {
    if (joinerAddress === undefined) throw new Error("not logged in");
    return await gameApi
      .get(`game?joinerAddress=${joinerAddress}`)
      .json<getGamesListResponse>();
  } catch (e) {
    console.error(e);
    throw e;
  }
}

interface getGamesListResponse {
  gamesForJoiner: Games[];
}

interface Games {
  contractAddress: string;
}

const ONE_SECOND = 1000;
