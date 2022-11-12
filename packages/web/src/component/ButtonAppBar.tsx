import { AppBar, Box, Toolbar, Typography } from "@mui/material";
import { grey } from "@mui/material/colors";
import logoURL from "../logo.svg";

export default function ButtonAppBar() {
  return (
    <AppBar position="sticky" sx={{ color: grey[900], bgcolor: grey[50] }}>
      <Toolbar variant="dense">
        <Box sx={{ height: 32 }}>
          <a href="https://utcode.net/" target="_blank" rel="noreferrer">
            <img src={logoURL} alt="" height="100%" />
          </a>
        </Box>
        <Typography sx={{ ml: 2 }}>Code vs Code</Typography>
      </Toolbar>
    </AppBar>
  );
}
