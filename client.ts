import { io } from "socket.io-client";
import * as readline from "readline";
import { Constants } from "./src/constants/appConstants";
import { exit } from "process";

const SERVER_URL = "http://localhost:8080";

let rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout,
});

// Create a socket instance
const socket = io(SERVER_URL);

class Client {
  constructor() {
    socket.on("connect", () => {
      console.log("Connected to server");
      this.promptUserId();
    });
  }

  promptUserId() {
    rl.question("Enter User ID: ", (userId: string) => {
      if (userId === Constants.EXIT) {
        rl.close();
        exit();
      } else {
        this.promptPassword(userId);
      }
    });
  }
  promptPassword(userId: string) {
    rl.question("Enter Password: ", (password: string) => {
      if (password === Constants.EXIT) {
        rl.close();
        exit();
      } else {
        this.processUserInput(userId, password);
      }
    });
  }
  processUserInput(userId: string, password: string) {
    const userCredentials = {
      userId: userId,
      password: password,
    };
    socket.emit("Authenticate", userCredentials);
  }

  promptOptionSelection(optionsLength: number) {
    rl.question("Please select a option : ", (option: string) => {
      if (option === Constants.EXIT) {
        rl.close();
        exit();
      } else {
        const selectedOption = parseInt(option, 10);
        if (selectedOption <= 0 || selectedOption > optionsLength) {
          console.log("Please select a valid option!");
          this.promptOptionSelection(optionsLength);
        } else {
          socket.emit("Option selection", selectedOption);
        }
      }
    });
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
    client.promptOptionSelection(optionsLength);
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
