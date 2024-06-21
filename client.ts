import { io } from "socket.io-client";
import * as readline from "readline";
import { Constants } from "./src/constants/appConstants";
import { exit } from "process";
import { AdminHandler } from "./src/ClientHandler/adminHandler";
import { getInput } from "./src/ClientHandler";
import { ChefHandler } from "./src/ClientHandler/chefHandler";
import { EmployeeHandler } from "./src/ClientHandler/employeeHandler";

const SERVER_URL = "http://localhost:8080";

// let rl = readline.createInterface({
//   input: process.stdin,
//   output: process.stdout,
// });

// Create a socket instance
const socket = io(SERVER_URL);

class Client {
  constructor() {
    socket.on("connect", () => {
      console.log("Connected to server");
      this.promptUserId();
    });
  }

  async promptUserId() {
    const userId = await getInput("Enter User ID: ");
    if (userId === Constants.EXIT) {
      exit();
    } else {
      this.promptPassword(userId);
    }
  }
  async promptPassword(userId: string) {
    const password = await getInput("Enter Password: ");
    if (password === Constants.EXIT) {
      exit();
    } else {
      this.processUserInput(userId, password);
    }
  }
  processUserInput(userId: string, password: string) {
    const userCredentials = {
      userId: userId,
      password: password,
    };
    socket.emit("Authenticate", userCredentials);
  }

  async promptOptionSelection(optionsLength: number, userRole: string) {
    const option = await getInput("Please select a option: ");
    if (option === Constants.EXIT) {
      exit();
    } else {
      const selectedOption = parseInt(option, 10);
      if (selectedOption <= 0 || selectedOption > optionsLength) {
        console.log("Please select a valid option!");
        await this.promptOptionSelection(optionsLength, userRole);
      } else {
        const payload = await this.handleRoleInputs(userRole, selectedOption);
        console.log("payload", payload);
        socket.emit("Option selection", { selectedOption, payload });
      }
    }
  }

  async handleRoleInputs(role: string, option: number) {
    let user: AdminHandler | ChefHandler;
    const nonPromptingOptions: { [key: string]: number[] } = {
      admin: [5],
      chef: [],
      employee: [],
    };

    switch (role) {
      case "admin":
        user = new AdminHandler(socket);
        break;
      case "chef":
        user = new ChefHandler(socket);
        break;
      case "employee":
        // user = new EmployeeHandler();
        break;
      default:
        throw new Error(`Unsupported role: ${role}`);
    }
    if (
      nonPromptingOptions[role] &&
      nonPromptingOptions[role].includes(option)
    ) {
      console.log("here");
      return null;
    } else {
      const requestPayload = await new Promise<any>(async (resolve) => {
        const payload = await user?.getOptionFunction(option).call(user);
        resolve(payload);
      });
      return requestPayload;
    }
  }

  async displayResponse(response: any) {
    if (response.length === 0) {
      console.log("No data to display.");
      return;
    }

    const keys = Object.keys(response[0]);
    const columnWidths = keys.map((key) =>
      Math.max(
        ...response.map((obj: { [x: string]: any }) => String(obj[key]).length),
        key.length
      )
    );

    const separatorLine =
      "+" + columnWidths.map((width) => "-".repeat(width + 2)).join("+") + "+";

    const header =
      "| " +
      keys.map((key, i) => key.padEnd(columnWidths[i])).join(" | ") +
      " |";

    console.log(separatorLine);
    console.log(header);
    console.log(separatorLine);

    response.forEach((obj: { [x: string]: any }) => {
      const row =
        "| " +
        keys
          .map((key, i) => String(obj[key]).padEnd(columnWidths[i]))
          .join(" | ") +
        " |";
      console.log(row);
    });

    console.log(separatorLine);
  }
}
let client = new Client();
socket.on("notification", (message: string) => {
  console.log("Notification from server: " + message);
});
socket.on("Authenticate", (result: any) => {
  console.log(result);
  if (result.success) {
    for (let i = 0; i < result.options.length; i++) {
      console.log(`${i + 1}. ${result.options[i]}`);
    }
    const optionsLength = parseInt(result.options.length, 10);
    client.promptOptionSelection(optionsLength, result.user.roleName);
  }
});
socket.on("Option Selection", (response: any) => {

  if (response.type === "message") {
    console.log(response.message);
  } else if (response.type === "Item") {
    client.displayResponse(response.response);
  }
});
// takeUserInput() {
//     rl.question("", (answer) => {

//         this.takeUserInput();
//       }
//     }
// socket.on("connect", () => {
//   console.log("Connected to server");

//   // Create a readline interface for user input
//   rl.question("Enter your userId",(answer)=>{

//       }
//   })
//   rl.on("line", (input) => {
//     // Send user input to the server
//     socket.emit("message", `hello ${input}`);
//   });
// }

// Handle incoming messages from the server
// socket.on("message", (data) => {
//   console.log(`Received from server: ${data}`);
// });

// Handle disconnection
// socket.on("disconnect", () => {
//   console.log("Disconnected from server");
// });
