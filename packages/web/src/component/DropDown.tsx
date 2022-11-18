import * as React from "react";
import Button from "@mui/material/Button";
import Box from "@mui/material/Box";
import InputLabel from "@mui/material/InputLabel";
import MenuItem from "@mui/material/MenuItem";
import FormControl from "@mui/material/FormControl";
import Select, { SelectChangeEvent } from "@mui/material/Select";
import Typography from "@mui/material/Typography";
import type { User } from "./Emulator";

export default function DropDown(props: {
  users: User[];
  handleClose: (user: User) => void;
}) {
  const { users, handleClose: handleUser } = props;

  const [name, setName] = React.useState("");

  const handleChange = (event: SelectChangeEvent) => {
    setName(event.target.value as string);
  };

  return (
    <>
      <Typography color="text.secondary" sx={{ my: 1, marginLeft: 10 }}>
        もしくは
      </Typography>
      <Box sx={{ display: "flex", marginLeft: 10, marginBottom: 10 }}>
        <Box sx={{ width: 100 }}>
          <FormControl fullWidth>
            <InputLabel id="demo-simple-select-label">名前</InputLabel>
            <Select
              labelId="demo-simple-select-label"
              id="demo-simple-select"
              value={name}
              label="User"
              onChange={handleChange}
            >
              {users.map((user) => (
                <MenuItem value={user.name} key={user.id}>
                  {user.name}
                </MenuItem>
              ))}
            </Select>
          </FormControl>
        </Box>
        <Button
          onClick={() => {
            const user = users.find((eachUser) => eachUser.name === name);
            if (!user) throw Error();
            handleUser(user);
          }}
          variant="outlined"
        >
          でログイン
        </Button>
      </Box>
    </>
  );
}
