/* eslint-disable max-classes-per-file */
import * as PIXI from "pixi.js";
import aircraftImage from "../../../resources/aircraft1.png";
import kinoko from "../../../resources/kinoko.png";
import explosion1 from "../../../resources/explosion1.png";
import explosion2 from "../../../resources/explosion2.png";
import explosion3 from "../../../resources/explosion3.png";
import explosion4 from "../../../resources/explosion4.png";
import explosion5 from "../../../resources/explosion5.png";
import explosion6 from "../../../resources/explosion6.png";
import explosion7 from "../../../resources/explosion7.png";
import explosion8 from "../../../resources/explosion8.png";
import itemFire from "../../../resources/itemFire.png";
import bulletFire from "../../../resources/bulletFire.png";
import type { User } from "../Emulator";
import type World from "./gameWorld";
import type {
  Fighter,
  Portion,
  Weapon,
  Bullet,
  Result,
} from "./gameComponents";
import { PunchAction } from "./gameActions";
import { MAX_HP, MAX_STAMINA } from "./gameComponents";

PIXI.settings.RESOLUTION = window.devicePixelRatio;

class FighterRenderer {
  fighter: Fighter;

  pixi: PIXI.Application;

  sprite: PIXI.Sprite;

  statusBarGraphics: PIXI.Graphics;

  userNameText: PIXI.Text;

  constructor(fighter: Fighter, pixi: PIXI.Application) {
    this.fighter = fighter;
    this.pixi = pixi;

    // 機体画像
    this.sprite = PIXI.Sprite.from(aircraftImage);
    this.sprite.width = this.fighter.size.x;
    this.sprite.height = this.fighter.size.y;
    this.sprite.anchor.set(0.5);
    this.sprite.x = this.fighter.location.x + this.fighter.size.x / 2;
    this.sprite.y = this.fighter.location.y + this.fighter.size.y / 2;
    pixi.stage.addChild(this.sprite);

    // HPバー・ステータスバー
    this.statusBarGraphics = new PIXI.Graphics();
    pixi.stage.addChild(this.statusBarGraphics);

    // ユーザー名
    this.userNameText = new PIXI.Text(`${this.fighter.name}`);
    this.userNameText.anchor.set(0.5);
    this.userNameText.position.set(
      this.fighter.location.x + this.fighter.size.x / 2,
      this.fighter.location.y - 25
    );
    this.userNameText.scale.set(0.8);
    pixi.stage.addChild(this.userNameText);
  }

  render(): void {
    // 機体画像
    this.sprite.position.set(
      this.fighter.location.x + this.fighter.size.x / 2,
      this.fighter.location.y + this.fighter.size.y / 2
    );
    const radian =
      Math.atan2(this.fighter.direction.y, this.fighter.direction.x) -
      Math.PI / 2;
    this.sprite.rotation = radian + Math.PI;

    // HPバー・スタミナバー
    this.statusBarGraphics.clear();
    this.statusBarGraphics.x = this.fighter.location.x;
    this.statusBarGraphics.y = this.fighter.location.y - 10;

    // HPバー
    this.statusBarGraphics.beginFill(0x00ff00);
    this.statusBarGraphics.drawRect(0, 0, (20 * this.fighter.HP) / MAX_HP, 2);

    // スタミナバー
    this.statusBarGraphics.beginFill(0xff0000);
    this.statusBarGraphics.drawRect(
      0,
      5,
      (20 * this.fighter.stamina) / MAX_STAMINA,
      2
    );

    this.statusBarGraphics.endFill();

    // ユーザー名
    this.userNameText.position.set(
      this.fighter.location.x + this.fighter.size.x / 2,
      this.fighter.location.y - 25
    );
  }

  destroy() {
    this.pixi.stage.removeChild(this.sprite);
    this.pixi.stage.removeChild(this.statusBarGraphics);
    this.pixi.stage.removeChild(this.userNameText);
  }
}

class PortionRenderer {
  portion: Portion;

  pixi: PIXI.Application;

  sprite: PIXI.Sprite = PIXI.Sprite.from(kinoko);

