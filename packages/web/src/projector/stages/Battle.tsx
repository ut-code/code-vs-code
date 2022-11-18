import { Box, LinearProgress, Stack } from "@mui/material";
import { useCallback, useRef, useState } from "react";
import { useMeasure } from "react-use";
import Emulator, { Status } from "../../component/Emulator";
import {
  MAX_HP,
  MAX_STAMINA,
  Result,
  STAGE_HEIGHT,
  STAGE_WIDTH,
} from "../../component/game";
import ProjectorHeader from "../components/Header";
import type { League, LeagueUserIds, User } from "../Projector";

function ProjectorBattleUser({
  playerCode,
  user,
  status,
}: {
  playerCode: number;
  user: User;
  status: Status | null;
}) {
  return (
    <Stack alignItems="flex-start" spacing="8px" sx={{ padding: "30px" }}>
      <Box
        sx={{
          color: "white",
          backgroundColor: "black",
          fontSize: "32px",
          paddingX: "32px",
        }}
      >
        {playerCode + 1}P
      </Box>
      <Box
        sx={{
          fontSize: "60px",
          textDecoration: !status ? "line-through" : undefined,
        }}
      >
        {user.name}
      </Box>
      <Box sx={{ color: "text.secondary", fontSize: "24px" }}>HP</Box>
      <LinearProgress
        sx={{ width: "100%", height: "30px" }}
        variant="determinate"
        value={status?.HP ?? 0}
      />
      <Box sx={{ color: "text.secondary", fontSize: "24px" }}>元気</Box>
      <LinearProgress
        sx={{ width: "100%", height: "30px" }}
        variant="determinate"
        value={status?.stamina ?? 0}
      />
    </Stack>
  );
}

export type ProjectorBattleProps = {
  league: League;
  onCompleted(rankSortedUserIds: [number, number, number, number]): void;
};

const defaultStatus: Omit<Status, "id"> = {
  HP: MAX_HP,
  stamina: MAX_STAMINA,
  speed: 2,
  weapon: "なし",
};

function ProjectorBattle({ league, onCompleted }: ProjectorBattleProps) {
  const [emulatorContainerRef, { width, height }] = useMeasure();
  const emulatorWidth = Math.min(
    width - 30,
    (STAGE_WIDTH * height) / STAGE_HEIGHT
  );
  const emulatorHeight = Math.min(
    width - 30,
    (STAGE_HEIGHT * width) / STAGE_WIDTH
  );

  const onCompletedRef = useRef(onCompleted);
  onCompletedRef.current = onCompleted;

  const onGameCompleted = useCallback((result: Result) => {
    onCompletedRef.current(result as LeagueUserIds);
  }, []);

  const [statuses, setStatuses] = useState<Status[] | null>(
    league.users.map((user) => ({ id: user.id, ...defaultStatus }))
  );

  return (
    <Box
      sx={{
        display: "grid",
        gridTemplateRows: "max-content 1fr",
        height: "100%",
      }}
    >
      <ProjectorHeader league={league} />
      <Box
        sx={{
          display: "grid",
          gridTemplateColumns: "1fr 960px 1fr",
        }}
      >
        {statuses && (
          <Stack justifyContent="center">
            <ProjectorBattleUser
              playerCode={0}
              user={league.users[0]}
              status={
                statuses.find((status) => status.id === league.users[0].id) ??
                null
              }
            />
            <ProjectorBattleUser
              playerCode={2}
              user={league.users[2]}
              status={
                statuses.find((status) => status.id === league.users[2].id) ??
                null
              }
            />
          </Stack>
        )}
        <Box
          ref={emulatorContainerRef}
          sx={{
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
          }}
        >
          <Emulator
            width={emulatorWidth}
            height={emulatorHeight}
            users={league.users}
            hasGameStarted
            executionId={1}
            isPaused={false}
            handleStatuses={setStatuses}
            onGameCompleted={onGameCompleted}
          />
        </Box>
        {statuses && (
          <Stack justifyContent="center">
            <ProjectorBattleUser
              playerCode={1}
              user={league.users[1]}
              status={
                statuses.find((status) => status.id === league.users[1].id) ??
                null
              }
            />
            <ProjectorBattleUser
              playerCode={3}
              user={league.users[3]}
              status={
                statuses.find((status) => status.id === league.users[3].id) ??
                null
              }
            />
          </Stack>
        )}
      </Box>
    </Box>
  );
}

export default ProjectorBattle;
