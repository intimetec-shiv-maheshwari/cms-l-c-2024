import { RowDataPacket } from "mysql2/promise";
import pool from "../repository/databaseConnector";
import menuRepository from "../repository/menuRepository";
import { mealType } from "../interface/Menu";
import { error } from "console";
import notificationService from "./notificationService";

class MenuService {
  async saveItemsForRecommendation(items: { [key: string]: number[] }) {
    try {
      const mealTypes = await menuRepository.getMealTypes();

      const mealTypeMap: { [key: string]: number } = mealTypes.reduce(
        (acc: any, { id, mealType }: any) => {
          acc[mealType] = id;
          return acc;
        },
        {}
      );

      for (const mealType in items) {
        const mealTypeId = mealTypeMap[mealType];
        if (mealTypeId) {
          const itemIds = items[mealType];
          for (const itemId of itemIds) {
            await menuRepository.insertRecommendation(mealTypeId, itemId);
          }
        } else {
          throw new Error(`Invalid meal type: ${mealType}`);
        }
      }
      const notificationDetails = {
        message: `Chef has rolled out Items for next day menu!`,
        notificationType: 3,
        receiverStatusCode: 1,
      };
      const notificationResult = await notificationService.saveNewNotification(
        notificationDetails
      );
      return {
        success: true,
        message: "Items inserted successfully",
        type: "message",
      };
    } catch (error) {
      return { success: false, message: "Error inserting data", type: "error" };
    }
  }

  async incrementVoteForMeal(payload: any) {
    try {
      type MealType = keyof typeof mealType;
      for (const [meal, ids] of Object.entries(payload.items) as [
        MealType,
        number[]
      ][]) {
        const mealTypeId = mealType[meal];
        const itemId = ids[0];
        try {
          const response = await menuRepository.increaseVote(
            mealTypeId,
            itemId
          );
        } catch (error) {
          throw `Failed to increment vote for ${meal}`;
        }
      }
      await menuRepository.insertVotingRecord(payload.userId);
    } catch (error) {
      throw error;
    }
  }

  async hasUserVoted(userId: string) {
    const response = await menuRepository.checkForExistingVote(userId);
    return response;
  }

  async viewRecommendedMenuStatus() {
    try {
      const result = await menuRepository.getRecommendedMealStatus();
      return { success: true, response: result, type: "Item" };
    } catch (error) {
      return { success: false, message: error, type: "message" };
    }
  }

  async displayRecommendedMenu() {
    try {
      const result = await menuRepository.getRecommendedMeal();
      return { success: true, response: result, type: "Item" };
    } catch (error) {
      return { success: false, message: error, type: "error" };
    }
  }

  async finaliseMenu(menu: any) {
    try {
      type MealType = keyof typeof mealType;
      for (const [meal, itemIds] of Object.entries(menu) as [
        MealType,
        number[]
      ][]) {
        const mealTypeId = mealType[meal];
        for (const itemId of itemIds) {
          await menuRepository.insertItemForFinalMenu(itemId, mealTypeId);
        }
      }
      return "Operation performed successfully!";
    } catch (error) {
      throw error;
    }
  }

  async getFinalMenu() {
    try {
      const result = await menuRepository.getPreparedMenu();
      return result;
    } catch (error) {
      throw error;
    }
  }

  async getItemsForFeedback(userId: string) {
    try {
      const result = await menuRepository.fetchItemsForReview(userId);
      console.log("in service", result);
      return result;
    } catch (error) {
      console.log(error);
    }
  }

  async getLowRatingItems() {
    try {
      const result = await menuRepository.getLowRatingItems();
      return result;
    } catch (error) {
      console.log(error);
    }
  }

  async checkRecommendationStatus() {
    try {
      const result = await menuRepository.checkRecommendationStatus();
      if (result.length === 0) {
        return {
          success: true,
          message: "Please select items from the below menu",
        };
      } else {
        return {
          success: false,
          message: "Items has been rolled out already!",
        };
      }
    } catch (error) {
      return {
        success: false,
        message: error,
      };
    }
  }

  async isMenuFinalized() {
    try {
      const result = await menuRepository.isMenuFinalized();
      if (result.length === 0) {
        return {
          success: true,
          message: "Please select items from the below menu",
        };
      } else {
        return {
          success: false,
          message: "Items has been already finalised!",
        };
      }
    } catch (error) {
      return {
        success: false,
        message: error,
      };
    }
  }
}

const menuService = new MenuService();
export default menuService;
