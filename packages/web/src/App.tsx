import { useEffect, useRef, useState } from "react";
import Blockly from "blockly";
// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-ignore
import Ja from "blockly/msg/ja";
import "./style.css";
import {
  Accordion,
  AccordionDetails,
  AccordionSummary,
  AppBar,
  Avatar,
  Box,
  Button,
  Card,
  Chip,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
  IconButton,
  LinearProgress,
  List,
  ListItem,
  MenuItem,
  TextField,
  ToggleButton,
  ToggleButtonGroup,
  Toolbar,
  Typography,
} from "@mui/material";
import {
  FileUpload,
  Pause,
  Person,
  PlayArrow,
  RestartAlt,
} from "@mui/icons-material";
import DeleteIcon from "@mui/icons-material/Delete";
import DirectionsRunIcon from "@mui/icons-material/DirectionsRun";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import { grey } from "@mui/material/colors";
import { FaFortAwesome } from "react-icons/fa";
import { GiCrossedSwords } from "react-icons/gi";
import { HiOutlineScale } from "react-icons/hi";
import type { User } from "./component/game";
import Injection from "./component/Injection";
import iconURL from "./icon1.svg";
import logoURL from "./logo.svg";
import Emulator from "./component/Emulator";

// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-ignore
Blockly.setLocale(Ja);
// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-ignore
Blockly.HSV_SATURATION = 0.6;
// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-ignore
Blockly.HSV_VALUE = 1;

type Program = {
  id: number;
  code: string;
};

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

async function updateUser(user: User): Promise<User> {
  /* const body = JSON.stringify(user);
  const response = await fetch("https://api.code-vs-code.com/user", {
    method: "put",
    body, 
  });
  const json = await response.json(); */
  return user;
}

async function createUser(name: string): Promise<User> {
  /* const body = JSON.stringify({ name });
  const response = await fetch("https://api.code-vs-code.com/user", {
    method: "post",
    body,
  });
  const json = await response.json(); */
  return new Promise((resolve) => {
    setTimeout(() => resolve({ id: 1, name, script: "", rank: 1 }), 1000);
  });
}

async function uploadProgram(program: Program) {
  /* const body = JSON.stringify(program);
  await fetch("https://api.code-vs-code.com/program", {
    method: "post",
    body,
  }); */
  return program;
}

// サンプルコード
const sampleUsers: [User, User, User, User] = [
  {
    name: "fooBarBaz",
    id: 1,
    script: `let target = null; 
    let closestPortion = portions[0]; 
    for ( const portion of portions ) {
      const previousDistance = calculateDistance( player, closestPortion ); 
      const currentDistance = calculateDistance( player, portion );
      if(previousDistance > currentDistance){closestPortion = portion}
    } 
    target = closestPortion 
    walkTo(target)`,
    rank: 1,
  },
  {
    name: "吾輩は猫",
    id: 2,
    script: `let closestWeapon = weapons[0];
    if(player.weapon){
      let closestEnemy = enemies[0] 
    for ( const enemy of enemies ) {
      const previousDistance = calculateDistance( player, closestEnemy ); 
      const currentDistance = calculateDistance( player, enemy );
      if(previousDistance > currentDistance){closestEnemy = enemy}
    }
    if(calculateDistance(player, closestEnemy)<player.weapon.firingRange){
      useWeapon(closestEnemy)
    }else{walkTo(closestEnemy)}
    }
    else{
    for ( const weapon of weapons ) {
      const previousDistance = calculateDistance( player, closestWeapon ) 
      const currentDistance = calculateDistance( player, weapon );
      if(previousDistance > currentDistance){closestWeapon = weapon}
    }
    if(calculateDistance(player, closestWeapon)<player.armLength){
      pickUp(closestWeapon)
    }else{walkTo(closestWeapon)}
  }
  `,
    rank: 2,
  },
  {
    name: "テスト",
    id: 3,
    script: `let target = null; 
let closestPortion = portions[0]; 
for ( const portion of portions ) {
  const previousDistance = calculateDistance( player, closestPortion ); 
  const currentDistance = calculateDistance( player, portion );
  if(previousDistance > currentDistance){closestPortion = portion}
} 
target = closestPortion 
walkTo(target)`,
    rank: 3,
  },
  {
    name: "UTC",
    id: 4,
    script: `let closestEnemy = enemies[0] 
    for ( const enemy of enemies ) {
      const previousDistance = calculateDistance( player, closestEnemy ); 
      const currentDistance = calculateDistance( player, enemy );
      if(previousDistance > currentDistance){closestEnemy = enemy}
    } 
      if(calculateDistance(player,closestEnemy)<player.armLength){
        punch(closestEnemy)
      }else{walkTo(closestEnemy)}`,
    rank: 4,
  },
];

