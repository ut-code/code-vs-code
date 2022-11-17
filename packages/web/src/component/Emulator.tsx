import { useEffect, useRef } from "react";
import Game from "./game";
import type { Result } from "./game";

interface User {
  name: string;
  id: number;
  script: string;
  rank: number;
}

export interface Status {
  id: number;
  HP: number;
  stamina: number;
  speed: number;
  weapon: "ファイヤ" | "なし";
}

export default function Emulator(props: {
  users: User[];
  HasGameStarted: boolean;
  isPaused: boolean;
  executionId: number; // エミュレーターそのものを更新するためのId
  handleStatuses: (statuses: Status[]) => void;
}) {
  const { users, HasGameStarted, isPaused, executionId, handleStatuses } =
    props;
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const gameRef = useRef<Game>();
  useEffect(() => {
    if (!canvasRef.current) throw new Error();
    const game = new Game(users, canvasRef.current, (newStatuses: Status[]) => {
      handleStatuses(newStatuses);
    });
    gameRef.current = game;
    return () => {
      game.destroy();
    };
  }, [users, executionId, handleStatuses]);
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
      } else {
        gameRef.current.pause();
      }
    }
  }, [HasGameStarted, isPaused]);
  return (
    <canvas
      ref={canvasRef}
      style={{ border: "solid", maxWidth: "100%", height: "auto" }}
    />
  );
}
