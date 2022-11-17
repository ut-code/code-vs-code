import Blockly from "blockly";

const modifyTranslation = () => {
  Blockly.Msg["CONTROLS_REPEAT_INPUT_DO"] = "";
  Blockly.Msg["CONTROLS_FOR_TITLE"] =
    "%1 を %2 から %3 まで %4 ずつ増やしながら";
  Blockly.Msg["CONTROLS_FLOW_STATEMENTS_OPERATOR_CONTINUE"] =
    "ループの次の処理へ移行";
  Blockly.Msg["CONTROLS_IF_TOOLTIP_1"] =
    "条件が満たされる場合、内部の文を実行します。";
  Blockly.Msg["CONTROLS_IF_TOOLTIP_2"] =
    "条件が満たされる場合は1番目の文を、満たされない場合は2番目の文を実行します。";
  Blockly.Msg["CONTROLS_IF_TOOLTIP_3"] =
    "最初の条件が満たされる場合は1番目の文を実行します。そうでなく2番目の条件が満たされる場合は2番目の文を実行します。";
  Blockly.Msg["CONTROLS_IF_TOOLTIP_4"] =
    "最初の条件が満たされる場合は1番目の文を実行します。そうでなく2番目の条件が満たされる場合は2番目の文を実行します。すべての条件が満たされない場合は、最後の文を実行します。";
  Blockly.Msg["CONTROLS_REPEAT_TOOLTIP"] =
    "内部の文を指定した回数繰り返します。";
  Blockly.Msg["CONTROLS_FOR_TOOLTIP"] =
    "変数 '%1' の値を変化させながら、内部の文を繰り返します。";
  Blockly.Msg["CONTROLS_FOREACH_TOOLTIP"] =
    "リストの各項目について、その項目を変数'%1'として、内部の文を実行します。";
  Blockly.Msg["MATH_CONSTANT_TOOLTIP"] =
    "次の定数のうちいずれかを返す: π (3.141…), e (2.718…), φ (1.618…), sqrt(2) (1.414…), sqrt(½) (0.707…), ∞ (無限)";
  Blockly.Msg["MATH_CHANGE_TOOLTIP"] = "変数'%1'に数を足します。";
  Blockly.Msg["VARIABLES_SET_TOOLTIP"] = "変数の値を入力した値に設定します。";
  Blockly.Msg["LISTS_LENGTH_TITLE"] = "%1の項目数";
  Blockly.Msg["LISTS_LENGTH_TOOLTIP"] = "リストの項目数を返します。";
  Blockly.Msg["LISTS_CREATE_WITH_TOOLTIP"] =
    "指定した項目でリストを作成します。";
  Blockly.Msg["LISTS_REPEAT_TOOLTIP"] =
    "与えた項目を指定した個数分持つリストを作成します。";
};

export default modifyTranslation;
