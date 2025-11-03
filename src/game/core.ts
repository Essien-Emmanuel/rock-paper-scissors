import { exitProgram, print } from "../core/io";
import { readTheFile } from "../core/utils";
import {
  gameObjectsKeyMap,
  gamePlayResult,
  PlayerChoice,
  renderResult,
  rockPaperScissors,
} from "./logic";
import { GameState } from "./state";

export async function render() {
  const State = await readTheFile("state");
  print(State.result + "\n");
}

export async function update(config: { input: string; playerId: number }) {
  const { input, playerId } = config;
  if (input === "\u0003") {
    exitProgram;
  }

  const State: GameState = await readTheFile("state");

  // run game
  State.players[playerId - 1].choice = input;

  if (!State.allPlayed) {
    return;
  }

  let isPlayerTurn = false;

  if (!Object.keys(gameObjectsKeyMap).includes(input.toLowerCase())) {
    console.log("Invalid Choices \nChoose 'r', 'p' or 's'");
    return;
  }

  const [player1Choice, player2Choice] = State.players.map((player) => {
    if (player.id === playerId && player.turn) {
      isPlayerTurn = true;
    }
    const playerChoice = gameObjectsKeyMap[
      player.choice as keyof typeof gameObjectsKeyMap
    ] as PlayerChoice;
    return playerChoice;
  });

  // check player turn
  if (!isPlayerTurn) {
    return;
  }

  const result = gamePlayResult(player1Choice, player2Choice);

  State.result = await renderResult(playerId, player1Choice, result);

  rockPaperScissors(playerId);
  render();
  return;
}
