import { io } from "socket.io-client";
import { exitProgram, handleInput } from "./core/io";
import { GameState } from "./types";

const clientSocket = io("http://localhost:8080");

clientSocket.on("exec:game", async (state: GameState) => {
  const player = state.players.find(
    (player) => player.socketId === clientSocket.id
  );

  if (player) {
    console.log("Rock Paper Scissors!!!");
    handleInput((key: string) => {
      if (key === "\u0003") {
        exitProgram();
      }

      clientSocket.emit("exec:update", { input: key, playerId: player.id });
    });
  }
});

clientSocket.on("render:log", (log: string) => {
  console.log(log);
});
