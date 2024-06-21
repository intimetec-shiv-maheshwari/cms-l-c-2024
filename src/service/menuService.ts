import { RowDataPacket } from "mysql2/promise";
import pool from "../repository/databaseConnector";
import menuRepository from "../repository/menuRepository";

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
      return {
        success: true,
        message: "Items inserted successfully",
        type: "message",
      };
    } catch (error) {
      return { success: false, message: "Error inserting data", type: "error" };
    }
  }
}

const menuService = new MenuService();
export default menuService;
