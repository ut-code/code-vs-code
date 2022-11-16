import { Box } from "@mui/material";

function Projector1() {
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
              fontweigt: "bold",
              fontSize: 200,
            }}
          >
            FooBarBaz
          </Box>
          <Box
            sx={{
              color: "text.secondary",
              fontweight: "medium",
              fontSize: 40,
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
              fontSize: 60,
              width: 160,
              height: 80,
              mt: 6,
              ml: 4,
              textAlign: "center",
            }}
          >
            2P
          </Box>
          <Box
            sx={{
              color: "black",
              fontweigt: "bold",
              fontSize: 200,
            }}
          >
            吾輩は猫
          </Box>
          <Box
            sx={{
              color: "text.secondary",
              fontweight: "medium",
              fontSize: 40,
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
              display: "grid",
              columGap: 5,
              rowGap: 0,
              gridTemplateColumns: "repeat(2, 0fr)",
              gap: 5,
              mt: 6,
            }}
          >
            <Box
              sx={{
                color: "white",
                bgcolor: "black",
                fontweigt: "bold",
                fontSize: 60,
                width: 160,
                height: 80,
                mt: 6,
                ml: 4,
                textAlign: "center",
              }}
            >
              3P
            </Box>
            <Box
              sx={{
                fontSize: 30,
                fontWeight: "bold",
                width: 500,
                mt: 6,
              }}
            >
              🔥リーグ初参加
            </Box>
          </Box>
          <Box
            sx={{
              color: "black",
              fontweigt: "bold",
              fontSize: 200,
            }}
          >
            テスト
          </Box>
          <Box
            sx={{
              color: "text.secondary",
              fontweight: "medium",
              fontSize: 40,
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
              fontSize: 60,
              width: 160,
              height: 80,
              mt: 6,
              ml: 4,
              textAlign: "center",
            }}
          >
            4P
          </Box>
          <Box
            sx={{
              color: "black",
              fontweigt: "bold",
              fontSize: 200,
            }}
          >
            UTC
          </Box>
          <Box
            sx={{
              color: "text.secondary",
              fontweight: "medium",
              fontSize: 40,
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
