import { useEffect, useRef } from "react";
import Game from "./game";

interface User {
  username: string;
  id: number;
  script: string;
}

const scripts: string[] = [
  `let target = null; 
  let closestPortion = portions[0]; 
  for ( const portion of portions ) {
    const previousDistance = calculateDistance( player, closestPortion ); 
    const currentDistance = calculateDistance( player, portion );
    if(previousDistance > currentDistance){closestPortion = portion}
  } 
  target = closestPortion 
  walkTo(target)`,
  `let closestWeapon = weapons[0];
  for ( const weapon of weapons ) {
    const previousDistance = calculateDistance( player, closestWeapon ) 
    const currentDistance = calculateDistance( player, weapon );
    if(previousDistance > currentDistance){closestPortion = portion}
  }
  if(calculateDistance(player, closestWeapon)<player.armLength){
    pickUp(closestWeapon)
  }else{walkTo(closestWeapon)}`,
  `let target = null; 
  let closestPortion = portions[0]; 
  for ( const portion of portions ) {
    const previousDistance = calculateDistance( player, closestPortion ) 
    const currentDistance = calculateDistance( player, portion );
    if(previousDistance > currentDistance){closestPortion = portion}
  } 
    target = closestPortion 
    runTo(target)`,
  `let closestEnemy = enemies[0] 
  for ( const enemy of enemies ) {
    const previousDistance = calculateDistance( player, closestEnemy ); 
    const currentDistance = calculateDistance( player, enemy );
    if(previousDistance > currentDistance){closestEnemy = enemy}
  } 
    if(calculateDistance(player,closestEnemy)<player.armLength){
      punch(closestEnemy)
    }else{walkTo(closestEnemy)}`,
];

// とりあえずここではテストコードとしてusersを生成しています。
const users: User[] = scripts.map((script, index) => {
  return {
    id: index + 1,
    username: String(index),
    script,
  };
});

export default function Emulator() {
  const ref = useRef<HTMLCanvasElement>(null);
  useEffect(() => {
    if (!ref.current) throw new Error();
    const game = new Game(users, ref.current);
    return () => {
      game.destroy();
    };
  }, []);
  return <canvas ref={ref} style={{ border: "solid" }} />;
}
