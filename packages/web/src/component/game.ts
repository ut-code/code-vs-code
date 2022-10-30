/* eslint-disable no-restricted-syntax */
/* eslint-disable max-classes-per-file */
import * as PIXI from "pixi.js";
import * as math from "mathjs";
import aircraftImage from "../aircraft1.png";
import kinoko from "../kinoko.png";

interface Vector2 {
  x: number;
  y: number;
}
interface Entity {
  location: Vector2;

  readonly size: Vector2;
}

interface Weapon extends Entity {
  firingRange: number;
  attackRange: number;
  speed: number;
  ReloadFrame: number;
  staminaRequired: number;
}

//  ドメインオブジェクト

class Fighter implements Entity {
  location: Vector2;

  readonly size: Vector2 = { x: 20, y: 20 };

  HP = 100;

  speed = 2; // 1 フレームの移動

  stamina = 100;

  weapon: Weapon | null = null;

  reloadFrameLeft = 10;

  direction: Vector2 = { x: 0, y: 1 };

  action: FighterAction | null = null;

  constructor(location: Vector2) {
    this.location = location;
  }
}

class Portion implements Entity {
  location: Vector2;

  readonly size: Vector2;

  type: "speedUp" | "attackUp";

  effect: number;

  constructor(
    location: Vector2,
    size: Vector2,
    type: "speedUp" | "attackUp",
    effect: number
  ) {
    this.size = size;
    this.location = location;
    this.type = type;
    this.effect = effect;
  }
}
class World {
  fighters: Fighter[] = [];

  portions: Portion[] = [];

  weapons: Weapon[] = [];

  AddedPortion: Portion | null = null;

  deletedPortion: Portion | null = null;

  constructor() {
    for (let i = 0; i < 4; i += 1) {
      const location = { x: 100 * i + 100, y: 100 * i + 100 };
      const fighter = new Fighter(location);
      this.fighters.push(fighter);
    }
  }

  createPortion() {
    const location = { x: math.random(0, 800), y: math.random(0, 600) };
    const portion = new Portion(location, { x: 20, y: 20 }, "speedUp", 1);
    let overlap = true;
    while (overlap) {
      overlap = false;
      for (let i = 0; i < this.fighters.length; i += 1) {
        const player = this.fighters[i];
        if (!player) throw new Error("Cannot find a player");
        if (
          portion.location.x + portion.size.x > player.location.x &&
          portion.location.x < player.location.x + player.size.x &&
          portion.location.y + portion.size.y > player.location.y &&
          portion.location.y < player.location.y + player.size.y
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
          portion.location.x + portion.size.x > OtherPortion.location.x &&
          portion.location.x < OtherPortion.location.x + OtherPortion.size.x &&
          portion.location.y + portion.size.y > OtherPortion.location.y &&
          portion.location.y < OtherPortion.location.y + OtherPortion.size.y
        ) {
          portion.location.x = math.random(0, 800);
          portion.location.y = math.random(0, 600);
          overlap = true;
          break;
        }
      }
    }
    this.portions.push(portion);
    this.AddedPortion = portion;
  }

  detectCollision() {
    const detectCollisionWithPortions = () => {
      for (const fighter of this.fighters) {
        this.portions.forEach((portion) => {
          if (
            fighter.location.x + fighter.size.x > portion.location.x &&
            fighter.location.x < portion.location.x + portion.size.x &&
            fighter.location.y + fighter.size.y > portion.location.y &&
            fighter.location.y < portion.location.y + portion.size.y
          ) {
            this.portions.splice(this.portions.indexOf(portion), 1);
            this.deletedPortion = portion;
            fighter.speed += 0.5;
            setTimeout(() => {
              fighter.speed -= 0.5;
            }, 5000);
          }
        });
      }
    };
    const detectCollisionWithWalls = () => {
      for (const fighter of this.fighters) {
        fighter.location = {
          x: math.min(fighter.location.x, 800 - fighter.size.x),
          y: math.min(fighter.location.y, 600 - fighter.size.y),
        };
      }
    };
    detectCollisionWithPortions();
    detectCollisionWithWalls();
  }
}

// アクション

interface FighterAction {
  tick(delay: number): void;
}

class WalkToAction implements FighterAction {
  world: World;

