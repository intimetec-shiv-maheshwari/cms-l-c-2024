import { FieldPacket, RowDataPacket } from "mysql2";
import pool from "./databaseConnector";
import { query } from "express";
import { error } from "console";

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

  async getRecommendedMeal() {
    try {
      const query =
        "select t_menu_item.id as id ,t_meal_type.id as mealTypeId, t_menu_item.name as Name,t_meal_type.mealType as Mealtype from t_menu_item INNER JOIN t_recommendation ON t_recommendation.itemId = t_menu_item.id INNER JOIN t_meal_type ON t_recommendation.mealTypeId = t_meal_type.id where t_recommendation.dateOfRecommendation = current_date()";
      const [result]: [RowDataPacket[], FieldPacket[]] = await pool.query(
        query
      );
      return result;
    } catch (error) {
      throw new Error("There was some problem in fetching the result");
    }
  }

  async checkForExistingVote(userId: string) {
    try {
      const [rows]: [RowDataPacket[], FieldPacket[]] = await pool.query(
        `SELECT COUNT(*) AS vote_count FROM t_voting_record WHERE userId = ? AND dateOfVote = CURDATE()`,
        [userId]
      );

      if (rows[0].vote_count > 0) {
        return true;
      } else {
        return false;
      }
    } catch (err) {
      console.error("Error checking vote record:", err);
      throw err;
    }
  }

  async increaseVote(mealTypeId: number, itemId: number) {
    try {
      const values = [itemId, mealTypeId];
      const query =
        "UPDATE t_recommendation SET noOfVotes = noOfVotes + 1 WHERE itemId = ? AND mealTypeId = ?";
      const [result] = await pool.query(query, values);
      return result;
    } catch (error) {
      throw error;
    }
  }

  async insertVotingRecord(userId: string) {
    try {
      await pool.query("CALL insertVotingRecord(?)", [userId]);
    } catch (error) {
      throw error;
    }
  }

  async getRecommendedMealStatus() {
    try {
      const query =
        "select t_menu_item.id as ItemId , t_menu_item.name as ItemName, t_meal_type.mealType as Mealtype, t_recommendation.noOfVotes as Votes from t_recommendation INNER JOIN t_menu_item ON t_recommendation.itemId = t_menu_item.id INNER JOIN t_meal_type ON t_recommendation.mealTypeId = t_meal_type.id";
      const [result] = await pool.query(query);
      return result;
    } catch (errror) {
      throw error;
    }
  }

  async insertItemForFinalMenu(itemId: number, mealTypeId: number) {
    try {
      const query =
        "INSERT INTO t_final_menu (itemid, mealTypeId , preparationDate) VALUES (?, ? , curdate() + 1)";
      await pool.query(query, [itemId, mealTypeId]);
    } catch (error) {
      throw error;
    }
  }

  async fetchItemsForReview(userId: string) {
    try {
      const query =
        "SELECT f.itemid , mi.name, mt.mealType FROM t_final_menu f LEFT JOIN t_feedback fb ON f.itemid = fb.itemid  AND f.preparationDate = fb.feedbackDate AND fb.userId = ? LEFT JOIN t_menu_item mi ON f.itemid = mi.id LEFT JOIN t_meal_type mt ON f.mealTypeId = mt.id WHERE fb.id IS NULL AND f.preparationDate = CURDATE()";

      const [result] = await pool.query(query, [userId]);
      console.log("in repo", result);
      return result;
    } catch (errror) {}
  }

  async getPreparedMenu() {
    try {
      const query =
        "SELECT t_menu_item.id as ItemId , t_menu_item.name as ItemName , t_meal_type.mealType as MealType from t_final_menu INNER JOIN t_menu_item ON t_final_menu.itemid = t_menu_item.id INNER JOIN t_meal_type ON t_final_menu.mealTypeId = t_meal_type.id WHERE t_final_menu.preparationDate = curdate()";
      const [result] = await pool.query(query);
      return result;
    } catch (error) {
      throw error;
    }
  }

  async checkRecommendationStatus() {
    try {
      const query =
        "select * from t_recommendation where dateOfRecommendation = current_date()";
      const [result]: [RowDataPacket[], FieldPacket[]] = await pool.query(
        query
      );
      return result;
    } catch (error) {
      throw error;
    }
  }

  async isMenuFinalized() {
    try {
      const query =
        "select * from t_final_menu where preparationDate = current_date() + 1;";
      const [result]: [RowDataPacket[], FieldPacket[]] = await pool.query(
        query
      );
      return result[0];
    } catch (error) {
      throw error;
    }
  }

  async getLowRatingItems() {
    try {
      const query =
        "select id , name from t_menu_item where averageRating < 2 and sentimentScore < 3.5";
      const [result] = await pool.query(query);
      return result;
    } catch (error) {
      throw error;
    }
  }
}

const menuRepository = new MenuRepository();
export default menuRepository;
