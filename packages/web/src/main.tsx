import React from "react";
import ReactDOM from "react-dom/client";
import { createBrowserRouter, RouterProvider } from "react-router-dom";
import App from "./App";
import Projector1 from "./projector1";
import Projector2 from "./projector2";
import Projector3 from "./projector3";

const router1 = createBrowserRouter([
  {
    path: "/",
    element: <App />,
  },
  {
    path: "/projector1",
    element: <Projector1 />,
  },
]);

const router2 = createBrowserRouter([
  {
    path: "/",
    element: <App />,
  },
  {
    path: "/projector2",
    element: <Projector2 />,
  },
]);

const router3 = createBrowserRouter([
  {
    path: "/",
    element: <App />,
  },
  {
    path: "/projector3",
    element: <Projector3 />,
  },
]);

ReactDOM.createRoot(document.getElementById("root") as HTMLElement).render(
  <React.StrictMode>
    <RouterProvider router={router1} />
  </React.StrictMode>
);

ReactDOM.createRoot(document.getElementById("root") as HTMLElement).render(
  <React.StrictMode>
    <RouterProvider router={router2} />
  </React.StrictMode>
);

ReactDOM.createRoot(document.getElementById("root") as HTMLElement).render(
  <React.StrictMode>
    <RouterProvider router={router3} />
  </React.StrictMode>
);
