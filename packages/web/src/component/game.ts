/* eslint-disable max-classes-per-file */
import * as PIXI from "pixi.js";
import aircraftImage from "../../resources/aircraft1.png";
import kinoko from "../../resources/kinoko.png";
import explosion1 from "../../resources/explosion1.png";
import explosion2 from "../../resources/explosion2.png";
import explosion3 from "../../resources/explosion3.png";
import explosion4 from "../../resources/explosion4.png";
import explosion5 from "../../resources/explosion5.png";
import explosion6 from "../../resources/explosion6.png";
import explosion7 from "../../resources/explosion7.png";
import explosion8 from "../../resources/explosion8.png";

const MAX_HP = 100;
const MAX_STAMINA = 100;

interface User {
  username: string;
  id: number;
  script: string;
}

interface Vector2 {
  x: number;
  y: number;
}

function normalizeVector2(vector2: Vector2): Vector2 {
  return {
    x: vector2.x / Math.sqrt(vector2.x ** 2 + vector2.y ** 2),
    y: vector2.y / Math.sqrt(vector2.x ** 2 + vector2.y ** 2),
  };
}

interface Entity {
  location: Vector2;

  readonly size: Vector2;
}

function calculateDistance(
  thing: Vector2 | Entity,
  destination: Vector2 | Entity
) {
  const vector1 = "x" in thing ? thing : thing.location;
  const vector2 = "x" in destination ? destination : destination.location;
  return Number(
    Math.sqrt((vector2.x - vector1.x) ** 2 + (vector2.y - vector1.y) ** 2)
  );
}

type DataFromWorker =
  | {
      type: "walkTo" | "runTo";
      target: Vector2;
    }
  | { type: "punch"; target: TargetData };

interface TargetData extends Entity {
  HP: number;
  id: number;
  speed: number;
  stamina: number;
  armLength: number;
  weapon: Weapon | null;
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
  id: number;

  location: Vector2;

  readonly size: Vector2 = { x: 20, y: 20 };

  HP = 100;

  speed = 2; // 1 フレームの移動

  stamina = 100;

  weapon: Weapon | null = null;

  reloadFrameLeft = 10;

  direction: Vector2 = { x: 0, y: 1 };

  action: FighterAction | null = null;

  isShortOfStamina = false;

  static armLength = 40;

