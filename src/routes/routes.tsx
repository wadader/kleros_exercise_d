import { createBrowserRouter } from "react-router-dom";
import PageContainer from "../features/PageContainer/PageContainer";
import CreateGameSection from "../features/CreateGameSection/CreateGameSection";
import GamesList from "../features/GamesList/GamesList";
import JoinGameSection from "../features/JoinGameSection/JoinGameSection";
import SolveGameSection from "../features/SolveGameSection/SolveGameSection";

import { Center } from "@mantine/core";
import RpslzImage from "../features/RpslzImage/RpslzImage";

export const createdRouter = createBrowserRouter([
  {
    path: "",
    element: <PageContainer />,
    children: [
      {
        path: "/",
        element: <RpslzImage />,
      },
      { path: "create", element: <CreateGameSection /> },
      { path: "games", element: <GamesList /> },
      { path: "join", element: <JoinGameSection /> },
      { path: "solve", element: <SolveGameSection /> },
    ],
  },
]);
