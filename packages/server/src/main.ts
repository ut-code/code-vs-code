import express from "express";
import cors from "cors";
import { PrismaClient } from "@prisma/client";

const app = express();
const client = new PrismaClient();

app.use(cors({ origin: process.env["WEB_ORIGIN"] }));

// 通信テスト
app.get("/", (_, res) => {
  res.json({ message: "success" });
});

// Userテーブルの作成
app.post("/user", async (request, response) => {
  await client.user.create({
    data: { name: request.body.name },
  });
  response.send();
});

// Userを全て取得
app.get("/user", async (_, response) => {
  const users = await client.user.findMany();
  response.json(users);
});

// 名前の変更
app.put("/user", async (request, response) => {
  await client.user.update({
    where: { id: request.body.id },
    data: { name: request.body.name },
  });
  response.send();
});

// プログラムの挿入とUserBattleIdentityの作成
app.put("/program", async (request, response) => {
  await client.userBattleIdentity.create({
    data: {
      user: client.user,
      program: request.body.program,
      league: 1,
    },
  });
  response.send();
});

app.listen(8081);
