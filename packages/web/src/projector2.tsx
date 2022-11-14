import { Box } from "@mui/material";

function Projector2() {
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
          display: "inline",
        }}
      >
        <Box
          sx={{
            color: "white",
            bgcolor: "black",
          }}
        >
          1P
        </Box>
        <Box
          sx={{
            color: "black",
          }}
        >
          FooBarBaz
        </Box>
        <Box
          sx={{
            color: "text.secondary",
          }}
        >
          HP
        </Box>
        <Box
          sx={{
            color: "white",
          }}
        >
          a
        </Box>
      </Box>
    </>
  );
}

export default Projector2;
