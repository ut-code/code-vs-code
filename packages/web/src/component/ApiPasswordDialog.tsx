import {
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
  TextField,
} from "@mui/material";
import { useEffect, useState } from "react";
import { usePromise } from "react-use";
import { useApiPasswordContext } from "../common/api-password";
import { checkPassword } from "../fetchAPI";

export type ApiPasswordDialogProps = {
  onClose(): void;
};

export default function ApiPasswordDialog({ onClose }: ApiPasswordDialogProps) {
  const { setPassword } = useApiPasswordContext();
  const [inputPassword, setInputPassword] = useState("");
  const [isValid, setIsValid] = useState(false);
  const mounted = usePromise();

  useEffect(() => {
    setIsValid(false);
    if (!inputPassword) return undefined;
    const timerId = setTimeout(async () => {
      if (await mounted(checkPassword(inputPassword))) setIsValid(true);
    }, 1000);
    return () => {
      clearTimeout(timerId);
    };
  }, [inputPassword, mounted]);

  return (
    <Dialog open onClose={onClose} maxWidth="xs" fullWidth>
      <form
        onSubmit={() => {
          setPassword(inputPassword);
        }}
      >
        <DialogTitle>ロック解除</DialogTitle>
        <DialogContent>
          <DialogContentText>
            オンライン対戦やユーザー登録などの機能はオフライン参加の方に限定しています。会場のスタッフはパスワードを入力してロックを解除してください。
          </DialogContentText>
          <TextField
            sx={{ mt: 2 }}
            type="password"
            fullWidth
            value={inputPassword}
            onChange={(e) => {
              setInputPassword(e.target.value);
            }}
            autoFocus
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={onClose}>キャンセル</Button>
          <Button type="submit" variant="contained" disabled={!isValid}>
            解除
          </Button>
        </DialogActions>
      </form>
    </Dialog>
  );
}
