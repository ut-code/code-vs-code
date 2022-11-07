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
import itemFire from "../../resources/itemFire.png";
import bulletFire from "../../resources/bulletFire.png";

const MAX_HP = 100;
const MAX_STAMINA = 100;
const STAGE_WIDTH = 800;
const STAGE_HEIGHT = 600;

interface User {
  username: string;
  id: number;
  script: string;
}

type Result = number[];

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
      type: "walkTo" | "runTo" | "useWeapon";
      target: Vector2;
    }
  | { type: "punch"; targetId: number }
  | { type: "pickUp"; targetId: number };

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

// ウェポンの性能は暫定値を代入してます 武器ごとに変える予定です
class Weapon implements Entity {
  id: number;

  location: Vector2;

  readonly size: Vector2;

  firingRange: number;

  damage: number;

  bulletScale: number;

  bulletSpeed: number;

  reloadFrame: number;

  bulletsLeft: number;

  requiredStamina: number;

  isPickedUp = false;

  constructor(id: number, location: Vector2, size: Vector2) {
    this.id = id;
    this.location = location;
    this.size = size;
    this.firingRange = 400;
    this.damage = 15;
    this.bulletScale = Math.sqrt(10 ** 2 + 20 ** 2);
    this.bulletSpeed = 10;
    this.reloadFrame = 10;
    this.bulletsLeft = 3;
    this.requiredStamina = 10;
  }
}

class Bullet implements Entity {
  owner: Fighter;

  location: Vector2;

  startLocation: Vector2;

  readonly size: Vector2;

  direction: Vector2;

  firingRange: number;

  damage: number;

  speed: number;

  constructor(
    owner: Fighter,
    location: Vector2,
    size: Vector2,
    direction: Vector2,
    firingRange: number,
    damage: number,
    speed: number
  ) {
    this.owner = owner;
    this.location = location;
    this.startLocation = { x: location.x, y: location.y };
    this.size = size;
    this.direction = direction;
    this.firingRange = firingRange;
    this.damage = damage;
    this.speed = speed;
  }

  move() {
    this.location.x += this.direction.x * this.speed;
    this.location.y += this.direction.y * this.speed;
  }
}

function isOverlap(entity1: Entity, entity2: Entity) {
  return (
    entity1.location.x + entity1.size.x > entity2.location.x &&
    entity1.location.x < entity2.location.x + entity2.size.x &&
    entity1.location.y + entity1.size.y > entity2.location.y &&
    entity1.location.y < entity2.location.y + entity2.size.y
  );
}

class World {
  fighters: Fighter[];

  portions: Portion[] = [];

  weapons: Weapon[] = [];

  bullets: Bullet[] = [];

  nextWeaponId = 1;

  losers: Fighter[] = [];

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

  placeRandomPortion() {
    const size = { x: 20, y: 20 };
    const location = this.findEmptySpace(size);

    const portion = new Portion(location, size, "speedUp", 1);
    this.portions.push(portion);
  }

  placeRandomWeapon() {
    const size = { x: 15, y: 20 };
    const location = this.findEmptySpace(size);
    const weapon = new Weapon(this.nextWeaponId, location, size);
    this.weapons.push(weapon);
    this.nextWeaponId += 1;
  }

  runFightersAction() {
    for (const fighter of this.fighters) {
      // スタミナ回復
      if (fighter.stamina < MAX_STAMINA) fighter.stamina += 1;
      // スタミナ不足か判断後、アクションによってはスタミナ消費し実行
      if (!fighter.isShortOfStamina) {
        fighter.action?.tick();
        if (fighter.stamina === 0) fighter.isShortOfStamina = true;
      } else if (fighter.stamina > MAX_STAMINA / 2) {
        fighter.isShortOfStamina = false;
      }
    }
  }

