/* eslint-disable max-classes-per-file */
import Game from "../game/game";
import type { Result } from "../game/game";
import {
  TutorialWorld,
  TutorialWorld2,
  TutorialWorld3,
  TutorialWorld4,
} from "./tutorialWorlds";
import WorldRenderer from "../game/gameRenderer";
import type { User, Status } from "../Emulator";

class TutorialGame1 extends Game {
  constructor(
    users: User[],
    canvas: HTMLCanvasElement,
    onStatusesChanged: (statuses: Status[]) => void
  ) {
    super(users, canvas, onStatusesChanged);
    this.world = new TutorialWorld(users);
    this.worldRenderer = new WorldRenderer(this.world, canvas);
    this.workers = this.createUserProgramRunnerWorkers();
    this.nextWorkers = this.createUserProgramRunnerWorkers();
    this.worldRenderer.run();
  }

  override start() {
    let previousTime1 = Date.now();
    let previousTime2 = Date.now();
    const startTime = Date.now();
    const callback = () => {
      if (this.isDestroyed || this.isEnded) return;
      const currentTime = Date.now();
      // ゲームが終わりか判断
      if (this.EndConditionMet()) {
        this.end();
        return;
      }
      // worldクラスのメソッド実行
      this.world.runFightersAction(currentTime - previousTime2);
      this.world.detectCollision();
      this.world.removeDeadFighters();
      this.world.deleteBullets();
      this.world.moveBullets();
      // HP変化を伝える
      this.onStatusesChanged(
        this.world.fighters.map((fighter) => {
          return {
            id: fighter.id,
            HP: fighter.HP,
            stamina: fighter.stamina,
            speed: fighter.speed,
            weapon: fighter.weapon ? "ファイヤ" : "なし",
          };
        })
      );
      // タイムラグが必要な処理実行
      if (currentTime - previousTime1 >= 500) {
        previousTime1 = Date.now();
        for (const worker of this.workers.values()) {
          worker.terminate();
        }
        this.workers = this.nextWorkers;
        this.registerUserProgramResultHandlers();
        this.sendProgramsToWorkers();
        this.nextWorkers = this.createUserProgramRunnerWorkers();
      }
      if (currentTime - startTime >= 120000) {
        this.end();
      }
      if (!this.isPaused) requestAnimationFrame(callback);
      previousTime2 = currentTime;
    };
    callback();
  }

  EndConditionMet() {
    // カスタムの終了条件をここで定義する
    // プレイヤー1以外が死んだら終了
    for (const fighter of this.world.losers) {
      if (fighter.id !== 0) {
        return true;
      }
    }
    return false;
  }

  override end() {
    const result: Result = [0];
    this.result = result;
    this.world.clear();
    this.isEnded = true;
    this.onCompleted?.(this.result);
    this.worldRenderer.showResult(result, this.users);
  }
}

class TutorialGame2 extends TutorialGame1 {
  constructor(
    users: User[],
    canvas: HTMLCanvasElement,
    onStatusesChanged: (statuses: Status[]) => void
  ) {
    super(users, canvas, onStatusesChanged);
    this.world = new TutorialWorld2(users);
    this.worldRenderer = new WorldRenderer(this.world, canvas);
    this.workers = this.createUserProgramRunnerWorkers();
    this.nextWorkers = this.createUserProgramRunnerWorkers();
    this.worldRenderer.run();
  }

  override EndConditionMet() {
    // プレイヤー1とプレイヤー2の位置が重なったら終了
    const fighter1 = this.world.fighters[0];
    const fighter2 = this.world.fighters[1];
    if (!fighter1 || !fighter2) {
      return false;
    }
    const distance = Math.sqrt(
      (fighter1.location.x - fighter2.location.x) ** 2 +
        (fighter1.location.y - fighter2.location.y) ** 2
    );
    if (distance < 20) {
      return true;
    }
    return false;
  }
}

class TutorialGame3 extends TutorialGame1 {
  constructor(
    users: User[],
    canvas: HTMLCanvasElement,
    onStatusesChanged: (statuses: Status[]) => void
  ) {
    super(users, canvas, onStatusesChanged);
    this.world = new TutorialWorld3(users);
    this.worldRenderer = new WorldRenderer(this.world, canvas);
    this.workers = this.createUserProgramRunnerWorkers();
    this.nextWorkers = this.createUserProgramRunnerWorkers();
    this.worldRenderer.run();
  }
  // プレイヤー1以外が死んだら終了
}

class TutorialGame4 extends TutorialGame1 {
  constructor(
    users: User[],
    canvas: HTMLCanvasElement,
    onStatusesChanged: (statuses: Status[]) => void
  ) {
    super(users, canvas, onStatusesChanged);
    this.world = new TutorialWorld4(users);
    this.worldRenderer = new WorldRenderer(this.world, canvas);
    this.workers = this.createUserProgramRunnerWorkers();
    this.nextWorkers = this.createUserProgramRunnerWorkers();
    this.worldRenderer.run();
  }

  override start() {
    let previousTime1 = Date.now();
    let previousTime2 = Date.now();
    let previousTime3 = Date.now();
    const startTime = Date.now();
    const callback = () => {
      if (this.isDestroyed || this.isEnded) return;
      const currentTime = Date.now();
      // ゲームが終わりか判断
      if (this.EndConditionMet()) {
        this.end();
        return;
      }
      // worldクラスのメソッド実行
      this.world.runFightersAction(currentTime - previousTime2);
      this.world.detectCollision();
      this.world.removeDeadFighters();
      this.world.deleteWeaponsPickedUp();
      this.world.deleteBullets();
      this.world.moveBullets();
      // HP変化を伝える
      this.onStatusesChanged(
        this.world.fighters.map((fighter) => {
          return {
            id: fighter.id,
            HP: fighter.HP,
            stamina: fighter.stamina,
            speed: fighter.speed,
            weapon: fighter.weapon ? "ファイヤ" : "なし",
          };
        })
      );
      // タイムラグが必要な処理実行
      if (currentTime - previousTime1 >= 500) {
        previousTime1 = Date.now();
        for (const worker of this.workers.values()) {
          worker.terminate();
        }
        this.workers = this.nextWorkers;
        this.registerUserProgramResultHandlers();
        this.sendProgramsToWorkers();
        this.nextWorkers = this.createUserProgramRunnerWorkers();
      }
      if (currentTime - startTime >= 120000) {
        this.end();
      }
      if (currentTime - previousTime3 > 2000) {
        previousTime3 = Date.now();
        this.world.placeRandomWeapon();
      }
      if (!this.isPaused) requestAnimationFrame(callback);
      previousTime2 = currentTime;
    };
    callback();
  }

  override EndConditionMet() {
    // プレイヤー1以外が死んだかつプレイヤー1が武器を持っていたら終了
    for (const fighter of this.world.losers) {
      if (fighter.id !== 0) {
        if (this.world.fighters[0]?.weapon) {
          return true;
        }
      }
    }
    return false;
  }
}

const tutorialGames = [
  TutorialGame1,
  TutorialGame2,
  TutorialGame3,
  TutorialGame4,
];

export default tutorialGames;
