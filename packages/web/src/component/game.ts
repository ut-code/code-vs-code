/* eslint-disable max-classes-per-file */
import * as PIXI from "pixi.js";
import aircraftImage from "../../resources/aircraft1.png";
import kinoko from "../../resources/kinoko.png";

interface Vector2 {
  x: number;
  y: number;
}

function normalizeVector2(x: number, y: number): Vector2 {
  return {
    x: x / Math.sqrt(x ** 2 + y ** 2),
    y: y / Math.sqrt(x ** 2 + y ** 2),
  };
}

interface Entity {
  location: Vector2;

  readonly size: Vector2;
}

interface DataFromWorker {
  type: string;
  target: Vector2;
}

interface Weapon extends Entity {
  firingRange: number;
  attackRange: number;
  speed: number;
  reloadFrame: number;
  staminaRequired: number;
}

//  ドメインオブジェクト

class Fighter implements Entity {
  location: Vector2;

  readonly size: Vector2 = { x: 20, y: 20 };

  HP = 100;

  speed = 2; // 1 フレームの移動

  stamina = 200;

  weapon: Weapon | null = null;

  reloadFrameLeft = 10;

  direction: Vector2 = { x: 0, y: 1 };

  action: FighterAction | null = null;

  isShortOfStamina = false;

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

  addedPortions: Portion[] = [];

  deletedPortions: Portion[] = [];

  constructor() {
    for (let i = 0; i < 4; i += 1) {
      const location = { x: 100 * i + 100, y: 100 * i + 100 };
      const fighter = new Fighter(location);
      this.fighters.push(fighter);
    }
  }

  setRandomPortion() {
    const size = { x: 20, y: 20 };
    const checkOverlapWithPortions = (location: Vector2) => {
      for (let i = 0; i < this.fighters.length; i += 1) {
        const player = this.fighters[i];
        if (!player) throw new Error("Cannot find a player");
        if (
          location.x + size.x > player.location.x &&
          location.x < player.location.x + player.size.x &&
          location.y + size.y > player.location.y &&
          location.y < player.location.y + player.size.y
        )
          return true;
      }
      return false;
    };
    const checkOverlapWithPlayers = (location: Vector2) => {
      for (let i = 0; i < this.portions.length; i += 1) {
        const OtherPortion = this.portions[i];
        if (!OtherPortion) throw new Error("Cannot find a portion");
        if (
          location.x + size.x > OtherPortion.location.x &&
          location.x < OtherPortion.location.x + OtherPortion.size.x &&
          location.y + size.y > OtherPortion.location.y &&
          location.y < OtherPortion.location.y + OtherPortion.size.y
        )
          return true;
      }
      return false;
    };
    const setAppropriateLocation = () => {
      const location = { x: Math.random() * 800, y: Math.random() * 600 };
      while (
        checkOverlapWithPortions(location) ||
        checkOverlapWithPlayers(location)
      ) {
        location.x = Math.random() * 800;
        location.y = Math.random() * 600;
      }
      return location;
    };
    const location = setAppropriateLocation();
    const portion = new Portion(location, size, "speedUp", 1);
    this.portions.push(portion);
    this.addedPortions.push(portion);
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
            this.deletedPortions.push(portion);
            if (fighter.speed < 8) {
              setTimeout(() => {
                fighter.speed -= 0.5;
              }, 5000);
            }
            fighter.speed = Math.min(fighter.speed + 0.5, 8);
          }
        });
      }
    };
    const detectCollisionWithWalls = () => {
      for (const fighter of this.fighters) {
        fighter.location = {
          x: Math.min(fighter.location.x, 800 - fighter.size.x),
          y: Math.min(fighter.location.y, 600 - fighter.size.y),
        };
      }
    };
    detectCollisionWithPortions();
    detectCollisionWithWalls();
  }
}

// アクション

interface FighterAction {
  requiredStamina: number;

  tick(delay: number): void;
}

class WalkToAction implements FighterAction {
  world: World;

  fighter: Fighter;

  destination: Vector2;

  requiredStamina = 0;

  constructor(world: World, fighter: Fighter, destination: Vector2) {
    this.world = world;
    this.fighter = fighter;
    this.destination = destination;
  }

  tick() {
    const walk = () => {
      const deltaX = this.destination.x - this.fighter.location.x;
      const deltaY = this.destination.y - this.fighter.location.y;
      this.fighter.direction = normalizeVector2(deltaX, deltaY);
      this.fighter.location.x += this.fighter.direction.x * this.fighter.speed;
      this.fighter.location.y += this.fighter.direction.y * this.fighter.speed;
    };
    if (this.destination) walk();
  }
}

class RunToAction implements FighterAction {
  world: World;

  fighter: Fighter;

  destination: Vector2;

  requiredStamina = 2;

  constructor(world: World, fighter: Fighter, destination: Vector2) {
    this.world = world;
    this.fighter = fighter;
    this.destination = destination;
  }

  tick() {
    const run = () => {
      const deltaX = this.destination.x - this.fighter.location.x;
      const deltaY = this.destination.y - this.fighter.location.y;
      this.fighter.direction = normalizeVector2(deltaX, deltaY);
      this.fighter.location.x +=
        this.fighter.direction.x * (this.fighter.speed + 1);
      this.fighter.location.y +=
        this.fighter.direction.y * (this.fighter.speed + 1);
    };
    if (this.destination) run();
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
    this.sprite.anchor.set(0.5);
    this.sprite.x = this.fighter.location.x + this.fighter.size.x / 2;
    this.sprite.y = this.fighter.location.y + this.fighter.size.y / 2;
    pixi.stage.addChild(this.sprite);
  }

