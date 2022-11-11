/* eslint-disable */
// イメージです

interface ベクトル2 {
  X: number;
  Y: number;
}

interface 存在 {
  場所: ベクトル2;
}

interface ファイター extends 存在 {
  HP: number;
  速度: ベクトル2; // 1 フレームの移動
  元気: number;
  所持武器: 武器 | null;
  残り武器リロードフレーム: number;
}

interface ポーション {
  種類: "スピードアップ" | "火力アップ";
  効果: number;
}

interface 武器 extends 存在 {
  射程: number;
  威力: number;
  弾の大きさ: number;
  弾速: number;
  リロードフレーム: number;
  消費元気: number;
}

declare const 自分: ファイター;
declare const 全ての敵: ファイター[];
declare const 落ちている全てのポーション: ポーション[];

// 定数
declare const 腕の長さ: number;

// 初心者向け
declare const いちばん近い敵: ファイター;

declare function aとbの距離(a: ベクトル2 | 存在, b: ベクトル2 | 存在): number;

// 意思決定
declare function xへ向かう(x: ベクトル2 | 存在); // 元気は減らない
declare function xへ走る(x: ベクトル2 | 存在); // -3 元気
declare function xを殴る(x: 存在);  // -1 元気
declare function xに対して武器を使う(x: ベクトル2 | 存在); // -x.消費元気 元気
declare function xを拾う(x: 武器);

// 低年齢の子に書いてもらいたい
for (const 敵 of 全ての敵) {
  if (aとbの距離(敵, 自分) < 腕の長さ) {
    xを殴る(敵);
  }
}
xへ向かう(いちばん近い敵);
