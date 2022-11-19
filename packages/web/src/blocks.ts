import Blockly from "blockly";

const Number = "Number";
const Array = "Array";
const Boolean = "Boolean";
const Vector2D = "ベクトル2";
const Existence = "存在";
const Fighter = "ファイター";
const Portion = "ポーション";
const Weapon = "武器";
const ExistenceOrVector2D = [Existence, Fighter, Portion, Weapon, Vector2D];

// vector2D

export const MATH_VECTOR2 = "math_vector2";
export const X = "X";
export const Y = "Y";
Blockly.Blocks[MATH_VECTOR2] = {
  init(this: Blockly.Block) {
    this.appendValueInput(X).setCheck(Number).appendField("(");
    this.appendValueInput(Y).setCheck(Number).appendField(",");
    this.appendDummyInput().appendField(")");
    this.setOutput(true, Vector2D);
    this.setColour(230);
    this.setTooltip("座標・ベクトルです。");
  },
};
Blockly.JavaScript[MATH_VECTOR2] = (block: Blockly.Block) => [
  `{x: ${Blockly.JavaScript.valueToCode(
    block,
    X,
    Blockly.JavaScript.ORDER_COMMA
  )}, y: ${Blockly.JavaScript.valueToCode(
    block,
    Y,
    Blockly.JavaScript.ORDER_COMMA
  )}}`,
  Blockly.JavaScript.ORDER_MEMBER,
];

// オブジェクト

export const PLAYER = "player";
Blockly.Blocks[PLAYER] = {
  init(this: Blockly.Block) {
    this.appendDummyInput().appendField("自分");
    this.setOutput(true, Fighter);
    this.setColour(20);
    this.setTooltip("自分自身です。");
  },
};
Blockly.JavaScript[PLAYER] = () => [
  `${PLAYER}`,
  Blockly.JavaScript.ORDER_ATOMIC,
];

export const ENEMIES = "enemies";
Blockly.Blocks[ENEMIES] = {
  init(this: Blockly.Block) {
    this.appendDummyInput().appendField("敵リスト");
    this.setOutput(true, Array);
    this.setColour(20);
    this.setTooltip("敵のリストです。");
  },
};
Blockly.JavaScript[ENEMIES] = () => [
  `${ENEMIES}`,
  Blockly.JavaScript.ORDER_ATOMIC,
];

export const PORTIONS = "portions";
Blockly.Blocks[PORTIONS] = {
  init(this: Blockly.Block) {
    this.appendDummyInput().appendField("ポーションリスト");
    this.setOutput(true, Array);
    this.setColour(20);
    this.setTooltip("落ちているポーションのリストです。");
  },
};
Blockly.JavaScript[PORTIONS] = () => [
  `${PORTIONS}`,
  Blockly.JavaScript.ORDER_ATOMIC,
];

export const WEAPONS = "weapons";
Blockly.Blocks[WEAPONS] = {
  init(this: Blockly.Block) {
    this.appendDummyInput().appendField("武器リスト");
    this.setOutput(true, Array);
    this.setColour(20);
    this.setTooltip("落ちている武器のリストです。");
  },
};
Blockly.JavaScript[WEAPONS] = () => [
  `${WEAPONS}`,
  Blockly.JavaScript.ORDER_ATOMIC,
];

// プロパティ取得

const OBJECT = "object";
const PROPERTY_NAME = "property_name";

const FighterProperties = {
  HP: "HP",
  STAMINA: "stamina",
  SPEED: "speed",
  WEAPON: "bulletsLeft",
} as const;
export const GET_PROPERTY_OF_FIGHTER = "get_property_of_fighter";
Blockly.Blocks[GET_PROPERTY_OF_FIGHTER] = {
  init(this: Blockly.Block) {
    this.appendValueInput(OBJECT).setCheck(Fighter).appendField("ファイター:");
    this.appendDummyInput()
      .appendField("の")
      .appendField(
        new Blockly.FieldDropdown([
          ["HP", FighterProperties.HP],
          ["元気", FighterProperties.STAMINA],
          ["素早さ", FighterProperties.SPEED],
          ["武器残り弾数", FighterProperties.WEAPON],
        ]),
        PROPERTY_NAME
      );
    this.setOutput(true, Number);
    this.setColour(20);
    this.setTooltip("ファイターの現在のステータスを調べます。");
  },
};
Blockly.JavaScript[GET_PROPERTY_OF_FIGHTER] = (block: Blockly.Block) => [
  `${Blockly.JavaScript.valueToCode(
    block,
    OBJECT,
    Blockly.JavaScript.ORDER_MEMBER
  )}.${block.getFieldValue(PROPERTY_NAME)} ? ${Blockly.JavaScript.valueToCode(
    block,
    OBJECT,
    Blockly.JavaScript.ORDER_MEMBER
  )}.${block.getFieldValue(PROPERTY_NAME)} : 0`,
  Blockly.JavaScript.ORDER_CONDITIONAL,
];

