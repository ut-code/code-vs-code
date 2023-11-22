/* eslint-disable max-classes-per-file */
import type { User } from "../Emulator";
// eslint-disable-next-line import/extensions, import/no-unresolved
import {
  Vector2,
  Entity,
  Fighter,
  Portion,
  Weapon,
  Bullet,
  STAGE_HEIGHT,
  STAGE_WIDTH,
  MAX_STAMINA,
  calculateDistance,
} from "./gameComponents";

function isOverlap(entity1: Entity, entity2: Entity) {
  return (
    entity1.location.x + entity1.size.x > entity2.location.x &&
    entity1.location.x < entity2.location.x + entity2.size.x &&
    entity1.location.y + entity1.size.y > entity2.location.y &&
    entity1.location.y < entity2.location.y + entity2.size.y
  );
}

export default class World {
  fighters: Fighter[];

  portions: Portion[] = [];

  weapons: Weapon[] = [];

  bullets: Bullet[] = [];

  nextWeaponId = 1;

  losers: Fighter[] = [];

  constructor(users: User[]) {
    const user1 = users[0];
    const user2 = users[1];
    const user3 = users[2];
    const user4 = users[3];
    if (!user1 || !user2 || !user3 || !user4) throw new Error("id0があるかも");
    const player1 = new Fighter(user1.id, user1.name, { x: 100, y: 100 });
    const player2 = new Fighter(user2.id, user2.name, { x: 700, y: 100 });
    const player3 = new Fighter(user3.id, user3.name, { x: 100, y: 500 });
    const player4 = new Fighter(user4.id, user4.name, { x: 700, y: 500 });
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

  runFightersAction(delta: number) {
    for (const fighter of this.fighters) {
      // スタミナ回復
      if (fighter.stamina < MAX_STAMINA) fighter.stamina += 0.5;
      // スタミナ不足か判断後、アクションによってはスタミナ消費し実行
      if (!fighter.isShortOfStamina) {
        fighter.action?.tick(delta);
        if (fighter.stamina === 0) fighter.isShortOfStamina = true;
      } else if (fighter.stamina > MAX_STAMINA / 4) {
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
            fighter.validPortions.push({ timeLeft: 5000 });
          }
          fighter.speed = Math.min(fighter.speed + 0.5, 8);
        }
      }
    }

    // 壁との当たり判定
    for (const fighter of this.fighters) {
      fighter.location = {
        x: Math.min(
          Math.max(fighter.location.x, 0),
          STAGE_WIDTH - fighter.size.x
        ),
        y: Math.min(
          Math.max(fighter.location.y, 0),
          STAGE_HEIGHT - fighter.size.y
        ),
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
      if (calculateDistance(bullet, bullet.startLocation) > bullet.rangeLimit) {
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

  manageValidPortions(time: number) {
    for (const fighter of this.fighters) {
      for (const validPortion of fighter.validPortions) {
        validPortion.timeLeft -= time;
        if (validPortion.timeLeft <= 0) {
          fighter.validPortions.splice(
            fighter.validPortions.indexOf(validPortion),
            1
          );
          fighter.speed -= 0.5;
        }
      }
    }
  }

  getFighter() {
    return this.fighters;
  }
}
