import { useEffect, useRef } from "react";
import Game from "./game";
import type { Result } from "./game";

export interface User {
  name: string;
  id: number;
  program: string;
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
  width: number;
  height: number;
  users: User[];
  hasGameStarted: boolean;
  isPaused: boolean;
  executionId: number; // エミュレーターそのものを更新するためのId
  handleStatuses: (statuses: Status[]) => void;
  onGameCompleted: (result: Result) => void;
}) {
  const {
    width,
    height,
    users,
    hasGameStarted,
    isPaused,
    executionId,
    handleStatuses,
    onGameCompleted,
  } = props;
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
    if (!gameRef.current) throw new Error();
    gameRef.current.onCompleted = (result: Result) => {
      onGameCompleted(result);
    };
    if (hasGameStarted) {
      if (!isPaused) {
        gameRef.current.resume();
      } else {
        gameRef.current.pause();
      }
    }
  }, [hasGameStarted, isPaused, onGameCompleted]);
  return (
    <canvas
      ref={canvasRef}
      style={{ border: "solid", width: `${width}px`, height: `${height}px` }}
    />
  );
}
