/* eslint-disable max-classes-per-file */
import * as PIXI from "pixi.js";
import * as math from "mathjs";

interface Vector2 {
  x: number;
  y: number;
}
class Entity {
  location: Vector2;

  width: number;

  height: number;

  constructor(location: Vector2, width: number, height: number) {
    this.location = location;
    this.width = width;
    this.height = height;
  }
}

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
    location: Vector2,
    width: number,
    height: number,
    type: "speedUp" | "attackUp",
    effect: number
  ) {
    super(location, width, height);
    this.type = type;
    this.effect = effect;
  }
}

class Fighter extends Entity {
  HP = 100;

  speed = 2; // 1 フレームの移動

  stamina = 100;

  weapon: Weapon | null = null;

  reloadFrameLeft = 10;

  direction: Vector2 = { x: 0, y: 1 };

  rotation = 0;

  rotate(radian: number) {
    this.rotation = this.direction.x <= 0 ? radian : radian + math.pi;
  }

  moveX(deltaX: number) {
    this.location.x += deltaX;
  }

  moveY(deltaY: number) {
    this.location.y += deltaY;
  }

  moveTo(
    destination: Vector2 | Entity | "closestEnemy" | "closestPortion",
    entities: Entities
  ) {
    const calculateDistance = (entity: Vector2) => {
      return Number(
        math.sqrt(
          (entity.x - this.location.x) ** 2 + (entity.y - this.location.y) ** 2
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
          const deltaX = destination.x - this.location.x;
          const deltaY = destination.y - this.location.y;
          this.direction = calculateUnit(deltaX, deltaY);
          this.moveX(this.direction.x * this.speed);
          this.moveY(this.direction.y * this.speed);
        } else {
          const deltaX = destination.location.x - this.location.x;
          const deltaY = destination.location.y - this.location.y;
          this.direction = calculateUnit(deltaX, deltaY);
          this.moveX(this.direction.x * this.speed);
          this.moveY(this.direction.y * this.speed);
        }
      } else if (destination === "closestEnemy") {
        const enemies = entities.players.filter((player) => player !== this);
        const closestEnemy = enemies.reduce((previousEnemy, currentEnemy) => {
          const previousDistance = calculateDistance(previousEnemy.location);
          const currentDistance = calculateDistance(currentEnemy.location);
          return previousDistance < currentDistance
            ? previousEnemy
            : currentEnemy;
        });
        const deltaX = closestEnemy.location.x - this.location.x;
        const deltaY = closestEnemy.location.y - this.location.y;
        this.direction = calculateUnit(deltaX, deltaY);
        this.moveX(this.direction.x * this.speed);
        this.moveY(this.direction.y * this.speed);
      } else if (entities.portions.length !== 0) {
        const closestPortion = entities.portions.reduce(
          (previousPortion, currentPortion) => {
            const previousDistance = calculateDistance(
              previousPortion.location
            );
            const currentDistance = calculateDistance(currentPortion.location);
            return previousDistance < currentDistance
              ? previousPortion
              : currentPortion;
          }
        );
        const deltaX = closestPortion.location.x - this.location.x;
        const deltaY = closestPortion.location.y - this.location.y;
        this.direction = calculateUnit(deltaX, deltaY);
        this.moveX(this.direction.x * this.speed);
        this.moveY(this.direction.y * this.speed);
      }
    };
    move();
  }

