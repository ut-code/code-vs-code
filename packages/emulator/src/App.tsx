import { useRef, useEffect } from "react";
import Phaser from "phaser";

let player: Phaser.Types.Physics.Arcade.ImageWithDynamicBody;
let enemy: Phaser.Types.Physics.Arcade.ImageWithDynamicBody;
class GameScene extends Phaser.Scene {
  constructor() {
    super({ key: "GameScene" });
  }

  preload() {
    this.load.image("aircraft1", "/images/aircraft1.png");
    this.load.image("bullet", "/images/bullet.gif");
  }

  create() {
    player = this.physics.add.image(300, 400, "aircraft1");
    enemy = this.physics.add.image(500, 500, "aircraft1");
    player.setDisplaySize(40, 40);
    enemy.setDisplaySize(40, 40);
    player.angle += ((Math.atan2(enemy.y - player.y, enemy.x - player.x) * 180) / Math.PI)
    player.setCollideWorldBounds(true);
    enemy.setCollideWorldBounds(true);
    this.physics.add.collider(player, enemy);
  }

  update(): void {
    this.physics.accelerateToObject(player, enemy, 30);
    this.physics.accelerateTo(enemy, 200, 200, 30);
    player.angle =
      (Math.atan2(enemy.y - player.y, enemy.x - player.x) * 180) / Math.PI;
  }
}

function App() {
  const ref = useRef<HTMLDivElement>(null);

  const config: Phaser.Types.Core.GameConfig = {
    type: Phaser.AUTO,
    width: 800,
    height: 600,
    parent: ref.current || "game" || undefined,
    physics: {
      default: "arcade",
      arcade: { debug: false },
    },
    backgroundColor: "#CCFFFF",
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
