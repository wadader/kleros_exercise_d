import { createBrowserRouter } from "react-router-dom";
import PageContainer from "../features/PageContainer/PageContainer";

export const createdRouter = createBrowserRouter([
  {
    path: "/",
    element: <PageContainer />,
  },
]);
