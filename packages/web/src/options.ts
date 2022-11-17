import {
  PUNCH,
  ENEMIES,
  GET_PROPERTY_OF_FIGHTER,
  PICK_UP,
  PLAYER,
  PORTIONS,
  RUN_TO,
  USE_WEAPON,
  MATH_VECTOR2,
  WALK_TO,
  WEAPONS,
  GET_PROPERTY_OF_PORTION,
  GET_PROPERTY_OF_WEAPON,
  DISTANCE,
  MINMAX,
  CLOSEST_ENEMY,
  CLOSEST_PORTION,
  CLOSEST_WEAPON,
  PORTION_KIND,
} from "./blocks";

const numberInput = (initialInput: number) => {
  return {
    shadow: {
      type: "math_number",
      fields: {
        NUM: initialInput,
      },
    },
  };
};

// https://github.com/google/blockly/issues/6075
// eslint-disable-next-line @typescript-eslint/no-explicit-any
const options: any = {
  toolbox: {
    kind: "categoryToolbox",
    contents: [
      {
        kind: "category",
        name: "論理",
        contents: [
          {
            kind: "block",
            type: "controls_if",
          },
          {
            kind: "block",
            type: "logic_compare",
          },
          {
            kind: "block",
            type: "logic_operation",
          },
          {
            kind: "block",
            type: "logic_negate",
          },
        ],
      },
      {
        kind: "category",
        name: "ループ",
        contents: [
          {
            kind: "block",
            type: "controls_repeat_ext",
            inputs: {
              TIMES: numberInput(10),
            },
          },
          {
            kind: "block",
            type: "controls_whileUntil",
          },
          {
            kind: "block",
            type: "controls_for",
            inputs: {
              FROM: numberInput(1),
              TO: numberInput(10),
              BY: numberInput(1),
            },
          },
          {
            kind: "block",
            type: "controls_forEach",
          },
          {
            kind: "block",
            type: "controls_flow_statements",
          },
        ],
      },
      {
        kind: "category",
        name: "数",
        contents: [
          {
            kind: "block",
            type: "math_number",
          },
          {
            kind: "block",
            type: "math_arithmetic",
            inputs: {
              A: numberInput(0),
              B: numberInput(0),
            },
          },
          {
            kind: "block",
            type: "math_modulo",
            inputs: {
              DIVIDEND: numberInput(0),
              DIVISOR: numberInput(0),
            },
          },
          {
            kind: "block",
            type: MINMAX,
            inputs: {
              A: numberInput(0),
              B: numberInput(0),
            },
          },
          {
            kind: "block",
            type: MATH_VECTOR2,
            inputs: {
              X: numberInput(0),
              Y: numberInput(0),
            },
          },
          {
            kind: "block",
            type: DISTANCE,
          },
          {
            kind: "block",
            type: "math_single",
            inputs: {
              NUM: numberInput(0),
            },
          },
          {
            kind: "block",
            type: "math_trig",
            inputs: {
              NUM: numberInput(0),
            },
          },
          {
            kind: "block",
            type: "math_constant",
          },
          {
            kind: "block",
            type: "math_random_int",
            inputs: {
              FROM: numberInput(1),
              TO: numberInput(10),
            },
          },
        ],
      },
      {
        kind: "category",
        name: "情報",
        contents: [
          {
            kind: "block",
            type: PLAYER,
          },
          {
            kind: "block",
            type: ENEMIES,
          },
          {
            kind: "block",
            type: PORTIONS,
          },
          {
            kind: "block",
            type: WEAPONS,
          },
          {
            kind: "block",
            type: GET_PROPERTY_OF_FIGHTER,
          },
          {
            kind: "block",
            type: GET_PROPERTY_OF_PORTION,
          },
          {
            kind: "block",
            type: GET_PROPERTY_OF_WEAPON,
          },
          {
            kind: "block",
            type: PORTION_KIND,
          },
          {
            kind: "block",
            type: CLOSEST_ENEMY,
          },
          {
            kind: "block",
            type: CLOSEST_PORTION,
          },
          {
            kind: "block",
            type: CLOSEST_WEAPON,
          },
        ],
      },
      {
        kind: "category",
        name: "行動",
        contents: [
          {
            kind: "block",
            type: WALK_TO,
          },
          {
            kind: "block",
            type: RUN_TO,
          },
          {
            kind: "block",
            type: PUNCH,
          },
          {
            kind: "block",
            type: USE_WEAPON,
          },
          {
            kind: "block",
            type: PICK_UP,
          },
        ],
      },
      {
        kind: "category",
        name: "変数",
        custom: "VARIABLE",
      },
      {
        kind: "category",
        name: "リスト",
        contents: [
          {
            kind: "block",
            type: "lists_create_with",
          },
          {
            kind: "block",
            type: "lists_repeat",
            inputs: {
              NUM: numberInput(5),
            },
          },
          {
            kind: "block",
            type: "lists_getIndex",
            inputs: {
              AT: numberInput(1),
            },
          },
          {
            kind: "block",
            type: "lists_setIndex",
            inputs: {
              AT: numberInput(1),
              TO: numberInput(0),
            },
          },
        ],
      },
      {
        kind: "category",
        name: "関数",
        custom: "PROCEDURE",
      },
    ],
  },
  grid: {
    spacing: 20,
    length: 3,
    colour: "#ccc",
    snap: true,
  },
  move: {
    wheel: true,
  },
  zoom: {
    controls: true,
  },
};

export default options;
