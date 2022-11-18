import { createTheme, ThemeProvider } from "@mui/material";
import React from "react";
import ReactDOM from "react-dom/client";
import { createBrowserRouter, RouterProvider } from "react-router-dom";
import App from "./App";
import { ApiPasswordContextProvider } from "./common/api-password";
import Projector from "./projector/Projector";

const router = createBrowserRouter([
  {
    path: "/",
    element: <App />,
  },
  {
    path: "/projector",
    element: <Projector />,
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
