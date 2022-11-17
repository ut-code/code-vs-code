import { useRef, useState } from "react";
import Blockly from "blockly";
// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-ignore
import Ja from "blockly/msg/ja";
import "./style.css";
import { Box } from "@mui/material";
import Injection from "./component/Injection";
import TestPlay from "./component/TestPlay";
import Arena from "./component/Arena";
import Welcome from "./component/Welcome";
import ButtonAppBar from "./component/ButtonAppBar";

// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-ignore
Blockly.setLocale(Ja);
// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-ignore
Blockly.HSV_SATURATION = 0.6;
// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-ignore
Blockly.HSV_VALUE = 1;

export default function App() {
  const [currentUser, setCurrentUser] = useState({
    id: 1,
    name: "",
    program: "",
    rank: 0,
  });
  const workspaceRef = useRef<Blockly.WorkspaceSvg>();

  return (
    <>
      <Box
        sx={{
          width: 1,
          height: 1,
          display: "grid",
          gridTemplateRows: "48px auto",
        }}
      >
        <ButtonAppBar />
        <Injection workspaceRef={workspaceRef} />
      </Box>
      <Welcome currentUser={currentUser} setCurrentUser={setCurrentUser} />
      <Arena
        currentUser={currentUser}
        setCurrentUser={setCurrentUser}
        workspaceRef={workspaceRef}
      />
      <TestPlay currentUser={currentUser} />
    </>
  );
}
