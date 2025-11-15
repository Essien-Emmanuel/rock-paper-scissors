import { Server as HttpServer } from "node:http";
import { Server } from "socket.io";

let socketIO: Server;

function initSocket(httpServer: HttpServer) {
  socketIO = new Server(httpServer);
  socketIO.on("connection", (socket) => {
    console.log(`⚡: user${socket.id} connected!`);

    socket.on("disconnect", () => {
      socket.disconnect();
      console.log(`🔥 user${socket.id} disconnected.`);
    });
  });
}

function getIO() {
  if (!socketIO) throw new Error("Socket io is uninitialized.");
  return socketIO;
}

export default { getIO, initSocket };
