import { useEffect, useRef } from "react";
import Blockly from "blockly";
// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-expect-error
import Ja from "blockly/msg/ja";
import "../style.css";
import { Box } from "@mui/material";
import options from "../options";

/* eslint-disable @typescript-eslint/no-explicit-any */
(Blockly as any).setLocale(Ja);
(Blockly as any).HSV_SATURATION = 0.6;
(Blockly as any).HSV_VALUE = 1;
/* eslint-enable @typescript-eslint/no-explicit-any */

export default function Injection(props: {
  onProgramSubmitted: (code: string) => void;
}) {
  const { onProgramSubmitted } = props;
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
    <Box>
      <Box ref={workspaceDivRef} sx={{ width: 1, height: 1 }} />
      <button
        type="button"
        onClick={() => {
          onProgramSubmitted(
            Blockly.JavaScript.workspaceToCode(workspaceRef.current)
          );
        }}
      >
        出力
      </button>
    </Box>
  );
}
