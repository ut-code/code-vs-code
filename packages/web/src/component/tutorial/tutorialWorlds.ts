/* eslint-disable max-classes-per-file */
import World from "../game/gameWorld";
import type { User } from "../game/game";
import { Fighter } from "../game/gameComponents";

export class TutorialWorld extends World {
  override worldId = 1;

  constructor(users: User[]) {
    super(users);
    const user1 = users[0];
    const user2 = users[1];
    if (!user1 || !user2) throw new Error("id0があるかも");
    const player1 = new Fighter(user1.id, user1.name, { x: 381, y: 300 });
    const player2 = new Fighter(user2.id, user2.name, { x: 420, y: 300 });
    this.fighters = [player1, player2];
  }
}

export class TutorialWorld2 extends World {
  override worldId = 2;

  constructor(users: User[]) {
    super(users);
    const user1 = users[0];
    const user2 = users[1];
    if (!user1 || !user2) throw new Error("id0があるかも");
    const player1 = new Fighter(user1.id, user1.name, { x: 100, y: 300 });
    const player2 = new Fighter(user2.id, user2.name, { x: 700, y: 300 });
    this.fighters = [player1, player2];
  }
}

export class TutorialWorld3 extends World {
  override worldId = 3;

  constructor(users: User[]) {
    super(users);
    const user1 = users[0];
    const user2 = users[1];
    if (!user1 || !user2) throw new Error("id0があるかも");
    const player1 = new Fighter(user1.id, user1.name, { x: 100, y: 300 });
    const player2 = new Fighter(user2.id, user2.name, { x: 700, y: 300 });
    this.fighters = [player1, player2];
  }
}

export class TutorialWorld4 extends World {
  override worldId = 4;

  constructor(users: User[]) {
    super(users);
    const user1 = users[0];
    const user2 = users[1];
    if (!user1 || !user2) throw new Error("id0があるかも");
    const player1 = new Fighter(user1.id, user1.name, { x: 100, y: 300 });
    const player2 = new Fighter(user2.id, user2.name, { x: 700, y: 300 });
    this.fighters = [player1, player2];
  }
}
