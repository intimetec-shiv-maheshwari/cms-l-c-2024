import { Item } from "../interface/Menu";
import pool from "../repository/databaseConnector";
import { FieldPacket, ResultSetHeader, RowDataPacket } from "mysql2";
import itemRepository from "../repository/itemRepository";
class ItemService {
  async addNewItem(item: Item) {
    try {
      const result = await itemRepository.addNewItem(item);
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
    try {
      const result = await itemRepository.updatePrice(item);
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
    try {
      const result = await itemRepository.updateAvailibilityStatus(item);
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
    try {
      const result = await itemRepository.deleteItem(itemName);
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
    try {
      const result = await itemRepository.viewMenu();
      return { success: true, response: result, type: "Item" };
    } catch (error) {
      console.log(error);
    }
  }
}

const itemService = new ItemService();
export default itemService;
