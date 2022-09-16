import { useEffect } from "react";
import Blockly from "blockly";
import "./style.css";

function Injection() {
  useEffect(() => {
    const toolbox = {
      kind: "flyoutToolbox",
      contents: [
        {
          kind: "block",
          type: "controls_if",
        },
        {
          kind: "block",
          type: "controls_whileUntil",
        },
      ],
    };
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const workspace = Blockly.inject("blocklyDiv", { toolbox });
  }, []);

  return (
    <>
      <script src="node_modules/blockly/blockly_compressed.js" />
      <script src="node_modules/blocklyblocks_compressed.js" />
      <script src="node_modules/blocklymsg/js/ja.js" />
      <div id="blocklyDiv" />
    </>
  );
}

export default function App() {
  return <Injection />;
}
