import express from "express";
import cors from "cors";
import { PrismaClient } from "@prisma/client";

const app = express();
const client = new PrismaClient();

app.use(cors({ origin: process.env["WEB_ORIGIN"] }));
app.use(express.json());

// 通信テスト

app.get("/", (_, res) => {
  res.json({ message: "success" });
});

// Userの作成

type PostUserRequest = {
  name: string;
};

type PostUserResponse = {
  name: string;
};

app.post("/user", async (request, response) => {
  const requestBody: PostUserRequest = request.body;
  await client.user.create({
    data: { name: requestBody.name },
  });
  const responseBody: PostUserResponse = {
    name: requestBody.name,
  };
  response.json(responseBody);
});

// Userを全て取得

app.get("/user", async (_, response) => {
  const users = await client.user.findMany();
  response.json(users);
});

// 名前の変更

type PutUserParams = {
  id: number;
};

type PutUserRequest = {
  name: string;
};

app.put("/user/:userId([0-9]+)", async (request, response) => {
  const requestParams: PutUserParams = {
    id: Number(request.params["userId"]),
  };
  const requestBody: PutUserRequest = request.body;
  await client.user.update({
    where: { id: requestParams.id },
    data: { name: requestBody.name },
  });
  response.send();
});

// Get user by ID

type GetUserParams = {
  id: number;
};

app.get("/user/:userId([0-9]+)", async (request, response) => {
  const requestParams: GetUserParams = {
    id: Number(request.params["userId"]),
  };
  const user = await client.user.findUnique({
    where: { id: requestParams.id },
  });
  response.json(user);
});

// プログラムの挿入とUserBattleIdentityの作成

type PutProgramRequest = {
  userId: number;
  program: string;
};

app.put("/program", async (request, response) => {
  const requestBody: PutProgramRequest = request.body;
  const participantNumber = await client.userBattleIdentity.count();
  await client.userBattleIdentity.create({
    data: {
      userId: requestBody.userId,
      program: requestBody.program,
      league: Math.floor((participantNumber + 5) / 4), // 作成された順にリーグ番号が割り振られる
    },
  });
  response.send();
});

app.listen(8081);
