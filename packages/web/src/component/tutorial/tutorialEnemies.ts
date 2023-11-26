import type { User } from "../Emulator";

const tutorial1Enemies: User[] = [
  {
    id: 1,
    name: "敵",
    program: ``,
    rank: 0,
  },
];

const tutorial2Enemies: User[] = [
  {
    id: 1,
    name: "敵",
    program: ``,
    rank: 0,
  },
];

const tutorial3Enemies: User[] = [
  {
    id: 1,
    name: "敵",
    program: ``,
    rank: 0,
  },
];

const tutorial4Enemies: User[] = [
  {
    id: 1,
    name: "敵",
    program: `if(calculateDistance(player,getClosestEnemy()) < 40){punch(getClosestEnemy());};`,
    rank: 0,
  },
];

const tutorial5Enemies: User[] = [
  {
    id: 1,
    name: "敵",
    // 最も近いポーションに向かう
    program: "walkTo(getClosestPortion());",
    /* program: "if(calculateDistance(player,getClosestEnemy()) < 40){  punch(getClosestEnemy());}else{walkTo(getClosestEnemy());};" , */
    rank: 0,
  },
];

const tutorialEnemies = [
  tutorial1Enemies,
  tutorial2Enemies,
  tutorial3Enemies,
  tutorial4Enemies,
  tutorial5Enemies,
];

export default tutorialEnemies;
