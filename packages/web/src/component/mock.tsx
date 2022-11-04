/* eslint-disable */
import { useEffect, useRef } from "react";

interface Result {
  first: string;
  second: string;
  third: string;
  forth: string;
}

class Game {
  scripts: string[];

  onCompleted?: (result: Result) => void;

  canvas: HTMLCanvasElement;

  constructor(scripts: string[], canvas: HTMLCanvasElement) {
    this.scripts = scripts;
    this.canvas = canvas;
  }

  destroy() {
    this.onCompleted?.({ first: "a", second: "b", third: "c", forth: "d" });
  }
}

export default function Emulator(props: { scripts: string[] }) {
  const ref = useRef<HTMLCanvasElement>(null);
  useEffect(() => {
    if (!ref.current) throw new Error();
    const game = new Game(props.scripts, ref.current);
    game.onCompleted = (Result) => Result;
    return () => {
      game.destroy();
    };
  }, []);
  return <canvas ref={ref} style={{ border: "solid" }} />;
}
