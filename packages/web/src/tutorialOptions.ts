import {
  PUNCH,
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
  CONSTANT,
  CUSTOM_IF,
  CUSTOM_IFELSE,
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

interface contents {
  kind: string;
  type: string;
}

// https://github.com/google/blockly/issues/6075
// eslint-disable-next-line @typescript-eslint/no-explicit-any
const tutorialOptions1: any = {
  toolbox: {
    kind: "categoryToolbox",
    contents: [
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
            type: CLOSEST_ENEMY,
          },
        ],
      },
      {
        kind: "category",
        name: "行動",
        contents: [
          {
            kind: "block",
            type: PUNCH,
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

const tutorialOptions2 = {
  ...tutorialOptions1,
  toolbox: {
    kind: "categoryToolbox",
    contents: [
      {
        kind: "category",
        name: "情報",
        contents: [
          ...tutorialOptions1.toolbox.contents.find(
            (category: { name: string }) => category.name === "情報"
          ).contents,
          {
            kind: "block",
            type: CONSTANT,
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
          // 他の新しいブロックを必要に応じて追加
        ],
      },
    ],
  },
};

const tutorialOptions3 = {
  ...tutorialOptions2,
  toolbox: {
    kind: "categoryToolbox",
    contents: [
      {
        kind: "category",
        name: "論理",
        contents: [
          {
            kind: "block",
            type: CUSTOM_IF,
          },
          {
            kind: "block",
            type: CUSTOM_IFELSE,
          },
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
        name: "数",
        contents: [
          {
            kind: "block",
            type: "math_number",
          },
          {
            kind: "block",
            type: DISTANCE,
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
        ],
      },
      ...tutorialOptions2.toolbox.contents,
    ],
  },
};

const tutorialOptions4 = {
  ...tutorialOptions3,
  toolbox: {
    contents: tutorialOptions3.toolbox.contents.map(
      (category: { name: string; contents: contents[] }) => {
        const updatedCategory = { ...category };
        if (category.name === "行動") {
          updatedCategory.contents = category.contents
            .filter((block) => block.type !== PUNCH)
            .concat([
              { kind: "block", type: USE_WEAPON },
              { kind: "block", type: PICK_UP },
            ]);
        }
        if (category.name === "情報") {
          updatedCategory.contents = category.contents.concat([
            { kind: "block", type: CLOSEST_WEAPON },
            { kind: "block", type: GET_PROPERTY_OF_FIGHTER },
            { kind: "block", type: WEAPONS },
          ]);
        }
        return updatedCategory;
      }
    ),
  },
};

const tutorialOptions5 = {
  ...tutorialOptions4,
  toolbox: {
    contents: tutorialOptions4.toolbox.contents.map(
      (category: { name: string; contents: contents[] }) => {
        const updatedCategory = { ...category };
        if (category.name === "情報") {
          updatedCategory.contents = category.contents.concat([
            { kind: "block", type: PORTIONS },
            { kind: "block", type: CLOSEST_PORTION },
          ]);
        }
        return updatedCategory;
      }
    ),
  },
};

export {
  tutorialOptions1,
  tutorialOptions2,
  tutorialOptions3,
  tutorialOptions4,
  tutorialOptions5,
};
