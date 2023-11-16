/* eslint-disable max-classes-per-file */
import type { FighterAction } from "./gameActions";

export const MAX_HP = 100;
export const MAX_STAMINA = 100;
export const STAGE_WIDTH = 800;
export const STAGE_HEIGHT = 600;
export type Result = number[];

interface Vector2 {
  x: number;
  y: number;
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

type validPortion = {
  timeLeft: number;
};

export type { Vector2, Entity, DataFromWorker };
export { calculateDistance };

class Fighter implements Entity {
  id: number;

  name: string;

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

  validPortions: validPortion[] = [];

  constructor(id: number, name: string, location: Vector2) {
    this.id = id;
    this.name = name;
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
    this.requiredStamina = 25;
  }
}

class Bullet implements Entity {
  owner: Fighter;

  location: Vector2;

  startLocation: Vector2;

  readonly size: Vector2;

  direction: Vector2;

  rangeLimit: number;

  damage: number;

  speed: number;

  constructor(
    owner: Fighter,
    location: Vector2,
    size: Vector2,
    direction: Vector2,
    rangeLimit: number,
    damage: number,
    speed: number
  ) {
    this.owner = owner;
    this.location = location;
    this.startLocation = { x: location.x, y: location.y };
    this.size = size;
    this.direction = direction;
    this.rangeLimit = rangeLimit;
    this.damage = damage;
    this.speed = speed;
  }

  move() {
    this.location.x += this.direction.x * this.speed;
    this.location.y += this.direction.y * this.speed;
  }
}

export { Fighter, Portion, Weapon, Bullet };
