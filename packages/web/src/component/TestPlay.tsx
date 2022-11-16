import { useState, useEffect } from "react";
import {
  Accordion,
  AccordionDetails,
  AccordionSummary,
  Box,
  Button,
  Chip,
  Dialog,
  DialogContent,
  DialogContentText,
  DialogTitle,
  IconButton,
  LinearProgress,
  List,
  ListItem,
  MenuItem,
  TextField,
  Typography,
} from "@mui/material";
import { Pause, PlayArrow, RestartAlt } from "@mui/icons-material";
import DeleteIcon from "@mui/icons-material/Delete";
import DirectionsRunIcon from "@mui/icons-material/DirectionsRun";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import { grey } from "@mui/material/colors";
import { GiCrossedSwords } from "react-icons/gi";
import { HiOutlineScale } from "react-icons/hi";
import Emulator from "./Emulator";
import type { User } from "./game";

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

export default function TestPlay(props: TestPlayProps) {
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
  const [executionId, setExecutionId] = useState(1);
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
            executionId={executionId}
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
                  setExecutionId((previous) => previous + 1);
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