  detectCollision() {
    // ポーションとの当たり判定
    for (const fighter of this.fighters) {
      for (const portion of this.portions) {
        if (isOverlap(fighter, portion)) {
          this.portions.splice(this.portions.indexOf(portion), 1);
          if (fighter.speed < 8) {
            setTimeout(() => {
              fighter.speed -= 0.5;
            }, 5000);
          }
          fighter.speed = Math.min(fighter.speed + 0.5, 8);
        }
      }
    }

    // 壁との当たり判定
    for (const fighter of this.fighters) {
      fighter.location = {
        x: Math.min(fighter.location.x, STAGE_WIDTH - fighter.size.x),
        y: Math.min(fighter.location.y, STAGE_HEIGHT - fighter.size.y),
      };
    }

    // 弾との当たり判定
    for (const fighter of this.fighters) {
      for (const bullet of this.bullets) {
        if (bullet.owner !== fighter) {
          if (isOverlap(fighter, bullet)) {
            this.bullets.splice(this.bullets.indexOf(bullet), 1);
            fighter.HP -= bullet.damage;
          }
        }
      }
    }
  }

  moveBullets() {
    for (const bullet of this.bullets) {
      bullet.move();
    }
  }

  deleteBullets() {
    for (const bullet of this.bullets) {
      if (
        calculateDistance(bullet, bullet.startLocation) > bullet.firingRange
      ) {
        this.bullets.splice(this.bullets.indexOf(bullet), 1);
      }
    }
  }

  removeDeadFighters() {
    for (const fighter of this.fighters) {
      if (fighter.HP <= 0) {
        this.fighters.splice(this.fighters.indexOf(fighter), 1);
        this.losers.push(fighter);
      }
    }
  }

  deleteWeaponsPickedUp() {
    this.weapons = this.weapons.filter((weapon) => !weapon.isPickedUp);
  }

  clear() {
    this.fighters = [];
    this.bullets = [];
    this.portions = [];
    this.weapons = [];
  }

  findEmptySpace(size: Vector2) {
    const location = {
      x: Math.random() * STAGE_WIDTH,
      y: Math.random() * STAGE_HEIGHT,
    };
    while (
      this.fighters.some((fighter) => isOverlap(fighter, { size, location })) ||
      this.portions.some((portion) => isOverlap(portion, { size, location })) ||
      this.weapons.some((weapon) => isOverlap(weapon, { size, location }))
    ) {
      location.x = Math.random() * STAGE_WIDTH;
      location.y = Math.random() * STAGE_HEIGHT;
    }
    return location;
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
    if (this.actor.stamina <= 0) return;
    const vector2 = {
      x: this.destination.x - this.actor.location.x,
      y: this.destination.y - this.actor.location.y,
    };
    this.actor.direction = normalizeVector2(vector2);
    this.actor.location.x += this.actor.direction.x * (this.actor.speed + 1);
    this.actor.location.y += this.actor.direction.y * (this.actor.speed + 1);
    this.actor.stamina = Math.max(this.actor.stamina - this.requiredStamina, 0);
  }
}

class PunchAction implements FighterAction {
  actor: Fighter;

  target: Fighter;

  isCompleted = false;

  requiredStamina = 21;

  constructor(actor: Fighter, target: Fighter) {
    this.actor = actor;
    this.target = target;
  }

  tick() {
    if (this.actor.stamina <= 0 || this.isCompleted) return;
    const distance = calculateDistance(this.actor, this.target);
    if (distance <= Fighter.armLength) {
      this.target.HP -= 10;
      const vector2 = normalizeVector2({
        x: this.target.location.x - this.actor.location.x,
        y: this.target.location.y - this.actor.location.y,
      });
      this.actor.direction = vector2;
    }
    this.actor.stamina = Math.max(this.actor.stamina - this.requiredStamina, 0);
    this.isCompleted = true;
  }
}

class PickUpAction implements FighterAction {
  actor: Fighter;

  target: Weapon;

  requiredStamina = 0;

  constructor(actor: Fighter, target: Weapon) {
    this.actor = actor;
    this.target = target;
  }

  tick() {
    const distance = calculateDistance(this.actor, this.target);
    if (distance <= Fighter.armLength) {
      this.actor.weapon = this.target;
      this.target.isPickedUp = true;
      const vector2 = normalizeVector2({
        x: this.target.location.x - this.actor.location.x,
        y: this.target.location.y - this.actor.location.y,
      });
      this.actor.direction = vector2;
    }
  }
}

