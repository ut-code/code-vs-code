import { useEffect, useRef } from "react";
import * as PIXI from "pixi.js";

interface Result {
  firstId: number;
  secondId: number;
  thirdId: number;
  forthId: number;
}

interface User {
  username: string;
  id: number;
  script: string;
}

class Game {
  canvas: HTMLCanvasElement;

  users: User[];

  pixi: PIXI.Application;

  onCompleted?: () => void;

  constructor(users: User[], canvas: HTMLCanvasElement) {
    this.canvas = canvas;
    this.users = users;
    this.pixi = new PIXI.Application({
      view: this.canvas,
      backgroundColor: 0xffffff,
    });
    this.start();
    setTimeout(() => {
      this.end({ firstId: 1, secondId: 2, thirdId: 3, forthId: 4 });
      this.onCompleted?.();
    }, 3000);
  }

  start() {
    this.pixi.stage.addChild(new PIXI.Text("game is ongoing"));
  }

  end(result: Result) {
    this.pixi.stage.removeChildren();
    const text1 = new PIXI.Text(
      `1st ${this.users.find((user) => user.id === result.firstId)?.username}`
    );
    const text2 = new PIXI.Text(
      `2nd ${this.users.find((user) => user.id === result.secondId)?.username}`
    );
    const text3 = new PIXI.Text(
      `3rd ${this.users.find((user) => user.id === result.thirdId)?.username}`
    );
    const text4 = new PIXI.Text(
      `4th ${this.users.find((user) => user.id === result.forthId)?.username}`
    );
    text1.position.set(100, 100);
    text2.position.set(100, 200);
    text3.position.set(100, 300);
    text4.position.set(100, 400);
    this.pixi.stage.addChild(text1, text2, text3, text4);
  }

  destroy() {
    this.pixi.destroy();
  }
}

export default function EmulatorMock(props: { users: User[] }) {
  const ref = useRef<HTMLCanvasElement>(null);
  useEffect(() => {
    if (!ref.current) throw new Error();
    const { users } = props;
    const game = new Game(users, ref.current);
    return () => {
      game.destroy();
    };
  }, [props]);
  return <canvas ref={ref} style={{ border: "solid" }} />;
}
