import { LinearProgress } from "@mui/material";
import { useEffect, useState } from "react";
import { getUsers } from "../fetchAPI";
import ProjectorBattle from "./stages/Battle";
import ProjectorReady from "./stages/Ready";
import ProjectorResult from "./stages/Result";

const USER_COUNT_IN_LEAGUE = 4;

export type User = {
  id: number;
  name: string;
  program: string;
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
  const users = await getUsers();
  users.sort((a, b) => a.rank - b.rank);
  const nextLeagueId =
    users.length > (currentLeagueId + 1) * USER_COUNT_IN_LEAGUE
      ? currentLeagueId + 1
      : 0;

  // リーグに参加できない人のいないよう、下から数えて 4 人を参加させる
  const startRank = Math.min(
    nextLeagueId * USER_COUNT_IN_LEAGUE,
    users.length - USER_COUNT_IN_LEAGUE
  );
  // max(User#rank) = users.length - 1
  const usersInLeague = users.slice(
    startRank,
    startRank + USER_COUNT_IN_LEAGUE
  );
  if (usersInLeague.length !== USER_COUNT_IN_LEAGUE)
    throw new Error("登録されているユーザーの数が足りません");

  return {
    id: currentLeagueId,
    // @ts-expect-error 現状の API 定義が古いのでエラー。直したらこのコメントを消してください。
    // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
    users: [users[0]!, users[1]!, users[2]!, users[3]!],
  };
}

export default function Projector() {
  const [isLoading, setIsLoading] = useState(false);
  const [state, setState] = useState<ProjectorState>({
    status: "INITIALIZING",
  });
  const withLoadingIndicator = async <T,>(promise: Promise<T>): Promise<T> => {
    setIsLoading(true);
    const result = await promise;
    setIsLoading(false);
    return result;
  };

  useEffect(() => {
    loadNextLeague(0).then((league) => setState({ status: "READY", league }));
  }, []);

  return (
    <>
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
              loadNextLeague(state.league.id)
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
    </>
  );
}
