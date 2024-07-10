// import * as readline from "readline";
import { getInput } from ".";
import client from "../../client";
import { Item, mealType } from "../interface/Menu";
import { Socket } from "socket.io-client";
export class AdminHandler {
  socket: Socket;
  lowRatingItems: any;
  constructor(socket: Socket) {
    this.socket = socket;
  }

  async showLowRatingItems() {
    await new Promise<void>((resolve) => {
      this.socket.emit("View Low Rating Items");
      this.socket.on("View Low Rating Items", async (response) => {
        this.lowRatingItems = response;
        console.table(this.lowRatingItems);
        resolve();
      });
    });
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
      success: true,
      body: {
        categoryId: parseInt(categoryId),
        name: itemName,
        price: parseInt(price),
        availabilityStatus: parseInt(isAvailable),
      },
    };
  }

  async updatePrice(socket: Socket) {
    const itemName = await getInput("Enter item name to update price : ");
    const newPrice = await getInput("Enter New Price : ");
    return {
      success: true,
      body: {
        name: itemName,
        price: newPrice,
      },
    };
  }

  async updateAvailibilityStatus() {
    const itemName = await getInput(
      "Enter item name to availibility status : "
    );
    const status = await getInput("Enter Status : ");
    return {
      success: true,
      body: {
        name: itemName,
        availabilityStatus: status,
      },
    };
  }

  async deleteItem() {
    const itemName = await getInput("Enter item name to delete : ");
    return {
      success: true,
      body: {
        name: itemName,
      },
    };
  }

  async viewMenu() {
    return {
      success: true,
      body: null,
    };
  }

  async viewDiscardMenuItemList() {
    let itemId;
    await this.showLowRatingItems();
    console.log("Choose from below options : ");
    console.log("1. Discard a menu item");
    console.log("2. Ask for detailed feedback for a item");
    const option = parseInt(await getInput("Enter your choice : "));
    if (option === 1) {
      if (await this.checkIfAlreadyUsed(option)) {
        itemId = await this.discardMenuItem();
      } else {
        return {
          success: false,
          message: "You have used it already!",
        };
      }
    } else if (option === 2) {
      if (await this.checkIfAlreadyUsed(option)) {
        itemId = await this.askForDetailedFeedback();
      } else {
        return {
          success: false,
          message: "You have used it already!",
        };
      }
    } else {
      console.log("Enter a valid option!");
      await this.viewDiscardMenuItemList();
    }
    return {
      success: true,
      body: {
        selectedOption: option,
        itemId: itemId,
        userId: client.getUserDetails().id,
      },
    };
  }

  async discardMenuItem() {
    const itemId = parseInt(await getInput("Enter item Id to discard : "));
    if (this.isItemIdPresent(itemId)) {
      return itemId;
    } else {
      console.log("Please enter a valid item Id");
      await this.discardMenuItem();
    }
  }

  async checkIfAlreadyUsed(selectedOption: number) {
    let isUsed: boolean = false;
    await new Promise<void>((resolve) => {
      this.socket.emit("Check for usage history", selectedOption);
      this.socket.on("Check for usage history", async (response) => {
        console.log(response);
        isUsed = response.result;
        resolve();
      });
    });
    return isUsed;
  }

  isItemIdPresent(itemId: number) {
    return this.lowRatingItems.some(
      (item: { id: string }) => parseInt(item.id) === itemId
    );
  }

  async askForDetailedFeedback() {
    const itemId = parseInt(
      await getInput("Enter item Id to move into detailed feedback list : ")
    );
    if (this.isItemIdPresent(itemId)) {
      return itemId;
    } else {
      console.log("Please enter a valid item Id");
      await this.askForDetailedFeedback();
    }
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
      6: this.viewDiscardMenuItemList,
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
