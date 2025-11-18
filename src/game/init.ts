import { readTheFile, writeToFile } from "../core/utils";
import { State as initGameState } from "./state";
import { Socket } from "../socket";
import { update } from "./core";
import { GameState } from "../types";

export function initGame(socketIO: Socket) {
  socketIO.getIO().on("connection", async (socket) => {
    let State: GameState = await readTheFile("state");

    if (!State) {
      await writeToFile("state", initGameState);
      State = initGameState;
    }

    if (socket.id) {
      const playerId = State.players.length + 1;

      State.players.push({
        id: playerId,
        choice: null,
        turn: false,
        socketId: socket.id,
        name: `Player${playerId}`,
        wins: 0,
        losses: 0,
        draws: 0,
        status: null,
        action: null,
      });
      State.result = [];

      await writeToFile("state", State);
    }

    socket.on("exec:update", (arg: { input: string; playerId: number }) => {
      const { input, playerId } = arg;

      update({ input, playerId });
    });

    const playersCount = State.players.length;
    if (playersCount < 2) {
      socketIO.getIO().emit("render:log", "Wait for the second player...");
      return;
    }

    socketIO.getIO().emit("exec:game", State);
  });
}
