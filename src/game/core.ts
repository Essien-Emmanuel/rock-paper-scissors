import { exitProgram, print } from "../core/io";
import {
  gameObjectsKeyMap,
  gamePlayResult,
  PlayerChoice,
  renderResult,
  rockPaperScissors,
} from "./logic";
import { State } from "./state";

export function render() {
  print(State.result + "\n");
}

export function update(config: { input: string; playerId: number }) {
  const { input, playerId } = config;
  if (input === "\u0003") {
    exitProgram;
  }

  // run game
  console.log("player ", playerId, State.players, State.players[playerId - 1]);
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

  State.result = renderResult(playerId, player1Choice, result);

  rockPaperScissors(playerId);
  render();
  return;
}
