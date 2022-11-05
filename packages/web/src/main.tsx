import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App";
import EmulatorMock from "./component/mock";

ReactDOM.createRoot(document.getElementById("root") as HTMLElement).render(
  <React.StrictMode>
    <App />
    <EmulatorMock scripts={["", "", "", ""]} />
  </React.StrictMode>
);
