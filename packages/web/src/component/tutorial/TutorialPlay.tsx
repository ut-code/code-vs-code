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
  LinearProgress,
  Skeleton,
  Typography,
} from "@mui/material";
import { Pause, PlayArrow, RestartAlt } from "@mui/icons-material";
import DirectionsRunIcon from "@mui/icons-material/DirectionsRun";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import { grey } from "@mui/material/colors";
import { HiOutlineScale } from "react-icons/hi";
import Draggable from "react-draggable";
import Emulator, { Status } from "../Emulator";
import type { User } from "../game/game";
import Modal from "./modal";
import tutorialEnemies from "./tutorialEnemies";

interface TutorialPlayProps {
  currentUser: User;
  setCurrentUser: (value: User) => void;
  workspaceRef: React.MutableRefObject<Blockly.WorkspaceSvg | undefined>;
  tutorialId: number;
}

export default function TutorialPlay(props: TutorialPlayProps) {
  const { currentUser, setCurrentUser, workspaceRef } = props;
  const [users, setUsers] = useState<User[] | null>(null);
  const [enemyIds, setEnemyIds] = useState([6, 7, 8]);
  const { tutorialId } = props;

  useEffect(() => {
    const fetchUsers = async () => {
      const response = await tutorialEnemies[tutorialId - 1];
      if (response) {
        const copy = response
          .filter((user) => user.id !== currentUser.id)
          .slice();
        const newEnemyIds = [...Array(3)].map(
          () => copy.splice(Math.floor(Math.random() * copy.length), 1)[0]?.id
        ) as number[];
        setEnemyIds(newEnemyIds);
        setUsers(response);
      }
    };
    fetchUsers();
  }, [currentUser.id, tutorialId]);

  const [isActive, setIsActive] = useState(false);
  const [executionId, setExecutionId] = useState(1);
  const [isPaused, setIsPaused] = useState(false);
  const [statuses, setStatuses] = useState<Status[]>();

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
            <Modal id={tutorialId} />
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
                  gameModeId={tutorialId}
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
            </Box>
          </AccordionDetails>
        </Accordion>
      </Draggable>
      {submitted && (
        <Dialog
          open={submitted}
          onClose={() => {
            setSubmitted(false);
          }}
        >
          <Typography sx={{ px: 2, py: 1 }}>反映しました</Typography>
        </Dialog>
      )}
    </>
  );
}
