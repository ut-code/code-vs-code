import { useEffect, useRef } from "react";
import Blockly from "blockly";
import "./style.css";

function Injection() {
  const workspaceRef = useRef<HTMLDivElement>(null);
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
    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
    // @ts-ignore
    const workspace = Blockly.inject(workspaceRef.current, { toolbox });
    return () => {
      workspace.dispose();
    };
  }, []);

  return <div ref={workspaceRef} />;
}

export default function App() {
  return <Injection />;
}
