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

type UserResponse = {
  id: number;
  name: string;
  program: string | undefined;
  league: number | undefined;
  rank: number | undefined;
};

app.post("/user", async (request, response) => {
  const requestBody: PostUserRequest = request.body;
  try {
    await client.user.create({
      data: { name: requestBody.name },
    });
    const newUser = await client.user.findUniqueOrThrow({
      where: { name: requestBody.name },
      include: {
        userIdentity: {
          select: {
            program: true,
            league: true,
            rank: true,
          },
        },
      },
    });
    const newUserResponse: UserResponse = {
      id: newUser.id,
      name: newUser.name,
      program: newUser.userIdentity?.program,
      league: newUser.userIdentity?.league,
      rank: newUser.userIdentity?.rank,
    };
    response.json(newUserResponse);
  } catch {
    response.status(409).send();
  }
});

// Userを全て取得

app.get("/user", async (_, response) => {
  const users = await client.user.findMany({
    include: {
      userIdentity: {
        select: {
          program: true,
          league: true,
          rank: true,
        },
      },
    },
  });
  const usersResponse = users.map((user) => {
    return {
      id: user.id,
      name: user.name,
      program: user.userIdentity?.program,
      league: user.userIdentity?.league,
      rank: user.userIdentity?.rank,
    };
  });
  response.json(usersResponse);
});

// 名前の変更

type PutUserParams = {
  userId: number;
};

type PutUserRequest = {
  name: string;
};

app.put("/user/:userId([0-9]+)", async (request, response) => {
  const requestParams: PutUserParams = {
    userId: Number(request.params["userId"]),
  };
  const requestBody: PutUserRequest = request.body;
  try {
    await client.user.update({
      where: { id: requestParams.userId },
      data: { name: requestBody.name },
    });
    response.send();
  } catch {
    response.status(409).send();
  }
});

// Get user by ID

type GetUserParams = {
  userId: string;
};

app.get("/user/:userId([0-9]+)", async (request, response) => {
  const requestParams = request.params as GetUserParams;
  const user = await client.user.findUniqueOrThrow({
    where: { id: Number(requestParams.userId) },
    include: {
      userIdentity: {
        select: {
          program: true,
          league: true,
          rank: true,
        },
      },
    },
  });
  const userResponse: UserResponse = {
    id: user.id,
    name: user.name,
    program: user.userIdentity?.program,
    league: user.userIdentity?.league,
    rank: user.userIdentity?.rank,
  };
  response.json(userResponse);
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
      rank: requestBody.userId, // ひとまずidと同じ番号を挿入
    },
  });
  response.send();
});

// 順位の入れ替え

type PostSwapRankRequest = {
  userId1: number;
  userId2: number;
};

app.post("/swap-rank", async (request, response) => {
  const requestBody: PostSwapRankRequest = request.body;
  const user1 = await client.userBattleIdentity.findUniqueOrThrow({
    where: { id: requestBody.userId1 },
  });
  const user2 = await client.userBattleIdentity.findUniqueOrThrow({
    where: { id: requestBody.userId2 },
  });
  await client.$transaction([
    client.userBattleIdentity.update({
      where: { id: requestBody.userId2 },
      data: {
        userId: user2.userId,
        program: user2.program,
        league: user2.league,
        rank: 0, // rankのuniqueを保つため
      },
    }),
    client.userBattleIdentity.update({
      where: { id: requestBody.userId1 },
      data: {
        userId: user1.userId,
        program: user1.program,
        league: user1.league,
        rank: user2.rank,
      },
    }),
    client.userBattleIdentity.update({
      where: { id: requestBody.userId2 },
      data: {
        userId: user2.userId,
        program: user2.program,
        league: user2.league,
        rank: user1.rank,
      },
    }),
  ]);
  response.send();
});

app.listen(8081);