class UseWeaponAction implements FighterAction {
  actor: Fighter;

  target: Vector2;

  bullets: Bullet[];

  requiredStamina = 0;

  isCompleted = false;

  constructor(actor: Fighter, target: Vector2, bullets: Bullet[]) {
    this.actor = actor;
    this.bullets = bullets;
    const requiredStamina = this.actor.weapon?.requiredStamina;
    if (requiredStamina !== undefined) this.requiredStamina = requiredStamina;
    this.target = target;
  }

  tick() {
    if (this.actor.stamina <= 0 || this.isCompleted) return;
    const { weapon } = this.actor;
    if (weapon) {
      const vector = normalizeVector2({
        x: this.target.x - this.actor.location.x,
        y: this.target.y - this.actor.location.y,
      });
      const newBullet = new Bullet(
        this.actor,
        {
          x: this.actor.location.x + vector.x,
          y: this.actor.location.y + vector.y,
        },
        { x: 10, y: 20 },
        vector,
        weapon.firingRange,
        weapon.damage,
        weapon.bulletSpeed
      );
      this.bullets.push(newBullet);
    }
    if (this.actor.weapon) {
      if (this.actor.weapon.bulletsLeft > 1) {
        this.actor.weapon.bulletsLeft -= 1;
      } else if (this.actor.weapon.bulletsLeft === 1) {
        this.actor.weapon = null;
      }
      this.actor.direction = normalizeVector2({
        x: this.target.x - this.actor.location.x,
        y: this.target.y - this.actor.location.y,
      });
    }
    this.actor.stamina = Math.max(this.actor.stamina - this.requiredStamina, 0);
    this.isCompleted = true;
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
    this.sprite.position.set(
      this.fighter.location.x + this.fighter.size.x / 2,
      this.fighter.location.y + this.fighter.size.y / 2
    );
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
    this.sprite = PIXI.Sprite.from(kinoko);
    this.sprite.position.set(this.portion.location.x, this.portion.location.y);
    this.sprite.width = this.portion.size.x;
    this.sprite.height = this.portion.size.y;
    this.pixi.stage.addChild(this.sprite);
  }

  destroy() {
    this.pixi.stage.removeChild(this.sprite);
  }
}

class WeaponRenderer {
  weapon: Weapon;

  pixi: PIXI.Application;

  sprite: PIXI.Sprite;

  constructor(weapon: Weapon, pixi: PIXI.Application) {
    this.weapon = weapon;
    this.pixi = pixi;
    this.sprite = PIXI.Sprite.from(itemFire);
    this.sprite.position.set(this.weapon.location.x, this.weapon.location.y);
    this.sprite.width = this.weapon.size.x;
    this.sprite.height = this.weapon.size.y;
    this.pixi.stage.addChild(this.sprite);
  }

  destroy() {
    this.pixi.stage.removeChild(this.sprite);
  }
}

class BulletRenderer {
  bullet: Bullet;

  pixi: PIXI.Application;

  sprite: PIXI.Sprite;

  constructor(bullet: Bullet, pixi: PIXI.Application) {
    this.bullet = bullet;
    this.pixi = pixi;
    this.sprite = PIXI.Sprite.from(bulletFire);
    this.sprite.anchor.set(0.5);
    this.sprite.width = this.bullet.size.x;
    this.sprite.height = this.bullet.size.y;
    this.sprite.position.set(
      this.bullet.location.x + this.bullet.size.x,
      this.bullet.location.y + this.bullet.size.y
    );
    this.pixi.stage.addChild(this.sprite);
  }

