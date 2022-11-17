import { Box, LinearProgress, Stack } from "@mui/material";
import { useEffect, useRef } from "react";
import ProjectorHeader from "../components/Header";
import type { League, User } from "../Projector";

function ProjectorBattleUser({
  playerCode,
  user,
}: {
  playerCode: number;
  user: User;
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
      <Box sx={{ fontSize: "60px" }}>{user.name}</Box>
      <Box sx={{ color: "text.secondary", fontSize: "24px" }}>HP</Box>
      <LinearProgress
        sx={{ width: "100%", height: "30px" }}
        variant="determinate"
        value={80}
      />
      <Box sx={{ color: "text.secondary", fontSize: "24px" }}>元気</Box>
      <LinearProgress
        sx={{ width: "100%", height: "30px" }}
        variant="determinate"
        value={20}
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

  useEffect(() => {
    const timerId = setTimeout(() => {
      onCompletedRef.current(
        league.users.map((user) => user.id) as [number, number, number, number]
      );
    }, 5000);
    return () => {
      clearTimeout(timerId);
    };
  }, [league.users]);

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
        <Stack justifyContent="center">
          <ProjectorBattleUser playerCode={0} user={league.users[0]} />
          <ProjectorBattleUser playerCode={2} user={league.users[2]} />
        </Stack>
        <Box bgcolor="yellow">Emulator</Box>
        <Stack justifyContent="center">
          <ProjectorBattleUser playerCode={1} user={league.users[1]} />
          <ProjectorBattleUser playerCode={3} user={league.users[3]} />
        </Stack>
      </Box>
    </Box>
  );
}

export default ProjectorBattle;
