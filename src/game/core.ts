import { readTheFile, writeToFile } from "../core/utils";
import { Socket } from "../socket";
import { GameObjectsKey } from "../types";
import {
  gameChoiceEmojiMap,
  gameObjectsKeyMap,
  gamePlayResult,
  updateGameResult,
} from "./logic";
import { PlayerChoice, PlayerConfig, GameState } from "../types";

type Player = PlayerConfig | { [key: string]: any };
type GameChoice = keyof typeof gameChoiceEmojiMap;

export async function render(playerId: number) {
  const socketIO = Socket.getInstance();
  const io = socketIO.getIO();

  const State: GameState = await readTheFile("state");

  let you: Player = {};
  let opponent: Player = {};

  for (let player of State.players) {
    if (player.id === playerId) {
      you = player;
    } else {
      opponent = player;
    }
  }
  if (!you) {
    io.emit("render:log", "No players connected.");
    console.log("No players connected.");
    return;
  }

  const stat = you.status !== "draw" ? `You ${you?.status}` : you.status;

  let gameDetail: string = "";

  const yourChoice = gameObjectsKeyMap[you.choice as GameObjectsKey];

  const opponentChoice = gameObjectsKeyMap[opponent.choice as GameObjectsKey];

  if (you.status === "win") {
    gameDetail = `${yourChoice} ${you.action} ${opponentChoice}`;
  } else if (you.status === "loss") {
    gameDetail = `${opponentChoice} ${opponent.action} ${yourChoice}`;
  }

  io.emit("render:log", gameDetail);
  io.to(you.socketId).emit("render:log", stat);
  io.to(opponent.socketId).emit("render:log", `You ${opponent.status}`);
  io.emit("render:log", "\nRock Paper Scissors!!!");
}

export async function update(config: { input: string; playerId: number }) {
  const socketIO = Socket.getInstance();
  const io = socketIO.getIO();

  const { input, playerId } = config;

  const State: GameState = await readTheFile("state");
  const player = State.players[playerId - 1];

  if (!Object.keys(gameObjectsKeyMap).includes(input.toLowerCase())) {
    io.to(player.socketId).emit(
      "render:log",
      `Invalid Choices \nChoose 'r', 'p' or 's'`
    );

    return;
  }

  // run game
  let justPlayed = false;

  const played = State.players.find((player) => player.choice);

  let isPlayerTurn = player.turn;

  if (played && !isPlayerTurn && State.allPlayed < 2) {
    io.to(player.socketId).emit("render:log", `Wait for opponent to play next`);

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

  io.to(player.socketId).emit(
    "render:log",
    `You: ${choice + gameChoiceEmojiMap[choice as GameChoice]}`
  );

  isPlayerTurn = State.players[playerId - 1].turn;

  if (State.allPlayed < 2) {
    if (!justPlayed) {
      io.to(player.socketId).emit("render:log", `Wait for opponent to play`);
    }
    return;
  }

  const [player1Choice, player2Choice] = State.players.map((player) => {
    const playerChoice = gameObjectsKeyMap[
      player.choice as GameObjectsKey
    ] as PlayerChoice;
    return playerChoice;
  });

  const result = gamePlayResult(player1Choice, player2Choice);

  await updateGameResult(playerId, player1Choice, result);

  render(playerId);
  return;
}
