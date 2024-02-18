import { createBrowserRouter } from "react-router-dom";
import GamesList from "../pages/GamesList/GamesList";
import JoinGameSection from "../pages/JoinGameSection/JoinGameSection";
import SolveGameSection from "../pages/SolveGameSection/SolveGameSection";
import CreateGameSection from "../pages/CreateGameSection/CreateGameSection";
import PageContainer from "../features/PageContainer/PageContainer";
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
