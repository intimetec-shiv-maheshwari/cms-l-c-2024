import {
  FieldPacket,
  QueryResult,
  ResultSetHeader,
  RowDataPacket,
} from "mysql2";
import { Item } from "../interface/Menu";
import pool from "../config/databaseConnector";

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
    const query = "UPDATE t_menu_item SET price = ? WHERE name = ?";
    const values = [price, name];
    try {
      const [result] = await pool.query<ResultSetHeader>(query, values);
      return result;
    } catch (error) {
      throw error;
    }
  }

  async updateAvailibilityStatus(item: Item) {
    const { name, availabilityStatus } = item;
    const query =
      "UPDATE t_menu_item SET availabilityStatus = ? WHERE name = ?";
    const values = [availabilityStatus, name];
    try {
      const [result] = await pool.query<ResultSetHeader>(query, values);
      return result;
    } catch (error) {
      throw error;
    }
  }

  async deleteItem(itemName: string) {
    const query = "DELETE FROM t_menu_item WHERE name = ?";
    const values = [itemName];
    try {
      const [result] = await pool.query(query, values);
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
      return result;
    } catch (error) {
      throw error;
    }
  }

  async checkItemExists(name: string) {
    const query = "SELECT COUNT(*) AS count FROM t_menu_item WHERE name = ?";
    const values = [name];
    try {
      const [rows] = await pool.query<RowDataPacket[]>(query, values);
      return rows[0].length;
      return;
    } catch (error) {
      throw error;
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
