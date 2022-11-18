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
  DISTANCE,
  MINMAX,
  CLOSEST_ENEMY,
  CLOSEST_PORTION,
  CLOSEST_WEAPON,
  CUSTOM_WHILE,
  CUSTOM_LISTS_GET_INDEX,
  CUSTOM_LISTS_SET_INDEX,
  CUSTOM_LISTS_INSERT_INDEX,
  CUSTOM_LISTS_DELETE_INDEX,
  CONSOLE_LOG,
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
            type: CUSTOM_WHILE,
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
            type: "lists_length",
          },
          {
            kind: "block",
            type: CUSTOM_LISTS_GET_INDEX,
            inputs: {
              index: numberInput(1),
            },
          },
          {
            kind: "block",
            type: CUSTOM_LISTS_SET_INDEX,
            inputs: {
              index: numberInput(1),
              value: numberInput(0),
            },
          },
          {
            kind: "block",
            type: CUSTOM_LISTS_INSERT_INDEX,
            inputs: {
              index: numberInput(1),
              value: numberInput(0),
            },
          },
          {
            kind: "block",
            type: CUSTOM_LISTS_DELETE_INDEX,
            inputs: {
              index: numberInput(1),
            },
          },
        ],
      },
      {
        kind: "category",
        name: "関数",
        custom: "PROCEDURE",
      },
      {
        kind: "category",
        name: "デバッグ",
        contents: [
          {
            kind: "block",
            type: CONSOLE_LOG,
          },
        ],
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
  renderer: "thrasos",
};

export default options;
