import {
  FieldPacket,
  QueryResult,
  ResultSetHeader,
  RowDataPacket,
} from "mysql2";
import { Item } from "../interface/Menu";
import pool from "./databaseConnector";

class ItemRepository {
  async addNewItem(item: Item) {
    const { categoryId, name, price, availabilityStatus } = item;
    const values = [name, price, availabilityStatus, categoryId];
    const query =
      "INSERT INTO t_menu_item (name, price, availabilityStatus,categoryId) VALUES (?, ?, ?, ?)";
    try {
      const [result] = await pool.query<ResultSetHeader>(query, values);
      return result.insertId;
    } catch (error) {
      throw error;
    }
  }

  async updatePrice(item: Item) {
    const { name, price } = item;

    const checkResult = await this.checkItemExists(name!);
    if (!checkResult.success) {
      throw checkResult.message;
    }

    const updateQuery = "UPDATE t_menu_item SET price = ? WHERE name = ?";
    const updateValues = [price, name];

    try {
      const [result] = await pool.query<ResultSetHeader>(
        updateQuery,
        updateValues
      );
      return result;
    } catch (error) {
      throw error;
    }
  }

  async updateAvailibilityStatus(item: Item) {
    const { name, availabilityStatus } = item;
    const checkResult = await this.checkItemExists(name!);
    if (!checkResult.success) {
      throw checkResult.message;
    }
    const updateQuery =
      "UPDATE t_menu_item SET availabilityStatus = ? WHERE name = ?";
    const updateValues = [availabilityStatus, name];
    try {
      const [result] = await pool.query<ResultSetHeader>(
        updateQuery,
        updateValues
      );
      return result;
    } catch (error) {
      throw error;
    }
  }

  async deleteItem(itemName: Item) {
    const { name } = itemName;
    const checkResult = await this.checkItemExists(name!);
    if (!checkResult.success) {
      throw checkResult.message;
    }
    const deleteQuery = "DELETE FROM t_menu_item WHERE name = ?";
    const deleteValues = [name];
    try {
      const [result] = await pool.query(deleteQuery, deleteValues);
      return result;
    } catch (error) {
      throw error;
    }
  }

  async updateSentimentScore(itemId: number, score: number) {
    try {
      const query =
        "UPDATE t_menu_item SET sentimentScore = CASE WHEN sentimentScore IS NULL THEN ? ELSE (sentimentScore + ?) / 2 END WHERE id = ?";
      const result = await pool.query(query, [score, score, itemId]);
      return result;
    } catch (error) {
      throw error;
    }
  }

  async updateAverageRating(itemId: number, rating: number) {
    try {
      const query =
        "UPDATE t_menu_item SET averageRating = CASE WHEN averageRating IS NULL THEN ? ELSE (averageRating + ?) / 2 END WHERE id = ?";
      const result = await pool.query(query, [rating, rating, itemId]);
      return result;
    } catch (error) {
      throw error;
    }
  }

  async viewMenu() {
    const query = `SELECT
      t_menu_item.id AS Id,
      t_menu_item.name AS Item, 
      t_menu_item.price AS Price, 
      t_menu_item.availabilityStatus AS AvailabilityStatus, 
      t_menu_item.averageRating AS Rating,
      t_menu_item.sentimentScore as SentimentScore,
      t_category.category AS Category
    FROM 
      t_menu_item
    INNER JOIN 
      t_category 
    ON 
      t_menu_item.categoryId = t_category.id
    ORDER BY t_category.category ASC , t_menu_item.averageRating DESC`;
    try {
      const [result]: [RowDataPacket[], FieldPacket[]] = await pool.query(
        query
      );
      console.log(result);
      return result;
    } catch (error) {
      throw error;
    }
  }

  async checkItemExists(name: string) {
    const checkQuery =
      "SELECT COUNT(*) AS count FROM t_menu_item WHERE name = ?";
    const checkValues = [name];

    try {
      const [rows] = await pool.query<RowDataPacket[]>(checkQuery, checkValues);
      const count = rows[0].count;
      if (count === 0) {
        return {
          success: false,
          message: `Item with name '${name}' does not exist.`,
          type: "error",
        };
      }
      return {
        success: true,
        message: `Item with name '${name}' exists.`,
        type: "success",
      };
    } catch (error) {
      return {
        success: false,
        message: "There was an error checking the item existence",
        type: "error",
      };
    }
  }

  async deleteItemById(itemId: number) {
    try {
      const query = "DELETE FROM t_menu_item WHERE id = ?";
      const response = await pool.query(query, [itemId]);
      return response;
    } catch (error) {
      return error;
    }
  }
}

const itemRepository = new ItemRepository();
export default itemRepository;
