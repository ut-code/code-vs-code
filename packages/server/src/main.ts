import express from "express";
import cors from "cors";
import { PrismaClient } from "@prisma/client";

const app = express();
const client = new PrismaClient();

app.use(cors({ origin: process.env["WEB_ORIGIN"] }));

app.get("/", (_, res) => {
  res.json({ message: "success" });
});

app.put("/program", async (request, response) => {
  await client.userBattleIdentity.create({
    data: { program: request.body.program },
  });
  response.send();
});

app.listen(8081);
