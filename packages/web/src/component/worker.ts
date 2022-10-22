/* eslint-disable @typescript-eslint/no-unused-vars */
import * as math from "mathjs";
import type { Entities, Entity, Vector2, Weapon } from "./game";

interface Status {
  location: Vector2;
  HP: number;
  speed: number;
  stamina: number;
  weapon: Weapon | null;
  direction: Vector2;
}

let id: number;
let players: Status[];
let entities: Entities;
let enemies: Status[];
let target: Entity | Vector2;

onmessage = (e) => {
  // eslint-disable-next-line no-eval
  eval(e.data);
};

// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-ignore
function moveTo(destination: Vector2 | Entity) {
  postMessage(JSON.stringify({ type: "moveTo", id, target }));
  throw new Error();
}

// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-ignore
function runTo(destination: Vector2 | Entity) {
  postMessage(JSON.stringify({ type: "runTo", id, target }));
  throw new Error();
}

// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-ignore
function calculateDistance(destination: Vector2 | Entity) {
  const player = players[id];
  if (!player) throw new Error("A player is undefined");
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
function getClosestEnemy() {
  const player = players[id];
  if (!player) throw new Error();
  const closestEnemy = enemies.reduce((previousEnemy, currentEnemy) => {
    const previousDistance = calculateDistance(previousEnemy.location);
    const currentDistance = calculateDistance(currentEnemy.location);
    return previousDistance < currentDistance ? previousEnemy : currentEnemy;
  });
  return closestEnemy;
}

// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-ignore
function getClosestPortion() {
  const closestPortion = entities.portions.reduce(
    (previousPortion, currentPortion) => {
      const previousDistance = calculateDistance(previousPortion.location);
      const currentDistance = calculateDistance(currentPortion.location);
      return previousDistance < currentDistance
        ? previousPortion
        : currentPortion;
    }
  );
  return closestPortion;
}
