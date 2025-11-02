import { handleInput } from "../core/io";
import { State } from "./state";

export const gameObjects = ["rock", "paper", "scissors"] as const;

export const gameChoiceEmojiMap = {
  rock: "✊",
  paper: "✋",
  scissors: "✌️",
};

export const gameObjectsKeyMap = {
  r: "rock",
  p: "paper",
  s: "scissors",
};

export type PlayerChoice = (typeof gameObjects)[number] | (string & {});

export type GameChoiceAction = "crushes" | "cuts" | "covers" | (string & {});

export type GamePlayResult = {
  result: number;
  player2Choice: PlayerChoice;
  player2Action: GameChoiceAction;
};

export type GameChoiceEmojiKey = keyof typeof gameChoiceEmojiMap;

function getNpcChoice(gameObjects: any) {
  const randInd = Math.floor(Math.random() * gameObjects.length);
  const npcChoice = gameObjects[randInd];
  return npcChoice;
}

export function gamePlayResult(
  player1Choice: PlayerChoice,
  player2Choice: PlayerChoice
): GamePlayResult {
  if (player1Choice === player2Choice) {
    return { result: 0, player2Choice, player2Action: "" };
  }

  if (player1Choice === "rock") {
    switch (player2Choice) {
      case "paper":
        return { result: -1, player2Choice, player2Action: "covers" };
      default:
        // we handled same choice at the top. default will be scissors
        return { result: 1, player2Choice, player2Action: "" };
    }
  }
  if (player1Choice === "paper") {
    switch (player2Choice) {
      case "rock":
        return { result: 1, player2Choice, player2Action: "" };
      default:
        // we handled same choice at the top. default will be scissors
        return { result: -1, player2Choice, player2Action: "cuts" };
    }
  }

  if (player1Choice === "scissors") {
    switch (player2Choice) {
      case "paper":
        return { result: 1, player2Choice, player2Action: "" };
      default:
        // we handled same choice at the top. default will be rock
        return { result: -1, player2Choice, player2Action: "crushes" };
    }
  }

  return { result: 0, player2Choice: "", player2Action: "" };
}

export function renderResult(
  playerId: number,
  player1Choice: PlayerChoice,
  result: GamePlayResult
) {
  switch (result.result) {
    case 1:
      State.players.forEach((player) => {
        if (player.id === playerId) {
          player.wins++;
        }
      });
      return "You Win";
    case -1:
      State.players.forEach((player) => {
        if (player.id === playerId) {
          player.losses++;
        }
      });
      return `${
        gameChoiceEmojiMap[result.player2Choice as GameChoiceEmojiKey]
      } ${result.player2Action} ${
        gameChoiceEmojiMap[player1Choice as GameChoiceEmojiKey]
      }\nYou Lose`;
    default:
      State.players.forEach((player) => {
        if (player.id === playerId) {
          player.draws++;
        }
      });
      return "Draw";
  }
}

export function rockPaperScissors(playerId: number) {
  console.log("Rock, paper, scissors");
}
