import { useEffect, useRef, useState } from "react";
import "../../common/blockly";
import type { WorkspaceSvg } from "blockly";
import "../../style.css";
import { Box } from "@mui/material";
import Injection from "../Injection";
import TutorialPlay from "./TutorialPlay";
import ButtonAppBar from "../ButtonAppBar";
import { tutorialOptions4 } from "../../tutorialOptions";
import { useApiPasswordContext } from "../../common/api-password";
import ApiPasswordDialog from "../ApiPasswordDialog";
import Welcome from "../Welcome";
import { getUsers } from "../../fetchAPI";
import type { User } from "../Emulator";

export default function Tutorial4() {
  const [currentUser, setCurrentUser] = useState({
    id: 0,
    name: "",
    program: "",
    rank: 0,
  });
  const [users, setUsers] = useState<User[]>([]);
  const { password } = useApiPasswordContext();
  const [isApiPasswordDialogOpen, setIsApiPasswordDialogOpen] = useState(false);
  const workspaceRef = useRef<WorkspaceSvg>();

  useEffect(() => {
    async function fetchUsers() {
      setUsers(await getUsers());
    }
    fetchUsers();
  }, []);

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
        <Injection workspaceRef={workspaceRef} options={tutorialOptions4} />
      </Box>
      {password && <Welcome users={users} setCurrentUser={setCurrentUser} />}
      <TutorialPlay
        currentUser={currentUser}
        setCurrentUser={setCurrentUser}
        workspaceRef={workspaceRef}
        tutorialId={4}
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
