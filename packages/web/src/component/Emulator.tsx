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
  HP: number;
  stamina: number;
  speed: number;
  weapon: "ファイヤ" | "なし";
}

export interface HPWithId {
  id: number;
  HP: number;
}

export default function Emulator(props: {
  users: User[];
  currentUserId: number;
  enemyUserIds: number[];
  HasGameStarted: boolean;
  isPaused: boolean;
  executionId: number; // エミュレーターそのものを更新するためのId
  handleCurrentUserStatus: (status: Status) => void;
  handleEnemyHPs: (HPs: HPWithId[]) => void;
}) {
  const {
    users,
    currentUserId,
    enemyUserIds,
    HasGameStarted,
    isPaused,
    executionId,
    handleCurrentUserStatus,
    handleEnemyHPs,
  } = props;
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const gameRef = useRef<Game>();
  const { HP, stamina, speed, weapon } = gameRef.current?.getFighterStatus(
    currentUserId
  ) || { HP: 100, stamina: 100, speed: 2, weapon: "なし" };
  const enemyHPs = enemyUserIds.map((enemyUserId) => {
    return {
      id: enemyUserId,
      HP: gameRef.current?.getFighterStatus(enemyUserId).HP || 0,
    };
  });
  useEffect(() => {
    if (!canvasRef.current) throw new Error();
    const game = new Game(users, canvasRef.current);
    gameRef.current = game;
    return () => {
      game.destroy();
    };
  }, [users, executionId, currentUserId]);
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
  useEffect(() => {
    handleCurrentUserStatus({
      HP,
      stamina,
      speed,
      weapon,
    });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [HP, stamina, speed, weapon]);
  useEffect(() => {
    handleEnemyHPs(enemyHPs);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [enemyHPs]);
  return (
    <canvas
      ref={canvasRef}
      style={{ border: "solid", maxWidth: "100%", height: "auto" }}
    />
  );
}
