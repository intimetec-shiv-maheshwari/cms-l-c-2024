import { getInput } from "../utils/inputHandler";
import { Socket } from "socket.io-client";
import client from "../../client";
import { mealType } from "../interface/Menu";
import { questions } from "../constants/detailedFeedbackQuestion";
export class EmployeeHandler {
  socket: Socket;
  recommendedMenu: any;
  itemsForFeedback: any;
  discardItemList: any;
  constructor(socket: Socket) {
    this.socket = socket;
  }

  async checkUserAlreadyVoted(userId: string) {
    let hasUserVoted = false;
    const response = await new Promise<boolean | void>((resolve) => {
      this.socket.emit("Get User Vote Status", userId);
      this.socket.on("Get User Vote Status", async (response) => {
        resolve();
        hasUserVoted = response;
      });
    });
    return hasUserVoted;
  }

  async getRecommendedMeal(userId: string) {
    await new Promise<void>((resolve) => {
      this.socket.emit("Recommended Meal", userId);
      this.socket.on("Recommended Meal", async (response) => {
        this.recommendedMenu = response.response;
        console.table(response.response);
        resolve();
      });
    });
  }

  async getItemsForFeedback(userId: string) {
    await new Promise<void>((resolve) => {
      this.socket.emit("Get items for feedback", userId);
      this.socket.on("Get items for feedback", async (response) => {
        this.itemsForFeedback = response;
        resolve();
      });
    });
  }

  async showDiscardItemList() {
    await new Promise<void>((resolve) => {
      this.socket.emit("Get Discard Item List");
      this.socket.on("Get Discard Item List", async (response) => {
        console.log(response);
        this.discardItemList = response;
        console.table(this.discardItemList);
        resolve();
      });
    });
  }

  async voteForMeal() {
    const hasUserVoted = await this.checkUserAlreadyVoted(
      client.getUserDetails().id
    );
    if (!hasUserVoted) {
      await this.getRecommendedMeal(client.getUserDetails().id);
      if (this.recommendedMenu.length > 0) {
        const breakfastItems = [];
        const lunchItems = [];
        const dinnerItems = [];
        const breakfastItemId = parseInt(
          await getInput("Enter breakfast item Id to vote for : ")
        );
        breakfastItems.push(breakfastItemId);
        const lunchItemId = parseInt(
          await getInput("Enter the Lunch Item Id to vote for : ")
        );
        lunchItems.push(lunchItemId);
        const dinnerItemId = parseInt(
          await getInput("Enter the Dinner Item Id to vote for : ")
        );
        dinnerItems.push(dinnerItemId);
        const items = {
          breakfast: breakfastItems,
          lunch: lunchItems,
          dinner: dinnerItems,
        };
        if (this.validateUniqueItems(items) && this.verifyItems(items)) {
          return {
            success: true,
            body: {
              userId: client.getUserDetails().id,
              items,
            },
          };
        } else {
          return {
            success: false,
            message: "Please vote again!",
          };
        }
      } else {
        return {
          success: false,
          message: "No items has been rolled out yet!",
        };
      }
    } else {
      return {
        success: false,
        message: "You have already voted!",
      };
    }
  }

  async provideFeedback() {
    await this.getItemsForFeedback(client.getUserDetails().id);
    if (this.itemsForFeedback.length > 0) {
      console.table(this.itemsForFeedback);
      const itemId = parseInt(await getInput("Enter itemid  : "));
      if (this.isItemIdPresent(itemId)) {
        const rating = parseFloat(await getInput("Enter rating : "));
        const comment = await getInput("Enter feedback : ");
        return {
          success: true,
          body: {
            userId: client.getUserDetails().id,
            itemId: itemId,
            rating: rating,
            feedback: comment,
          },
        };
      }
    } else {
      return {
        success: false,
        message: "Nothing here as of now!",
      };
    }
  }

  async viewNotification() {
    return {
      success: true,
      body: null,
    };
  }

  async askForDetailedFeedback() {
    if (await this.checkUserAlreadyGivenFeedback(client.getUserDetails().id)) {
      await this.showDiscardItemList();
      const itemId = parseInt(await getInput("Enter the item id : "));
      if (this.isItemIdPresentInDiscardList(itemId)) {
        const dislikes = await getInput(questions[0]);
        const likes = await getInput(questions[1]);
        const recipe = await getInput(questions[2]);
        return {
          success: true,
          body: {
            userId: client.getUserDetails().id,
            itemId: itemId,
            dislikes: dislikes,
            likes: likes,
            momsRecipe: recipe,
          },
        };
      } else {
        return {
          success: false,
          message: "Enter a valid item id",
        };
      }
    } else {
      return {
        success: false,
        message: "You have already provided detailed feedback in last 30 days!",
      };
    }
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
    for (const [meal, mealTypeId] of Object.entries(mealType)) {
      const itemId = items[meal][0];
      const validItem = this.recommendedMenu.find(
        (item: { id: number }) => item.id === itemId
      );

      if (!validItem || validItem.mealTypeId !== mealTypeId) {
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

  isItemIdPresent(itemId: number): boolean {
    return this.itemsForFeedback.some(
      (item: { itemid: string }) => parseInt(item.itemid) === itemId
    );
  }

  isItemIdPresentInDiscardList(itemId: number): boolean {
    console.log(this.discardItemList);
    return this.discardItemList.some(
      (item: { itemId: string }) => parseInt(item.itemId) === itemId
    );
  }

  async checkUserAlreadyGivenFeedback(userId: string) {
    let hasGivenFeedback: boolean = false;
    await new Promise<void>((resolve) => {
      this.socket.emit("Check User already provided detailed feedback", userId);
      this.socket.on(
        "Check User already provided detailed feedback",
        async (response) => {
          hasGivenFeedback = response.result;
          resolve();
        }
      );
    });
    return hasGivenFeedback;
  }

  getOptionFunction(option: number): () => void {
    const optionsMap: {
      [key: number]: (requestPayload?: any) => any;
    } = {
      1: this.voteForMeal,
      2: this.provideFeedback,
      3: this.askForDetailedFeedback,
      4: this.viewNotification,
    };
    return optionsMap[option];
  }
}
