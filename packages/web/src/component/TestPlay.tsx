import Blockly from "blockly";
import { useState, useEffect, useMemo, useRef } from "react";
import {
  Accordion,
  AccordionDetails,
  AccordionSummary,
  accordionSummaryClasses,
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
  Skeleton,
  TextField,
  Typography,
} from "@mui/material";
import { Pause, PlayArrow, RestartAlt } from "@mui/icons-material";
import DeleteIcon from "@mui/icons-material/Delete";
import DirectionsRunIcon from "@mui/icons-material/DirectionsRun";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import { grey } from "@mui/material/colors";
import { HiOutlineScale } from "react-icons/hi";
import Draggable from "react-draggable";
import Emulator, { Status } from "./Emulator";
import type { User } from "./game";
import { getUsers } from "../fetchAPI";

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
            {users
              .filter((user) => user.program)
              .map((user) => (
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
  setCurrentUser: (value: User) => void;
  workspaceRef: React.MutableRefObject<Blockly.WorkspaceSvg | undefined>;
}

export default function TestPlay(props: TestPlayProps) {
  const { currentUser, setCurrentUser, workspaceRef } = props;
  const [users, setUsers] = useState<User[] | null>(null);
  const [open, setOpen] = useState(false);
  const [enemyIds, setEnemyIds] = useState([6, 7, 8]);

  useEffect(() => {
    const fetchUsers = async () => {
      const response = await getUsers();
      const copy = response
        .filter((user) => user.id !== currentUser.id)
        .slice();
      const newEnemyIds = [...Array(3)].map(
        () => copy.splice(Math.floor(Math.random() * copy.length), 1)[0]?.id
      ) as number[];
      setEnemyIds(newEnemyIds);
      setUsers(response);
    };
    fetchUsers();
  }, [currentUser.id]);

  const usersExceptMe = users?.filter((user) => user.id !== currentUser.id);

  const [isActive, setIsActive] = useState(false);
  const [executionId, setExecutionId] = useState(1);
  const [isPaused, setIsPaused] = useState(false);
  const [selectedEnemyIds, setSelectedEnemyIds] = useState(enemyIds);
  const [isConfirmDisabled, setIsConfirmDisabled] = useState(false);

  const [statuses, setStatuses] = useState<Status[]>();

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

  const enemyUsers: User[] | null = useMemo(
    () =>
      users
        ? users.filter((user) =>
            enemyIds.some((enemyId) => enemyId === user.id)
          )
        : null,
    [enemyIds, users]
  );

  const usersOnStage = useMemo(
    () => (enemyUsers ? [currentUser].concat(enemyUsers) : null),
    [currentUser, enemyUsers]
  );
  const [submitted, setSubmitted] = useState(false);

  const accordionRef = useRef<HTMLDivElement>(null);

  return (
    <>
      <Draggable
        nodeRef={accordionRef}
        handle={`.${accordionSummaryClasses.root}`}
      >
        <Accordion
          sx={{ position: "absolute", top: 60, right: 20, width: 640 }}
          elevation={4}
          disableGutters
          ref={accordionRef}
        >
          <AccordionSummary expandIcon={<ExpandMoreIcon />}>
            実行
          </AccordionSummary>
          <AccordionDetails>
            <Box sx={{ height: 450, width: 600 }}>
              {usersOnStage ? (
                <Emulator
                  width={600}
                  height={450}
                  users={usersOnStage}
                  hasGameStarted={isActive}
                  isPaused={isPaused}
                  executionId={executionId}
                  handleStatuses={setStatuses}
                />
              ) : (
                <Skeleton width="100%" height="auto" />
              )}
            </Box>
            <Box sx={{ m: 1 }}>
              <Box>
                <Typography>HP</Typography>
                <LinearProgress
                  variant="determinate"
                  value={
                    statuses?.find((status) => status.id === currentUser.id)
                      ?.HP || 0
                  }
                />
                <Typography sx={{ mt: 1 }}>元気</Typography>
                <LinearProgress
                  variant="determinate"
                  value={
                    statuses?.find((status) => status.id === currentUser.id)
                      ?.stamina || 0
                  }
                />
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
                  label={`移動: x${
                    statuses?.find((status) => status.id === currentUser.id)
                      ?.speed || 0
                  }`}
                  size="small"
                  variant="outlined"
                  sx={{ width: 100 }}
                />
                <Chip
                  icon={<HiOutlineScale size="0.8em" />}
                  label={`装備: ${
                    statuses?.find((status) => status.id === currentUser.id)
                      ?.weapon || "なし"
                  }`}
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
                {enemyUsers &&
                  enemyUsers.map((enemyUser) => (
                    <Box key={enemyUser.name}>
                      <Typography>{enemyUser.name}</Typography>
                      <LinearProgress
                        variant="determinate"
                        value={
                          statuses?.find((status) => status.id === enemyUser.id)
                            ?.HP || 0
                        }
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
                    setCurrentUser({
                      id: currentUser.id,
                      name: currentUser.name,
                      program: Blockly.JavaScript.workspaceToCode(
                        workspaceRef.current
                      ),
                      rank: currentUser.rank,
                    });
                  }}
                  startIcon={<RestartAlt />}
                >
                  リセット
                </Button>
              </Box>
              <Button
                onClick={() => {
                  setCurrentUser({
                    id: currentUser.id,
                    name: currentUser.name,
                    program: Blockly.JavaScript.workspaceToCode(
                      workspaceRef.current
                    ),
                    rank: currentUser.rank,
                  });
                  setSubmitted(true);
                }}
              >
                プログラムを反映
              </Button>
            </Box>
          </AccordionDetails>
        </Accordion>
      </Draggable>
      {users && usersExceptMe ? (
        <EnemyDialog
          users={usersExceptMe}
          enemyIds={enemyIds}
          selectedEnemyIds={selectedEnemyIds}
          setSelectedEnemyIds={setSelectedEnemyIds}
          open={open}
          handleClose={handleClose}
          isConfirmDisabled={isConfirmDisabled}
          setIsConfirmDisabled={setIsConfirmDisabled}
        />
      ) : (
        <Skeleton />
      )}
      {submitted && (
        <Dialog
          open={submitted}
          onClose={() => {
            setSubmitted(false);
          }}
        >
          {currentUser.program}
        </Dialog>
      )}
    </>
  );
}
