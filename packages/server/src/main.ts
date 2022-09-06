import express from "express";
import cors from "cors";

const app = express();

app.use(cors({ origin: process.env["WEB_ORIGIN"] }));

app.get("/", (_, res) => {
  res.json({ message: "success" });
});

app.listen(8081);
