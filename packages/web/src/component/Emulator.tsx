/* eslint-disable max-classes-per-file */

import * as PIXI from "pixi.js";
import { useEffect, useRef } from "react";
import * as math from "mathjs";

interface vector2 {
  X: number;
  Y: number;
}

class entity {
  sprite: PIXI.Sprite;

  constructor(sprite: PIXI.Sprite) {
    this.sprite = sprite;
  }
}

class Fighter extends entity {
  HP = 100;

  velocity: vector2 = { X: 0, Y: 0 }; // 1 フレームの移動

  stamina = 100;

  weapon: weapon | null = null;

  reloadFrameLeft = 10;

  moveX(deltaX: number) {
    this.sprite.x += deltaX;
  }

  moveY(deltaY: number) {
    this.sprite.y += deltaY;
  }
}

interface weapon extends entity {
  firingRange: number;
  attackRange: number;
  speed: number;
  ReloadFrame: number;
  staminaRequired: number;
}

function moveTo(p: Fighter, q: vector2 | entity) {
  if ("X" in q) {
    const deltaX = q.X - p.sprite.x;
    const deltaY = q.Y - p.sprite.y;
    const unit: vector2 = {
      X: deltaX / Number(math.sqrt(deltaX ** 2 + deltaY ** 2)),
      Y: deltaY / Number(math.sqrt(deltaX ** 2 + deltaY ** 2)),
    };
    p.moveX(unit.X);
    p.moveY(unit.Y);
  }
}

export default function Emulator() {
  const ref = useRef<HTMLCanvasElement>(null);
  useEffect(() => {
    if (!ref.current) throw new Error();
    const players: Fighter[] = [];
    const app = new PIXI.Application({
      view: ref.current,
    });
    const texture = PIXI.Texture.from("image/aircraft1.png");
    for (let i = 0; i < 4; i += 1) {
      const player = PIXI.Sprite.from(texture);
      player.scale.set(0.2);
      player.anchor.set(0.5, 0.5);
      player.position.x = 100 * i + 100;
      app.stage.addChild(player);
      players.push(new Fighter(player));
    }
    const script = "moveTo(0,{ X: 200, Y: 300 })";
    const worker = new Worker(new URL("./worker.ts", import.meta.url));
    worker.postMessage(script);
    worker.onmessage = (e) => {
      const object = JSON.parse(e.data);
      if (object.type === "moveTo") {
        app.ticker.add(() => {
          const player = players[object.param1];
          if (player) {
            moveTo(player, object.param2);
          }
        });
      }
    };

    return () => {
      app.destroy();
      worker.terminate();
    };
  }, []);
  return <canvas ref={ref} />;
}
