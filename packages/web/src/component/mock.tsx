import { useEffect, useRef } from "react";
import * as PIXI from "pixi.js";

interface Result {
  first: string;
  second: string;
  third: string;
  forth: string;
}

class Game {
  canvas: HTMLCanvasElement;

  scripts: string[];

  pixi: PIXI.Application;

  onCompleted?: () => void;

  constructor(scripts: string[], canvas: HTMLCanvasElement) {
    this.canvas = canvas;
    this.scripts = scripts;
    this.pixi = new PIXI.Application({
      view: this.canvas,
      backgroundColor: 0xffffff,
    });
  }

  start() {
    this.pixi.stage.addChild(new PIXI.Text("game is ongoing"));
  }

  end(result: Result) {
    this.pixi.stage.removeChildren();
    const text1 = new PIXI.Text(`1st ${result.first}`);
    const text2 = new PIXI.Text(`2nd ${result.second}`);
    const text3 = new PIXI.Text(`3rd ${result.third}`);
    const text4 = new PIXI.Text(`4th ${result.forth}`);
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

export default function EmulatorMock(props: { scripts: string[] }) {
  const ref = useRef<HTMLCanvasElement>(null);
  useEffect(() => {
    if (!ref.current) throw new Error();
    const { scripts } = props;
    const game = new Game(scripts, ref.current);
    game.start();
    setTimeout(() => {
      game.end({ first: "a", second: "b", third: "c", forth: "d" });
    }, 3000);
    return () => {
      game.destroy();
    };
  }, [props]);
  return <canvas ref={ref} style={{ border: "solid" }} />;
}
