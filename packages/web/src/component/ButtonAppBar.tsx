import { AppBar, Box, ButtonBase, Toolbar, Typography } from "@mui/material";
import { grey } from "@mui/material/colors";
import { Lock } from "@mui/icons-material";
import logoURL from "../logo.svg";
import { useApiPasswordContext } from "../common/api-password";

export type ButtonAppBarProps = {
  openApiPasswordDialog(): void;
};

export default function ButtonAppBar({
  openApiPasswordDialog,
}: ButtonAppBarProps) {
  const { password } = useApiPasswordContext();

  return (
    <AppBar position="sticky" sx={{ color: grey[900], bgcolor: grey[50] }}>
      <Toolbar variant="dense">
        <Box sx={{ height: 32 }}>
          <a href="https://utcode.net/" target="_blank" rel="noreferrer">
            <img src={logoURL} alt="" height="100%" />
          </a>
        </Box>
        <Typography sx={{ ml: 2 }}>Code vs Code</Typography>
        <Box sx={{ height: 32 }}>
          <a href="/" target="_blank" rel="noreferrer">
            <Typography
              variant="caption"
              sx={{
                ml: 2,
                height: "100%",
                display: "flex",
                alignItems: "center",
              }}
            >
              チュートリアル選択画面に戻る
            </Typography>
          </a>
        </Box>
        {!password && (
          <ButtonBase
            onClick={openApiPasswordDialog}
            sx={{
              ml: "auto",
              px: 1,
              height: "100%",
              gap: 0.5,
              color: "text.secondary",
            }}
          >
            <Lock />
            <Typography>オンライン参加</Typography>
          </ButtonBase>
        )}
      </Toolbar>
    </AppBar>
  );
}
