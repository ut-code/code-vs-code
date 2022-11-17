import { Box } from "@mui/material";
import { useEffect, useRef } from "react";
import type { League, User } from "../Projector";

function ProjectorReadyUser({ user }: { user: User }) {
  return (
    <Box>
      <Box
        sx={{
          color: "white",
          bgcolor: "black",
          fontWeight: "bold",
          fontSize: 60,
          width: 160,
          height: 80,
          mt: 6,
          ml: 4,
          textAlign: "center",
        }}
      >
        1P
      </Box>
      <Box
        sx={{
          color: "black",
          fontWeight: "bold",
          fontSize: 200,
        }}
      >
        {user.name}
      </Box>
      <Box
        sx={{
          color: "text.secondary",
          fontWeight: "medium",
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
    <>
      <Box
        sx={{
          bgcolor: "background.paper",
          boxShadow: 1,
          p: 2,
          minWidth: 300,
          width: 1920,
          height: 120,
          borderBottom: 20,
        }}
      >
        <Box
          sx={{
            display: "inline",
            fontSize: 80,
          }}
        >
          ut.code();
        </Box>
        <Box
          sx={{
            color: "text.primary",
            fontWeight: "bolder",
            display: "inline",
            fontSize: 80,
            ml: 60,
          }}
        >
          第{league.id + 1}リーグ
        </Box>
      </Box>
      <Box
        sx={{
          display: "grid",
          columGap: 0,
          rowGap: 0,
          gridTemplateColumns: "repeat(2, 1fr)",
          width: 1920,
          height: 960,
        }}
      >
        <ProjectorReadyUser user={league.users[0]} />
        <ProjectorReadyUser user={league.users[1]} />
        <ProjectorReadyUser user={league.users[2]} />
        <ProjectorReadyUser user={league.users[3]} />
      </Box>
    </>
  );
}

export default ProjectorReady;