  runTo(
    destination: PIXI.IPointData | Entity | "closestEnemy" | "closestPortion",
    entities: Entities
  ) {
    const calculateDistance = (location: Vector2) => {
      return Number(
        math.sqrt(
          (location.x - this.location.x) ** 2 +
            (location.y - this.location.y) ** 2
        )
      );
    };
    const calculateUnit = (X: number, Y: number) => {
      return {
        x: X / Number(math.sqrt(X ** 2 + Y ** 2)),
        y: Y / Number(math.sqrt(X ** 2 + Y ** 2)),
      };
    };
    const run = () => {
      if (typeof destination !== "string") {
        if ("x" in destination) {
          const deltaX = destination.x - this.location.x;
          const deltaY = destination.y - this.location.y;
          this.direction = calculateUnit(deltaX, deltaY);
          this.moveX(this.direction.x * this.speed * 1.5);
          this.moveY(this.direction.y * this.speed * 1.5);
        } else {
          const deltaX = destination.location.x - this.location.x;
          const deltaY = destination.location.y - this.location.y;
          this.direction = calculateUnit(deltaX, deltaY);
          this.moveX(this.direction.x * this.speed * 1.5);
          this.moveY(this.direction.y * this.speed * 1.5);
        }
      } else if (destination === "closestEnemy") {
        const enemies = entities.players.filter((player) => player !== this);
        const closestEnemy = enemies.reduce((previousEnemy, currentEnemy) => {
          const previousDistance = calculateDistance(previousEnemy.location);
          const currentDistance = calculateDistance(currentEnemy.location);
          return previousDistance < currentDistance
            ? previousEnemy
            : currentEnemy;
        });
        const deltaX = closestEnemy.location.x - this.location.x;
        const deltaY = closestEnemy.location.y - this.location.y;
        this.direction = calculateUnit(deltaX, deltaY);
        this.moveX(this.direction.x * this.speed * 1.5);
        this.moveY(this.direction.y * this.speed * 1.5);
      } else if (entities.portions.length !== 0) {
        const closestPortion = entities.portions.reduce(
          (previousPortion, currentPortion) => {
            const previousDistance = calculateDistance(
              previousPortion.location
            );
            const currentDistance = calculateDistance(currentPortion.location);
            return previousDistance < currentDistance
              ? previousPortion
              : currentPortion;
          }
        );
        const deltaX = closestPortion.location.x - this.location.x;
        const deltaY = closestPortion.location.y - this.location.y;
        this.direction = calculateUnit(deltaX, deltaY);
        this.moveX(this.direction.x * this.speed * 1.5);
        this.moveY(this.direction.y * this.speed * 1.5);
      }
    };
    this.stamina -= 0.5;
    run();
  }

  addSpeed(x: number) {
    this.speed += x;
    if (this.speed > 8) {
      this.speed = 8;
    }
  }
}

class Map {
  app: PIXI.Application;

  players: Fighter[] = [];

  portions: Portion[] = [];

  weapons: Weapon[] = [];

  constructor(app: PIXI.Application) {
    this.app = app;
  }

  deployPlayers() {
    for (let i = 0; i < 4; i += 1) {
      const location = { x: 100 * i + 100, y: 100 * i + 100 };
      const player = new Fighter(location, 20, 20);
      this.players.push(player);
    }
  }

