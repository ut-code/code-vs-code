import { useEffect, useRef, useState } from "react";
import "./common/blockly";
import type { WorkspaceSvg } from "blockly";
import "./style.css";
import { Box } from "@mui/material";
import Injection from "./component/Injection";
import TestPlay from "./component/TestPlay";
import Arena from "./component/Arena";
import Welcome from "./component/Welcome";
import ButtonAppBar from "./component/ButtonAppBar";
import { getUsers } from "./fetchAPI";
import type { User } from "./component/Emulator";
import { useApiPasswordContext } from "./common/api-password";
import ApiPasswordDialog from "./component/ApiPasswordDialog";

export default function App() {
  const [currentUser, setCurrentUser] = useState({
    id: 1,
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
        <Injection workspaceRef={workspaceRef} />
      </Box>
      {password && (
        <>
          <Welcome users={users} setCurrentUser={setCurrentUser} />
          <Arena
            currentUser={currentUser}
            setCurrentUser={setCurrentUser}
            workspaceRef={workspaceRef}
            users={users}
          />
        </>
      )}
      <TestPlay
        currentUser={currentUser}
        setCurrentUser={setCurrentUser}
        workspaceRef={workspaceRef}
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
