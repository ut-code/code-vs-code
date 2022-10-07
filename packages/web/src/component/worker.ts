onmessage = (e) => {
  // eslint-disable-next-line no-eval
  eval(e.data);
};

// eslint-disable-next-line @typescript-eslint/no-unused-vars
function moveTo(p: string, q: string) {
  postMessage(JSON.stringify({ type: "moveTo", param1: p, param2: q }));
  throw new Error();
}
