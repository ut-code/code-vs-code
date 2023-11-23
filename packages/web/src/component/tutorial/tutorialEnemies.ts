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

const tutorialEnemies = [
  tutorial1Enemies,
  tutorial2Enemies,
  tutorial3Enemies,
  tutorial4Enemies,
];

export default tutorialEnemies;
