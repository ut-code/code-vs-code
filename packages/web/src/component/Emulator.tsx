import { useEffect, useRef } from "react";
import Game from "./game";
import type { Result } from "./game";

interface User {
  name: string;
  id: number;
  script: string;
}
export default function Emulator(props: {
  users: User[];
  HasGameStarted: boolean;
  isPaused: boolean;
  resetId: number;
}) {
  const { users, HasGameStarted, isPaused, resetId } = props;
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const gameRef = useRef<Game>();
  useEffect(() => {
    if (!canvasRef.current) throw new Error();
    const game = new Game(users, canvasRef.current);
    gameRef.current = game;
    return () => {
      game.destroy();
    };
  }, [users, resetId]);
  useEffect(() => {
    let userIds: number[] = [];
    // この一行テキトウ
    userIds.slice();
    if (!gameRef.current) throw new Error();
    gameRef.current.onCompleted = (result: Result) => {
      userIds = result;
    };
    if (HasGameStarted) {
      if (!isPaused) {
        gameRef.current.resume();
        gameRef.current.start();
      } else {
        gameRef.current.pause();
      }
    }
  }, [HasGameStarted, isPaused]);
  return (
    <canvas
      ref={canvasRef}
      style={{ border: "solid", width: "600px", height: "450px" }}
    />
  );
}
