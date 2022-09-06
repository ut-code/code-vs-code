import { useEffect, useState } from "react";

export default function App() {
  const [message, setMessage] = useState("loading");

  useEffect(() => {
    (async () => {
      const response = await fetch(`${import.meta.env["VITE_SERVER_ORIGIN"]}/`);
      const data = await response.json();
      setMessage(data.message);
    })();
  }, []);

  return <p>{message}</p>;
}
