// main.ts

import client from './client';
import viewResponse from "./src/utils/displayResponse";

// Use the socket instance from Client
const socket = client.getSocket();

socket.on("notification", (message: string) => {
  console.log("Notification from server: " + message);
});

socket.on("Authenticate", (result: any) => {
  console.log("Authenticate event received:", result);

  if (result.success) {
    client.setUserDetails(result.user);
    for (let i = 0; i < result.options.length; i++) {
      console.log(`${i + 1}. ${result.options[i]}`);
    }
    const optionsLength = parseInt(result.options.length, 10);
    client.promptOptionSelection(optionsLength, result.user.roleName);
  } else {
    console.log("Authentication failed:", result.message);
  }
});

socket.on("Option Selection", (response: any) => {
  if (response.type === "message") {
    console.log(response.message);
  } else if (response.type === "Item") {
    viewResponse(response.response);
  }
});

