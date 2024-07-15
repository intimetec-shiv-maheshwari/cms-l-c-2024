import { Socket } from "socket.io-client";
import { getInput } from ".";
import viewResponse from "../utils/displayResponse";
import { mealType } from "../interface/Menu";
import client from "../../client";
import { actionType } from "../constants/appConstants";

export class ChefHandler {
  socket: Socket;
  recommendedMenu: any;
  menuItems: any;
  lowRatingItems: any;
  constructor(socket: Socket) {
    this.socket = socket;
  }

  async getMenuItemsForRecommendation() {
    await new Promise<void>((resolve) => {
      this.socket.emit("Menu For Recommendation");
      this.socket.on("Menu For Recommendation", async (response) => {
        this.menuItems = response.response;
        resolve();
      });
    });
  }

  async getRecommendationStatus(): Promise<{
    success: boolean;
    message: string;
  }> {
    let recommendationStatus: { success: boolean; message: string } = {
      success: false,
      message: "",
    };
    await new Promise<void>((resolve) => {
      this.socket.emit("Get Recommendation Status");
      this.socket.on(
        "Get Recommendation Status",
        async (response: { success: boolean; message: string }) => {
          recommendationStatus = response;
          resolve();
        }
      );
    });
    return recommendationStatus;
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

  async isMenuFinalized(): Promise<{
    success: boolean;
    message: string;
  }> {
    let menuFinalisedStatus: { success: boolean; message: string } = {
      success: false,
      message: "",
    };
    await new Promise<void>((resolve) => {
      this.socket.emit("Check Menu Finalized");
      this.socket.on(
        "Check Menu Finalized",
        async (response: { success: boolean; message: string }) => {
          menuFinalisedStatus = response;
          resolve();
        }
      );
    });
    return menuFinalisedStatus;
  }

  async rollOutItemsForRecommendation() {
    const recommendationStatus: { success: boolean; message: string } =
      await this.getRecommendationStatus();
    if (recommendationStatus.success) {
      const items = await this.getItemsForRecommendation();
      if (this.validateUniqueItems(items)) {
        return {
          success: true,
          body: items,
        };
      } else {
        await this.rollOutItemsForRecommendation();
      }
    } else {
      return {
        success: false,
        message: recommendationStatus.message,
      };
    }
  }

  viewMenu() {
    return {
      success: true,
      body: null,
    };
  }

  viewEmployeeChoices() {
    return null;
  }

  viewNotications() {
    return {
      success: true,
      body: null,
    };
  }

  async getRecommendedMealStatus() {
    await new Promise<void>((resolve) => {
      this.socket.emit("Get Recommended Meal Status");
      this.socket.on("Get Recommended Meal Status", async (response) => {
        this.recommendedMenu = response.response;
        console.table(this.recommendedMenu);
        resolve();
      });
    });
  }

  async getFinalMenu() {
    const isMenuFinalized = await this.isMenuFinalized();
    if (isMenuFinalized.success) {
      await this.getRecommendedMealStatus();
      if (this.recommendedMenu.length > 0) {
        const breakfastItems = [];
        const lunchItems = [];
        const dinnerItems = [];

        const itemId = parseInt(
          await getInput("Enter Item Id for breakfast: ")
        );
        breakfastItems.push(itemId);
        const lunchCount = parseInt(
          await getInput("Enter no of items for Lunch : ")
        );
        for (let i = 0; i < lunchCount; i++) {
          const itemId = parseInt(await getInput("Enter Item Id : "));
          lunchItems.push(itemId);
        }
        const dinnerCount = parseInt(
          await getInput("Enter no of items for Dinner : ")
        );
        for (let i = 0; i < dinnerCount; i++) {
          const itemId = parseInt(await getInput("Enter Item Id : "));
          dinnerItems.push(itemId);
        }
        const items = {
          breakfast: breakfastItems,
          lunch: lunchItems,
          dinner: dinnerItems,
        };
        if (this.validateUniqueItems(items) && this.verifyItems(items)) {
          return {
            success: true,
            body: items,
          };
        } else {
          await this.getFinalMenu();
        }
      } else {
        return {
          success: false,
          message: "Please Roll Out items for recommendation first.. ",
        };
      }
    } else {
      return {
        success: false,
        message: isMenuFinalized.message,
      };
    }
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
      return {
        success: false,
        message: "Enter a valid option!",
      };
    }
    return {
      success: true,
      body: {
        actionType: option,
        itemId: itemId,
        userId: client.getUserDetails().id,
      },
    };
  }

