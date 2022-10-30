/* eslint-disable @typescript-eslint/no-unused-vars */
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
  reloadFrame: number;
  staminaRequired: number;
}

onmessage = (e: MessageEvent<string>) => {
  try {
    // eslint-disable-next-line no-eval
    eval(e.data) as void;
  } catch (error) {
    console.log("action done");
  }
};

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

function runTo(target: Vector2 | Entity) {
  if ("x" in target) {
    postMessage(JSON.stringify({ type: "runTo", target }));
  } else {
    postMessage(
      JSON.stringify({
        type: "runTo",
        target: { x: target.location.x, y: target.location.y },
      })
    );
  }
  throw new Error();
}

function calculateDistance(player: Fighter, destination: Vector2 | Entity) {
  if (!player) throw new Error("A player is undefined");
  if (!destination) throw new Error("destination is undefined");
  if ("x" in destination) {
    return Number(
      Math.sqrt(
        (destination.x - player.location.x) ** 2 +
          (destination.y - player.location.y) ** 2
      )
    );
  }
  return Number(
    Math.sqrt(
      (destination.location.x - player.location.x) ** 2 +
        (destination.location.y - player.location.y) ** 2
    )
  );
}

function getClosestEnemy(player: Fighter, enemies: Fighter[]) {
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

function getClosestPortion(player: Fighter, portions: Portion[]) {
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
