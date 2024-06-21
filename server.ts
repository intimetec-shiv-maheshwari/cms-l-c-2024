import express from "express";
import { createServer } from "http";
import { Server, Socket } from "socket.io";
import * as mysql from "mysql2/promise";
import authService from "./src/service/authService";
import roleService from "./src/service/roleService";
import { User } from "./src/controller/userController";
// import { socket } from "./client";
import itemService from "./src/service/itemService";
import { Role } from "./src/interface/User";
import { Admin } from "./src/controller/adminController";
import { Chef } from "./src/controller/chefController";
import { Employee } from "./src/controller/employeeController";

// Create a connection pool
const pool = mysql.createPool({
  host: "localhost",
  user: "root",
  password: "root",
  database: "cafeteriams",
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0,
});
// Initialize Express and HTTP server
const app = express();
const httpServer = createServer(app);

// Initialize Socket.io server
const io = new Server(httpServer, {
  cors: {
    origin: "*",
    methods: ["GET", "POST"], // Allow all origins for development
  },
});
let noOfClients = 0;

io.on("connection", (socket: Socket) => {
  console.log("Client connected : ");
  io.emit("notification", "A new client has connected: " + socket.id);
  socket.on("message", (data) => {
    console.log(`Received from client: ${data}`);
    socket.emit("message", `Server received: ${data}`);
  });

  // Handle client disconnection
  socket.on("disconnect", () => {
    console.log("Client disconnected");
  });

  socket.on("Authenticate", async (userCredentials) => {
    const user = await authService.login(userCredentials);
    if (user instanceof User) {
      socket.emit("Authenticate", {
        success: true,
        user,
        options: user.getOptions(),
      });
      socket.on("Option selection", async (request) => {
        let response: any;
        if (request.payload) {
          console.log("here");
          response = await user.executeOption(
            request.selectedOption,
            request.payload
          );
          socket.emit("Option Selection", response);
        } else {
          response = await user.executeOption(request.selectedOption);
          socket.emit("Option Selection", response);
        }
      });
    } else {
      socket.emit("Authenticate", user);
    }
  });

  socket.on("Menu For Recommendation", async () => {
    const menu = await itemService.viewMenu();
    console.log(menu);
    socket.emit("Menu For Recommendation", menu);
  });
});

// Start the server
const PORT = 8080;
httpServer.listen(PORT, () => {
  console.log(`Server listening on port ${PORT}`);
});
