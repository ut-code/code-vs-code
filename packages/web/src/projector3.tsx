import { Box } from "@mui/material";

function Projector3() {
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
          ml: 40,
          mt: 10,
        }}
      >
        <Box>
          <Box
            sx={{
              fontSize: 50,
              fontWeight: "bold",
            }}
          >
            Result
          </Box>
          <Box
            sx={{
              display: "grid",
              columGap: 5,
              rowGap: 0,
              gridTemplateColumns: "repeat(2, 0fr)",
              gap: 10,
              mt: 5,
            }}
          >
            <Box
              sx={{
                color: "black",
                width: 120,
                height: 120,
                bgcolor: "aqua",
              }}
            >
              cup
            </Box>
            <Box>
              <Box
                sx={{
                  color: "white",
                  bgcolor: "black",
                  fontSize: 20,
                  width: 60,
                  height: 30,
                  textAlign: "center",
                }}
              >
                2P
              </Box>
              <Box
                sx={{
                  fontSize: 60,
                  fontWeight: "bold",
                  width: 800,
                }}
              >
                吾輩は猫
              </Box>
            </Box>
          </Box>
          <Box
            sx={{
              display: "grid",
              columGap: 5,
              rowGap: 0,
              gridTemplateColumns: "repeat(3, 0fr)",
              gap: 5,
              mt: 6,
            }}
          >
            <Box
              sx={{
                fontSize: 20,
                fontWeight: "bold",
              }}
            >
              2nd
            </Box>
            <Box
              sx={{
                color: "white",
                bgcolor: "black",
                fontSize: 18,
                width: 50,
                height: 25,
                textAlign: "center",
              }}
            >
              1P
            </Box>
            <Box
              sx={{
                fontSize: 30,
                fontWeight: "bold",
              }}
            >
              FooBarBaz
            </Box>
          </Box>
          <Box
            sx={{
              display: "grid",
              columGap: 5,
              rowGap: 0,
              gridTemplateColumns: "repeat(3, 0fr)",
              gap: 5,
              mt: 6,
            }}
          >
            <Box
              sx={{
                fontSize: 20,
                fontWeight: "bold",
              }}
            >
              3rd
            </Box>
            <Box
              sx={{
                color: "white",
                bgcolor: "black",
                fontSize: 18,
                width: 50,
                height: 25,
                textAlign: "center",
              }}
            >
              4P
            </Box>
            <Box
              sx={{
                fontSize: 30,
                fontWeight: "bold",
              }}
            >
              UTC
            </Box>
          </Box>
          <Box
            sx={{
              display: "grid",
              columGap: 5,
              rowGap: 0,
              gridTemplateColumns: "repeat(3, 0fr)",
              gap: 5,
              mt: 6,
            }}
          >
            <Box
              sx={{
                fontSize: 20,
                fontWeight: "bold",
              }}
            >
              4th
            </Box>
            <Box
              sx={{
                color: "white",
                bgcolor: "black",
                fontSize: 18,
                width: 50,
                height: 25,
                textAlign: "center",
              }}
            >
              3P
            </Box>
            <Box
              sx={{
                fontSize: 30,
                fontWeight: "bold",
                width: 700,
              }}
            >
              テスト
            </Box>
          </Box>
        </Box>
        <Box>
          <Box
            sx={{
              bgcolor: "aqua",
              height: 900,
            }}
          >
            icon
          </Box>
          <Box
            sx={{
              fontSize: 40,
              textAlign: "right",
            }}
          >
            ▶▶ Next: 第8リーグ
          </Box>
        </Box>
      </Box>
    </>
  );
}

export default Projector3;
