import { Socket } from "socket.io-client";
import { getInput } from ".";
import viewResponse from "../utils/displayResponse";
import { mealType } from "../interface/Menu";

export class ChefHandler {
  socket: Socket;
  recommendedMenu: any;
  constructor(socket: Socket) {
    this.socket = socket;
  }
  async selectItemsForRecommendation() {
    await new Promise<void>((resolve) => {
      this.socket.emit("Menu For Recommendation");
      this.socket.on("Menu For Recommendation", async (response) => {
        console.log("here", response.response);
        viewResponse(response.response);
        resolve();
      });
    });
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
    const items = {
      breakfast: breakfastItems,
      lunch: lunchItems,
      dinner: dinnerItems,
    };
    if (this.validateUniqueItems(items)) {
      return items;
    } else {
      console.log("here in else");
    }
  }

  viewMenu() {
    return null;
  }

  viewEmployeeChoices() {
    return null;
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
    await this.getRecommendedMealStatus();

    const breakfastItems = [];
    const lunchItems = [];
    const dinnerItems = [];

    const itemId = parseInt(await getInput("Enter Item Id for breakfast: "));
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
      return items;
    } else {
      console.log("in else");
    }
  }

  generateFeedbackReport() {}

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

  getOptionFunction(option: number): () => void {
    const optionsMap: {
      [key: number]: (requestPayload?: any) => any;
    } = {
      1: this.selectItemsForRecommendation,
      2: this.viewMenu,
      3: this.getFinalMenu,
      4: this.generateFeedbackReport,
    };
    return optionsMap[option];
  }
}