// 意思決定

const TARGET = "target";

export const WALK_TO = "walkTo";
Blockly.Blocks[WALK_TO] = {
  init(this: Blockly.Block) {
    this.appendValueInput(TARGET).setCheck(ExistenceOrVector2D);
    this.appendDummyInput().appendField("へ向かう");
    this.setPreviousStatement(true, null);
    this.setColour(0);
    this.setTooltip("指定した位置に向かって移動します。");
  },
};
Blockly.JavaScript[WALK_TO] = (block: Blockly.Block) =>
  `${WALK_TO}(${Blockly.JavaScript.valueToCode(
    block,
    TARGET,
    Blockly.JavaScript.ORDER_NONE
  )});`;

export const RUN_TO = "runTo";
Blockly.Blocks[RUN_TO] = {
  init(this: Blockly.Block) {
    this.appendValueInput(TARGET).setCheck(ExistenceOrVector2D);
    this.appendDummyInput().appendField("へ走る");
    this.setPreviousStatement(true, null);
    this.setColour(0);
    this.setTooltip("指定した位置に向かって速く移動します。");
  },
};
Blockly.JavaScript[RUN_TO] = (block: Blockly.Block) =>
  `${RUN_TO}(${Blockly.JavaScript.valueToCode(
    block,
    TARGET,
    Blockly.JavaScript.ORDER_NONE
  )});`;

export const PUNCH = "punch";
Blockly.Blocks[PUNCH] = {
  init(this: Blockly.Block) {
    this.appendValueInput(TARGET).setCheck(Fighter);
    this.appendDummyInput().appendField("を殴る");
    this.setPreviousStatement(true, null);
    this.setColour(0);
    this.setTooltip("指定した相手が腕の長さの範囲にいる場合は攻撃します。");
  },
};
Blockly.JavaScript[PUNCH] = (block: Blockly.Block) =>
  `${PUNCH}(${Blockly.JavaScript.valueToCode(
    block,
    TARGET,
    Blockly.JavaScript.ORDER_NONE
  )});`;

export const USE_WEAPON = "useWeapon";
Blockly.Blocks[USE_WEAPON] = {
  init(this: Blockly.Block) {
    this.appendValueInput(TARGET).setCheck(ExistenceOrVector2D);
    this.appendDummyInput().appendField("に向けて武器を使う");
    this.setPreviousStatement(true, null);
    this.setColour(0);
    this.setTooltip("指定した位置の方向に向かって武器を使います。");
  },
};
Blockly.JavaScript[USE_WEAPON] = (block: Blockly.Block) =>
  `${USE_WEAPON}(${Blockly.JavaScript.valueToCode(
    block,
    TARGET,
    Blockly.JavaScript.ORDER_NONE
  )});`;

export const PICK_UP = "pickUp";
Blockly.Blocks[PICK_UP] = {
  init(this: Blockly.Block) {
    this.appendValueInput(TARGET).setCheck(Weapon);
    this.appendDummyInput().appendField("を拾う");
    this.setPreviousStatement(true, null);
    this.setColour(0);
    this.setTooltip("指定した武器が腕の長さの範囲内にある場合は拾います。");
  },
};
Blockly.JavaScript[PICK_UP] = (block: Blockly.Block) =>
  `${PICK_UP}(${Blockly.JavaScript.valueToCode(
    block,
    TARGET,
    Blockly.JavaScript.ORDER_NONE
  )});`;

// プリセット関数

export const DISTANCE = "distance";
Blockly.Blocks[DISTANCE] = {
  init(this: Blockly.Block) {
    this.appendValueInput("A").setCheck(ExistenceOrVector2D);
    this.appendValueInput("B").setCheck(ExistenceOrVector2D).appendField("と");
    this.appendDummyInput().appendField("の距離");
    this.setOutput(true, Number);
    this.setColour(230);
    this.setTooltip("2つのモノまたは位置の距離です。");
  },
};
Blockly.JavaScript[DISTANCE] = (block: Blockly.Block) => [
  `calculateDistance(${Blockly.JavaScript.valueToCode(
    block,
    "A",
    Blockly.JavaScript.ORDER_COMMA
  )},${Blockly.JavaScript.valueToCode(
    block,
    "B",
    Blockly.JavaScript.ORDER_COMMA
  )})`,
  Blockly.JavaScript.ORDER_FUNCTION_CALL,
];