  fighter: Fighter;

  destination: Vector2;

  constructor(world: World, fighter: Fighter, destination: Vector2) {
    this.world = world;
    this.fighter = fighter;
    this.destination = destination;
  }

  tick() {
    const calculateUnit = (X: number, Y: number) => {
      return {
        x: X / Number(math.sqrt(X ** 2 + Y ** 2)),
        y: Y / Number(math.sqrt(X ** 2 + Y ** 2)),
      };
    };
    const walk = () => {
      const deltaX = this.destination.x - this.fighter.location.x;
      const deltaY = this.destination.y - this.fighter.location.y;
      this.fighter.direction = calculateUnit(deltaX, deltaY);
      this.fighter.location.x += this.fighter.direction.x * this.fighter.speed;
      this.fighter.location.y += this.fighter.direction.y * this.fighter.speed;
    };
    if (this.destination) walk();
  }
}

// レンダラー

interface Renderer {
  render(): void;
}

class FighterRenderer implements Renderer {
  fighter: Fighter;

  pixi: PIXI.Application;

  sprite: PIXI.Sprite;

  constructor(fighter: Fighter, pixi: PIXI.Application) {
    this.fighter = fighter;
    this.pixi = pixi;
    this.sprite = PIXI.Sprite.from(aircraftImage);
    this.sprite.width = this.fighter.size.x;
    this.sprite.height = this.fighter.size.y;
    this.sprite.x = this.fighter.location.x + this.fighter.size.x / 2;
    this.sprite.y = this.fighter.location.y + this.fighter.size.y / 2;
    this.sprite.anchor.set(0.5);
    pixi.stage.addChild(this.sprite);
  }

  render(): void {
    this.sprite.x = this.fighter.location.x;
    this.sprite.y = this.fighter.location.y;
    const radian =
      math.atan(this.fighter.direction.y / this.fighter.direction.x) -
      math.pi / 2;
    this.sprite.rotation =
      this.fighter.direction.x <= 0 ? radian : radian + math.pi;
  }
}

class PortionRenderer implements Renderer {
  portion: Portion;

  pixi: PIXI.Application;

  sprite: PIXI.Sprite = PIXI.Sprite.from(kinoko);

  constructor(portion: Portion, pixi: PIXI.Application) {
    this.portion = portion;
    this.pixi = pixi;
    if (this.portion.type === "speedUp") {
      this.sprite = PIXI.Sprite.from(kinoko);
    }
    this.sprite.x = this.portion.location.x;
    this.sprite.y = this.portion.location.y;
    this.sprite.width = this.portion.size.x;
    this.sprite.height = this.portion.size.y;
    this.pixi.stage.addChild(this.sprite);
  }

  render(): void {
    this.sprite.x = this.portion.location.x;
    this.sprite.y = this.portion.location.y;
  }
}
class WorldRenderer implements Renderer {
  world: World;

  pixi: PIXI.Application;

  fighterRenderers: FighterRenderer[];

  portionRenderers: PortionRenderer[];

  constructor(world: World, canvas: HTMLCanvasElement) {
    this.world = world;
    this.pixi = new PIXI.Application({
      view: canvas,
      width: 800,
      height: 600,
      backgroundColor: 0xffffff,
    });
    this.fighterRenderers = this.world.fighters.map(
      (fighter) => new FighterRenderer(fighter, this.pixi)
    );
    this.portionRenderers = this.world.portions.map(
      (portion) => new PortionRenderer(portion, this.pixi)
    );
  }

  run() {
    this.pixi.ticker.add(() => {
      this.render();
    });
  }

  render() {
    this.addPortionSprite();
    this.deletePortionSprite();
    for (const fighterRenderer of this.fighterRenderers) {
      fighterRenderer.render();
    }
    for (const portionRenderer of this.portionRenderers) {
      portionRenderer.render();
    }
  }

  addPortionSprite() {
    if (this.world.AddedPortion) {
      const newRenderer = new PortionRenderer(
        this.world.AddedPortion,
        this.pixi
      );
      this.portionRenderers.push(newRenderer);
      this.world.AddedPortion = null;
    }
  }

