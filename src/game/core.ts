import { exitProgram, print } from "../core/io";
import { readTheFile, writeToFile } from "../core/utils";
import { io } from "../server";
import {
  gameObjectsKeyMap,
  gamePlayResult,
  PlayerChoice,
  updateGameResult,
} from "./logic";
import { GameState } from "./state";

export async function render() {
  const State = await readTheFile("state");
  print(State.result + "\n");
}

export async function update(config: { input: string; playerId: number }) {
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
  const played = State.players.find((player) => player.choice);
  let isPlayerTurn = State.players[playerId - 1].turn;
  if (played && !isPlayerTurn) {
    console.log("Wait for opponent to play next.");
    // io.emit("playing:next", State);
    return;
  }
  State.players[playerId - 1].choice = input;

  State.players.map((player) => {
    if (player.choice) {
      console.log("player choice ", player.choice);
      if (State.allPlayed === 2) {
        State.allPlayed = 0;
      }
      State.allPlayed++;
    }

    if (player.id !== playerId) {
      player.turn = true;
    } else {
      player.turn = false;
    }
  });

  await writeToFile("state", State);

  console.log(JSON.stringify(State, null, 2));

  isPlayerTurn = State.players[playerId - 1].turn;

  if (State.allPlayed < 2) {
    if (!isPlayerTurn) {
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

  console.log({ isPlayerTurn });

  // check player turn
  if (!isPlayerTurn) {
    console.log("Wait for opponent to choose.");
    return;
  }

  const result = gamePlayResult(player1Choice, player2Choice);

  State.result = await updateGameResult(playerId, player1Choice, result);

  render();
  return;
}
