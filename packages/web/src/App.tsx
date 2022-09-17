import { useEffect } from "react";
import Blockly from "blockly";
import "./style.css";

function Injection() {
  useEffect(() => {
    // https://github.com/google/blockly/issues/6075
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const options: any = {
      toolbox: {
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
      },
    };
    const workspace = Blockly.inject("blocklyDiv", options);
    return () => {
      workspace.dispose();
    };
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