  constructor(id: number, location: Vector2) {
    this.id = id;
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
  fighters: Fighter[];

  portions: Portion[] = [];

  weapons: Weapon[] = [];

  constructor(fighterIds: number[]) {
    const id1 = fighterIds[0];
    const id2 = fighterIds[1];
    const id3 = fighterIds[2];
    const id4 = fighterIds[3];
    if (!id1 || !id2 || !id3 || !id4) throw new Error();
    const player1 = new Fighter(id1, { x: 100, y: 100 });
    const player2 = new Fighter(id2, { x: 500, y: 100 });
    const player3 = new Fighter(id3, { x: 100, y: 500 });
    const player4 = new Fighter(id4, { x: 500, y: 500 });
    this.fighters = [player1, player2, player3, player4];
  }

  setRandomPortion() {
    const size = { x: 20, y: 20 };
    const checkOverlapWithPortions = (location: Vector2) => {
      for (const fighter of this.fighters) {
        if (!fighter) throw new Error("Cannot find a player");
        if (
          location.x + size.x > fighter.location.x &&
          location.x < fighter.location.x + fighter.size.x &&
          location.y + size.y > fighter.location.y &&
          location.y < fighter.location.y + fighter.size.y
        )
          return true;
      }
      return false;
    };
    const checkOverlapWithPlayers = (location: Vector2) => {
      for (const otherPortion of this.portions) {
        if (!otherPortion) throw new Error("Cannot find a portion");
        if (
          location.x + size.x > otherPortion.location.x &&
          location.x < otherPortion.location.x + otherPortion.size.x &&
          location.y + size.y > otherPortion.location.y &&
          location.y < otherPortion.location.y + otherPortion.size.y
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
  }

  runFightersAction() {
    for (const fighter of this.fighters) {
      // スタミナ回復
      if (fighter.stamina < MAX_STAMINA) fighter.stamina += 1;
      // スタミナ不足か判断後、アクションによってはスタミナ消費し実行
      if (!fighter.isShortOfStamina) {
        const { action } = fighter;
        if (action) {
          if (action instanceof PunchAction) {
            if (!action.isCompleted) {
              action.tick();
              fighter.stamina = Math.max(
                fighter.stamina - action.requiredStamina,
                0
              );
              action.isCompleted = true;
            }
          } else if (action instanceof RunToAction) {
            action.tick();
            fighter.stamina = Math.max(
              fighter.stamina - action.requiredStamina,
              0
            );
          } else {
            action.tick();
          }
        }
        if (fighter.stamina === 0) fighter.isShortOfStamina = true;
      } else if (fighter.stamina > MAX_STAMINA / 2) {
        fighter.isShortOfStamina = false;
      }
    }
  }

  detectCollision() {
    // ポーションとの当たり判定
    for (const fighter of this.fighters) {
      this.portions.forEach((portion) => {
        if (
          fighter.location.x + fighter.size.x > portion.location.x &&
          fighter.location.x < portion.location.x + portion.size.x &&
          fighter.location.y + fighter.size.y > portion.location.y &&
          fighter.location.y < portion.location.y + portion.size.y
        ) {
          this.portions.splice(this.portions.indexOf(portion), 1);
          if (fighter.speed < 8) {
            setTimeout(() => {
              fighter.speed -= 0.5;
            }, 5000);
          }
          fighter.speed = Math.min(fighter.speed + 0.5, 8);
        }
      });
    }

    // 壁との当たり判定
    for (const fighter of this.fighters) {
      fighter.location = {
        x: Math.min(fighter.location.x, 800 - fighter.size.x),
        y: Math.min(fighter.location.y, 600 - fighter.size.y),
      };
    }
  }

  checkFightersHP() {
    for (const fighter of this.fighters) {
      if (fighter.HP <= 0) {
        this.fighters.splice(this.fighters.indexOf(fighter), 1);
      }
    }
  }
}

// アクション

interface FighterAction {
  actor: Fighter;

  readonly requiredStamina: number;

  tick(): void;
}

class WalkToAction implements FighterAction {
  actor: Fighter;

  destination: Vector2;

  requiredStamina = 0;

  constructor(fighter: Fighter, destination: Vector2) {
    this.actor = fighter;
    this.destination = destination;
  }

  tick() {
    const vector2 = {
      x: this.destination.x - this.actor.location.x,
      y: this.destination.y - this.actor.location.y,
    };
    this.actor.direction = normalizeVector2(vector2);
    this.actor.location.x += this.actor.direction.x * this.actor.speed;
    this.actor.location.y += this.actor.direction.y * this.actor.speed;
  }
}

class RunToAction implements FighterAction {
  actor: Fighter;

  destination: Vector2;

  requiredStamina = 2;

  constructor(fighter: Fighter, destination: Vector2) {
    this.actor = fighter;
    this.destination = destination;
  }

  tick() {
    const vector2 = {
      x: this.destination.x - this.actor.location.x,
      y: this.destination.y - this.actor.location.y,
    };
    this.actor.direction = normalizeVector2(vector2);
    this.actor.location.x += this.actor.direction.x * (this.actor.speed + 1);
    this.actor.location.y += this.actor.direction.y * (this.actor.speed + 1);
  }
}

class PunchAction implements FighterAction {
  actor: Fighter;

  target: Fighter;

  isCompleted = false;

  requiredStamina = 11;

  constructor(actor: Fighter, target: Fighter) {
    this.actor = actor;
    this.target = target;
  }

  tick() {
    const distance = calculateDistance(this.actor, this.target);
    if (distance <= Fighter.armLength) {
      this.target.HP -= 10;
      const vector2 = normalizeVector2({
        x: this.target.location.x - this.actor.location.x,
        y: this.target.location.y - this.actor.location.y,
      });
      this.actor.direction = vector2;
    }
  }
}

// レンダラー

class FighterRenderer {
  fighter: Fighter;

  pixi: PIXI.Application;

  sprite: PIXI.Sprite;

  statusBarGraphics: PIXI.Graphics;

  constructor(fighter: Fighter, pixi: PIXI.Application) {
    this.fighter = fighter;
    this.pixi = pixi;

    // 機体画像
    this.sprite = PIXI.Sprite.from(aircraftImage);
    this.sprite.width = this.fighter.size.x;
    this.sprite.height = this.fighter.size.y;
    this.sprite.anchor.set(0.5);
    this.sprite.x = this.fighter.location.x + this.fighter.size.x / 2;
    this.sprite.y = this.fighter.location.y + this.fighter.size.y / 2;
    pixi.stage.addChild(this.sprite);

    // HPバー・ステータスバー
    this.statusBarGraphics = new PIXI.Graphics();
    pixi.stage.addChild(this.statusBarGraphics);
  }

  render(): void {
    // 機体画像
    this.sprite.x = this.fighter.location.x + this.fighter.size.x / 2;
    this.sprite.y = this.fighter.location.y + this.fighter.size.y / 2;
    const radian =
      Math.atan2(this.fighter.direction.y, this.fighter.direction.x) -
      Math.PI / 2;
    this.sprite.rotation = radian + Math.PI;

    // HPバー・スタミナバー
    this.statusBarGraphics.clear();
    this.statusBarGraphics.x = this.fighter.location.x;
    this.statusBarGraphics.y = this.fighter.location.y - 10;

    // HPバー
    this.statusBarGraphics.beginFill(0x00ff00);
    this.statusBarGraphics.drawRect(0, 0, (20 * this.fighter.HP) / MAX_HP, 2);

    // スタミナバー
    this.statusBarGraphics.beginFill(0xff0000);
    this.statusBarGraphics.drawRect(
      0,
      5,
      (20 * this.fighter.stamina) / MAX_STAMINA,
      2
    );

    this.statusBarGraphics.endFill();
  }

  destroy() {
    this.pixi.stage.removeChild(this.sprite);
    this.pixi.stage.removeChild(this.statusBarGraphics);
  }
}

class PortionRenderer {
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

  destroy() {
    this.pixi.stage.removeChild(this.sprite);
  }
}

class PunchEffectRenderer {
  punchAction: PunchAction;

  pixi: PIXI.Application;

  onCompleted?: () => void;

  static sprites: PIXI.Texture[] = [
    PIXI.Texture.from(explosion1),
    PIXI.Texture.from(explosion2),
    PIXI.Texture.from(explosion3),
    PIXI.Texture.from(explosion4),
    PIXI.Texture.from(explosion5),
    PIXI.Texture.from(explosion6),
    PIXI.Texture.from(explosion7),
    PIXI.Texture.from(explosion8),
  ];

  animatedSprite: PIXI.AnimatedSprite;

  constructor(punchAction: PunchAction, pixi: PIXI.Application) {
    this.punchAction = punchAction;
    this.pixi = pixi;
    this.animatedSprite = new PIXI.AnimatedSprite(PunchEffectRenderer.sprites);
    this.animatedSprite.anchor.set(0.5);
    this.animatedSprite.scale.set(0.5);
    this.animatedSprite.x = this.punchAction.target.location.x + 10;
    this.animatedSprite.y = this.punchAction.target.location.y + 10;
    this.animatedSprite.loop = false;
    this.animatedSprite.onComplete = () => {
      this.onCompleted?.();
    };
    this.pixi.stage.addChild(this.animatedSprite);
    this.animatedSprite.play();
  }

  destroy(): void {
    this.pixi.stage.removeChild(this.animatedSprite);
  }
}

class WorldRenderer {
  world: World;

  #pixi: PIXI.Application;

  fighterRenderers = new Map<Fighter, FighterRenderer>();

  portionRenderers = new Map<Portion, PortionRenderer>();

  punchEffectRenderers = new Map<PunchAction, PunchEffectRenderer>();

  constructor(world: World, canvas: HTMLCanvasElement) {
    this.world = world;
    this.#pixi = new PIXI.Application({
      view: canvas,
      width: 800,
      height: 600,
      backgroundColor: 0xffffff,
    });
    for (const fighter of this.world.fighters) {
      this.fighterRenderers.set(
        fighter,
        new FighterRenderer(fighter, this.#pixi)
      );
    }
  }

  run() {
    this.#pixi.ticker.add(() => {
      this.render();
    });
  }

  render() {
    // ファイター
    const unusedFighterRenderers = new Set(this.fighterRenderers.values());
    for (const fighter of this.world.fighters) {
      const existingRenderer = this.fighterRenderers.get(fighter);
      if (!existingRenderer) {
        this.fighterRenderers.set(
          fighter,
          new FighterRenderer(fighter, this.#pixi)
        );
      } else {
        existingRenderer.render();
        unusedFighterRenderers.delete(existingRenderer);
      }
    }
    for (const renderer of unusedFighterRenderers) {
      renderer.destroy();
    }

    // ポーション
    const unusedPortionRenderers = new Set(this.portionRenderers.values());
    for (const portion of this.world.portions) {
      const existingRenderer = this.portionRenderers.get(portion);
      if (!existingRenderer) {
        this.portionRenderers.set(
          portion,
          new PortionRenderer(portion, this.#pixi)
        );
      } else {
        existingRenderer.render();
        unusedPortionRenderers.delete(existingRenderer);
      }
    }
    for (const renderer of unusedPortionRenderers) {
      renderer.destroy();
    }

    // エフェクト
    for (const fighter of this.world.fighters) {
      const { action } = fighter;
      if (action instanceof PunchAction) {
        const existingRenderer = this.punchEffectRenderers.get(action);
        if (!existingRenderer) {
          if (!action.isCompleted) {
            const newRenderer = new PunchEffectRenderer(action, this.#pixi);
            this.punchEffectRenderers.set(action, newRenderer);
            newRenderer.onCompleted = () => {
              this.punchEffectRenderers.delete(action);
              newRenderer.destroy();
            };
          }
        }
      }
    }
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

  workers: Map<number, Worker>;

  users: User[];

  constructor(users: User[], canvas: HTMLCanvasElement) {
    this.users = users;
    const ids = users.map((user) => user.id);
    this.world = new World(ids);
    this.worldRenderer = new WorldRenderer(this.world, canvas);
    this.workers = new Map<number, Worker>();
    this.run();
  }

  run() {
    this.buildWorkers();
    this.worldRenderer.run();
    let previousTime = Date.now();
    const callback = () => {
      if (this.isDestroyed) return;
      const currentTime = Date.now();
      // worldクラスのメソッド実行
      this.world.runFightersAction();
      this.world.detectCollision();
      this.world.checkFightersHP();
      // タイムラグが必要な処理実行
      if (currentTime - previousTime >= 500) {
        previousTime = Date.now();
        this.world.setRandomPortion();
        this.sendScriptsToWorkers();
      }
      requestAnimationFrame(callback);
    };
    callback();
  }

  buildWorkers() {
    for (const me of this.world.fighters) {
      const worker = new Worker(new URL("./worker.ts", import.meta.url), {
        type: "module",
      });
      worker.onmessage = (e: MessageEvent<string>) => {
        const data: DataFromWorker = JSON.parse(e.data);
        if (data.type === "walkTo") {
          me.action = new WalkToAction(me, data.target);
        }
        if (data.type === "runTo") {
          me.action = new RunToAction(me, data.target);
        }
        if (data.type === "punch") {
          const target = this.world.fighters.find(
            (fighter) => fighter.id === data.target.id
          );
          if (!target) throw new Error();
          me.action = new PunchAction(me, target);
        }
      };
      this.workers.set(me.id, worker);
    }
  }

  sendScriptsToWorkers() {
    const { portions } = this.world;
    for (const me of this.world.fighters) {
      if (!me) throw new Error();
      const enemies: Fighter[] = this.world.fighters.filter(
        (fighter) => fighter !== me
      );
      const script = `player = ${JSON.stringify({
        location: me.location,
        HP: me.HP,
        id: me.id,
        speed: me.speed,
        stamina: me.stamina,
        armLength: Fighter.armLength,
        weapon: {
          firingRange: me.weapon?.firingRange,
          attackRange: me.weapon?.attackRange,
          speed: me.weapon?.speed,
          reloadFrame: me.weapon?.reloadFrame,
          staminaRequired: me.weapon?.staminaRequired,
        },
      })}
          enemies = ${JSON.stringify(
            enemies.map((enemy) => {
              return {
                location: enemy.location,
                HP: enemy.HP,
                id: enemy.id,
                speed: enemy.speed,
                stamina: enemy.stamina,
                armLength: Fighter.armLength,
                weapon: {
                  firingRange: enemy.weapon?.firingRange,
                  attackRange: enemy.weapon?.attackRange,
                  speed: enemy.weapon?.speed,
                  reloadFrame: enemy.weapon?.reloadFrame,
                  requiredStamina: enemy.weapon?.staminaRequired,
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
          ${this.users.find((user) => user.id === me.id)?.script}`;
      this.workers.get(me.id)?.postMessage(script);
    }
  }

  destroy() {
    this.worldRenderer.destroy();
    for (const worker of this.workers.values()) {
      worker.terminate();
    }
    this.workers.clear();
    this.isDestroyed = true;
  }
}

export type { Vector2, Entity };