  render(): void {
    this.sprite.x = this.fighter.location.x + this.fighter.size.x / 2;
    this.sprite.y = this.fighter.location.y + this.fighter.size.y / 2;
    const radian =
      Math.atan(this.fighter.direction.y / this.fighter.direction.x) -
      Math.PI / 2;
    this.sprite.rotation =
      this.fighter.direction.x <= 0 ? radian : radian + Math.PI;
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

  #pixi: PIXI.Application;

  fighterRenderers: FighterRenderer[];

  portionRenderers: PortionRenderer[];

  Graphics: PIXI.Graphics = new PIXI.Graphics();

  constructor(world: World, canvas: HTMLCanvasElement) {
    this.world = world;
    this.#pixi = new PIXI.Application({
      view: canvas,
      width: 800,
      height: 600,
      backgroundColor: 0xffffff,
    });
    this.fighterRenderers = this.world.fighters.map(
      (fighter) => new FighterRenderer(fighter, this.#pixi)
    );
    this.portionRenderers = this.world.portions.map(
      (portion) => new PortionRenderer(portion, this.#pixi)
    );
    const graphics = this.Graphics;
    graphics.beginFill(0xff0000);
    for (const fighter of this.world.fighters) {
      graphics.drawRect(
        fighter.location.x,
        fighter.location.y - 5,
        fighter.size.x,
        2
      );
    }
    graphics.endFill();
    this.#pixi.stage.addChild(graphics);
  }

  run() {
    this.#pixi.ticker.add(() => {
      this.render();
    });
  }

  render() {
    this.addPortionSprite();
    this.deletePortionSprite();
    this.updateStaminaBar();
    for (const fighterRenderer of this.fighterRenderers) {
      fighterRenderer.render();
    }
    for (const portionRenderer of this.portionRenderers) {
      portionRenderer.render();
    }
  }

  addPortionSprite() {
    this.world.addedPortions.forEach((addedPortion) => {
      const newRenderer = new PortionRenderer(addedPortion, this.#pixi);
      this.world.addedPortions.splice(
        this.world.addedPortions.indexOf(addedPortion),
        1
      );
      this.portionRenderers.push(newRenderer);
    });
  }

  deletePortionSprite() {
    this.world.deletedPortions.forEach((deletedPortion) => {
      const oldRenderer = this.portionRenderers.find((portionRenderer) => {
        return portionRenderer.portion === deletedPortion;
      });
      if (oldRenderer) {
        this.#pixi.stage.removeChild(oldRenderer.sprite);
        this.portionRenderers.splice(
          this.portionRenderers.indexOf(oldRenderer),
          1
        );
      }
    });
  }

  updateStaminaBar() {
    const graphics = this.Graphics;
    graphics.clear();
    graphics.beginFill(0xff0000);
    for (const fighter of this.world.fighters) {
      graphics.drawRect(
        fighter.location.x,
        fighter.location.y - 5,
        fighter.stamina < 200
          ? fighter.size.x * (fighter.stamina / 200)
          : fighter.size.x,
        2
      );
    }
    graphics.endFill();
  }

  destroy() {
    this.#pixi.destroy();
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
      const runFightersAction = () => {
        for (const fighter of this.world.fighters) {
          const { action } = fighter;
          if (action) {
            if (fighter.isShortOfStamina === false) {
              action.tick(delta);
              fighter.stamina -= action.requiredStamina;
            }
          }
          if (fighter.stamina < 200 && fighter.stamina > 0) {
            fighter.stamina += 1;
            if (fighter.stamina >= 50) {
              fighter.isShortOfStamina = false;
            }
          } else if (fighter.stamina <= 0) {
            fighter.isShortOfStamina = true;
            fighter.stamina += 1;
          }
        }
      };
      runFightersAction();
      this.world.detectCollision();
      if (currentTime - previousTime2 >= 100) {
        previousTime2 = Date.now();
        this.world.setRandomPortion();
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
      worker.onmessage = (e: MessageEvent<string>) => {
        const data: DataFromWorker = JSON.parse(e.data);
        const player = this.world.fighters[i];
        if (player === undefined) throw new Error();
        player.action = null;
        if (data.type === "walkTo") {
          player.action = new WalkToAction(this.world, player, data.target);
        }
        if (data.type === "runTo") {
          player.action = new RunToAction(this.world, player, data.target);
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
    const { portions } = this.world;
    for (let i = 0; i < this.world.fighters.length; i += 1) {
      const player = this.world.fighters[i];
      if (!player) throw new Error();
      const enemies = this.world.fighters.filter(
        (fighter) => fighter !== player
      );
      const script = `player = ${JSON.stringify({
        location: player.location,
        HP: player.HP,
        speed: player.speed,
        stamina: player.stamina,
        weapon: {
          firingRange: player.weapon?.firingRange,
          attackRange: player.weapon?.attackRange,
          speed: player.weapon?.speed,
          reloadFrame: player.weapon?.reloadFrame,
          staminaRequired: player.weapon?.staminaRequired,
        },
      })}
          enemies = ${JSON.stringify(
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
                  reloadFrame: enemy.weapon?.reloadFrame,
                  staminaRequired: enemy.weapon?.staminaRequired,
                },
              };
            })
          )}
          portions = ${JSON.stringify(
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
          ${
            i !== this.world.fighters.length - 1
              ? "walkTo(target);"
              : "runTo(target)"
          }`;
      this.workers[i]?.postMessage(script);
    }
  }

  destroy() {
    this.worldRenderer.destroy();
    this.workers.forEach((worker) => {
      worker.terminate();
    });
    this.workers = [];
    this.isDestroyed = true;
  }
}

export type { Vector2, Entity };
