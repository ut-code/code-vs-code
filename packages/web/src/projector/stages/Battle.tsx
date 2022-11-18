import { Box, LinearProgress, Stack } from "@mui/material";
import { useRef, useState } from "react";
import Emulator, { Status } from "../../component/Emulator";
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

function ProjectorBattle({ league, onCompleted }: ProjectorBattleProps) {
  const onCompletedRef = useRef(onCompleted);
  onCompletedRef.current = onCompleted;

  const [statuses, setStatuses] = useState<Status[] | null>(null);

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
        <Box>
          <Emulator
            users={league.users}
            hasGameStarted
            executionId={1}
            isPaused={false}
            handleStatuses={setStatuses}
            onGameCompleted={(result) => onCompleted(result as LeagueUserIds)}
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
