import { useEffect, useRef } from "react";
import Game from "./game";

export default function Emulator() {
  const ref = useRef<HTMLCanvasElement>(null);
  useEffect(() => {
    if (!ref.current) throw new Error();
    const game = new Game(ref.current);
    return () => {
      game.destroy();
    };
  }, []);
  return <canvas ref={ref} />;
}
