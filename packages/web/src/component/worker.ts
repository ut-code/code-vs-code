/* eslint-disable @typescript-eslint/no-unused-vars */
import * as math from "mathjs";
import type { Vector2, Entity } from "./game";

interface Fighter extends Entity {
  HP: number;
  speed: number;
  stamina: number;
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
  ReloadFrame: number;
  staminaRequired: number;
}

onmessage = (e) => {
  // eslint-disable-next-line no-eval
  eval(e.data);
};

// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-ignore
function walkTo(target: Vector2 | Entity) {
  if ("x" in target) {
    postMessage(JSON.stringify({ type: "walkTo", target }));
  } else {
    postMessage(
      JSON.stringify({
        type: "walkTo",
        target: { x: target.location.x, y: target.location.y },
      })
    );
  }
  throw new Error();
}

// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-ignore
function runTo(target: Vector2 | Entity) {
  postMessage(JSON.stringify({ type: "runTo", destination: target }));
  throw new Error();
}

// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-ignore
function calculateDistance(player, destination: Vector2 | Entity) {
  if (!player) throw new Error("A player is undefined");
  if (!destination) throw new Error("destination is undefined");
  if ("x" in destination) {
    return Number(
      math.sqrt(
        (destination.x - player.location.x) ** 2 +
          (destination.y - player.location.y) ** 2
      )
    );
  }
  return Number(
    math.sqrt(
      (destination.location.x - player.location.x) ** 2 +
        (destination.location.y - player.location.y) ** 2
    )
  );
}

// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-ignore
function getClosestEnemy(player, enemies) {
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

// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-ignore
function getClosestPortion(player, portions) {
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
