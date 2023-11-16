/* eslint-disable max-classes-per-file */
import type { Status, User } from "../Emulator";
// eslint-disable-next-line import/extensions, import/no-unresolved
import UserCodeRunnerWorker from "../worker.ts?worker&inline";
import {
  Result,
  Vector2,
  Entity,
  DataFromWorker,
  Fighter,
} from "./gameComponents";
import WorldRenderer from "./gameRenderer";
import {
  WalkToAction,
  RunToAction,
  PunchAction,
  PickUpAction,
  UseWeaponAction,
} from "./gameActions";
import World from "./gameWorld";

export default class Game {
  world: World;

  worldRenderer: WorldRenderer;

  isDestroyed = false;

  isEnded = false;

  isPaused = false;

  result?: Result;

  onCompleted?: (result: Result) => void;

  protected workers: Map<number, Worker>;

  protected nextWorkers: Map<number, Worker>;

  users: User[];

  onStatusesChanged: (statuses: Status[]) => void;

  constructor(
    users: User[],
    canvas: HTMLCanvasElement,
    onStatusesChanged: (statuses: Status[]) => void
  ) {
    this.users = users;
    this.onStatusesChanged = onStatusesChanged;
    this.world = new World(users);
    this.worldRenderer = new WorldRenderer(this.world, canvas);
    this.workers = this.createUserProgramRunnerWorkers();
    this.nextWorkers = this.createUserProgramRunnerWorkers();
    this.worldRenderer.run();
  }

  start() {
    let previousTime1 = Date.now();
    let previousTime2 = Date.now();
    let previousTime3 = Date.now();
    const startTime = Date.now();
    const callback = () => {
      if (this.isDestroyed || this.isEnded) return;
      const currentTime = Date.now();
      // ゲームが終わりか判断
      if (this.endConditionMet()) {
        this.end();
        return;
      }
      // worldクラスのメソッド実行
      this.world.manageValidPortions(currentTime - previousTime2);
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
        this.world.placeRandomPortion();
        this.world.placeRandomWeapon();
      }
      if (!this.isPaused) requestAnimationFrame(callback);
      previousTime2 = currentTime;
    };
    callback();
  }

  private endConditionMet() {
    // 例: プレイヤーが１人なら終了
    return this.world.fighters.length <= 1;
  }

  pause() {
    this.isPaused = true;
  }

  resume() {
    this.isPaused = false;
    this.start();
  }

  createUserProgramRunnerWorkers() {
    return new Map(
      this.world.fighters.map((fighter) => [
        fighter.id,
        new UserCodeRunnerWorker(),
      ])
    );
  }

  registerUserProgramResultHandlers() {
    for (const f of this.world.fighters) {
      const me = f;
      const worker = this.workers.get(f.id);
      if (!worker) throw new Error("Worker not found");
      worker.onmessage = (e: MessageEvent<string>) => {
        const data: DataFromWorker = JSON.parse(e.data);
        if (data.type === "walkTo") {
          me.action = new WalkToAction(me, data.target);
        }
        if (data.type === "runTo") {
          me.action = new RunToAction(me, data.target);
        }
        if (data.type === "punch") {
          const target = this.world.fighters.find(
            (fighter) => fighter.id === data.targetId
          );
          if (!target) throw new Error();
          me.action = new PunchAction(me, target);
        }
        if (data.type === "pickUp") {
          const target = this.world.weapons.find(
            (weapon) => weapon.id === data.targetId
          );
          if (!target) throw new Error();
          me.action = new PickUpAction(me, target);
        }
        if (data.type === "useWeapon") {
          me.action = new UseWeaponAction(me, data.target, this.world.bullets);
        }
      };
    }
  }

  sendProgramsToWorkers() {
    const { portions, weapons } = this.world;
    for (const me of this.world.fighters) {
      if (!me) throw new Error();
      const enemies: Fighter[] = this.world.fighters.filter(
        (fighter) => fighter !== me
      );
      const program = `player = ${JSON.stringify({
        location: me.location,
        HP: me.HP,
        id: me.id,
        speed: me.speed,
        stamina: me.stamina,
        armLength: Fighter.armLength,
        weapon: me.weapon
          ? {
              firingRange: me.weapon.firingRange,
              attackRange: me.weapon.bulletScale,
              speed: me.weapon.bulletSpeed,
              reloadFrame: me.weapon.reloadFrame,
              staminaRequired: me.weapon.requiredStamina,
              bulletsLeft: me.weapon.bulletsLeft,
            }
          : null,
      })}
          enemies = ${JSON.stringify(
            enemies.map((enemy) => {
              return {
                location: enemy.location,
                HP: enemy.HP,
                id: enemy.id,
                speed: enemy.speed,
                stamina: enemy.stamina,
                armLength: Fighter.armLength,
                weapon: {
                  firingRange: enemy.weapon?.firingRange,
                  attackRange: enemy.weapon?.bulletScale,
                  speed: enemy.weapon?.bulletSpeed,
                  reloadFrame: enemy.weapon?.reloadFrame,
                  requiredStamina: enemy.weapon?.requiredStamina,
                },
              };
            })
          )}
          portions = ${JSON.stringify(
            portions.map((portion) => {
              return {
                location: portion.location,
                type: portion.type,
                effect: portion.effect,
              };
            })
          )}
          weapons = ${JSON.stringify(
            weapons.map((weapon) => {
              return {
                id: weapon.id,
                location: weapon.location,
                firingRange: weapon.firingRange,
                bulletScale: weapon.bulletScale,
                speed: weapon.bulletSpeed,
                reloadFrame: weapon.reloadFrame,
                staminaRequired: weapon.requiredStamina,
                bulletsLeft: weapon.bulletsLeft,
              };
            })
          )}
          ${this.users.find((user) => user.id === me.id)?.program}`;
      this.workers.get(me.id)?.postMessage(program);
    }
  }

  end() {
    const losersCopy = this.world.losers.slice();
    const losersIds = losersCopy.reverse().map((fighter) => fighter.id);
    const winnersIds = this.world.fighters
      .sort((fighter1, fighter2) => fighter2.HP - fighter1.HP)
      .map((fighter) => fighter.id);
    const result: Result = winnersIds.concat(losersIds);
    this.result = result;
    this.world.clear();
    this.isEnded = true;
    this.onCompleted?.(this.result);
    this.worldRenderer.showResult(result, this.users);
  }

  destroy() {
    this.worldRenderer.destroy();
    for (const worker of this.workers.values()) {
      worker.terminate();
    }
    this.workers.clear();
    this.isDestroyed = true;
  }
}

export type { Vector2, Entity, Result, User };
