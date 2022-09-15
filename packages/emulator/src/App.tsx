import { useRef, useEffect } from "react";
import Phaser from "phaser";

class GameScene extends Phaser.Scene {
  constructor() {
    super({ key: "GameScene" });
  }

  preload() {
    this.load.setBaseURL("http://labs.phaser.io");
    this.load.image("sky", "assets/skies/space3.png");
  }

  create() {
    this.add.image(400, 300, "sky");
  }
}

function App() {
  const ref = useRef<HTMLDivElement>(null);

  const config: Phaser.Types.Core.GameConfig = {
    type: Phaser.AUTO,
    width: 800,
    height: 600,
    parent: ref.current || "game" || undefined,
    scene: [GameScene],
  };
  useEffect(() => {
    const game = new Phaser.Game(config);
    console.log(game.isRunning);
    return () => {
      game.destroy(true);
    };
  });

  return <div ref={ref} id="game" />;
}

export default App;
