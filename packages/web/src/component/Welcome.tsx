import { useState } from "react";
import {
  Avatar,
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  TextField,
  ToggleButton,
  ToggleButtonGroup,
  Typography,
} from "@mui/material";
import type { User } from "./game";
import iconURL from "../icon1.svg";
import { createUser } from "../fetchAPI";

interface WelcomeProps {
  currentUser: User;
  setCurrentUser: (value: User) => void;
}

export default function Welcome(props: WelcomeProps) {
  const { currentUser, setCurrentUser } = props;
  const [open, setOpen] = useState(true);
  const [name, setName] = useState("");
  const [selectedIcon, setSelectedIcon] = useState(0);
  const [errorMessage, setErrorMessage] = useState(" ");

  const icons = [
    { src: iconURL, name: "icon1" },
    { src: iconURL, name: "icon2" },
    { src: iconURL, name: "icon3" },
    { src: iconURL, name: "icon4" },
    { src: iconURL, name: "icon5" },
    { src: iconURL, name: "icon6" },
  ];

  const handleClose = async () => {
    if (name !== "" && name.match(/\S/g)) {
      setOpen(false);
      const user = await createUser(name);
      setCurrentUser(user);
      /* setCurrentUser({
        id: 7,
        name,
        script: "",
        rank: 3,
      }); */
    } else {
      setErrorMessage("ニックネームを入力してください");
    }
  };

  const handleChangeName = (event: React.ChangeEvent<HTMLInputElement>) => {
    setName(event.target.value);
  };

  const handleChangeIcon = (_: unknown, newIcon: number | null) => {
    if (newIcon !== null) {
      setSelectedIcon(newIcon);
    }
  };

  return (
    <div>
      {currentUser.id === 0 && (
        <Dialog open={open}>
          <DialogTitle>ようこそ</DialogTitle>
          <DialogContent>
            <Typography color="text.secondary" sx={{ my: 1 }}>
              ニックネーム
            </Typography>
            <TextField
              onChange={handleChangeName}
              autoFocus
              fullWidth
              variant="outlined"
              error={errorMessage !== " "}
              helperText={errorMessage}
            />
            <Typography color="text.secondary" sx={{ my: 1 }}>
              アイコン
            </Typography>
            <div>
              <ToggleButtonGroup
                value={selectedIcon}
                onChange={handleChangeIcon}
                exclusive
                size="small"
              >
                {icons.map((icon, index) => (
                  <ToggleButton value={index} key={icon.name}>
                    <Avatar src={icon.src} />
                  </ToggleButton>
                ))}
              </ToggleButtonGroup>
            </div>
          </DialogContent>
          <DialogActions>
            <Button onClick={handleClose} variant="outlined">
              開始
            </Button>
          </DialogActions>
        </Dialog>
      )}
    </div>
  );
}
