import { useEffect, useRef, useState } from "react";
import Blockly from "blockly";
// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-ignore
import Ja from "blockly/msg/ja";
import "./style.css";
import {
  Accordion,
  AccordionDetails,
  AccordionSummary,
  AppBar,
  Avatar,
  Button,
  Card,
  Chip,
  createTheme,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
  IconButton,
  LinearProgress,
  List,
  ListItem,
  MenuItem,
  TextField,
  ToggleButton,
  ToggleButtonGroup,
  Toolbar,
} from "@mui/material";
import MenuIcon from "@mui/icons-material/Menu";
import DeleteIcon from "@mui/icons-material/Delete";
import DirectionsRunIcon from "@mui/icons-material/DirectionsRun";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import { grey } from "@mui/material/colors";
import { Box, ThemeProvider } from "@mui/system";
import { FaFortAwesome } from "react-icons/fa";
import { GiCrossedSwords } from "react-icons/gi";
import { HiOutlineScale } from "react-icons/hi";
import { SlControlPause, SlControlPlay, SlReload } from "react-icons/sl";
import { IconContext } from "react-icons";
import options from "./options";

// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-ignore
Blockly.setLocale(Ja);
// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-ignore
Blockly.HSV_SATURATION = 0.6;
// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-ignore
Blockly.HSV_VALUE = 1;

const appbarTheme = createTheme({
  palette: {
    secondary: {
      main: grey[50],
    },
  },
});

const buttonTheme = createTheme({
  palette: {
    secondary: {
      main: grey[900],
    },
  },
});

function Injection() {
  const [code, setCode] = useState("");
  const workspaceDivRef = useRef<HTMLDivElement>(null);
  const workspaceRef = useRef<Blockly.WorkspaceSvg>();
  useEffect(() => {
    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
    // @ts-ignore
    const workspace = Blockly.inject(workspaceDivRef.current, options);
    workspaceRef.current = workspace;
    return () => {
      workspace.dispose();
    };
  }, []);

  return (
    <>
      <div className="blocklyDiv" ref={workspaceDivRef} />
      <button
        type="button"
        onClick={() => {
          setCode(Blockly.JavaScript.workspaceToCode(workspaceRef.current));
        }}
      >
        出力
      </button>
      {code}
    </>
  );
}

function ButtonAppBar() {
  return (
    <ThemeProvider theme={appbarTheme}>
      <AppBar className="appbarDiv" position="sticky" color="secondary">
        <Toolbar variant="dense">
          <IconButton
            size="large"
            edge="start"
            color="inherit"
            aria-label="menu"
            sx={{ mr: 2 }}
          >
            <MenuIcon />
          </IconButton>
          <a href="https://utcode.net/" target="_blank" rel="noreferrer">
            <img
              className="logo"
              src="image/logo.da3597da.svg"
              alt=""
              height="32px"
            />
          </a>
          <div className="title">Code vs Code</div>
        </Toolbar>
      </AppBar>
    </ThemeProvider>
  );
}

