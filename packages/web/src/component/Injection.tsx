import { useEffect, useRef } from "react";
import Blockly from "blockly";
// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-expect-error
import Ja from "blockly/msg/ja";
import "../style.css";
import { Box } from "@mui/material";
import modifyTranslation from "../modifyTranslation";

/* eslint-disable @typescript-eslint/no-explicit-any */
(Blockly as any).setLocale(Ja);
(Blockly as any).HSV_SATURATION = 0.6;
(Blockly as any).HSV_VALUE = 1;
/* eslint-enable @typescript-eslint/no-explicit-any */

export default function Injection(props: {
  workspaceRef: React.MutableRefObject<Blockly.WorkspaceSvg | undefined>;
  options: any;
}) {
  const { workspaceRef } = props;
  const workspaceDivRef = useRef<HTMLDivElement>(null);
  const { options } = props;
  useEffect(() => {
    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
    // @ts-ignore
    const workspace = Blockly.inject(workspaceDivRef.current, options);
    workspaceRef.current = workspace;
    modifyTranslation();
    return () => {
      workspace.dispose();
    };
  }, [workspaceRef, options]);

  return <Box ref={workspaceDivRef} sx={{ width: 1, height: 1 }} />;
}
