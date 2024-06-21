// import * as readline from "readline";
import { getInput } from ".";
import { Item, mealType } from "../interface/Menu";
// import { socket } from "../../client";
import { Socket } from "socket.io-client";
// let r = readline.createInterface({
//   input: process.stdin,
//   output: process.stdout,
// });
let menu: any;
export class AdminHandler {
    socket :Socket
  constructor(socket : Socket) {
    this.socket = socket
  }
  async inputNewItemDetails() {
    console.log("The Meal Types are as follows : ");
    console.log(mealType);
    const categoryId = await getInput("Enter the Meal Type : ");
    const itemName = await getInput("Enter item name : ");
    const price = await getInput("Enter price : ");
    const isAvailable = await getInput(
      "Enter availibility status (0 -> False / 1 -> True): "
    );
    return {
      categoryId: parseInt(categoryId),
      name: itemName,
      price: parseInt(price),
      availabilityStatus: parseInt(isAvailable),
    };
  }

  async updatePrice(socket: Socket) {
    const itemName = await getInput("Enter item id to update price : ");
    const newPrice = await getInput("Enter New Price : ");
    return {
      name: itemName,
      price: newPrice,
    };
  }

  async updateAvailibilityStatus() {
    const itemName = await getInput(
      "Enter item name to availibility status : "
    );
    const status = await getInput("Enter Status : ");
    return {
      name: itemName,
      availabilityStatus: status,
    };
  }

  async deleteItem() {
    const itemName = await getInput("Enter item name to delete : ");
    return {
      name: itemName,
    };
  }

  async viewMenu() {
    return null;
  }

  getOptionFunction(option: number): () => void {
    const optionsMap: {
      [key: number]: (requestPayload?: any) => void;
    } = {
      1: this.inputNewItemDetails,
      2: this.updatePrice,
      3: this.updateAvailibilityStatus,
      4: this.deleteItem,
      5: this.viewMenu,
    };
    return optionsMap[option];
  }

  displayMenu(menuItems: Item[]) {
    if (menuItems.length === 0) {
      console.log("No data to display.");
      return;
    }

    const keys = Object.keys(menuItems[0]);
    const columnWidths = keys.map((key) =>
      Math.max(
        ...menuItems.map(
          (obj: { [x: string]: any }) => String(obj[key]).length
        ),
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

    menuItems.forEach((obj: { [x: string]: any }) => {
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

