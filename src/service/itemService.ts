import { Item } from "../interface/Menu";
import itemRepository from "../repository/itemRepository";
import notificationService from "./notificationService";
class ItemService {
  async addNewItem(item: Item) {
    try {
      const result = await itemRepository.addNewItem(item);
      const notificationDetails = {
        message: `${item.name} has been added to menu at price ${item.price}`,
        notificationType: 1,
        receiverStatusCode: 3,
      };
      const notificationResult = await notificationService.saveNewNotification(
        notificationDetails
      );
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
        message: "Price Updated Successfully!",
        type: "message",
      };
    } catch (error) {
      console.log(error);
      return {
        success: false,
        message: error,
        type: "message",
      };
    }
  }

  async updateItemAvailibilityStatus(item: Item) {
    try {
      const result = await itemRepository.updateAvailibilityStatus(item);
      const notificationDetails = {
        message: `${item.name}'s availibility status has been changed`,
        notificationType: 2,
        receiverStatusCode: 2,
      };
      const notificationResult = await notificationService.saveNewNotification(
        notificationDetails
      );
      return {
        success: true,
        message: "Availability Status Changed Successfully !",
        type: "message",
      };
    } catch (error) {
      return {
        success: false,
        message: error,
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
        message: error,
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

  async updateSentimentScore(itemId: number, score: number) {
    try {
      const result = await itemRepository.updateSentimentScore(itemId, score);
      return result;
    } catch (error) {
      throw error;
    }
  }

  async updateAverageRating(itemId: number, rating: number) {
    try {
      const result = await itemRepository.updateAverageRating(itemId, rating);
      return result;
    } catch (error) {
      throw error;
    }
  }

  async deleteItemById(itemId: number) {
    try {
      const result = await itemRepository.deleteItemById(itemId);
      return result;
    } catch (error) {
      throw error;
    }
  }
}

const itemService = new ItemService();
export default itemService;
