import { createServer } from "node:http";
import { readTheFile, writeToFile } from "./core/utils";
import { GameState, State as initGameState } from "./game/state";
import socket from "./socket";

const httpServer = createServer();

const { getIO, initSocket } = socket;
initSocket(httpServer);

const socketIO = getIO();

socketIO.on("connection", async (socket) => {
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

  const playersCount = State.players.length;
  if (playersCount < 2) {
    console.log("Waiting for the second player.");
    return;
  }

  socketIO.emit("playing:first", State);

  // io.emit("render:result", State);
});

httpServer.listen(8080, () => {
  console.log("Server running at port 8080");
});
