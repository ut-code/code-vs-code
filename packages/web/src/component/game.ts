/* eslint-disable max-classes-per-file */
import * as PIXI from "pixi.js";
import * as math from "mathjs";

class Entity {
  sprite: PIXI.Sprite;

  constructor(sprite: PIXI.Sprite) {
    this.sprite = sprite;
  }
}

export type { Entity };
interface Weapon extends Entity {
  firingRange: number;
  attackRange: number;
  speed: number;
  ReloadFrame: number;
  staminaRequired: number;
}

interface Entities {
  players: Fighter[];
  portions: Portion[];
  weapons: Weapon[];
}

class Portion extends Entity {
  type: "speedUp" | "attackUp";

  effect: number;

  constructor(
    sprite: PIXI.Sprite,
    type: "speedUp" | "attackUp",
    effect: number
  ) {
    super(sprite);
    this.type = type;
    this.effect = effect;
  }
}

class Fighter extends Entity {
  HP = 100;

  speed = 2; // 1 フレームの移動

  speedUpCount = 0;

  stamina = 100;

  weapon: Weapon | null = null;

  reloadFrameLeft = 10;

  direction: PIXI.IPointData = { x: 0, y: 1 };

  rotate(radian: number) {
    this.sprite.rotation = this.direction.x <= 0 ? radian : radian + math.pi;
  }

  moveX(deltaX: number) {
    this.sprite.x += deltaX;
  }

  moveY(deltaY: number) {
    this.sprite.y += deltaY;
  }

  moveTo(
    destination: PIXI.IPointData | Entity | "closestEnemy" | "closestPortion",
    entities: Entities
  ) {
    const calculateDistance = (sprite: PIXI.Sprite) => {
      return Number(
        math.sqrt(
          (sprite.x - this.sprite.x) ** 2 + (sprite.y - this.sprite.y) ** 2
        )
      );
    };
    const calculateUnit = (X: number, Y: number) => {
      return {
        x: X / Number(math.sqrt(X ** 2 + Y ** 2)),
        y: Y / Number(math.sqrt(X ** 2 + Y ** 2)),
      };
    };
    const move = () => {
      if (typeof destination !== "string") {
        if ("x" in destination) {
          const deltaX = destination.x - this.sprite.x;
          const deltaY = destination.y - this.sprite.y;
          this.direction = calculateUnit(deltaX, deltaY);
          this.moveX(this.direction.x * this.speed);
          this.moveY(this.direction.y * this.speed);
        } else {
          const deltaX = destination.sprite.x - this.sprite.x;
          const deltaY = destination.sprite.y - this.sprite.y;
          this.direction = calculateUnit(deltaX, deltaY);
          this.moveX(this.direction.x * this.speed);
          this.moveY(this.direction.y * this.speed);
        }
      } else if (destination === "closestEnemy") {
        const enemies = entities.players.filter(
          (player) => player.sprite !== this.sprite
        );
        const closestEnemy = enemies.reduce((previousEnemy, currentEnemy) => {
          const previousDistance = calculateDistance(previousEnemy.sprite);
          const currentDistance = calculateDistance(currentEnemy.sprite);
          return previousDistance < currentDistance
            ? previousEnemy
            : currentEnemy;
        });
        const deltaX = closestEnemy.sprite.x - this.sprite.x;
        const deltaY = closestEnemy.sprite.y - this.sprite.y;
        this.direction = calculateUnit(deltaX, deltaY);
        this.moveX(this.direction.x * this.speed);
        this.moveY(this.direction.y * this.speed);
      } else if (entities.portions.length !== 0) {
        const closestPortion = entities.portions.reduce(
          (previousPortion, currentPortion) => {
            const previousDistance = calculateDistance(previousPortion.sprite);
            const currentDistance = calculateDistance(currentPortion.sprite);
            return previousDistance < currentDistance
              ? previousPortion
              : currentPortion;
          }
        );
        const deltaX = closestPortion.sprite.x - this.sprite.x;
        const deltaY = closestPortion.sprite.y - this.sprite.y;
        this.direction = calculateUnit(deltaX, deltaY);
        this.moveX(this.direction.x * this.speed);
        this.moveY(this.direction.y * this.speed);
      }
    };
    move();
  }

  changeSpeed(x: number) {
    this.speed += x;
    if (this.speed > 8) {
      this.speed = 8;
    }
  }

  setSpeedUpCount(x: number) {
    this.speedUpCount = x;
  }
}

export default class Game {
  app: PIXI.Application;