export const MINMAX = "minmax";
const OPERATOR = "operator";
const MIN = "Math.min";
const MAX = "Math.max";
Blockly.Blocks[MINMAX] = {
  init(this: Blockly.Block) {
    this.appendValueInput("A").setCheck(Number);
    this.appendValueInput("B").setCheck(Number).appendField("と");
    this.appendDummyInput()
      .appendField("のうち")
      .appendField(
        new Blockly.FieldDropdown([
          ["小さい方", MIN],
          ["大きい方", MAX],
        ]),
        OPERATOR
      );
    this.setOutput(true, Number);
    this.setColour(230);
    this.setTooltip("2つの値のうち小さい方または大きい方を返します。");
  },
};
Blockly.JavaScript[MINMAX] = (block: Blockly.Block) => [
  `${block.getFieldValue(OPERATOR)}(${Blockly.JavaScript.valueToCode(
    block,
    "A",
    Blockly.JavaScript.ORDER_COMMA
  )},${Blockly.JavaScript.valueToCode(
    block,
    "B",
    Blockly.JavaScript.ORDER_COMMA
  )})`,
  Blockly.JavaScript.ORDER_FUNCTION_CALL,
];

export const CLOSEST_ENEMY = "closestEnemy";
Blockly.Blocks[CLOSEST_ENEMY] = {
  init(this: Blockly.Block) {
    this.appendDummyInput().appendField("最も近い敵");
    this.setOutput(true, Fighter);
    this.setColour(20);
    this.setTooltip("自分に最も近い敵です。");
  },
};
Blockly.JavaScript[CLOSEST_ENEMY] = () => [
  `getClosestEnemy()`,
  Blockly.JavaScript.ORDER_FUNCTION_CALL,
];

export const CLOSEST_PORTION = "closestPortion";
Blockly.Blocks[CLOSEST_PORTION] = {
  init(this: Blockly.Block) {
    this.appendDummyInput().appendField("最も近いポーション");
    this.setOutput(true, Portion);
    this.setColour(20);
    this.setTooltip("自分に最も近いポーションです。");
  },
};
Blockly.JavaScript[CLOSEST_PORTION] = () => [
  `getClosestPortion()`,
  Blockly.JavaScript.ORDER_FUNCTION_CALL,
];

export const CLOSEST_WEAPON = "closestWeapon";
Blockly.Blocks[CLOSEST_WEAPON] = {
  init(this: Blockly.Block) {
    this.appendDummyInput().appendField("最も近い武器");
    this.setOutput(true, Weapon);
    this.setColour(20);
    this.setTooltip("自分に最も近い武器です。");
  },
};
Blockly.JavaScript[CLOSEST_WEAPON] = () => [
  `getClosestWeapon()`,
  Blockly.JavaScript.ORDER_FUNCTION_CALL,
];

// 日本語訳がおかしい物の修正など
// while

const STATEMENT = "statement";
const CONDITION = "condition";

export const CUSTOM_WHILE = "custom_while";
Blockly.Blocks[CUSTOM_WHILE] = {
  init(this: Blockly.Block) {
    this.appendValueInput(CONDITION).setCheck(Boolean);
    this.appendDummyInput().appendField("の間ずっと");
    this.appendStatementInput(STATEMENT);
    this.setPreviousStatement(true, null);
    this.setNextStatement(true, null);
    this.setColour(120);
    this.setTooltip("条件が満たされている間、内部の文を繰り返し実行します。");
  },
};
Blockly.JavaScript[CUSTOM_WHILE] = (block: Blockly.Block) =>
  `while(${Blockly.JavaScript.valueToCode(
    block,
    CONDITION,
    Blockly.JavaScript.ORDER_NONE
  )}){${Blockly.JavaScript.statementToCode(block, STATEMENT)}};`;

// リスト関連

const LIST = "list";
const INDEX = "index";
const VALUE = "value";

export const CUSTOM_LISTS_LENGTH = "custom_lists_length";
Blockly.Blocks[CUSTOM_LISTS_LENGTH] = {
  init(this: Blockly.Block) {
    this.appendValueInput(LIST).setCheck(Array).appendField("リスト");
    this.appendDummyInput().appendField("の項目数");
    this.setOutput(true, Number);
    this.setColour(260);
    this.setTooltip("指定したリストの項目数です。");
  },
};
Blockly.JavaScript[CUSTOM_LISTS_LENGTH] = (block: Blockly.Block) => [
  `${Blockly.JavaScript.valueToCode(
    block,
    LIST,
    Blockly.JavaScript.ORDER_MEMBER
  )}.length`,
  Blockly.JavaScript.ORDER_ATOMIC,
];

