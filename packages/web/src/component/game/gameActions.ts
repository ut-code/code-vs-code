/* eslint-disable max-classes-per-file */
import type { Vector2 } from "./gameComponents";
import { Fighter, Weapon, Bullet, calculateDistance } from "./gameComponents";

function normalizeVector2(vector2: Vector2): Vector2 | null {
  if (vector2.x === 0 && vector2.y === 0) return null;
  return {
    x: vector2.x / Math.sqrt(vector2.x ** 2 + vector2.y ** 2),
    y: vector2.y / Math.sqrt(vector2.x ** 2 + vector2.y ** 2),
  };
}

interface FighterAction {
  actor: Fighter;

  readonly requiredStamina: number;

  tick(delta: number): void;
}

class WalkToAction implements FighterAction {
  actor: Fighter;

  destination: Vector2;

  requiredStamina = 0.7;

  constructor(fighter: Fighter, destination: Vector2) {
    this.actor = fighter;
    this.destination = destination;
  }

  tick(delta: number) {
    if (this.actor.stamina <= 0) return;
    const vector2 = {
      x: this.destination.x - this.actor.location.x,
      y: this.destination.y - this.actor.location.y,
    };
    const normalizedVector = normalizeVector2(vector2);
    this.actor.direction = normalizedVector || this.actor.direction;
    this.actor.location.x +=
      this.actor.direction.x * this.actor.speed * delta * 0.1;
    this.actor.location.y +=
      this.actor.direction.y * this.actor.speed * delta * 0.1;
    this.actor.stamina = Math.max(this.actor.stamina - this.requiredStamina, 0);
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

  tick(delta: number) {
    if (this.actor.stamina <= 0) return;
    const vector2 = {
      x: this.destination.x - this.actor.location.x,
      y: this.destination.y - this.actor.location.y,
    };
    const normalizedVector = normalizeVector2(vector2);
    this.actor.direction = normalizedVector || this.actor.direction;
    this.actor.location.x +=
      this.actor.direction.x * (this.actor.speed + 2) * delta * 0.1;
    this.actor.location.y +=
      this.actor.direction.y * (this.actor.speed + 2) * delta * 0.1;
    this.actor.stamina = Math.max(this.actor.stamina - this.requiredStamina, 0);
  }
}

class PunchAction implements FighterAction {
  actor: Fighter;

  target: Fighter;

  isCompleted = false;

  isSucceeded = false;

  requiredStamina = 20;

  constructor(actor: Fighter, target: Fighter) {
    this.actor = actor;
    this.target = target;
    const distance = calculateDistance(this.actor, this.target);
    if (distance <= Fighter.armLength) {
      this.isSucceeded = true;
    }
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
      this.actor.direction = vector2 || this.actor.direction;
    }
    this.actor.stamina = Math.max(this.actor.stamina - this.requiredStamina, 0);
    this.isCompleted = true;
  }
}

class PickUpAction implements FighterAction {
  actor: Fighter;

  target: Weapon;

  requiredStamina = 10;

  isFinished = false;

  constructor(actor: Fighter, target: Weapon) {
    this.actor = actor;
    this.target = target;
  }

  tick() {
    if (this.actor.stamina <= 0 || this.isFinished) return;
    const distance = calculateDistance(this.actor, this.target);
    if (distance <= Fighter.armLength) {
      this.actor.weapon = this.target;
      this.target.isPickedUp = true;
      const vector2 = normalizeVector2({
        x: this.target.location.x - this.actor.location.x,
        y: this.target.location.y - this.actor.location.y,
      });
      this.actor.direction = vector2 || this.actor.direction;
    }
    this.actor.stamina = Math.max(this.actor.stamina - this.requiredStamina, 0);
    this.isFinished = true;
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
          x: this.actor.location.x + (vector ? vector.x : 0),
          y: this.actor.location.y + (vector ? vector.y : 0),
        },
        { x: 10, y: 20 },
        vector || this.actor.direction,
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
      this.actor.direction =
        normalizeVector2({
          x: this.target.x - this.actor.location.x,
          y: this.target.y - this.actor.location.y,
        }) || this.actor.direction;
    }
    this.actor.stamina = Math.max(this.actor.stamina - this.requiredStamina, 0);
    this.isCompleted = true;
  }
}

export {
  FighterAction,
  WalkToAction,
  RunToAction,
  PunchAction,
  PickUpAction,
  UseWeaponAction,
};
