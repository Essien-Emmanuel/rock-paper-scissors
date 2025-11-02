export type PlayerConfig = {
  id: number;
  choice: string | null;
  turn: boolean;
  socketId: string;
  name: string;
  wins: number;
  losses: number;
  draws: number;
};

export type GameState = {
  players: PlayerConfig[];
  allPlayed: boolean;
  result: string;
};

export const State: GameState = {
  players: [],
  allPlayed: false,
  result: "",
};