  async checkIfAlreadyUsed(actionType: number) {
    let isUsed: boolean = false;
    await new Promise<void>((resolve) => {
      this.socket.emit("Check for usage history", actionType);
      this.socket.on("Check for usage history", async (response) => {
        console.log(response);
        isUsed = response.result;
        resolve();
      });
    });
    return isUsed;
  }

  generateFeedbackReport() {}

  async discardMenuItem() {
    const itemId = parseInt(await getInput("Enter item Id to discard : "));
    if (this.isItemIdPresent(itemId)) {
      return itemId;
    } else {
      console.log("Please enter a valid item Id");
      await this.discardMenuItem();
    }
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

  isItemIdPresent(itemId: number) {
    return this.lowRatingItems.some(
      (item: { id: string }) => parseInt(item.id) === itemId
    );
  }

  validateUniqueItems(items: { [key: string]: number[] }): boolean {
    const allItems = new Set<number>();
    for (const mealType in items) {
      const itemIds = items[mealType];
      for (const itemId of itemIds) {
        if (allItems.has(itemId)) {
          console.error(`Item ID ${itemId} is duplicated across meal types.`);
          return false;
        }
        allItems.add(itemId);
      }
    }
    return true;
  }

  verifyItems(items: { [key: string]: number[] }) {
    const mealTypes = {
      breakfast: "breakfast",
      lunch: "lunch",
      dinner: "dinner",
    };
    for (const [meal, mealType] of Object.entries(mealTypes)) {
      let validItemFound = false;
      for (const itemId of items[meal]) {
        const validItem = this.recommendedMenu.find(
          (item: { ItemId: number; Mealtype: string }) =>
            item.ItemId === itemId && item.Mealtype === mealType
        );
        if (validItem) {
          validItemFound = true;
          break;
        }
      }
      if (!validItemFound) {
        console.log(
          `You have made a wrong choice in ${
            meal.charAt(0).toUpperCase() + meal.slice(1)
          }`
        );
        return false;
      }
    }
    return true;
  }

  async getItemsForRecommendation() {
    await this.getMenuItemsForRecommendation();
    console.table(this.menuItems);
    const breakfastItems = [];
    const lunchItems = [];
    const dinnerItems = [];
    const breakfastCount = parseInt(
      await getInput("Enter no of items to recommend for Breakfast : ")
    );
    for (let i = 0; i < breakfastCount; i++) {
      const itemId = parseInt(await getInput("Enter Item Id : "));
      breakfastItems.push(itemId);
    }
    const lunchCount = parseInt(
      await getInput("Enter no of items to recommend for Lunch : ")
    );
    for (let i = 0; i < lunchCount; i++) {
      const itemId = parseInt(await getInput("Enter Item Id : "));
      lunchItems.push(itemId);
    }
    const dinnerCount = parseInt(
      await getInput("Enter no of items to recommend for Dinner : ")
    );
    for (let i = 0; i < dinnerCount; i++) {
      const itemId = parseInt(await getInput("Enter Item Id : "));
      dinnerItems.push(itemId);
    }
    return {
      breakfast: breakfastItems,
      lunch: lunchItems,
      dinner: dinnerItems,
    };
  }

  getOptionFunction(option: number): () => void {
    const optionsMap: {
      [key: number]: (requestPayload?: any) => any;
    } = {
      1: this.rollOutItemsForRecommendation,
      2: this.viewMenu,
      3: this.getFinalMenu,
      4: this.generateFeedbackReport,
      5: this.viewNotications,
      6: this.viewDiscardMenuItemList,
    };
    return optionsMap[option];
  }
}
