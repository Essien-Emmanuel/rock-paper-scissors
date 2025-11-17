import { io } from "socket.io-client";
import { GameState } from "./game/state";
import { render, update } from "./game/core";
import { handleInput } from "./core/io";

const clientSocket = io("http://localhost:8080");
// const clientSocket = io();

clientSocket.on("playing:first", async (state: GameState) => {
  console.log("playing:first");
  const player = state.players.find(
    (player) => player.socketId === clientSocket.id
  );

  if (player) {
    console.log("My turn");
    handleInput((key: string) => {
      update({ input: key, playerId: player.id });
    });
  }
});

clientSocket.on("render:result", (state: GameState) => {
  console.log("render:result");
  const player = state.players.find((player) => player.turn);
  console.log({ player });
  if (!player) throw new Error("There is not player with turn");

  if (clientSocket.id === player.socketId) {
    render(player.id);
  }
});
