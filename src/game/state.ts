export type PlayerConfig = {
  choice: string | null;
  turn: boolean;
  socketId: string;
  name: string;
};

export type GameState = {
  players: PlayerConfig[];
};

export const State: GameState = {
  players: [],
};