  constructor(portion: Portion, pixi: PIXI.Application) {
    this.portion = portion;
    this.pixi = pixi;
    this.sprite = PIXI.Sprite.from(kinoko);
    this.sprite.position.set(this.portion.location.x, this.portion.location.y);
    this.sprite.width = this.portion.size.x;
    this.sprite.height = this.portion.size.y;
    this.pixi.stage.addChild(this.sprite);
  }

  destroy() {
    this.pixi.stage.removeChild(this.sprite);
  }
}

class WeaponRenderer {
  weapon: Weapon;

  pixi: PIXI.Application;

  sprite: PIXI.Sprite;

  constructor(weapon: Weapon, pixi: PIXI.Application) {
    this.weapon = weapon;
    this.pixi = pixi;
    this.sprite = PIXI.Sprite.from(itemFire);
    this.sprite.position.set(this.weapon.location.x, this.weapon.location.y);
    this.sprite.width = this.weapon.size.x;
    this.sprite.height = this.weapon.size.y;
    this.pixi.stage.addChild(this.sprite);
  }

  destroy() {
    this.pixi.stage.removeChild(this.sprite);
  }
}

class BulletRenderer {
  bullet: Bullet;

  pixi: PIXI.Application;

  sprite: PIXI.Sprite;

  constructor(bullet: Bullet, pixi: PIXI.Application) {
    this.bullet = bullet;
    this.pixi = pixi;
    this.sprite = PIXI.Sprite.from(bulletFire);
    this.sprite.anchor.set(0.5);
    this.sprite.width = this.bullet.size.x;
    this.sprite.height = this.bullet.size.y;
    this.sprite.position.set(
      this.bullet.location.x + this.bullet.size.x,
      this.bullet.location.y + this.bullet.size.y
    );
    this.pixi.stage.addChild(this.sprite);
  }

  render() {
    this.sprite.position.set(this.bullet.location.x, this.bullet.location.y);
  }

  destroy() {
    this.pixi.stage.removeChild(this.sprite);
  }
}

class PunchEffectRenderer {
  punchAction: PunchAction;

  pixi: PIXI.Application;

  onCompleted?: () => void;

  static sprites: PIXI.Texture[] = [
    PIXI.Texture.from(explosion1),
    PIXI.Texture.from(explosion2),
    PIXI.Texture.from(explosion3),
    PIXI.Texture.from(explosion4),
    PIXI.Texture.from(explosion5),
    PIXI.Texture.from(explosion6),
    PIXI.Texture.from(explosion7),
    PIXI.Texture.from(explosion8),
  ];

  animatedSprite: PIXI.AnimatedSprite;

  constructor(punchAction: PunchAction, pixi: PIXI.Application) {
    this.punchAction = punchAction;
    this.pixi = pixi;
    this.animatedSprite = new PIXI.AnimatedSprite(PunchEffectRenderer.sprites);
    this.animatedSprite.anchor.set(0.5);
    this.animatedSprite.scale.set(0.5);
    this.animatedSprite.x = this.punchAction.target.location.x + 10;
    this.animatedSprite.y = this.punchAction.target.location.y + 10;
    this.animatedSprite.loop = false;
    this.animatedSprite.onComplete = () => {
      this.onCompleted?.();
    };
    this.pixi.stage.addChild(this.animatedSprite);
    this.animatedSprite.play();
  }

  destroy(): void {
    this.pixi.stage.removeChild(this.animatedSprite);
  }
}

class WorldRenderer {
  world: World;

  #pixi: PIXI.Application;

  fighterRenderers = new Map<Fighter, FighterRenderer>();

  portionRenderers = new Map<Portion, PortionRenderer>();

  weaponRenderers = new Map<Weapon, WeaponRenderer>();

  bulletRenderers = new Map<Bullet, BulletRenderer>();

  punchEffectRenderers = new Map<PunchAction, PunchEffectRenderer>();

