import {
  gameChoiceEmojiMap,
  gameObjects,
  gameObjectsKeyMap,
} from "../game/logic";

export type GameChoiceEmojiKey = keyof typeof gameChoiceEmojiMap;

export type GameObjectsKey = keyof typeof gameObjectsKeyMap;

export type PlayerChoice = (typeof gameObjects)[number] | (string & {});

export type GameChoiceAction = "crushes" | "cuts" | "covers" | (string & {});

export type GamePlayResult = {
  result: number;
  player1Action: GameChoiceAction;
  player2Choice: PlayerChoice;
  player2Action: GameChoiceAction;
};

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
