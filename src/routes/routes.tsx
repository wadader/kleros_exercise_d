import { createBrowserRouter } from "react-router-dom";
import PageContainer from "../features/PageContainer/PageContainer";
import CreateGameSection from "../features/CreateGameSection/CreateGameSection";

export const createdRouter = createBrowserRouter([
  {
    path: "",
    element: <PageContainer />,
    children: [{ path: "", element: <CreateGameSection /> }],
  },
]);
