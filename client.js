"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var socket_io_client_1 = require("socket.io-client");
var readline = require("readline");
var appConstants_1 = require("./src/constants/appConstants");
var process_1 = require("process");
// Define the server address
var SERVER_URL = "http://localhost:8080";
var rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout,
});
// Create a socket instance
var socket = (0, socket_io_client_1.io)(SERVER_URL);
var userId = "";
var password = "";
var Client = /** @class */ (function () {
    function Client() {
        var _this = this;
        socket.on("connect", function () {
            console.log("Connected to server");
            _this.promptUserId();
        });
    }
    Client.prototype.promptUserId = function () {
        var _this = this;
        rl.question("Enter User ID: ", function (userId) {
            if (userId === appConstants_1.Constants.EXIT) {
                rl.close();
                (0, process_1.exit)();
            }
            else {
                _this.promptPassword(userId);
            }
        });
    };
    Client.prototype.promptPassword = function (userId) {
        var _this = this;
        rl.question("Enter Password: ", function (password) {
            if (password === appConstants_1.Constants.EXIT) {
                rl.close();
                (0, process_1.exit)();
            }
            else {
                _this.processUserInput(userId, password);
            }
        });
    };
    Client.prototype.processUserInput = function (userId, password) {
        var userCredentials = {
            userId: userId,
            password: password,
        };
        socket.emit("Authenticate", userCredentials);
    };
    return Client;
}());
var client = new Client();
socket.on("Correct Credentials", function (result) {
    console.log(result);
    if (result.roleId) {
        socket.emit("Get Role", result);
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
