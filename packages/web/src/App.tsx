import { useEffect, useRef, useState } from "react";
import Blockly from "blockly";
import Ja from "blockly/msg/ja";
import "./style.css";
import options from "./options";

Blockly.setLocale(Ja);
Blockly.HSV_SATURATION = 0.6;
Blockly.HSV_VALUE = 1;

function Injection() {
  const [code, setCode] = useState("");
  const workspaceDivRef = useRef<HTMLDivElement>(null);
  const workspaceRef = useRef<Blockly.WorkspaceSvg>();
  useEffect(() => {
    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
    // @ts-ignore
    const workspace = Blockly.inject(workspaceDivRef.current, options);
    workspaceRef.current = workspace;
    return () => {
      workspace.dispose();
    };
  }, []);

  return (
    <>
      <div ref={workspaceDivRef} />
      <button
        type="button"
        onClick={() => {
          setCode(Blockly.JavaScript.workspaceToCode(workspaceRef.current));
        }}
      >
        出力
      </button>
      {code}
    </>
  );
}

export default function App() {
  return <Injection />;
}