export const CUSTOM_LISTS_GET_INDEX = "custom_lists_get_index";
Blockly.Blocks[CUSTOM_LISTS_GET_INDEX] = {
  init(this: Blockly.Block) {
    this.appendValueInput(LIST).setCheck(Array).appendField("リスト");
    this.appendValueInput(INDEX).setCheck(Number).appendField("の");
    this.appendDummyInput().appendField("番目の項目");
    this.setOutput(true, null);
    this.setColour(260);
    this.setTooltip("リストの指定した位置にある項目です。");
  },
};
Blockly.JavaScript[CUSTOM_LISTS_GET_INDEX] = (block: Blockly.Block) => [
  `${Blockly.JavaScript.valueToCode(
    block,
    LIST,
    Blockly.JavaScript.ORDER_MEMBER
  )}[${Blockly.JavaScript.valueToCode(
    block,
    INDEX,
    Blockly.JavaScript.ORDER_SUBTRACTION
  )}-1]`,
  Blockly.JavaScript.ORDER_ATOMIC,
];

export const CUSTOM_LISTS_SET_INDEX = "custom_lists_set_index";
Blockly.Blocks[CUSTOM_LISTS_SET_INDEX] = {
  init(this: Blockly.Block) {
    this.appendValueInput(LIST).setCheck(Array).appendField("リスト");
    this.appendValueInput(INDEX).setCheck(Number).appendField("の");
    this.appendValueInput(VALUE).appendField("番目の項目を");
    this.appendDummyInput().appendField("に変更");
    this.setPreviousStatement(true);
    this.setNextStatement(true);
    this.setColour(260);
    this.setTooltip("リストの指定した位置の項目を変更します。");
  },
};
Blockly.JavaScript[CUSTOM_LISTS_SET_INDEX] = (block: Blockly.Block) =>
  `${Blockly.JavaScript.valueToCode(
    block,
    LIST,
    Blockly.JavaScript.ORDER_MEMBER
  )}[${Blockly.JavaScript.valueToCode(
    block,
    INDEX,
    Blockly.JavaScript.ORDER_SUBTRACTION
  )}-1] = ${Blockly.JavaScript.valueToCode(
    block,
    VALUE,
    Blockly.JavaScript.ORDER_ASSIGNMENT
  )};`;

export const CUSTOM_LISTS_INSERT_INDEX = "custom_lists_insert_index";
Blockly.Blocks[CUSTOM_LISTS_INSERT_INDEX] = {
  init(this: Blockly.Block) {
    this.appendValueInput(LIST).setCheck(Array).appendField("リスト");
    this.appendValueInput(INDEX).setCheck(Number).appendField("の");
    this.appendValueInput(VALUE).appendField("番目の項目の後ろに");
    this.appendDummyInput().appendField("を挿入");
    this.setPreviousStatement(true);
    this.setNextStatement(true);
    this.setColour(260);
    this.setTooltip("リストの指定した位置に項目を挿入します。");
  },
};
Blockly.JavaScript[CUSTOM_LISTS_INSERT_INDEX] = (block: Blockly.Block) =>
  `${Blockly.JavaScript.valueToCode(
    block,
    LIST,
    Blockly.JavaScript.ORDER_MEMBER
  )}.splice(${Blockly.JavaScript.valueToCode(
    block,
    INDEX,
    Blockly.JavaScript.ORDER_COMMA
  )},0,${Blockly.JavaScript.valueToCode(
    block,
    VALUE,
    Blockly.JavaScript.ORDER_COMMA
  )};`;

export const CUSTOM_LISTS_DELETE_INDEX = "custom_lists_delete_index";
Blockly.Blocks[CUSTOM_LISTS_DELETE_INDEX] = {
  init(this: Blockly.Block) {
    this.appendValueInput(LIST).setCheck(Array).appendField("リスト");
    this.appendValueInput(INDEX).setCheck(Number).appendField("の");
    this.appendDummyInput().appendField("番目の項目を削除");
    this.setPreviousStatement(true);
    this.setNextStatement(true);
    this.setColour(260);
    this.setTooltip("リストの指定した位置の項目を削除します。");
  },
};
Blockly.JavaScript[CUSTOM_LISTS_DELETE_INDEX] = (block: Blockly.Block) =>
  `${Blockly.JavaScript.valueToCode(
    block,
    LIST,
    Blockly.JavaScript.ORDER_MEMBER
  )}.splice(${Blockly.JavaScript.valueToCode(
    block,
    INDEX,
    Blockly.JavaScript.ORDER_SUBTRACTION
  )}-1,1);`;

// デバッグ用
export const CONSOLE_LOG = "console_log";
Blockly.Blocks[CONSOLE_LOG] = {
  init(this: Blockly.Block) {
    this.appendValueInput(VALUE).appendField("console.log");
    this.setPreviousStatement(true);
    this.setNextStatement(true);
    this.setColour(160);
  },
};
Blockly.JavaScript[CONSOLE_LOG] = (block: Blockly.Block) =>
  `console.log(${Blockly.JavaScript.valueToCode(
    block,
    VALUE,
    Blockly.JavaScript.ORDER_NONE
  )});`;
