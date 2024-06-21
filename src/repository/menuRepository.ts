import { RowDataPacket } from "mysql2";
import pool from "./databaseConnector";

class MenuRepository {
  async getMealTypes() {
    try {
      const [mealTypes] = await pool.query<RowDataPacket[]>(
        'SELECT id, mealType FROM t_meal_type WHERE mealType IN ("Breakfast", "Lunch", "Dinner")'
      );
      return mealTypes;
    } catch (error) {
      throw error;
    }
  }

  async insertRecommendation(mealTypeId: number, itemId: number) {
    await pool.query(
      "INSERT INTO t_recommendation (itemId, mealTypeId, noOfVotes) VALUES (?, ?, 0)",
      [itemId, mealTypeId]
    );
  }

  async existingItemCheck(itemId: string) {
    try {
      const [existingItem] = await pool.query<RowDataPacket[]>(
        "SELECT 1 FROM t_recommendation WHERE itemId = ?",
        [itemId]
      );
      return existingItem.length;
    } catch (error) {
      throw new Error(`Item ID ${itemId} already exists in another meal type`);
    }
  }
}

const menuRepository = new MenuRepository();
export default menuRepository;
