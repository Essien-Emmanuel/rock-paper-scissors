import { createServer } from "node:http";
import { Server } from "socket.io";
import { State } from "./game/state.js";
import { rockPaperScissors } from "./game/logic";

const httpServer = createServer();
const io = new Server(httpServer);

io.on("connection", (socket) => {
  console.log(socket.id + " connected");
  if (socket.id) {
    State.players.push({
      choice: null,
      turn: false,
      socketId: socket.id,
      name: `Player${State.players.length + 1}`,
    });
  }
  rockPaperScissors();
  console.log(State);
  socket.emit("");

  // disconnect
  socket.on("disconnect", () => {
    console.log(socket.id, " disconnected");
  });
});

httpServer.listen(8080, () => {
  console.log("Server running at port 8080");
});
