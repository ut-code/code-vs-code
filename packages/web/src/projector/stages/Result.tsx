import { Box, Stack } from "@mui/material";
import { Fragment, useEffect, useRef } from "react";
import { AiFillTrophy } from "react-icons/ai";
import ProjectorHeader from "../components/Header";
import type { League, LeagueUserIds } from "../Projector";
import rocketIcon from "../../icon1.svg";

export type ProjectorReadyProps = {
  league: League;
  rankSortedUserIds: LeagueUserIds;
  nextLeague: League;
  onCompleted(): void;
};

const orderLabelMap = ["1st", "2nd", "3rd", "4th"] as const;

function ProjectorResult({
  league,
  rankSortedUserIds,
  nextLeague,
  onCompleted,
}: ProjectorReadyProps) {
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
        gridTemplateRows: "max-content 1fr max-content",
        height: "100%",
      }}
    >
      <ProjectorHeader league={league} />
      <Stack direction="row" justifyContent="center" alignItems="center">
        <Box sx={{ width: "700px" }}>
          <Box sx={{ fontSize: "96px" }}>Result</Box>
          <Stack direction="row" alignItems="center" spacing={2} sx={{ mt: 4 }}>
            <Box>
              <AiFillTrophy size="160px" />
            </Box>
            <Box>
              <Box
                sx={{
                  width: "max-content",
                  color: "white",
                  backgroundColor: "black",
                  fontSize: "40px",
                  paddingX: "30px",
                }}
              >
                {league.users.findIndex(
                  (user) => user.id === rankSortedUserIds[0]
                ) + 1}
                P
              </Box>
              <Box sx={{ fontSize: "96px" }}>
                {
                  league.users.find((user) => user.id === rankSortedUserIds[0])
                    ?.name
                }
              </Box>
            </Box>
          </Stack>
          <Box
            sx={{
              display: "grid",
              gridTemplateColumns: "120px max-content 1fr",
              alignItems: "center",
              mt: 4,
              columnGap: 3,
            }}
          >
            {rankSortedUserIds.slice(1).map((userId, i) => (
              <Fragment key={userId}>
                <Box sx={{ fontSize: "40px" }}>{orderLabelMap[i + 1]}</Box>
                <Box>
                  <Box
                    sx={{
                      width: "max-content",
                      color: "white",
                      backgroundColor: "black",
                      fontSize: "32px",
                      paddingX: "20px",
                    }}
                  >
                    {league.users.findIndex((user) => user.id === userId) + 1}P
                  </Box>
                </Box>
                <Box sx={{ fontSize: "64px" }}>
                  {league.users.find((user) => user.id === userId)?.name}
                </Box>
              </Fragment>
            ))}
          </Box>
        </Box>
        <img alt="" src={rocketIcon} style={{ width: "800px" }} />
      </Stack>
      <Stack
        direction="row"
        alignItems="center"
        justifyContent="flex-end"
        sx={{ fontSize: "48px", padding: "40px" }}
      >
        ▶▶ Next: 第{nextLeague.id + 1}リーグ
      </Stack>
    </Box>
  );
}

export default ProjectorResult;
