import { useState } from "react";
import Blockly from "blockly";
import {
  Accordion,
  AccordionDetails,
  AccordionSummary,
  Box,
  Button,
  Card,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  TextField,
  Typography,
} from "@mui/material";
import { FileUpload, Person } from "@mui/icons-material";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import { grey } from "@mui/material/colors";
import { FaFortAwesome } from "react-icons/fa";
import type { User } from "./game";

async function updateUser(user: User): Promise<User> {
  /* const body = JSON.stringify(user);
  const response = await fetch("https://api.code-vs-code.com/user", {
    method: "put",
    body, 
  });
  const json = await response.json(); */
  return user;
}

async function getUsers(): Promise<User[]> {
  // const response = await fetch("https://api.code-vs-code.com//user");
  // const json = await response.json();
  // return json;
  const array = new Array(10);
  for (let i = 0; i < 10; i += 1) array[i] = i + 1;
  return new Promise((resolve) => {
    setTimeout(
      () =>
        resolve(
          array.map((id) => ({
            id: 11 - id,
            name: `ユーザー${id}`,
            script: "",
            rank: 1,
          }))
        ),
      1000
    );
  });
}

async function getUser(id: number): Promise<User> {
  // const response = await fetch(`https://api.code-vs-code.com/user/${id}`);
  // const json = await response.json();
  // return json;
  return new Promise((resolve) => {
    setTimeout(
      () => resolve({ id, name: `ユーザー${id}`, script: "", rank: 1 }),
      1000
    );
  });
}

type Program = {
  id: number;
  code: string;
};

async function uploadProgram(program: Program) {
  /* const body = JSON.stringify(program);
  await fetch("https://api.code-vs-code.com/program", {
    method: "post",
    body,
  }); */
  return program;
}

interface ChangeNameDialogProps {
  currentUser: User;
  setCurrentUser: (value: User) => void;
  open: boolean;
  setOpen: (value: boolean) => void;
  errorMessage: string;
  setErrorMessage: (value: string) => void;
  name: string;
  setName: (value: string) => void;
}

function ChangeNameDialog(props: ChangeNameDialogProps) {
  const {
    currentUser,
    setCurrentUser,
    open,
    setOpen,
    errorMessage,
    setErrorMessage,
    name,
    setName,
  } = props;

  const handleClose = async (newName: string) => {
    if (newName !== "" && newName.match(/\S/g)) {
      const newCurrentUser = {
        id: currentUser.id,
        name: newName,
        script: currentUser.script,
        rank: currentUser.rank,
      };
      const user = await updateUser(newCurrentUser);
      setCurrentUser(user);
      setOpen(false);
    } else {
      setErrorMessage("ニックネームを入力してください");
    }
  };
  const handleChangeName = (event: React.ChangeEvent<HTMLInputElement>) => {
    setName(event.target.value);
  };

  return (
    <Dialog open={open}>
      <DialogTitle>ニックネームの変更</DialogTitle>
      <DialogContent>
        <Typography color="text.secondary" sx={{ my: 1 }}>
          ニックネーム
        </Typography>
        <TextField
          onChange={handleChangeName}
          autoFocus
          variant="outlined"
          error={errorMessage !== " "}
          helperText={errorMessage}
          sx={{ width: 300 }}
        />
      </DialogContent>
      <DialogActions>
        <Button
          onClick={() => {
            handleClose(currentUser.name);
          }}
          variant="text"
        >
          キャンセル
        </Button>
        <Button
          onClick={() => {
            handleClose(name);
          }}
          variant="outlined"
        >
          変更
        </Button>
      </DialogActions>
    </Dialog>
  );
}

interface ArenaProps {
  currentUser: User;
  setCurrentUser: (value: User) => void;
  workspaceRef: React.MutableRefObject<Blockly.WorkspaceSvg | undefined>;
}

export default function Arena(props: ArenaProps) {
  const { currentUser, setCurrentUser, workspaceRef } = props;
  const [numberOfUsers, setNumberOfUsers] = useState(0);
  const [loaded, setLoaded] = useState(false);
  const [open, setOpen] = useState(false);
  const [errorMessage, setErrorMessage] = useState(" ");
  const [name, setName] = useState("");

  const handleChange = async (_: React.SyntheticEvent, expanded: boolean) => {
    if (expanded) {
      setCurrentUser(await getUser(currentUser.id));
      setNumberOfUsers((await getUsers()).length);
      setLoaded(true);
    } else setLoaded(false);
  };

  const handleUpload = () => {
    uploadProgram({
      id: currentUser.id,
      code: Blockly.JavaScript.workspaceToCode(workspaceRef.current),
    });
  };

  const handleClickOpen = () => {
    setName("");
    setErrorMessage(" ");
    setOpen(true);
  };

  return (
    <div>
      <Accordion
        onChange={handleChange}
        sx={{ position: "absolute", top: 48, right: 480, width: 600 }}
      >
        <AccordionSummary expandIcon={<ExpandMoreIcon />}>
          闘技場
        </AccordionSummary>
        <AccordionDetails>
          <Box
            sx={{
              position: "relative",
              display: "flex",
              gap: 1,
            }}
          >
            <Card sx={{ width: 1 / 2, height: 170 }} variant="outlined">
              {loaded && (
                <>
                  <Box sx={{ position: "absolute", ml: 2, mt: 7 }}>
                    <FaFortAwesome size="25%" />
                  </Box>
                  <Typography sx={{ position: "absolute", ml: 2, mt: 1.5 }}>
                    {currentUser.name}
                  </Typography>
                  <Typography
                    sx={{
                      position: "absolute",
                      ml: 11,
                      mt: 3.5,
                      fontSize: 60,
                      fontWeight: "bold",
                      textAlign: "center",
                      width: 1 / 5,
                    }}
                  >
                    {currentUser.rank}
                  </Typography>
                  <Typography
                    color="text.secondary"
                    sx={{
                      position: "absolute",
                      ml: 23,
                      mt: 12,
                      fontSize: 35,
                      textAlign: "center",
                      width: 1 / 8,
                    }}
                  >
                    {numberOfUsers}
                  </Typography>
                  <Box
                    sx={{
                      position: "absolute",
                      ml: 13,
                      mt: 13,
                      borderTop: "grey solid",
                      width: 150,
                      transform: "rotate(-25deg)",
                    }}
                  />
                </>
              )}
            </Card>
            <Box sx={{ width: 1 / 2 }}>
              <Button
                onClick={handleUpload}
                sx={{
                  color: grey[900],
                  borderColor: grey[300],
                }}
                fullWidth
                variant="outlined"
                startIcon={<FileUpload />}
              >
                プログラムのアップロード
              </Button>
              <Button
                onClick={handleClickOpen}
                sx={{
                  color: grey[900],
                  borderColor: grey[300],
                  mt: 1,
                }}
                fullWidth
                variant="outlined"
                startIcon={<Person />}
              >
                ニックネームの変更…
              </Button>
            </Box>
          </Box>
        </AccordionDetails>
      </Accordion>
      <ChangeNameDialog
        currentUser={currentUser}
        setCurrentUser={setCurrentUser}
        open={open}
        setOpen={setOpen}
        errorMessage={errorMessage}
        setErrorMessage={setErrorMessage}
        name={name}
        setName={setName}
      />
    </div>
  );
}
