import type { User } from "./component/Emulator";

export type Program = {
  userId: number;
  program: string;
};

export async function getUsers(): Promise<User[]> {
  const response = await fetch(`${import.meta.env["VITE_SERVER_ORIGIN"]}/user`);
  const json = await response.json();
  return json;
  // const array = new Array(10);
  // for (let i = 0; i < 10; i += 1) array[i] = i + 1;
  // return new Promise((resolve) => {
  //   setTimeout(
  //     () =>
  //       resolve(
  //         array.map((id) => ({
  //           id,
  //           name: `ユーザー${id}`,
  //           program: "",
  //           rank: 1,
  //         }))
  //       ),
  //     100
  //   );
  // });
}

export async function getUser(id: number): Promise<User> {
  const response = await fetch(
    `${import.meta.env["VITE_SERVER_ORIGIN"]}/user/${id}`
  );
  const json = await response.json();
  return json;
  // return new Promise((resolve) => {
  //   setTimeout(
  //     () => resolve({ id, name: `ユーザー${id}`, script: "", rank: 1 }),
  //     100
  //   );
  // });
}

export async function createUser(name: string): Promise<User> {
  const body = JSON.stringify({ name });
  const response = await fetch(
    `${import.meta.env["VITE_SERVER_ORIGIN"]}/user`,
    {
      method: "post",
      headers: { "Content-Type": "application/json" },
      body,
    }
  );
  if (response.status === 409) {
    throw new Error();
  } else {
    const json = await response.json();
    return json;
  }
  // return new Promise((resolve) => {
  //   setTimeout(() => resolve({ id: 1, name, program: "", rank: 1 }), 100);
  // });
}

export async function changeUserName(id: number, name: string) {
  const body = JSON.stringify({ name });
  const response = await fetch(
    `${import.meta.env["VITE_SERVER_ORIGIN"]}/user/${id}`,
    {
      method: "put",
      headers: { "Content-Type": "application/json" },
      body,
    }
  );
  if (response.status === 409) throw new Error();
}

export async function uploadProgram(program: Program) {
  const body = JSON.stringify(program);
  await fetch(`${import.meta.env["VITE_SERVER_ORIGIN"]}/program`, {
    method: "put",
    headers: { "Content-Type": "application/json" },
    body,
  });
}

export async function swapRank(userId1: number, userId2: number) {
  const body = JSON.stringify({ userId1, userId2 });
  await fetch(`${import.meta.env["VITE_SERVER_ORIGIN"]}/swap-rank`, {
    method: "post",
    headers: { "Content-Type": "application/json" },
    body,
  });
}