  constructor(world: World, canvas: HTMLCanvasElement) {
    this.world = world;
    this.#pixi = new PIXI.Application({
      view: canvas,
      width: 800,
      height: 600,
      backgroundColor: 0xffffff,
    });
    for (const fighter of this.world.fighters) {
      this.fighterRenderers.set(
        fighter,
        new FighterRenderer(fighter, this.#pixi)
      );
    }
  }

  run() {
    this.#pixi.ticker.add(() => {
      this.render();
    });
  }

  render() {
    // ファイター
    const unusedFighterRenderers = new Set(this.fighterRenderers.values());
    for (const fighter of this.world.fighters) {
      const existingRenderer = this.fighterRenderers.get(fighter);
      if (!existingRenderer) {
        this.fighterRenderers.set(
          fighter,
          new FighterRenderer(fighter, this.#pixi)
        );
      } else {
        existingRenderer.render();
        unusedFighterRenderers.delete(existingRenderer);
      }
    }
    for (const renderer of unusedFighterRenderers) {
      renderer.destroy();
    }

    // ポーション
    const unusedPortionRenderers = new Set(this.portionRenderers.values());
    for (const portion of this.world.portions) {
      const existingRenderer = this.portionRenderers.get(portion);
      if (!existingRenderer) {
        this.portionRenderers.set(
          portion,
          new PortionRenderer(portion, this.#pixi)
        );
      } else {
        unusedPortionRenderers.delete(existingRenderer);
      }
    }
    for (const renderer of unusedPortionRenderers) {
      renderer.destroy();
    }

    // 武器
    const unusedWeaponRenderers = new Set(this.weaponRenderers.values());
    for (const weapon of this.world.weapons) {
      const existingRenderer = this.weaponRenderers.get(weapon);
      if (!existingRenderer) {
        this.weaponRenderers.set(
          weapon,
          new WeaponRenderer(weapon, this.#pixi)
        );
      } else {
        unusedWeaponRenderers.delete(existingRenderer);
      }
    }
    for (const renderer of unusedWeaponRenderers) {
      renderer.destroy();
    }

    // 弾
    const unusedBulletRenderers = new Set(this.bulletRenderers.values());
    for (const bullet of this.world.bullets) {
      const existingRenderer = this.bulletRenderers.get(bullet);
      if (!existingRenderer) {
        this.bulletRenderers.set(
          bullet,
          new BulletRenderer(bullet, this.#pixi)
        );
      } else {
        existingRenderer.render();
        unusedBulletRenderers.delete(existingRenderer);
      }
    }
    for (const renderer of unusedBulletRenderers) {
      renderer.destroy();
    }

    // エフェクト
    for (const fighter of this.world.fighters) {
      const { action } = fighter;
      if (action instanceof PunchAction) {
        const existingRenderer = this.punchEffectRenderers.get(action);
        if (!existingRenderer) {
          if (!action.isCompleted && action.isSucceeded) {
            const newRenderer = new PunchEffectRenderer(action, this.#pixi);
            this.punchEffectRenderers.set(action, newRenderer);
            newRenderer.onCompleted = () => {
              this.punchEffectRenderers.delete(action);
              newRenderer.destroy();
            };
          }
        }
      }
    }
  }

  showResult(result: Result, users: User[]) {
    if (result.length === 1) {
      const resultText = new PIXI.Text(`チュートリアルクリア！`, {
        fontFamily: "Arial",
        fontStyle: "italic",
      });
      resultText.anchor.set(0.5);
      resultText.position.set(400, 100);
      this.#pixi.stage.addChild(resultText);
    } else if (result.length > 1) {
      let rank = 1;
      for (const id of result) {
        const user = users.find((eachUser) => eachUser.id === id);
        if (!user) throw new Error();
        const resultText = new PIXI.Text(`${rank}位: ${user.name}`, {
          fontFamily: "Arial",
          fontStyle: "italic",
        });
        resultText.anchor.set(0.5);
        resultText.position.set(400, 100 * rank);
        this.#pixi.stage.addChild(resultText);
        rank += 1;
      }
    }
  }

  destroy() {
    this.#pixi.destroy();
  }
}

export default WorldRenderer;
