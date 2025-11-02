import { io } from "socket.io-client";
import { PlayerConfig } from "./game/state";
import { rockPaperScissors } from "./game/logic";
import { update } from "./game/core";
import { handleInput } from "./core/io";

const clientSocket = io("ws://localhost:8080");

clientSocket.emit("chatMsg", "Hello Server");

clientSocket.on(
  "game:start",
  (args: { players: PlayerConfig[]; playerTurnId: number }) => {
    const { playerTurnId, players } = args;

    const player = players.find(
      (player) => player.socketId === clientSocket.id
    );

    if (player) {
      if (player.id !== playerTurnId) {
        console.log(player.name + " turn");
      } else {
        console.log("My turn");
        handleInput((key: string) => {
          update({ input: key, playerId: player.id });
        });
      }
    }
  }
);
