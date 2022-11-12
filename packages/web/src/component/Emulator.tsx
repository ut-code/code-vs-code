import { useEffect, useRef } from "react";
import Game from "./game";
import type { Result } from "./game";

interface User {
  name: string;
  id: number;
  script: string;
  rank: number;
}
export default function Emulator(props: { users: User[] }) {
  const ref = useRef<HTMLCanvasElement>(null);
  const { users } = props;
  useEffect(() => {
    if (!ref.current) throw new Error();
    const game = new Game(users, ref.current);
    let userIds: number[] = [];
    // この一行テキトウ
    userIds.slice();
    game.onCompleted = (result: Result) => {
      userIds = result;
    };
    return () => {
      game.destroy();
    };
  }, [users]);
  return <canvas ref={ref} style={{ border: "solid" }} />;
}
