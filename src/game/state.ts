import { GameChoiceAction } from "./logic";

export type ResultStatus = "win" | "loss" | "draw";

export type PlayerConfig = {
  id: number;
  choice: string | null;
  turn: boolean;
  socketId: string;
  name: string;
  wins: number;
  losses: number;
  draws: number;
  status: ResultStatus | null;
  action: GameChoiceAction | null;
};

export type GameState = {
  players: PlayerConfig[];
  allPlayed: number;
  result: { status: ResultStatus; playerId: number }[];
};

export const State: GameState = {
  players: [],
  allPlayed: 0,
  result: [],
};
