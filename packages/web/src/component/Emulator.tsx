import { useEffect, useRef } from "react";
import Game from "./game";

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
  `let target = null; 
  let closestPortion = portions[0]; 
  for ( const portion of portions ) {
    const previousDistance = calculateDistance( player, closestPortion ) 
    const currentDistance = calculateDistance( player, portion );
    if(previousDistance > currentDistance){closestPortion = portion}
  } 
    target = closestPortion 
    walkTo(target)`,
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
    if(calculateDistance(player,closestEnemy)<=player.armLength){
      punch(closestEnemy)
    }else{runTo(closestEnemy)}`,
];

export default function Emulator() {
  const ref = useRef<HTMLCanvasElement>(null);
  useEffect(() => {
    if (!ref.current) throw new Error();
    const game = new Game(scripts, ref.current);
    return () => {
      game.destroy();
    };
  }, []);
  return <canvas ref={ref} style={{ border: "solid" }} />;
}
