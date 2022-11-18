import { Box, LinearProgress } from "@mui/material";
import { useEffect, useState } from "react";
import { Navigate } from "react-router-dom";
import { usePromise } from "react-use";
import { useApiPasswordContext } from "../common/api-password";
import { getUsers, swapRank } from "../fetchAPI";
import ProjectorBattle from "./stages/Battle";
import ProjectorReady from "./stages/Ready";
import ProjectorResult from "./stages/Result";

const USER_COUNT_IN_LEAGUE = 4;

export type User = {
  id: number;
  name: string;
  program: string;
  rank: number;
};

export type LeagueUsers = [User, User, User, User];
export type LeagueUserIds = [number, number, number, number];

export type League = {
  id: number;
  users: LeagueUsers;
};

type ProjectorState =
  | { status: "INITIALIZING" }
  | { status: "READY"; league: League }
  | { status: "BATTLE"; league: League }
  | {
      status: "RESULT";
      league: League;
      rankSortedUserIds: LeagueUserIds;
      nextLeague: League;
    };

async function loadNextLeague(currentLeagueId: number): Promise<League> {
  const users = await getUsers().then((rawUsers) =>
    rawUsers
      .filter((user) => typeof user.program === "string")
      .sort((a, b) => a.rank - b.rank)
  );
  const nextLeagueId =
    users.length > (currentLeagueId + 1) * (USER_COUNT_IN_LEAGUE - 1) + 1
      ? currentLeagueId + 1
      : 0;

  // リーグに参加できない人のいないよう、下から数えて 4 人を参加させる
  const startRank =
    nextLeagueId !== 0
      ? Math.min(
          nextLeagueId * (USER_COUNT_IN_LEAGUE - 1),
          users.length - USER_COUNT_IN_LEAGUE
        )
      : 0;
  // max(User#rank) = users.length - 1
  const leagueUsers = users.slice(startRank, startRank + USER_COUNT_IN_LEAGUE);
  if (leagueUsers.length !== USER_COUNT_IN_LEAGUE)
    throw new Error("登録されているユーザーの数が足りません");

  return {
    id: nextLeagueId,
    /* eslint-disable @typescript-eslint/no-non-null-assertion */
    users: [leagueUsers[0]!, leagueUsers[1]!, leagueUsers[2]!, leagueUsers[3]!],
  };
}

async function saveBattleResult(
  leagueUsers: LeagueUsers,
  rankSortedUserIds: LeagueUserIds,
  password: string
) {
  let previousRankSortedUserIds = leagueUsers
    .slice()
    .sort((a, b) => a.rank - b.rank)
    .map((user) => user.id) as LeagueUserIds;

  // rankIndex = リーグ内順位
  for (const rankIndex of [0, 1, 2, 3] as const) {
    /** リーグ内で {@link rankIndex} 位になったユーザーの ID */
    const userId1 = rankSortedUserIds[rankIndex];
    /** ゲームが始まる前にリーグ内で {@link rankIndex} 位になったユーザーの ID */
    const userId2 = previousRankSortedUserIds[rankIndex];
    if (userId1 !== userId2) {
      // FIXME: 効率が悪い・不安定
      // eslint-disable-next-line no-await-in-loop
      await swapRank(userId1, userId2, password);

      // 順位の入れ替わりをシミュレーションする
      previousRankSortedUserIds = previousRankSortedUserIds.map((userId) => {
        if (userId === userId1) return userId2;
        if (userId === userId2) return userId1;
        return userId;
      }) as LeagueUserIds;
    }
  }
}

export default function Projector() {
  const [isLoading, setIsLoading] = useState(false);
  const [state, setState] = useState<ProjectorState>({
    status: "INITIALIZING",
  });
  const mounted = usePromise();

  const withLoadingIndicator = async <T,>(promise: Promise<T>): Promise<T> => {
    setIsLoading(true);
    const result = await promise;
    setIsLoading(false);
    return result;
  };

  useEffect(() => {
    mounted(loadNextLeague(-1)).then((league) =>
      setState({ status: "READY", league })
    );
  }, [mounted]);

  const { password } = useApiPasswordContext();
  if (!password) return <Navigate to="/" />;

  return (
    <Box
      sx={{
        height: "100%",
        fontFamily: "Noto Sans CJK JP, sans-serif",
        fontWeight: 1000,
      }}
    >
      {isLoading && (
        <LinearProgress
          sx={{ position: "absolute", top: 0, left: 0, width: "100%" }}
        />
      )}
      {state.status === "READY" && (
        <ProjectorReady
          league={state.league}
          onCompleted={() => {
            setState({ status: "BATTLE", league: state.league });
          }}
        />
      )}
      {state.status === "BATTLE" && (
        <ProjectorBattle
          league={state.league}
          onCompleted={async (rankSortedUserIds) => {
            const nextLeague = await withLoadingIndicator(
              mounted(
                saveBattleResult(
                  state.league.users,
                  rankSortedUserIds,
                  password
                ).then(() => loadNextLeague(state.league.id))
              )
            );
            setState({
              status: "RESULT",
              league: state.league,
              rankSortedUserIds,
              nextLeague,
            });
          }}
        />
      )}
      {state.status === "RESULT" && (
        <ProjectorResult
          league={state.league}
          rankSortedUserIds={state.rankSortedUserIds}
          nextLeague={state.nextLeague}
          onCompleted={() => {
            setState({ status: "READY", league: state.nextLeague });
          }}
        />
      )}
    </Box>
  );
}
