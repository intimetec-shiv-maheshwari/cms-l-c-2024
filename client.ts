// Client.ts

import { io, Socket } from "socket.io-client";
import { Constants } from "./src/constants/appConstants";
import { exit } from "process";
import { AdminHandler } from "./src/ClientHandler/adminHandler";
import { getInput } from "./src/ClientHandler";
import { ChefHandler } from "./src/ClientHandler/chefHandler";
import { EmployeeHandler } from "./src/ClientHandler/employeeHandler";

const SERVER_URL = "http://localhost:8080";

class Client {
  private static instance: Client;
  private socket: Socket;
  private id: string = "";
  private name: string = "";
  private role: string = "";
  private userOptions: string[] = [];
  private constructor() {
    this.socket = io(SERVER_URL);
    this.socket.on("connect", () => {
      console.log("Connected to server");
      this.promptUserId();
    });
  }

  public static getInstance(): Client {
    if (!Client.instance) {
      Client.instance = new Client();
    }
    return Client.instance;
  }

  getSocket(): Socket {
    return this.socket;
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
    this.socket.emit("Authenticate", userCredentials);
  }

  setUserDetails(newDetails: { id: string; name: string; roleName: string }) {
    this.id = newDetails.id;
    this.name = newDetails.name;
    this.role = newDetails.roleName;
  }

  getUserDetails() {
    return {
      id: this.id,
      name: this.name,
      role: this.role,
    };
  }

  setUserOptions(userOptions: string[]) {
    this.userOptions = userOptions;
  }

  getUserOptions() {
    return this.userOptions;
  }

  async displayUserOptions(options: string[]) {
    for (let i = 0; i < options.length; i++) {
      console.log(`${i + 1}. ${options[i]}`);
    }
  }

  async promptOptionSelection(optionsLength: number, userRole: string) {
    const option = await getInput("Please select an option: ");
    if (option === Constants.EXIT) {
      exit();
    } else {
      const selectedOption = parseInt(option, 10);
      if (selectedOption <= 0 || selectedOption > optionsLength) {
        console.log("Please select a valid option!");
        await this.promptOptionSelection(optionsLength, userRole);
      } else {
        const payload = await this.handleRoleInputs(userRole, selectedOption);
        if (payload.success) {
          this.socket.emit("Option selection", { selectedOption, payload });
        } else {
          console.log(payload.message);
          await this.displayUserOptions(this.getUserOptions());
          await this.promptOptionSelection(
            this.getUserOptions().length,
            this.role
          );
        }
      }
    }
  }

  async handleRoleInputs(role: string, option: number) {
    let user: AdminHandler | ChefHandler | EmployeeHandler;
    const nonPromptingOptions: { [key: string]: number[] } = {
      admin: [5],
      chef: [5],
      employee: [],
    };

    switch (role) {
      case "admin":
        user = new AdminHandler(this.socket);
        break;
      case "chef":
        user = new ChefHandler(this.socket);
        break;
      case "employee":
        user = new EmployeeHandler(this.socket);
        break;
      default:
        throw new Error(`Unsupported role: ${role}`);
    }
    const requestPayload = await new Promise<any>(async (resolve) => {
      const payload = await user?.getOptionFunction(option).call(user);
      resolve(payload);
    });
    return requestPayload;
  }
}

const clientInstance = Client.getInstance();
console.log(clientInstance);
export default clientInstance;