function Welcome() {
  const [open, setOpen] = useState(true);
  const [name, setName] = useState("");
  const [icon, setIcon] = useState(0);

  const iconSources = [
    "image/icon1.svg",
    "image/icon1.svg",
    "image/icon1.svg",
    "image/icon1.svg",
    "image/icon1.svg",
    "image/icon1.svg",
  ];

  const handleClose = () => {
    setOpen(false);
  };

  const handleChangeName = (event: React.ChangeEvent<HTMLInputElement>) => {
    setName(event.target.value);
  };

  const handleChangeIcon = (
    _: React.MouseEvent<HTMLElement>,
    newIcon: number | null
  ) => {
    if (newIcon !== null) {
      setIcon(newIcon);
    }
  };

  return (
    <div>
      <Dialog className="welcomeDialog" open={open} onClose={handleClose}>
        <DialogTitle>ようこそ</DialogTitle>
        <DialogContent>
          <div className="text">ニックネーム</div>
          <TextField
            onChange={handleChangeName}
            autoFocus
            fullWidth
            variant="outlined"
          />
          <div className="text">アイコン</div>
          <div>
            <ToggleButtonGroup
              value={icon}
              onChange={handleChangeIcon}
              exclusive
              size="small"
            >
              {iconSources.map((src, index) => (
                <ToggleButton value={index}>
                  <Avatar src={src} />
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
    </div>
  );
}

function Arena() {
  const userName = "ユーティー太郎";
  const userRank = 24;
  const numberOfUsers = 125;

  return (
    <div className="arenaDiv">
      <Accordion sx={{ width: 600 }}>
        <AccordionSummary
          expandIcon={<ExpandMoreIcon />}
          aria-controls="panel1a-content"
          id="panel1a-header"
        >
          闘技場
        </AccordionSummary>
        <AccordionDetails>
          <Box
            sx={{
              display: "grid",
              gridTemplateColumns: "repeat(2, 1fr)",
              gridTemplateRows: "repeat(4, 1fr)",
              gap: 1,
            }}
          >
            <Card
              className="rank"
              sx={{ gridColumn: "1", gridRow: "1 / 5" }}
              variant="outlined"
            >
              <div className="name">{userName}</div>
              <IconContext.Provider value={{ size: "25%" }}>
                <div className="icon">
                  <FaFortAwesome />
                </div>
              </IconContext.Provider>
              <div className="userRank">{userRank}</div>
              <div className="numberOfUsers">{numberOfUsers}</div>
              <div className="line" />
            </Card>
            <Button sx={{ gridColumn: "2", gridRow: "1" }} variant="outlined">
              プログラムのアップロード
            </Button>
            <Button sx={{ gridColumn: "2", gridRow: "2" }} variant="outlined">
              ニックネームの変更…
            </Button>
          </Box>
        </AccordionDetails>
      </Accordion>
    </div>
  );
}

interface EnemyDialogProps {
  open: boolean;
  selectedValue: number[];
  onClose: (value: number[]) => void;
}

function EnemyDialog(props: EnemyDialogProps) {
  const { onClose, selectedValue, open } = props;
  const enemies = ["ユーティー一郎", "ユーティー二郎", "ユーティー三郎"];
  const [selectedEnemy, setSelectedEnemy] = useState("");
  const [selectedEnemies, setSelectedEnemies] = useState([
    "ユーティー一郎",
    "ユーティー二郎",
    "ユーティー三郎",
  ]);

  const handleClose = () => {
    onClose(selectedValue);
  };

  const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setSelectedEnemy(event.target.value);
  };

  return (
    <Dialog className="enemyDialog" onClose={handleClose} open={open}>
      <DialogTitle>対戦相手の選択</DialogTitle>
      <DialogContent>
        <DialogContentText>
          闘技場の対戦相手を3人まで呼び出して対戦できます。
        </DialogContentText>
        <Box
          className="enemyInput"
          sx={{
            display: "grid",
            gridTemplateColumns: "repeat(4, 1fr)",
            gap: 2,
          }}
        >
          <TextField
            select
            value={selectedEnemy}
            onChange={handleChange}
            variant="outlined"
            size="small"
            sx={{ gridColumn: "1/4" }}
          >
            {enemies.map((enemy) => (
              <MenuItem key={enemy} value={enemy}>
                {enemy}
              </MenuItem>
            ))}
          </TextField>
          <ThemeProvider theme={buttonTheme}>
            <Button variant="outlined" color="secondary">
              追加
            </Button>
          </ThemeProvider>
        </Box>
        <List>
          {selectedEnemies.map((enemy) => (
            <ListItem className="listItem" key={enemy} dense divider>
              {enemy}
              <IconButton>
                <DeleteIcon />
              </IconButton>
            </ListItem>
          ))}
        </List>
        <div className="buttons">
          <Button variant="text" onClick={handleClose}>
            キャンセル
          </Button>
          <Button variant="outlined" onClick={handleClose}>
            OK
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}

function TestPlay() {
  const playerHp = 20;
  const playerEnergy = 20;
  const speed = 2.5;
  const strength = 1.2;
  const weaponName = "クロスボウ";
  const enemies = [
    { name: "CPU1", hp: 50 },
    { name: "CPU2", hp: 50 },
    { name: "CPU3", hp: 50 },
  ];

  const [open, setOpen] = useState(false);
  const [selectedValue, setSelectedValue] = useState([0, 1, 2]);

  const handleClickOpen = () => {
    setOpen(true);
  };

  const handleClose = (value: number[]) => {
    setOpen(false);
    setSelectedValue(value);
  };

  return (
    <div className="testPlayDiv">
      <Accordion sx={{ width: 480 }}>
        <AccordionSummary expandIcon={<ExpandMoreIcon />}>
          実行
        </AccordionSummary>
        <AccordionDetails sx={{ height: 600 }}>
          <div className="emulator" />
          <div className="testPlayInterface">
            <div className="playerStatus">
              <div className="text">HP</div>
              <LinearProgress variant="determinate" value={playerHp} />
              <div className="text">元気</div>
              <LinearProgress variant="determinate" value={playerEnergy} />
            </div>
            <div className="itemEffect">
              <Chip
                icon={<DirectionsRunIcon />}
                label={`移動: x${speed}`}
                size="small"
                variant="outlined"
              />
              <IconContext.Provider value={{ size: "0.8em" }}>
                <Chip
                  icon={<GiCrossedSwords />}
                  label={`攻撃: x${strength}`}
                  size="small"
                  variant="outlined"
                />
                <div />
                <Chip
                  icon={<HiOutlineScale />}
                  label={`装備: ${weaponName}`}
                  size="small"
                  variant="outlined"
                />
              </IconContext.Provider>
            </div>
            <Box
              sx={{
                display: "grid",
                gridTemplateColumns: "repeat(3, 1fr)",
                gap: 2,
              }}
              className="enemyStatus"
            >
              {enemies.map((enemy) => (
                <div>
                  <div className="text">{enemy.name}</div>
                  <LinearProgress
                    variant="determinate"
                    value={enemy.hp}
                    color="error"
                  />
                </div>
              ))}
            </Box>
            <div className="selectEnemy">
              <Button variant="text" size="small" onClick={handleClickOpen}>
                対戦相手の選択...
              </Button>
            </div>
            <Box
              sx={{
                display: "grid",
                gridTemplateColumns: "repeat(3, 1fr)",
                gap: 2,
              }}
              className="controlButton"
            >
              <ThemeProvider theme={buttonTheme}>
                <Button variant="outlined" color="secondary">
                  <SlControlPlay /> &nbsp; 実行
                </Button>
                <Button variant="outlined" color="secondary">
                  <SlControlPause /> &nbsp; 一時停止
                </Button>
                <Button variant="outlined" color="secondary">
                  <SlReload /> &nbsp; リセット
                </Button>
              </ThemeProvider>
            </Box>
          </div>
        </AccordionDetails>
      </Accordion>
      <EnemyDialog
        selectedValue={selectedValue}
        open={open}
        onClose={handleClose}
      />
    </div>
  );
}

export default function App() {
  return (
    <>
      <div className="container">
        <ButtonAppBar />
        <div>
          <Injection />
        </div>
      </div>
      <Welcome />
      <Arena />
      <TestPlay />
    </>
  );
}
