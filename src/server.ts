import { createServer } from "node:http";
import { Socket } from "./socket";
import { initGame } from "./game/init";

const httpServer = createServer();

const socketIO = Socket.getInstance();
socketIO.initialize(httpServer);

initGame(socketIO);

httpServer.listen(8080, () => {
  console.log("Server running at port 8080");
});
