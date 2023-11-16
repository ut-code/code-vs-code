import { useEffect, useRef } from "react";
import type { Result } from "./game/game";
import TutorialGame from "./tutorial/tutorialGames";
import Game from "./game/game";

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

type EmulatorProps = {
  width: number;
  height: number;
  users: User[];
  hasGameStarted: boolean;
  isPaused: boolean;
  executionId: number; // エミュレーターそのものを更新するためのId
  handleStatuses: (statuses: Status[]) => void;
  onGameCompleted?: (result: Result) => void;
  gameModeId: number;
};

export default function Emulator(props: EmulatorProps) {
  const {
    width,
    height,
    users,
    hasGameStarted,
    isPaused,
    executionId,
    handleStatuses,
    onGameCompleted,
    gameModeId,
  } = props;
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const gameRef = useRef<any>();
  useEffect(() => {
    if (!canvasRef.current) throw new Error();
    let GameClass;
    switch (gameModeId) {
      case 0:
        GameClass = Game;
        break;
      case 1:
        GameClass = TutorialGame;
        break;
      default:
        GameClass = Game;
    }
    const game = new GameClass(
      users,
      canvasRef.current,
      (newStatuses: Status[]) => {
        handleStatuses(newStatuses);
      }
    );
    gameRef.current = game;
    return () => {
      game.destroy();
    };
  }, [users, executionId, handleStatuses, gameModeId]);
  useEffect(() => {
    if (!gameRef.current) throw new Error();
    gameRef.current.onCompleted = (result: Result) => {
      onGameCompleted?.(result);
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

Emulator.defaultProps = {
  onGameCompleted: (result: Result) => {
    result.keys();
  },
};
