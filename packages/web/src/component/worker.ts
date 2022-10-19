/* eslint-disable @typescript-eslint/no-unused-vars */
import * as math from "mathjs";
import type {
  Entities,
  Entity,
  Fighter,
  Portion,
  Vector2,
  Weapon,
} from "./game";

let id: number;
let players: Fighter[];
let portions: Portion[];
let weapons: Weapon[];
let entities: Entities;
let enemies: Fighter[];
let target: Entity | Vector2;

onmessage = (e) => {
  // eslint-disable-next-line no-eval
  eval(e.data);
};

// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-ignore
function moveTo(destination: Vector2 | Entity) {
  const player = players[id];
  if (!player) throw new Error("A player is undefined");
  player.moveTo(destination, entities);
  postMessage(JSON.stringify({ players, portions, weapons }));
  throw new Error();
}

// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-ignore
function runTo(destination: Vector2 | Entity) {
  const player = players[id];
  if (!player) throw new Error("A player is undefined");
  player.runTo(destination, entities);
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