  players: Fighter[] = [];

  portions: Portion[] = [];

  weapons: Weapon[] = [];

  constructor(canvas: HTMLCanvasElement) {
    this.app = new PIXI.Application({ view: canvas });
    this.displayPlayers();
    this.displayItems();
    this.rotatePlayers();
    this.detectCollision();
    this.runWorkers();
  }

  displayPlayers() {
    const playerTexture = PIXI.Texture.from("image/aircraft1.png");
    for (let i = 0; i < 4; i += 1) {
      const player = PIXI.Sprite.from(playerTexture);
      player.scale.set(0.2);
      player.anchor.set(0.5, 0.5);
      player.position.x = 100 * i + 100;
      this.app.stage.addChild(player);
      this.players.push(new Fighter(player));
    }
  }

  displayItems() {
    const itemTexture = PIXI.Texture.from("image/kinoko.png");
    let startTime = Date.now();
    this.app.ticker.add(() => {
      if (Date.now() - startTime > 1000) {
        startTime = Date.now();
        const item = PIXI.Sprite.from(itemTexture);
        item.anchor.set(0.5, 0.5);
        item.scale.set(0.05);
        let overlap = true;
        item.position.x = math.random(0, 800);
        item.position.y = math.random(0, 600);
        while (overlap) {
          overlap = false;
          const box1 = item.getBounds();
          for (let i = 0; i < this.players.length; i += 1) {
            const box2 = this.players[i]?.sprite.getBounds();
            if (!box2) throw new Error("Cannot find a player");
            if (
              box1.x + box1.width > box2.x &&
              box1.x < box2.x + box2.width &&
              box1.y + box1.height > box2.y &&
              box1.y < box2.y + box2.width
            ) {
              item.position.x = math.random(0, 800);
              item.position.y = math.random(0, 600);
              overlap = true;
              break;
            }
          }
          if (overlap) break;
          for (let i = 0; i < this.portions.length; i += 1) {
            const box3 = this.portions[i]?.sprite.getBounds();
            if (!box3) throw new Error("Cannot find a portion");
            if (
              box1.x + box1.width > box3.x &&
              box1.x < box3.x + box3.width &&
              box1.y + box1.height > box3.y &&
              box1.y < box3.y + box3.width
            ) {
              item.position.x = math.random(0, 800);
              item.position.y = math.random(0, 600);
              overlap = true;
              break;
            }
          }
        }
        this.app.stage.addChild(item);
        this.portions.push(new Portion(item, "speedUp", 0.5));
      }
    });
  }

  rotatePlayers() {
    this.app.ticker.add(() => {
      this.players.forEach((fighter) => {
        fighter.rotate(
          math.atan(fighter.direction.y / fighter.direction.x) - math.pi / 2
        );
      });
    });
  }

  detectCollision() {
    let timerID: NodeJS.Timeout;
    this.app.ticker.add(() => {
      this.players.forEach((fighter) => {
        const box1 = fighter.sprite.getBounds();
        this.portions.forEach((portion) => {
          const box2 = portion.sprite.getBounds();
          if (
            box1.x + box1.width > box2.x &&
            box1.x < box2.x + box2.width &&
            box1.y + box1.height > box2.y &&
            box1.y < box2.y + box2.width
          ) {
            this.portions.splice(this.portions.indexOf(portion), 1);
            this.app.stage.removeChild(portion.sprite);
            fighter.changeSpeed(0.5);
            if (fighter.speed === 8) {
              clearTimeout(timerID);
            }
            timerID = setTimeout(() => {
              fighter.changeSpeed(-0.5);
            }, 5000);
          }
        });
      });
    });
  }

  runWorkers() {
    // const script = "moveTo(0,{ x: 200, y: 300 })";
    // const script = "moveTo(0, 0)";
    const script = "moveTo(0,'closestPortion')";
    const worker = new Worker(new URL("./worker.ts", import.meta.url));
    worker.postMessage(script);
    worker.onmessage = (e) => {
      const object = JSON.parse(e.data);
      if (object.type === "moveTo") {
        const moveToFunction = () => {
          const player = this.players[object.param1];
          const entities = {
            players: this.players,
            portions: this.portions,
            weapons: this.weapons,
          };
          if (!player) throw Error(`Cannot find player ${object.param1 + 1}`);
          player.moveTo(object.param2, entities);
        };
        this.app.ticker.add(moveToFunction);
      }
    };
  }

  destroy() {
    this.app.destroy();
  }
}
