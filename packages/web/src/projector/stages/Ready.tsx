import { Box } from "@mui/material";
import { useEffect, useRef } from "react";
import ProjectorHeader from "../components/Header";
import type { League, User } from "../Projector";

function ProjectorReadyUser({
  playerCode,
  user,
}: {
  playerCode: number;
  user: User;
}) {
  return (
    <Box
      sx={{
        display: "flex",
        flexFlow: "column",
        justifyContent: "center",
        border: "solid 1px",
        padding: "30px",
      }}
    >
      <Box
        sx={{
          width: "max-content",
          paddingX: "40px",
          color: "white",
          backgroundColor: "black",
          fontSize: "50px",
          textAlign: "center",
        }}
      >
        {playerCode + 1}P
      </Box>
      <Box sx={{ mt: "-50px", fontSize: 200 }}>{user.name}</Box>
      <Box
        sx={{
          color: "text.secondary",
          fontSize: 40,
        }}
      >
        11/18 11:43参戦
      </Box>
    </Box>
  );
}

export type ProjectorReadyProps = {
  league: League;
  onCompleted(): void;
};

function ProjectorReady({ league, onCompleted }: ProjectorReadyProps) {
  const onCompletedRef = useRef(onCompleted);
  onCompletedRef.current = onCompleted;

  useEffect(() => {
    const timerId = setTimeout(() => {
      onCompletedRef.current();
    }, 5000);
    return () => {
      clearTimeout(timerId);
    };
  }, []);

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
          gridTemplateColumns: "repeat(2, 1fr)",
        }}
      >
        {([0, 1, 2, 3] as const).map((playerCode) => (
          <ProjectorReadyUser
            key={playerCode}
            playerCode={playerCode}
            user={league.users[playerCode]}
          />
        ))}
      </Box>
    </Box>
  );
}

export default ProjectorReady;