function ButtonAppBar() {
  return (
    <AppBar position="sticky" sx={{ color: grey[900], bgcolor: grey[50] }}>
      <Toolbar variant="dense">
        <Box sx={{ height: 32 }}>
          <a href="https://utcode.net/" target="_blank" rel="noreferrer">
            <img src={logoURL} alt="" height="100%" />
          </a>
        </Box>
        <Typography sx={{ ml: 2 }}>Code vs Code</Typography>
      </Toolbar>
    </AppBar>
  );
}

interface WelcomeProps {
  currentUser: User;
  setCurrentUser: (value: User) => void;
}

function Welcome(props: WelcomeProps) {
  const { currentUser, setCurrentUser } = props;
  const [open, setOpen] = useState(true);
  const [name, setName] = useState("");
  const [selectedIcon, setSelectedIcon] = useState(0);
  const [errorMessage, setErrorMessage] = useState(" ");

  const icons = [
    { src: iconURL, name: "icon1" },
    { src: iconURL, name: "icon2" },
    { src: iconURL, name: "icon3" },
    { src: iconURL, name: "icon4" },
    { src: iconURL, name: "icon5" },
    { src: iconURL, name: "icon6" },
  ];

  const handleClose = async () => {
    if (name !== "" && name.match(/\S/g)) {
      setOpen(false);
      const user = await createUser(name);
      setCurrentUser(user);
    } else {
      setErrorMessage("ニックネームを入力してください");
    }
  };

  const handleChangeName = (event: React.ChangeEvent<HTMLInputElement>) => {
    setName(event.target.value);
  };

  const handleChangeIcon = (
    _: React.MouseEvent<HTMLElement>,
    newIcon: number | null
  ) => {
    if (newIcon !== null) {
      setSelectedIcon(newIcon);
    }
  };

  return (
    <div>
      {currentUser.id === 0 && (
        <Dialog open={open}>
          <DialogTitle>ようこそ</DialogTitle>
          <DialogContent>
            <Typography color="text.secondary" sx={{ my: 1 }}>
              ニックネーム
            </Typography>
            <TextField
              onChange={handleChangeName}
              autoFocus
              fullWidth
              variant="outlined"
              error={errorMessage !== " "}
              helperText={errorMessage}
            />
            <Typography color="text.secondary" sx={{ my: 1 }}>
              アイコン
            </Typography>
            <div>
              <ToggleButtonGroup
                value={selectedIcon}
                onChange={handleChangeIcon}
                exclusive
                size="small"
              >
                {icons.map((icon, index) => (
                  <ToggleButton value={index} key={icon.name}>
                    <Avatar src={icon.src} />
                  </ToggleButton>
                ))}
              </ToggleButtonGroup>
            </div>
          </DialogContent>
          <DialogActions>
            <Button onClick={handleClose} variant="outlined">
              開始
            </Button>
          </DialogActions>
        </Dialog>
      )}
    </div>
  );
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

function Arena(props: ArenaProps) {
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

interface EnemyDialogProps {
  open: boolean;
  users: User[];
  enemyIds: number[];
  selectedEnemyIds: number[];
  setSelectedEnemyIds: (value: number[]) => void;
  handleClose: (value: number[]) => void;
  isConfirmDisabled: boolean;
  setIsConfirmDisabled: (value: boolean) => void;
}

function EnemyDialog(props: EnemyDialogProps) {
  const {
    users,
    enemyIds,
    selectedEnemyIds,
    setSelectedEnemyIds,
    open,
    handleClose,
    isConfirmDisabled,
    setIsConfirmDisabled,
  } = props;

  const [selectedUser, setSelectedUser] = useState({
    id: 1,
    name: "ユーザー1",
  });

  const handleClickAdd = async () => {
    if (!selectedEnemyIds.includes(selectedUser.id)) {
      if (selectedEnemyIds.length === 2) setIsConfirmDisabled(false);
      if (selectedEnemyIds.length < 3) {
        setSelectedEnemyIds(selectedEnemyIds.concat(selectedUser.id));
      }
    }
  };

  const deleteEnemy = (deleteIndex: number) => {
    setIsConfirmDisabled(true);
    setSelectedEnemyIds(
      selectedEnemyIds.filter((_, index) => index !== deleteIndex)
    );
  };

  const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const user = users.find(
      (element) => element.id === Number(event.target.value)
    );
    if (user) setSelectedUser(user);
  };

  return (
    <Dialog open={open}>
      <DialogTitle>対戦相手の選択</DialogTitle>
      <DialogContent>
        <DialogContentText>
          闘技場の対戦相手を3人呼び出して対戦できます。
        </DialogContentText>
        <Box
          sx={{
            display: "grid",
            gridTemplateColumns: "1fr max-content",
            gap: 1,
            mt: 1,
          }}
        >
          <TextField
            select
            value={selectedUser.id}
            onChange={handleChange}
            variant="outlined"
            size="small"
            sx={{ gridColumn: "1" }}
          >
            {users.map((user) => (
              <MenuItem key={user.id} value={user.id}>
                {user.name}
              </MenuItem>
            ))}
          </TextField>
          <Button
            onClick={handleClickAdd}
            variant="outlined"
            sx={{ color: grey[900], borderColor: grey[400] }}
          >
            追加
          </Button>
        </Box>
        <List>
          {selectedEnemyIds.map((enemyId, index) => (
            <ListItem
              sx={{ display: "grid", gridTemplateColumns: "1fr 40px" }}
              key={enemyId}
              dense
              divider
            >
              {users.find((user) => user.id === enemyId)?.name}
              <IconButton
                onClick={() => {
                  deleteEnemy(index);
                }}
              >
                <DeleteIcon />
              </IconButton>
            </ListItem>
          ))}
        </List>
        <Box
          sx={{ display: "flex", justifyContent: "flex-end", mt: 1, gap: 1 }}
        >
          <Button
            variant="text"
            onClick={() => {
              handleClose(enemyIds);
            }}
          >
            キャンセル
          </Button>
          <Button
            variant="outlined"
            disabled={isConfirmDisabled}
            onClick={() => {
              handleClose(selectedEnemyIds);
            }}
          >
            OK
          </Button>
        </Box>
      </DialogContent>
    </Dialog>
  );
}

interface TestPlayProps {
  currentUser: User;
}

function TestPlay(props: TestPlayProps) {
  const { currentUser } = props;
  const playerHp = 20;
  const playerEnergy = 20;
  const speed = 2.5;
  const strength = 1.2;
  const weaponName = "クロスボウ";
  const enemyHps = [50, 50, 50];
  const InitialEnemies = [sampleUsers[0], sampleUsers[1], sampleUsers[2]];

  const [users, setUsers] = useState([currentUser]);
  const [enemies, setEnemies] = useState(InitialEnemies);
  const [open, setOpen] = useState(false);
  const [enemyIds, setEnemyIds] = useState([1, 2, 3]);

  const [isActive, setIsActive] = useState(false);
  const [resetId, setResetId] = useState(1);
  const [isPaused, setIsPaused] = useState(false);
  const [selectedEnemyIds, setSelectedEnemyIds] = useState(enemyIds);
  const [isConfirmDisabled, setIsConfirmDisabled] = useState(false);

  const handleClickOpen = async () => {
    setUsers(await getUsers());
    setSelectedEnemyIds(enemyIds);
    setIsConfirmDisabled(false);
    setOpen(true);
  };

  const handleClose = (returnedEnemyIds: number[]) => {
    if (returnedEnemyIds.length === 3) {
      setEnemyIds(returnedEnemyIds);
      setOpen(false);
    }
  };

  useEffect(() => {
    const newEnemies: User[] = Array(3);
    for (let i = 0; i < 3; i += 1) {
      const enemy = users.find((element) => element.id === enemyIds[i]);
      if (enemy) newEnemies[i] = enemy;
    }
    setEnemies(newEnemies);
  }, [enemyIds, users]);

  const fetchUsers = async () => {
    setUsers(await getUsers());
  };
  fetchUsers();

  return (
    <div>
      <Accordion sx={{ position: "absolute", top: 48, right: 0, width: 480 }}>
        <AccordionSummary expandIcon={<ExpandMoreIcon />}>
          実行
        </AccordionSummary>
        <AccordionDetails sx={{ height: 600 }}>
          <Emulator
            users={sampleUsers}
            HasGameStarted={isActive}
            isPaused={isPaused}
            resetId={resetId}
          />
          <Box sx={{ m: 1 }}>
            <Box>
              <Typography>HP</Typography>
              <LinearProgress variant="determinate" value={playerHp} />
              <Typography sx={{ mt: 1 }}>元気</Typography>
              <LinearProgress variant="determinate" value={playerEnergy} />
            </Box>
            <Box
              sx={{
                mt: 1,
                mb: 2,
                display: "flex",
                gap: 0.5,
              }}
            >
              <Chip
                icon={<DirectionsRunIcon />}
                label={`移動: x${speed}`}
                size="small"
                variant="outlined"
                sx={{ width: 100 }}
              />
              <Chip
                icon={<GiCrossedSwords size="0.8em" />}
                label={`攻撃: x${strength}`}
                size="small"
                variant="outlined"
                sx={{ width: 100 }}
              />
              <Chip
                icon={<HiOutlineScale size="0.8em" />}
                label={`装備: ${weaponName}`}
                size="small"
                variant="outlined"
                sx={{ width: 140, ml: "auto" }}
              />
            </Box>
            <Box
              sx={{
                display: "grid",
                gridTemplateColumns: "repeat(3, 1fr)",
                gap: 2,
              }}
            >
              {enemies.map((enemy, index) => (
                <Box key={enemy.name}>
                  <Typography>{enemy.name}</Typography>
                  <LinearProgress
                    variant="determinate"
                    value={Number(enemyHps[index])}
                    color="error"
                  />
                </Box>
              ))}
            </Box>
            <Box sx={{ display: "flex", justifyContent: "flex-end" }}>
              <Button variant="text" size="small" onClick={handleClickOpen}>
                対戦相手の選択...
              </Button>
            </Box>
            <Box
              sx={{
                display: "grid",
                gridTemplateColumns: "repeat(3, 1fr)",
                gap: 2,
                mt: 2,
              }}
            >
              <Button
                variant="outlined"
                sx={{ color: grey[900], borderColor: grey[400] }}
                onClick={() => {
                  setIsActive(true);
                  setIsPaused(false);
                }}
                startIcon={<PlayArrow />}
              >
                実行
              </Button>
              <Button
                variant="outlined"
                sx={{ color: grey[900], borderColor: grey[400] }}
                onClick={() => {
                  setIsPaused(true);
                }}
                startIcon={<Pause />}
              >
                一時停止
              </Button>
              <Button
                variant="outlined"
                sx={{ color: grey[900], borderColor: grey[400] }}
                onClick={() => {
                  setResetId((previous) => previous + 1);
                  setIsActive(false);
                }}
                startIcon={<RestartAlt />}
              >
                リセット
              </Button>
            </Box>
          </Box>
        </AccordionDetails>
      </Accordion>
      <EnemyDialog
        users={users}
        enemyIds={enemyIds}
        selectedEnemyIds={selectedEnemyIds}
        setSelectedEnemyIds={setSelectedEnemyIds}
        open={open}
        handleClose={handleClose}
        isConfirmDisabled={isConfirmDisabled}
        setIsConfirmDisabled={setIsConfirmDisabled}
      />
    </div>
  );
}

export default function App() {
  const [currentUser, setCurrentUser] = useState({
    id: 0,
    name: "",
    script: "",
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
        {/* <Emulator users={users} /> */}
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
