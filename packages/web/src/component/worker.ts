/* eslint-disable @typescript-eslint/no-unused-vars */
import type PIXI from "pixi.js";
import type { Entity } from "./game";

onmessage = (e) => {
  // eslint-disable-next-line no-eval
  eval(e.data);
};

// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-ignore
function moveTo(
  p: number,
  q: PIXI.IPointData | Entity | "closestEnemy" | "closestPortion"
) {
  postMessage(JSON.stringify({ type: "moveTo", param1: p, param2: q }));
  throw new Error();
}

// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-ignore
function runTo(
  p: number,
  q: PIXI.IPointData | Entity | "closestEnemy" | "closestPortion"
) {
  postMessage(JSON.stringify({ type: "runTo", param1: p, param2: q }));
  throw new Error();
}
