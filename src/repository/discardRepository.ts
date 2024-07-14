import { query } from "express";
import pool from "./databaseConnector";
import { FieldPacket, RowDataPacket } from "mysql2";
import { actionType } from "../constants/appConstants";
import { DetailedFeedback } from "../interface/feedback";

class DiscardRepository {
  async checkForUsageHistory(actionType: number) {
    try {
      const query =
        "SELECT IFNULL((SELECT CASE WHEN MAX(lastUsed) IS NULL THEN true WHEN DATEDIFF(NOW(), MAX(lastUsed)) > 30 THEN true ELSE false END FROM t_usage_log WHERE actionType = ?), true) AS result;";
      const [result]: [RowDataPacket[], FieldPacket[]] = await pool.query(
        query,
        [actionType]
      );
      return result[0];
    } catch (error) {
      throw error;
    }
  }

  async insertUsageLog(actionType: number, userId: string) {
    try {
      const selectQuery = `
    SELECT id FROM t_usage_log
    WHERE actionType = ?;
  `;
      const insertQuery = `
    INSERT INTO t_usage_log (userId, actionType, lastUsed)
    VALUES (?, ?, CURRENT_DATE);
  `;

      const updateQuery = `
    UPDATE t_usage_log
    SET userId = ?, lastUsed = CURRENT_DATE
    WHERE actionType = ?;
  `;
      const [result]: [RowDataPacket[], FieldPacket[]] = await pool.query(
        selectQuery,
        [actionType]
      );
      if (result.length > 0) {
        console.log("here in update");
        await pool.query(updateQuery, [userId, actionType]);
      } else {
        console.log("here in insert", userId, actionType);
        await pool.query(insertQuery, [userId, actionType]);
      }
    } catch (error) {
      throw error;
    }
  }

  async insertDiscardFeedbackItem(itemId: number) {
    try {
      const truncateQuery = "TRUNCATE TABLE t_discard_feedback_item";
      const insertQuery =
        "INSERT INTO t_discard_feedback_item (itemId) VALUES (?)";
      const result = await pool.query(truncateQuery);
      const response = await pool.query(insertQuery, [itemId]);
      return response;
    } catch (error) {
      throw error;
    }
  }

  async checkForUserHistory(userId: string) {
    try {
      const query =
        "SELECT IFNULL((SELECT CASE WHEN MAX(lastUsed) IS NULL THEN TRUE WHEN DATEDIFF(CURRENT_DATE, MAX(lastUsed)) > 30 THEN TRUE ELSE FALSE END FROM t_usage_log WHERE userId = ? AND actionType = 3), TRUE ) AS result";
      const [result]: [RowDataPacket[], FieldPacket[]] = await pool.query(
        query,
        [userId]
      );
      return result[0];
    } catch (error) {
      throw error;
    }
  }

  async showDiscardItemList() {
    try {
      const query =
        "SELECT itemId , t_menu_item.name from t_discard_feedback_item INNER JOIN t_menu_item ON t_discard_feedback_item.itemId = t_menu_item.id";
      const [result]: [RowDataPacket[], FieldPacket[]] = await pool.query(
        query
      );
      return result;
    } catch (error) {
      throw error;
    }
  }

  async saveDetailedFeedbackForDiscardItem(feedbackDetails: DetailedFeedback) {
    try {
      const { itemId, likes, dislikes, momsRecipe } = feedbackDetails;
      const query =
        "INSERT INTO t_detailed_feedback (itemId, likes, dislike, momsRecipe) VALUES (?, ?, ?, ?)";
      const result = await pool.query(query, [
        itemId,
        likes,
        dislikes,
        momsRecipe,
      ]);
      return result;
    } catch (error) {
      throw error;
    }
  }

  async insertUsageLogForEmployee(userId: string) {
    try {
      const action = actionType["Provide Detailed Feedback"];
      const query = "CALL InsertUsageLogForEmployee(?, ?)";
      const values = [userId, action];
      const result = await pool.execute(query, values);
      return result;
    } catch (error) {
      throw error;
    }
  }
}
const discardRepository = new DiscardRepository();
export default discardRepository;
