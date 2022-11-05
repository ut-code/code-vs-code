import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App";
import EmulatorMock from "./component/mock";

interface User {
  name: string;
  id: number;
  script: string;
}

const users: User[] = [
  {
    name: "fooBarBaz",
    id: 0,
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
    name: "吾輩は猫",
    id: 1,
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
    name: "テスト",
    id: 2,
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
];

ReactDOM.createRoot(document.getElementById("root") as HTMLElement).render(
  <React.StrictMode>
    <App />
    <EmulatorMock users={users} />
  </React.StrictMode>
);
