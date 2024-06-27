import { FieldPacket, ResultSetHeader, RowDataPacket } from "mysql2";
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
    const values = [price, name];
    const query = "UPDATE t_menu_item SET price = ? WHERE name = ?";
    try {
      const [result] = await pool.query(query, values);
      return result;
    } catch (error) {
      throw error;
    }
  }

  async updateAvailibilityStatus(item: Item) {
    const { name, availabilityStatus } = item;
    const values = [availabilityStatus, name];
    const query =
      "UPDATE t_menu_item SET availabilityStatus = ? WHERE name = ?";
    try {
      const [result] = await pool.query(query, values);
      return result;
    } catch (error) {
      throw error;
    }
  }

  async deleteItem(itemName: Item) {
    const { name } = itemName;
    const values = [name];
    const query = "DELETE FROM t_menu_item WHERE name = ?";
    try {
      const [result] = await pool.query(query, values);
      return result;
    } catch (error) {
      return {
        success: false,
        message: "There was an error in doing this",
        type: "message",
      };
    }
  }

  async viewMenu() {
    const query = `SELECT
      t_menu_item.id AS Id,
      t_menu_item.name AS Item, 
      t_menu_item.price AS Price, 
      t_menu_item.availabilityStatus AS AvailabilityStatus, 
      t_menu_item.averageRating AS Rating,
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
}

const itemRepository = new ItemRepository();
export default itemRepository;
