import { Box } from "@mui/material";

function Projector1() {
  return (
    <>
      <Box
        sx={{
          bgcolor: "background.paper",
          boxShadow: 1,
          borderRadius: 2,
          p: 2,
          minWidth: 300,
          width: 1920,
          height: 120,
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
          display: "grid",
          columGap: 0,
          rowGap: 0,
          gridTemplateColumns: "repeat(2, 1fr)",
          width: 1920,
          height: 960,
        }}
      >
        <Box
          sx={{
            bgcolor: "yellow",
          }}
        >
          <Box
            sx={{
              color: "white",
              bgcolor: "black",
              fontweigt: "bold",
              width: 160,
              height: 80,
              mt: 6,
              ml: 4,
              textAlign: "center",
              verticalAlign: "middle",
            }}
          >
            1P
          </Box>
          <Box
            sx={{
              color: "black",
              fontweigt: "bold",
            }}
          >
            FooBarBaz
          </Box>
          <Box
            sx={{
              color: "text.secondary",
              fontweight: "medium",
            }}
          >
            11/18 11:43参戦
          </Box>
        </Box>
        <Box
          sx={{
            bgcolor: "aqua",
          }}
        >
          <Box
            sx={{
              color: "white",
              bgcolor: "black",
              fontweigt: "bold",
            }}
          >
            2P
          </Box>
          <Box
            sx={{
              color: "black",
              fontweigt: "bold",
            }}
          >
            吾輩は猫
          </Box>
          <Box
            sx={{
              color: "text.secondary",
              fontweight: "medium",
            }}
          >
            11/18 11:43参戦
          </Box>
        </Box>
        <Box
          sx={{
            bgcolor: "lime",
          }}
        >
          <Box
            sx={{
              color: "white",
              bgcolor: "black",
              fontweigt: "bold",
            }}
          >
            3P
          </Box>
          <Box
            sx={{
              color: "black",
              fontweigt: "bold",
            }}
          >
            テスト
          </Box>
          <Box
            sx={{
              color: "text.secondary",
              fontweight: "medium",
            }}
          >
            11/18 11:43参戦
          </Box>
        </Box>
        <Box
          sx={{
            bgcolor: "orange",
          }}
        >
          <Box
            sx={{
              color: "white",
              bgcolor: "black",
              fontweigt: "bold",
            }}
          >
            4P
          </Box>
          <Box
            sx={{
              color: "black",
              fontweigt: "bold",
            }}
          >
            UTC
          </Box>
          <Box
            sx={{
              color: "text.secondary",
              fontweight: "medium",
            }}
          >
            11/18 11:43参戦
          </Box>
        </Box>
      </Box>
    </>
  );
}

export default Projector1;
