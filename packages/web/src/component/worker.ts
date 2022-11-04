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
  firingRange: number;
  attackRange: number;
  speed: number;
  reloadFrame: number;
  staminaRequired: number;
}

type JsonMessage = {
  type: string;
  target: Vector2 | Entity;
};

let player: Fighter;
let enemies: Fighter[];
let portions: Portion[];

onmessage = (e: MessageEvent<string>) => {
  try {
    // eslint-disable-next-line no-eval
    eval(e.data) as void;
  } catch (error) {
    const done = () => null;
    done();
  }
};

function walkTo(target: Vector2 | Entity) {
  if ("x" in target) {
    const message: JsonMessage = { type: "walkTo", target };
    postMessage(JSON.stringify(message));
  } else {
    const message: JsonMessage = {
      type: "walkTo",
      target: { x: target.location.x, y: target.location.y },
    };
    postMessage(JSON.stringify(message));
  }
  throw new Error();
}

function runTo(target: Vector2 | Entity) {
  if ("x" in target) {
    const message: JsonMessage = { type: "runTo", target };
    postMessage(JSON.stringify(message));
  } else {
    const message: JsonMessage = {
      type: "runTo",
      target: { x: target.location.x, y: target.location.y },
    };
    postMessage(JSON.stringify(message));
  }
  throw new Error();
}

function punch(target: Fighter) {
  const message: JsonMessage = {
    type: "punch",
    target,
  };
  postMessage(JSON.stringify(message));
}

function calculateDistance(thing: Entity, destination: Vector2 | Entity) {
  if (!thing) throw new Error();
  if (!destination) throw new Error("destination is undefined");
  if ("x" in destination) {
    return Number(
      Math.sqrt(
        (destination.x - thing.location.x) ** 2 +
          (destination.y - thing.location.y) ** 2
      )
    );
  }
  return Number(
    Math.sqrt(
      (destination.location.x - thing.location.x) ** 2 +
        (destination.location.y - thing.location.y) ** 2
    )
  );
}

function getClosestEnemy() {
  if (!player) throw new Error();
  const closestEnemy = enemies.reduce(
    (previousEnemy: Fighter, currentEnemy: Fighter) => {
      const previousDistance = calculateDistance(
        player,
        previousEnemy.location
      );
      const currentDistance = calculateDistance(player, currentEnemy.location);
      return previousDistance < currentDistance ? previousEnemy : currentEnemy;
    }
  );
  return closestEnemy;
}

function getClosestPortion() {
  const closestPortion = portions.reduce(
    (previousPortion: Portion, currentPortion: Portion) => {
      const previousDistance = calculateDistance(
        player,
        previousPortion.location
      );
      const currentDistance = calculateDistance(
        player,
        currentPortion.location
      );
      return previousDistance < currentDistance
        ? previousPortion
        : currentPortion;
    }
  );
  return closestPortion;
}

// eslintのエラーを消すだけの式
walkTo.toString();
runTo.toString();
punch.toString();
getClosestEnemy.toString();
getClosestPortion.toString();
