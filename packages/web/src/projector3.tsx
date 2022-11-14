import { Box } from "@mui/material";

function Projector3() {
  return (
    <>
      <Box
        sx={{
          bgcolor: "background.paper",
          boxShadow: 1,
          borderRadius: 2,
          p: 2,
          minWidth: 300,
        }}
      >
        <Box
          sx={{
            color: "success.dark",
            display: "inline",
          }}
        >
          ut.code();
        </Box>
        <Box
          sx={{
            color: "text.primary",
            fontWeight: "bolder",
            display: "inline",
          }}
        >
          第7リーグ
        </Box>
      </Box>
      <Box
        sx={{
          bgcolor: "white",
        }}
      >
        <Box
          sx={{
            color: "black",
          }}
        >
          Result
        </Box>
        <Box
          sx={{
            color: "black",
            display: "inline",
          }}
        >
          1st
        </Box>
        <Box
          sx={{
            color: "white",
            bgcolor: "black",
            display: "inline",
          }}
        >
          2P
        </Box>
        <Box
          sx={{
            color: "black",
            display: "inline",
          }}
        >
          吾輩は猫
        </Box>
      </Box>
    </>
  );
}

export default Projector3;
