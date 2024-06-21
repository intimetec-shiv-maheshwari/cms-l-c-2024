import { Socket } from "socket.io-client";
import { getInput } from ".";

export class ChefHandler {
    socket : Socket
    constructor(socket : Socket){
        this.socket = socket
    }
  async selectItemsForRecommendation() {
    await new Promise<void>((resolve) => {
        this.socket.emit("Menu For Recommendation");
        this.socket.on("Menu For Recommendation", async (response) => {
          console.log("here", response);
        //   await this.displayResponse(response.response);
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
      const itemId = await getInput("Enter Item Id : ");
      breakfastItems.push(itemId);
    }
    const lunchCount = parseInt(
      await getInput("Enter no of items to recommend for Lunch : ")
    );
    for (let i = 0; i < lunchCount; i++) {
      const itemId = await getInput("Enter Item Id : ");
      lunchItems.push(itemId);
    }
    const dinnerCount = parseInt(
      await getInput("Enter no of items to recommend for Dinner : ")
    );
    for (let i = 0; i < dinnerCount; i++) {
      const itemId = await getInput("Enter Item Id : ");
      dinnerItems.push(itemId);
    }
    return {
      Breakfast: breakfastItems,
      Lunch: lunchItems,
      Dinner: dinnerItems,
    };
  }

  viewMenu() {}

  viewEmployeeChoices() {}

  finaliseNthDayMenu() {}

  generateFeedbackReport() {}

  getOptionFunction(option: number): () => void {
    const optionsMap: {
      [key: number]: (requestPayload?: any) => any;
    } = {
      1: this.selectItemsForRecommendation,
      2: this.viewMenu,
      3: this.viewEmployeeChoices,
      4: this.finaliseNthDayMenu,
      5: this.generateFeedbackReport,
    };
    return optionsMap[option];
  }
}
