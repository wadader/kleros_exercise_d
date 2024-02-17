import { Container, Stack, Text } from "@mantine/core";
import { useQuery } from "@tanstack/react-query";
import ky from "ky";
import { BACKEND } from "../../config/config";
import { useAccount } from "wagmi";
import GameItem from "./GameItem/GameItem";
import useSiweStore from "../../store/siwe";

function GamesList() {
  const { address } = useAccount();
  const { data: gamesResponse } = useQuery({
    queryKey: ["games-list", address],
    queryFn: async () => await getGamesList(address),
  });

  console.log("gamesResponse:", gamesResponse);

  const games = gamesResponse?.gamesForJoiner;

  const authenticationStatus = useSiweStore(
    (state) => state.authenticationStatus
  );
  const isSignedIn = authenticationStatus === "authenticated";

  return (
    <Stack mt={50}>
      {isSignedIn ? (
        games !== undefined ? (
          games.map((game) => (
            <GameItem
              key={game.contractAddress}
              contractAddress={game.contractAddress}
            />
          ))
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

const gameApi = ky.create({
  prefixUrl: `${BACKEND}/game`,
  credentials: "include",
});

interface getGamesListResponse {
  gamesForJoiner: Games[];
}

interface Games {
  contractAddress: string;
}