  deployPortions() {
    let startTime = Date.now();
    this.app.ticker.add(() => {
      if (Date.now() - startTime > 1000) {
        startTime = Date.now();
        const location = { x: math.random(0, 800), y: math.random(0, 600) };
        const portion = new Portion(location, 10, 10, "speedUp", 1);
        let overlap = true;
        while (overlap) {
          overlap = false;
          for (let i = 0; i < this.players.length; i += 1) {
            const player = this.players[i];
            if (!player) throw new Error("Cannot find a player");
            if (
              portion.location.x + portion.width > player.location.x &&
              portion.location.x < player.location.x + player.width &&
              portion.location.y + portion.height > player.location.y &&
              portion.location.y < player.location.y + player.height
            ) {
              portion.location.x = math.random(0, 800);
              portion.location.y = math.random(0, 600);
              overlap = true;
              break;
            }
          }
          if (overlap) break;
          for (let i = 0; i < this.portions.length; i += 1) {
            const OtherPortion = this.portions[i];
            if (!OtherPortion) throw new Error("Cannot find a portion");
            if (
              portion.location.x + portion.width > OtherPortion.location.x &&
              portion.location.x <
                OtherPortion.location.x + OtherPortion.width &&
              portion.location.y + portion.height > OtherPortion.location.y &&
              portion.location.y < OtherPortion.location.y + OtherPortion.width
            ) {
              portion.location.x = math.random(0, 800);
              portion.location.y = math.random(0, 600);
              overlap = true;
              break;
            }
          }
        }
        this.portions.push(portion);
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
    const detectCollisionWithPortions = () => {
      this.app.ticker.add(() => {
        this.players.forEach((fighter) => {
          this.portions.forEach((portion) => {
            if (
              fighter.location.x + fighter.width > portion.location.x &&
              fighter.location.x < portion.location.x + portion.width &&
              fighter.location.y + fighter.height > portion.location.y &&
              fighter.location.y < portion.location.y + portion.height
            ) {
              this.portions.splice(this.portions.indexOf(portion), 1);
              fighter.addSpeed(0.5);
              if (fighter.speed === 8) {
                clearTimeout(timerID);
              }
              timerID = setTimeout(() => {
                fighter.addSpeed(-0.5);
              }, 5000);
            }
          });
        });
      });
    };
    const detectCollisionWithStage = () => {
      this.app.ticker.add(() => {
        this.players.forEach((fighter) => {
          const rightRunover = fighter.location.x + fighter.width - 800;
          const leftRunover = -fighter.location.x;
          const topRunover = -fighter.location.y;
          const bottomRunover = fighter.location.y + fighter.height - 600;
          if (rightRunover > 0) {
            fighter.moveX(-rightRunover);
          }
          if (leftRunover > 0) {
            fighter.moveX(leftRunover);
          }
          if (topRunover > 0) {
            fighter.moveY(topRunover);
          }
          if (bottomRunover > 0) {
            fighter.moveY(bottomRunover);
          }
        });
      });
    };
    detectCollisionWithPortions();
    detectCollisionWithStage();
  }

  runWorkers() {
    // const script = "moveTo(0,{ x: 200, y: 300 })";
    // const script = "moveTo(0, 0)";
    // const script = "moveTo(0,'closestPortion')";
    // const script = "runTo(0,'closestPortion')";
    const script = `id = 0;
    players = ${JSON.stringify(this.players)};
    portions = ${JSON.stringify(this.portions)};
    weapons = ${JSON.stringify(this.weapons)};
    entities = ${JSON.stringify({
      players: this.players,
      portions: this.portions,
      weapons: this.weapons,
    })};
    enemies = players.filter((player) => player !== players[id]);
    for (let i = 0; i < enemies.length; i += 1) {
      if(enemies[i + 1]){
      const currentDistance = calculateDistance(enemies[i]);
      const nextDistance = calculateDistance(enemies[i + 1]);
      target = currentDistance < nextDistance ? currentDistance : nextDistance; 
     }; // if文の終わり
    }; // for文の終わり
    moveTo(target);
    
    `;
    const worker = new Worker(new URL("./worker.ts", import.meta.url), {
      type: "module",
    });
    worker.postMessage(script);
    worker.onmessage = (e) => {
      const data: Entities = JSON.parse(e.data);
      this.players = data.players;
      this.portions = data.portions;
      this.weapons = data.weapons;
    };
  }
}
export default class Game {
  app: PIXI.Application;

  map: Map;

  constructor(canvas: HTMLCanvasElement) {
    this.app = new PIXI.Application({
      view: canvas,
      backgroundColor: 0xffffff,
    });
    this.map = new Map(this.app);
    this.map.deployPlayers();
    this.map.deployPortions();
    this.map.detectCollision();
    this.map.rotatePlayers();
    this.map.runWorkers();
    this.displayImages();
  }

  displayImages() {
    const playerTexture = PIXI.Texture.from("image/aircraft1.png");
    const portionTexture = PIXI.Texture.from("image/kinoko.png");
    const displayPlayers = () => {
      this.map.players.forEach((player) => {
        const playerImage = PIXI.Sprite.from(playerTexture);
        if (!player) throw new Error();
        const { width, height, location } = player;
        playerImage.width = width;
        playerImage.height = height;
        playerImage.anchor.set(0.5, 0.5);
        playerImage.position.set(
          location.x + width / 2,
          location.y + height / 2
        );
        playerImage.rotation = player.rotation;
        this.app.stage.addChild(playerImage);
      });
    };
    const displayPortions = () => {
      this.map.portions.forEach((portion) => {
        const portionImage = PIXI.Sprite.from(portionTexture);
        if (!portion) return;
        const { width, height, location } = portion;
        portionImage.width = width;
        portionImage.height = height;
        portionImage.position.set(location.x, location.y);
        this.app.stage.addChild(portionImage);
      });
    };
    const removeImages = () => {
      this.app.stage.removeChildren();
    };
    this.app.ticker.add(() => {
      removeImages();
      displayPlayers();
      displayPortions();
    });
  }

  destroy() {
    this.app.destroy();
  }
}

export type { Vector2 };
export { Entity, Fighter, Portion, Weapon, Entities };
