import express from "express";
import { createServer } from "http";
import { Server, Socket } from "socket.io";
import authService from "./src/service/authService";
import { User } from "./src/controller/userController";

import itemService from "./src/service/itemService";
import menuService from "./src/service/menuService";
import discardService from "./src/service/discardService";

const app = express();
const httpServer = createServer(app);

const io = new Server(httpServer, {
  cors: {
    origin: "*",
    methods: ["GET", "POST"], // Allow all origins for development
  },
});

io.on("connection", (socket: Socket) => {
  console.log("Client connected : ");
  io.emit("notification", "A new client has connected: ");
  socket.on("message", (data) => {
    socket.emit("message", `Server received: ${data}`);
  });

  // Handle client disconnection
  socket.on("disconnect", () => {
    console.log("Client disconnected");
  });

  socket.on("Authenticate", async (userCredentials) => {
    const user = await authService.login(userCredentials);
    if (user instanceof User) {
      console.log(user);
      socket.emit("Authenticate", {
        success: true,
        user,
        options: user.getOptions(),
      });
      socket.on("Option selection", async (request) => {
        let response: any;
        if (request.payload.body) {
          response = await user.executeOption(
            request.selectedOption,
            request.payload.body
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
    socket.emit("Menu For Recommendation", menu);
  });

  socket.on("Recommended Meal", async (userId: string) => {
    const response = await menuService.displayRecommendedMenu(userId);
    console.log(response);
    socket.emit("Recommended Meal", response);
  });

  socket.on("Get Recommended Meal Status", async () => {
    const response = await menuService.viewRecommendedMenuStatus();
    socket.emit("Get Recommended Meal Status", response);
  });

  socket.on("Get User Vote Status", async (userId: string) => {
    const response = await menuService.hasUserVoted(userId);
    socket.emit("Get User Vote Status", response);
  });

  socket.on("Get Final Menu", async () => {
    const response = await menuService.getFinalMenu();
  });

  socket.on("Get items for feedback", async (userId: string) => {
    const response = await menuService.getItemsForFeedback(userId);
    console.log("in server", response);
    socket.emit("Get items for feedback", response);
  });

  socket.on("Get Recommendation Status", async () => {
    const response = await menuService.checkRecommendationStatus();
    socket.emit("Get Recommendation Status", response);
  });

  socket.on("Check Menu Finalized", async () => {
    const response = await menuService.isMenuFinalized();
    socket.emit("Check Menu Finalized", response);
  });

  socket.on("View Low Rating Items", async () => {
    const response = await menuService.getLowRatingItems();
    socket.emit("View Low Rating Items", response);
  });

  socket.on("Check for usage history", async (actionType: number) => {
    const response = await discardService.checkForUsageHistory(actionType);
    socket.emit("Check for usage history", response);
  });

  socket.on(
    "Check User already provided detailed feedback",
    async (userId: string) => {
      const response = await discardService.checkForUserHistory(userId);
      socket.emit("Check User already provided detailed feedback", response);
    }
  );

  socket.on("Get Discard Item List", async () => {
    const response = await discardService.showDiscardItemList();
    console.log(response);
    socket.emit("Get Discard Item List", response);
  });
});

// Start the server
const PORT = 8080;
httpServer.listen(PORT, () => {
  console.log(`Server listening on port ${PORT}`);
});
