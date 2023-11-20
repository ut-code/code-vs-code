import { createTheme, ThemeProvider } from "@mui/material";
import React from "react";
import ReactDOM from "react-dom/client";
import { createBrowserRouter, RouterProvider } from "react-router-dom";
import App from "./App";
import { ApiPasswordContextProvider } from "./common/api-password";
import Projector from "./projector/Projector";
import Tutorial1 from "./component/tutorial/Tutorial1";
import Tutorial2 from "./component/tutorial/Tutorial2";
import Tutorial3 from "./component/tutorial/Tutorial3";
import Tutorial4 from "./component/tutorial/Tutorial4";

const router = createBrowserRouter([
  {
    path: "/",
    element: <App />,
  },
  {
    path: "/projector",
    element: <Projector />,
  },
  {
    path: "/tutorial1",
    element: <Tutorial1 />,
  },
  {
    path: "/tutorial2",
    element: <Tutorial2 />,
  },
  {
    path: "/tutorial3",
    element: <Tutorial3 />,
  },
  {
    path: "/tutorial4",
    element: <Tutorial4 />,
  },
]);

const theme = createTheme({
  components: {
    MuiAppBar: { defaultProps: { elevation: 0, variant: "outlined" } },
  },
});

ReactDOM.createRoot(document.getElementById("root") as HTMLElement).render(
  <React.StrictMode>
    <ThemeProvider theme={theme}>
      <ApiPasswordContextProvider>
        <RouterProvider router={router} />
      </ApiPasswordContextProvider>
    </ThemeProvider>
  </React.StrictMode>
);
