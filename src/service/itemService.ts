import { Item } from "../interface/Menu";
import pool from "../repository/databaseConnector";
import { FieldPacket, ResultSetHeader, RowDataPacket } from "mysql2";
class ItemService {
  async addNewItem(item: Item) {
    const { categoryId, name, price, availabilityStatus } = item;
    const values = [name, price, availabilityStatus, categoryId];
    const query =
      "INSERT INTO t_menu_item (name, price, availabilityStatus,categoryId) VALUES (?, ?, ?, ?)";
    try {
      const result = await pool.query<ResultSetHeader>(query, values);
      return {
        sucess: true,
        message: "Item Added Successfully!",
        type: "message",
      };
    } catch (error) {
      return { success: false, message: error, type: "message" };
    }
  }

  async updateItemPrice(item: Item) {
    const { name, price } = item;
    const values = [price, name];
    const query = "UPDATE t_menu_item SET price = ? WHERE name = ?";
    try {
      const result = await pool.query(query, values);
      return {
        success: true,
        message: "Item Added Successfully!",
        type: "message",
      };
    } catch (error) {
      return {
        success: false,
        message: "There was an error in doing this",
        type: "message",
      };
    }
  }

  async updateItemAvailibilityStatus(item: Item) {
    const { name, availabilityStatus } = item;
    const values = [availabilityStatus, name];
    const query =
      "UPDATE t_menu_item SET availabilityStatus = ? WHERE name = ?";
    try {
      const result = await pool.query(query, values);
      return {
        success: true,
        message: "Availability Status Successfully!",
        type: "message",
      };
    } catch (error) {
      return {
        success: false,
        message: "There was an error in doing this",
        type: "message",
      };
    }
  }

  async deleteItem(itemName: Item) {
    const { name } = itemName;
    const values = [name];
    const query = "DELETE FROM t_menu_item WHERE name = ?";
    try {
      const result = await pool.query(query, values);
      return {
        success: true,
        message: "Item Deleted Successfully!",
        type: "message",
      };
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
      t_menu_item.id AS \`S.No\`,
      t_menu_item.name AS Item, 
      t_menu_item.price AS Price, 
      t_menu_item.availabilityStatus AS AvailabilityStatus, 
      t_category.category AS Category
    FROM 
      t_menu_item
    INNER JOIN 
      t_category 
    ON 
      t_menu_item.categoryId = t_category.id`;

    try {
      const result: [RowDataPacket[], FieldPacket[]] = await pool.query(query);
      return { success: true, response: result[0], type: "Item" };
    } catch (error) {
      console.log(error);
    }
  }
}

const itemService = new ItemService();
export default itemService;
