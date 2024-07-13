import {
  NotificationType,
  receiverStatusCode,
} from "../constants/appConstants";
import { Item } from "../interface/Menu";
import itemRepository from "../repository/itemRepository";
import notificationService from "./notificationService";
class ItemService {
  async addNewItem(item: Item) {
    try {
      const result = await itemRepository.addNewItem(item);
      const notificationMessage = `${item.name} has been added to menu at price ${item.price}`;
      const notificationResult = await notificationService.saveNewNotification(
        notificationMessage,
        NotificationType["New Item Added"],
        receiverStatusCode.Both
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
      const count = await itemRepository.checkItemExists(item.name!);
      if (count > 0) {
        const result = await itemRepository.updatePrice(item);
        return {
          success: true,
          message: "Price Updated Successfully!",
          type: "message",
        };
      } else {
        return {
          success: false,
          message: `Item with name '${name}' does not exist.`,
          type: "error",
        };
      }
    } catch (error) {
      return {
        success: false,
        message: error,
        type: "message",
      };
    }
  }

  async updateItemAvailibilityStatus(item: Item) {
    try {
      const count = await itemRepository.checkItemExists(item.name!);
      if (count > 0) {
        const result = await itemRepository.updateAvailibilityStatus(item);
        const notificationMessage = `${item.name}'s availibility status has been changed`;
        const notificationResult =
          await notificationService.saveNewNotification(
            notificationMessage,
            NotificationType["Availibility Status Changed"],
            receiverStatusCode.Employee
          );
        return {
          success: true,
          message: "Availability Status Changed Successfully !",
          type: "message",
        };
      }
    } catch (error) {
      return {
        success: false,
        message: error,
        type: "message",
      };
    }
  }

  async deleteItem(itemName: string) {
    try {
      const count = await itemRepository.checkItemExists(itemName);
      if (count > 0) {
        const result = await itemRepository.deleteItem(itemName);
        return {
          success: true,
          message: "Item Deleted Successfully!",
          type: "message",
        };
      } else {
        return {
          success: false,
          message: "No such Item exist",
          type: "message",
        };
      }
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