  deletePortionSprite() {
    if (this.world.deletedPortion) {
      const oldRenderer = this.portionRenderers.find(
        (portionRenderer) =>
          portionRenderer.portion === this.world.deletedPortion
      );
      if (oldRenderer) {
        this.pixi.stage.removeChild(oldRenderer?.sprite);
        const newPortionRenderers = this.portionRenderers.filter(
          (portionRenderer) => portionRenderer !== oldRenderer
        );
        this.portionRenderers = newPortionRenderers;
      }
      this.world.deletedPortion = null;
    }
  }
}

// 全体を管理するやつ

export default class GameManager {
  world: World;

  worldRenderer: WorldRenderer;

  isDestroyed = false;

  workers: Worker[] = [];

  constructor(canvas: HTMLCanvasElement) {
    this.world = new World();
    this.worldRenderer = new WorldRenderer(this.world, canvas);
    this.run();
  }

  run() {
    this.buildWorkers();
    this.worldRenderer.run();
    let previousTime = Date.now();
    let previousTime2 = Date.now();
    const callback = () => {
      if (this.isDestroyed) return;
      const currentTime = Date.now();
      const delta = currentTime - previousTime;
      previousTime = currentTime;
      this.world.fighters.forEach((fighter) => {
        fighter.action?.tick(delta);
      });
      this.world.detectCollision();
      if (currentTime - previousTime2 >= 500) {
        previousTime2 = Date.now();
        this.world.createPortion();
        this.sendScriptsToWorkers();
      }
      requestAnimationFrame(callback);
    };
    callback();
  }

  buildWorkers() {
    for (let i = 0; i < 4; i += 1) {
      const worker = new Worker(new URL("./worker.ts", import.meta.url), {
        type: "module",
      });
      worker.onmessage = (e) => {
        const data = JSON.parse(e.data);
        const player = this.world.fighters[i];
        if (player === undefined) throw new Error();
        player.action = null;
        if (data.type === "walkTo") {
          player.action = new WalkToAction(this.world, player, data.target);
        }
      };
      this.workers.push(worker);
    }
  }

  sendScriptsToWorkers() {
    // const script = "walkTo(0,{ x: 200, y: 300 })";
    // const script = "walkTo(0, 0)";
    // const script = "walkTo(0,'closestPortion')";
    // const script = "runTo(0,'closestPortion')";
    const player = this.world.fighters[0];
    const enemies = this.world.fighters.filter(
      (fighter) => fighter !== this.world.fighters[0]
    );
    const { portions } = this.world;
    if (!player) throw new Error();
    const script = `const player = ${JSON.stringify({
      location: player.location,
      HP: player.HP,
      speed: player.speed,
      stamina: player.stamina,
      weapon: {
        firingRange: player.weapon?.firingRange,
        attackRange: player.weapon?.attackRange,
        speed: player.weapon?.speed,
        ReloadFrame: player.weapon?.ReloadFrame,
        staminaRequired: player.weapon?.staminaRequired,
      },
    })}
        const enemies = ${JSON.stringify(
          enemies.map((enemy) => {
            return {
              location: enemy.location,
              HP: enemy.HP,
              speed: enemy.speed,
              stamina: enemy.stamina,
              weapon: {
                firingRange: enemy.weapon?.firingRange,
                attackRange: enemy.weapon?.attackRange,
                speed: enemy.weapon?.speed,
                ReloadFrame: enemy.weapon?.ReloadFrame,
                staminaRequired: enemy.weapon?.staminaRequired,
              },
            };
          })
        )}
        const portions = ${JSON.stringify(
          portions.map((portion) => {
            return {
              location: portion.location,
              type: portion.type,
              effect: portion.effect,
            };
          })
        )}
        const weapons = ${JSON.stringify(this.world.weapons)}
        let target = null
        let closestPortion = portions[0]
        for ( const portion of portions ) {
          const previousDistance = calculateDistance( player, closestPortion );
          const currentDistance = calculateDistance( player, portion );
          if(previousDistance > currentDistance){closestPortion = portion}   
        }
        target = closestPortion
        walkTo(target);`;
    this.workers[0]?.postMessage(script);
  }

  destroy() {
    this.worldRenderer.pixi.destroy();
    this.workers.forEach((worker) => {
      worker.terminate();
    });
    this.workers = [];
    this.isDestroyed = true;
  }
}

export type { Vector2, Entity };
