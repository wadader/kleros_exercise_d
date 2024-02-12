import { createBrowserRouter } from "react-router-dom";
import PageContainer from "../features/PageContainer/PageContainer";
import CreateDialog from "../features/CreateGame/CreateDialog";

export const createdRouter = createBrowserRouter([
  {
    path: "",
    element: <PageContainer />,
    children: [{ path: "", element: <CreateDialog /> }],
  },
]);
