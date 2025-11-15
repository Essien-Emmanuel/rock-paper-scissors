import { exitProgram, print } from "../core/io";
import { readTheFile, writeToFile } from "../core/utils";
import socket from "../socket";
import {
  gameObjectsKeyMap,
  gamePlayResult,
  PlayerChoice,
  updateGameResult,
} from "./logic";
import { GameState, PlayerConfig } from "./state";

export async function render(playerId: number) {
  const State: GameState = await readTheFile("state");

  let you: PlayerConfig | { [key: string]: any } = {};
  let opponent: PlayerConfig | { [key: string]: any } = {};

  for (let player of State.players) {
    if (player.id === playerId) {
      you = player;
    } else {
      opponent = player;
    }
  }
  if (!you) {
    console.log("No players connected.");
    return;
  }

  const stat = `You ${you?.status} \nOpponent ${opponent.status}`;

  print(stat + "\n\n");
}

export async function update(config: { input: string; playerId: number }) {
  const socketIO = socket.getIO();

  const { input, playerId } = config;
  if (input === "\u0003") {
    exitProgram();
  }

  if (!Object.keys(gameObjectsKeyMap).includes(input.toLowerCase())) {
    console.log("Invalid Choices \nChoose 'r', 'p' or 's'");
    return;
  }

  const State: GameState = await readTheFile("state");

  // run game
  let justPlayed = false;

  const played = State.players.find((player) => player.choice);

  let isPlayerTurn = State.players[playerId - 1].turn;

  if (played && !isPlayerTurn && State.allPlayed < 2) {
    console.log("Wait for opponent to play next.");
    return;
  }

  State.players[playerId - 1].choice = input;

  if (State.allPlayed === 2) {
    State.allPlayed = 0;
  }
  State.allPlayed++;

  State.players.map((player) => {
    if (State.allPlayed === 2) {
      player.turn = false;
    } else {
      if (player.id !== playerId) {
        player.turn = true;
      } else {
        player.turn = false;
      }
    }
  });

  justPlayed = true;

  await writeToFile("state", State, State.allPlayed);

  // show input
  const choice = gameObjectsKeyMap[input as keyof typeof gameObjectsKeyMap];

  console.log("YOU: ", choice);

  isPlayerTurn = State.players[playerId - 1].turn;

  if (State.allPlayed < 2) {
    if (!justPlayed) {
      console.log("Wait for opponent to play");
    }
    // io.emit("playing:next", State);
    return;
  }

  const [player1Choice, player2Choice] = State.players.map((player) => {
    const playerChoice = gameObjectsKeyMap[
      player.choice as keyof typeof gameObjectsKeyMap
    ] as PlayerChoice;
    return playerChoice;
  });

  const result = gamePlayResult(player1Choice, player2Choice);

  await updateGameResult(playerId, player1Choice, result);

  // render(playerId);
  console.log("before emit");
  socketIO.emit("render:result", State);
  return;
}
