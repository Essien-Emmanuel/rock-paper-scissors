import { createServer } from "node:http";
import { Server } from "socket.io";
import { State } from "./game/state";

const httpServer = createServer();
const io = new Server(httpServer);

io.on("connection", (socket) => {
  console.log(socket.id + " connected");
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
  }

  console.log(State);
  const playersCount = State.players.length;
  if (playersCount < 2) {
    console.log("Waiting for the second player.");
    return;
  }

  const playerTurnId = Math.random() > 0.5 ? 1 : 2;

  io.emit("game:start", {
    players: State.players,
    playerTurnId,
  });

  io.on("turn", (args: string) => {
    io.emit("turn", args);
  });

  // disconnect
  socket.on("disconnect", () => {
    console.log(socket.id, " disconnected");
  });
});

httpServer.listen(8080, () => {
  console.log("Server running at port 8080");
});
