import React, { useEffect, useRef, useState } from "react";
import Blockly from "blockly";
// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-expect-error
import Ja from "blockly/msg/ja";
import "./style.css";
import options from "./options";
import Emulator from "./component/Emulator";
import type { User } from "./component/game";

/* eslint-disable @typescript-eslint/no-explicit-any */
(Blockly as any).setLocale(Ja);
(Blockly as any).HSV_SATURATION = 0.6;
(Blockly as any).HSV_VALUE = 1;
/* eslint-enable @typescript-eslint/no-explicit-any */

function Injection(props: {
  setValue: React.Dispatch<React.SetStateAction<string>>;
  setIsGameActive: React.Dispatch<React.SetStateAction<boolean>>;
}) {
  const { setValue, setIsGameActive: setIsActive } = props;
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
  useEffect(() => {
    setValue(code);
  });

  return (
    <>
      <div ref={workspaceDivRef} />
      <button
        type="button"
        onClick={() => {
          setCode(Blockly.JavaScript.workspaceToCode(workspaceRef.current));
          setIsActive(true);
        }}
      >
        出力
      </button>
      {code}
    </>
  );
}

export default function App() {
  const [value, setValue] = useState("");
  const [isGameActive, setIsGameActive] = useState(false);
  const users: [User, User, User, User] = [
    {
      name: "fooBarBaz",
      id: 1,
      script: value,
    },
    {
      name: "吾輩は猫",
      id: 2,
      script: `let closestWeapon = weapons[0];
      if(player.weapon){
        let closestEnemy = enemies[0] 
      for ( const enemy of enemies ) {
        const previousDistance = calculateDistance( player, closestEnemy ); 
        const currentDistance = calculateDistance( player, enemy );
        if(previousDistance > currentDistance){closestEnemy = enemy}
      }
      if(calculateDistance(player, closestEnemy)<player.weapon.firingRange){
        useWeapon(closestEnemy)
      }else{walkTo(closestEnemy)}
      }
      else{
      for ( const weapon of weapons ) {
        const previousDistance = calculateDistance( player, closestWeapon ) 
        const currentDistance = calculateDistance( player, weapon );
        if(previousDistance > currentDistance){closestWeapon = weapon}
      }
      if(calculateDistance(player, closestWeapon)<player.armLength){
        pickUp(closestWeapon)
      }else{walkTo(closestWeapon)}
    }
    `,
    },
    {
      name: "テスト",
      id: 3,
      script: `let target = null; 
  let closestPortion = portions[0]; 
  for ( const portion of portions ) {
    const previousDistance = calculateDistance( player, closestPortion ); 
    const currentDistance = calculateDistance( player, portion );
    if(previousDistance > currentDistance){closestPortion = portion}
  } 
  target = closestPortion 
  walkTo(target)`,
    },
    {
      name: "UTC",
      id: 4,
      script: `let closestEnemy = enemies[0] 
      for ( const enemy of enemies ) {
        const previousDistance = calculateDistance( player, closestEnemy ); 
        const currentDistance = calculateDistance( player, enemy );
        if(previousDistance > currentDistance){closestEnemy = enemy}
      } 
        if(calculateDistance(player,closestEnemy)<player.armLength){
          punch(closestEnemy)
        }else{walkTo(closestEnemy)}`,
    },
  ];
  return (
    <>
      <Injection setValue={setValue} setIsGameActive={setIsGameActive} />
      {isGameActive && <Emulator users={users} />}
    </>
  );
}
