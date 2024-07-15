// main.ts

import client from "./client";
import viewResponse from "./src/utils/displayResponse";

const socket = client.getSocket();
socket.on("Authenticate", (result: any) => {
  if (result.success) {
    client.setUserDetails(result.user);
    client.setUserOptions(result.options);
    client.displayUserOptions(client.getUserOptions());
    const optionsLength = parseInt(result.options.length, 10);
    client.promptOptionSelection(optionsLength, client.getUserDetails().role);
  } else {
    console.log(
      "Authentication failed:",
      result.message,
      "Please Login Again!"
    );
    client.promptUserId();
  }
});

socket.on("Option Selection", async (response: any) => {
  if (response.type === "message") {
    console.log(response.message);
  } else if (response.type === "Item") {
    viewResponse(response.response);
  } else if (response.type === "list") {
    console.log(response.message);
  }
  await client.displayUserOptions(client.getUserOptions());
  await client.promptOptionSelection(
    client.getUserOptions().length,
    client.getUserDetails().role
  );
});
