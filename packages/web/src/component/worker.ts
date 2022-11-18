/* eslint-disable @typescript-eslint/no-unused-vars */
import type { Vector2, Entity } from "./game";

interface Fighter extends Entity {
  HP: number;
  id: number;
  speed: number;
  stamina: number;
  armLength: number;
  weapon: Weapon | null;
}
interface Portion extends Entity {
  type: "speedUp" | "attackUp";
  effect: number;
}

interface Weapon extends Entity {
  id: number;
  firingRange: number;
  bulletScale: number;
  speed: number;
  reloadFrame: number;
  staminaRequired: number;
  bulletsLeft: number;
}

type MessageToMainThread =
  | {
      type: "walkTo" | "runTo" | "useWeapon";
      target: Vector2;
    }
  | {
      type: "punch" | "pickUp";
      targetId: number;
    };

let player: Fighter;
let enemies: Fighter[];
let portions: Portion[];
let weapons: Weapon[];

onmessage = (e: MessageEvent<string>) => {
  try {
    // eslint-disable-next-line no-eval
    eval(e.data) as void;
  } catch (error) {
    const done = () => 1;
    done();
  }
};

function walkTo(target: Vector2 | Entity) {
  if ("x" in target) {
    const message: MessageToMainThread = { type: "walkTo", target };
    postMessage(JSON.stringify(message));
  } else {
    const message: MessageToMainThread = {
      type: "walkTo",
      target: { x: target.location.x, y: target.location.y },
    };
    postMessage(JSON.stringify(message));
  }
  throw new Error();
}

function runTo(target: Vector2 | Entity) {
  if ("x" in target) {
    const message: MessageToMainThread = { type: "runTo", target };
    postMessage(JSON.stringify(message));
  } else {
    const message: MessageToMainThread = {
      type: "runTo",
      target: { x: target.location.x, y: target.location.y },
    };
    postMessage(JSON.stringify(message));
  }
  throw new Error();
}

function punch(target: Fighter) {
  const message: MessageToMainThread = {
    type: "punch",
    targetId: target.id,
  };
  postMessage(JSON.stringify(message));
  throw new Error();
}

function pickUp(target: Weapon) {
  const message: MessageToMainThread = {
    type: "pickUp",
    targetId: target.id,
  };
  postMessage(JSON.stringify(message));
  throw new Error();
}

function useWeapon(target: Vector2 | Entity) {
  const message: MessageToMainThread =
    "x" in target
      ? {
          type: "useWeapon",
          target,
        }
      : {
          type: "useWeapon",
          target: { x: target.location.x, y: target.location.y },
        };
  postMessage(JSON.stringify(message));
  throw new Error();
}

function calculateDistance(
  thing: Vector2 | Entity,
  destination: Vector2 | Entity
) {
  const vector1 = "x" in thing ? thing : thing.location;
  const vector2 = "x" in destination ? destination : destination.location;
  return Math.sqrt((vector2.x - vector1.x) ** 2 + (vector2.y - vector1.y) ** 2);
}

function getClosestEnemy() {
  const closestEnemy = enemies.reduce((previousEnemy, currentEnemy) => {
    const previousDistance = calculateDistance(player, previousEnemy);
    const currentDistance = calculateDistance(player, currentEnemy);
    return previousDistance < currentDistance ? previousEnemy : currentEnemy;
  });
  return closestEnemy;
}

function getClosestPortion() {
  const closestPortion = portions.reduce((previousPortion, currentPortion) => {
    const previousDistance = calculateDistance(player, previousPortion);
    const currentDistance = calculateDistance(player, currentPortion);
    return previousDistance < currentDistance
      ? previousPortion
      : currentPortion;
  });
  return closestPortion;
}

function getClosestWeapon() {
  const closestWeapon = weapons.reduce((previousWeapon, currentWeapon) => {
    const previousDistance = calculateDistance(player, previousWeapon);
    const currentDistance = calculateDistance(player, currentWeapon);
    return previousDistance < currentDistance ? previousWeapon : currentWeapon;
  });
  return closestWeapon;
}

// eval 内部から使用されるシンボルが最適化で消されるのを防ぐ。
function dummy() {
  if (Math.random() < 0) {
    [
      player,
      enemies,
      portions,
      weapons,
      walkTo,
      runTo,
      punch,
      pickUp,
      useWeapon,
      getClosestEnemy,
      getClosestPortion,
      getClosestWeapon,
    ].forEach(
      // eslint-disable-next-line no-console
      console.log
    );
  }
}
dummy();
