/* eslint-disable */
// イメージです

interface Location {
  x: number;
  y: number;
}

interface GameObject {
  location: Location;
}

interface Fighter extends GameObject {
  hp: number;
}

interface Player extends Fighter {
  /** 3 つまで */
  weapons: Weapon[];

  walkTo(location: Location);
  attack(fighter: Fighter);
  useWeapon(weapon: Weapon);
}

interface Tool extends GameObject {
  type: "回復" | "スピードアップ" | "火力アップ";
  effectSize: number;
}

interface Weapon {
  range: number;
  damage: number;
}

declare const player: Player;
declare const enemies: Fighter[];
declare const tools: Tool[];

declare function getDistance(a: GameObject, b: GameObject): number;
