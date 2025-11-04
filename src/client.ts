import { io } from "socket.io-client";
import { GameState } from "./game/state";
import { update } from "./game/core";
import { handleInput } from "./core/io";

const clientSocket = io("ws://localhost:8080");

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

clientSocket.on("playing:next", (state: GameState) => {
  console.log("playing:next");
  const player = state.players.find((player) => player.turn);
  if (!player) throw new Error("There is not player with turn");

  if (clientSocket.id === player.socketId) {
    handleInput((key: string) => {
      update({ input: key, playerId: player.id });
    });
  }
});