  render() {
    this.sprite.position.set(this.bullet.location.x, this.bullet.location.y);
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

  weaponRenderers = new Map<Weapon, WeaponRenderer>();

  bulletRenderers = new Map<Bullet, BulletRenderer>();

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
        unusedPortionRenderers.delete(existingRenderer);
      }
    }
    for (const renderer of unusedPortionRenderers) {
      renderer.destroy();
    }

    // 武器
    const unusedWeaponRenderers = new Set(this.weaponRenderers.values());
    for (const weapon of this.world.weapons) {
      const existingRenderer = this.weaponRenderers.get(weapon);
      if (!existingRenderer) {
        this.weaponRenderers.set(
          weapon,
          new WeaponRenderer(weapon, this.#pixi)
        );
      } else {
        unusedWeaponRenderers.delete(existingRenderer);
      }
    }
    for (const renderer of unusedWeaponRenderers) {
      renderer.destroy();
    }

    // 弾
    const unusedBulletRenderers = new Set(this.bulletRenderers.values());
    for (const bullet of this.world.bullets) {
      const existingRenderer = this.bulletRenderers.get(bullet);
      if (!existingRenderer) {
        this.bulletRenderers.set(
          bullet,
          new BulletRenderer(bullet, this.#pixi)
        );
      } else {
        existingRenderer.render();
        unusedBulletRenderers.delete(existingRenderer);
      }
    }
    for (const renderer of unusedBulletRenderers) {
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

  isEnded = false;

  result?: Result;

  isCompleted?: () => void;

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
    const startTime = Date.now();
    const callback = () => {
      if (this.isDestroyed || this.isEnded) return;
      const currentTime = Date.now();
      // ゲームが終わりか判断
      if (this.world.fighters.length === 1) this.end();
      // worldクラスのメソッド実行
      this.world.runFightersAction();
      this.world.detectCollision();
      this.world.removeDeadFighters();
      this.world.deleteWeaponsPickedUp();
      this.world.deleteBullets();
      this.world.moveBullets();
      // タイムラグが必要な処理実行
      if (currentTime - previousTime >= 500) {
        previousTime = Date.now();
        this.world.placeRandomPortion();
        this.world.placeRandomWeapon();
        this.sendScriptsToWorkers();
      }
      if (currentTime - startTime >= 120000) {
        this.end();
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
            (fighter) => fighter.id === data.targetId
          );
          if (!target) throw new Error();
          me.action = new PunchAction(me, target);
        }
        if (data.type === "pickUp") {
          const target = this.world.weapons.find(
            (weapon) => weapon.id === data.targetId
          );
          if (!target) throw new Error();
          me.action = new PickUpAction(me, target);
        }
        if (data.type === "useWeapon") {
          me.action = new UseWeaponAction(me, data.target, this.world.bullets);
        }
      };
      this.workers.set(me.id, worker);
    }
  }

  sendScriptsToWorkers() {
    const { portions, weapons } = this.world;
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
        weapon: me.weapon
          ? {
              firingRange: me.weapon.firingRange,
              attackRange: me.weapon.bulletScale,
              speed: me.weapon.bulletSpeed,
              reloadFrame: me.weapon.reloadFrame,
              staminaRequired: me.weapon.requiredStamina,
            }
          : null,
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
                  attackRange: enemy.weapon?.bulletScale,
                  speed: enemy.weapon?.bulletSpeed,
                  reloadFrame: enemy.weapon?.reloadFrame,
                  requiredStamina: enemy.weapon?.requiredStamina,
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
          weapons = ${JSON.stringify(
            weapons.map((weapon) => {
              return {
                id: weapon.id,
                location: weapon.location,
                firingRange: weapon.firingRange,
                bulletScale: weapon.bulletScale,
                speed: weapon.bulletSpeed,
                reloadFrame: weapon.reloadFrame,
                staminaRequired: weapon.requiredStamina,
              };
            })
          )}
          ${this.users.find((user) => user.id === me.id)?.script}`;
      this.workers.get(me.id)?.postMessage(script);
    }
  }

  end() {
    const losersCopy = this.world.losers.slice();
    const losersIds = losersCopy.reverse().map((fighter) => fighter.id);
    const winnersIds = this.world.fighters
      .sort((fighter1, fighter2) => fighter2.HP - fighter1.HP)
      .map((fighter) => fighter.id);
    const result: Result = winnersIds.concat(losersIds);
    this.result = result;
    this.world.clear();
    this.isEnded = true;
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
