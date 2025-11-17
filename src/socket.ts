import { Server as HttpServer } from "node:http";
import { Server, Socket as ioSocket } from "socket.io";

let socketIO: Server;

// function initSocket(httpServer: HttpServer) {
//   socketIO = new Server(httpServer);
//   socketIO.on("connection", (socket) => {
//     console.log(`⚡: user${socket.id} connected!`);

//     socket.on("disconnect", () => {
//       socket.disconnect();
//       console.log(`🔥 user${socket.id} disconnected.`);
//     });
//   });
// }

// function _getIO() {
//   console.log("io => ", socketIO);
//   if (!socketIO) throw new Error("Socket io is uninitialized.");
//   return socketIO;
// }

export class Socket {
  public static instance: Socket;
  public io: Server | null;
  public socket: ioSocket | null;

  constructor() {
    this.io = null;
    this.socket = null;
  }

  static getInstance() {
    if (!Socket.instance) {
      console.log("new socket");
      this.instance = new Socket();
    }
    return this.instance;
  }

  initialize(httpServer: HttpServer) {
    this.io = new Server(httpServer, {
      cors: {
        origin: "*",
      },
    });

    this.io.on("connection", (socket) => {
      this.socket = socket;
      console.log(`⚡: user${socket.id} connected!`);

      socket.on("disconnect", () => {
        socket.disconnect();
        console.log(`🔥 user${socket.id} disconnected.`);
      });
    });
    return;
  }

  getIO() {
    if (!this.io) throw new Error("Socket io not initialized.");
    return this.io;
  }
}

// export default { _getIO, initSocket };
