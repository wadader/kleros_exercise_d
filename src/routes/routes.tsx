import { createBrowserRouter } from "react-router-dom";
import Home from "../pages/Home/Home";

export const createdRouter = createBrowserRouter([
  {
    path: "/",
    element: <Home />,
  },
]);
