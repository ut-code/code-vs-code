import { Box } from "@mui/material";
import type { League } from "../Projector";
import logo from "../../logo.svg";

export default function ProjectorHeader({ league }: { league: League }) {
  return (
    <Box
      sx={{
        height: "80px",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        position: "relative",
        borderBottom: "8px solid",
      }}
    >
      <img
        alt="ut.code(); ロゴ"
        src={logo}
        style={{
          position: "absolute",
          top: "calc(50% - 25px)",
          left: "20px",
          height: "50px",
        }}
      />
      <Box sx={{ fontSize: "40px" }}>第{league.id + 1}リーグ</Box>
    </Box>
  );
}
