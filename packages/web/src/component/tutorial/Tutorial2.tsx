import { useRef, useState } from "react";
import "../../common/blockly";
import type { WorkspaceSvg } from "blockly";
import "../../style.css";
import { Box } from "@mui/material";
import Injection from "../Injection";
import TutorialPlay from "./TutorialPlay";
import ButtonAppBar from "../ButtonAppBar";
import { tutorialOptions2 } from "../../tutorialOptions";
import { useApiPasswordContext } from "../../common/api-password";
import ApiPasswordDialog from "../ApiPasswordDialog";

export default function Tutorial2() {
  const [currentUser, setCurrentUser] = useState({
    id: 0,
    name: "あなた",
    program: "",
    rank: 0,
  });

  const { password } = useApiPasswordContext();
  const [isApiPasswordDialogOpen, setIsApiPasswordDialogOpen] = useState(false);
  const workspaceRef = useRef<WorkspaceSvg>();

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
        <ButtonAppBar
          openApiPasswordDialog={() => {
            setIsApiPasswordDialogOpen(true);
          }}
        />
        <Injection workspaceRef={workspaceRef} options={tutorialOptions2} />
      </Box>
      <TutorialPlay
        currentUser={currentUser}
        setCurrentUser={setCurrentUser}
        workspaceRef={workspaceRef}
        tutorialId={2}
      />
      {!password && isApiPasswordDialogOpen && (
        <ApiPasswordDialog
          onClose={() => {
            setIsApiPasswordDialogOpen(false);
          }}
        />
      )}
    </>
  );
}
