import { createBrowserRouter } from "react-router-dom";
import PageContainer from "../features/PageContainer/PageContainer";
import CreateGameSection from "../features/CreateGameSection/CreateGameSection";
import GamesList from "../features/GamesList/GamesList";
import JoinGameSection from "../features/JoinGameSection/JoinGameSection";

export const createdRouter = createBrowserRouter([
  {
    path: "",
    element: <PageContainer />,
    children: [
      { path: "create", element: <CreateGameSection /> },
      { path: "games", element: <GamesList /> },
      { path: "join", element: <JoinGameSection /> },
    ],
  },
]);
