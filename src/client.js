import { io } from "socket.io-client";

const clientSocket = io("ws://localhost:8080");

clientSocket.emit("chatMsg", "Hello Server");
clientSocket.on("chatMsg", (arg) => {
  console.log("server: ", arg);
});
