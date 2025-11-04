import { createServer } from "node:http";
import { Server } from "socket.io";
import { readTheFile, writeToFile } from "./core/utils";
import { GameState, State as initGameState } from "./game/state";

const httpServer = createServer();
export const io = new Server(httpServer);

io.on("connection", async (socket) => {
  console.log(socket.id + " connected");

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
    });

    await writeToFile("state", State);
  }

  const playersCount = State.players.length;
  if (playersCount < 2) {
    console.log("Waiting for the second player.");
    return;
  }

  io.emit("playing:first", State);

  // disconnect
  socket.on("disconnect", () => {
    console.log(socket.id, " disconnected");
  });
});

httpServer.listen(8080, () => {
  console.log("Server running at port 8080");
});
