import { actionType } from "../constants/appConstants";
import { Role } from "../interface/User";
import { chefOptions } from "../interface/optionMapping";
import discardService from "../service/discardService";
import itemService from "../service/itemService";
import menuService from "../service/menuService";
import notificationService from "../service/notificationService";
export class Chef implements Role {
  getOptions(): string[] {
    return chefOptions;
  }

  async viewMenu() {
    const menu = await itemService.viewMenu();
    return menu;
  }

  async saveItemsForRecommendation(requestPayload: any) {
    console.log(requestPayload);
    const response = await menuService.saveItemsForRecommendation(
      requestPayload
    );
    return response;
  }

  generateFeedbackReport() {}

  async savefinalisedMenu(requestPayload: any) {
    try {
      const response = await menuService.finaliseMenu(requestPayload);
      return {
        success: true,
        message: response,
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

  async viewNotifications() {
    try {
      const receiverStatusCode = 2;
      const result = await notificationService.getNotifications(
        receiverStatusCode
      );
      return {
        success: true,
        message: result,
        type: "list",
      };
    } catch (error) {
      return {
        success: false,
        message: error,
        type: "message",
      };
    }
  }

  async viewDiscardMenuItemList(requestPayload: {
    actionType: number;
    itemId: number;
    userId: string;
  }) {
    try {
      if (requestPayload.actionType === actionType["Discard Item"]) {
        const result = await itemService.deleteItemById(requestPayload.itemId);
      } else if (
        requestPayload.actionType === actionType["Ask for Detailed Feedback"]
      ) {
        const result = await discardService.insertDiscardFeedbackItem(
          requestPayload.itemId
        );
      }
      const usageLog = await discardService.insertUsageLog(
        requestPayload.actionType,
        requestPayload.userId
      );
      return {
        success: true,
        message: "Operation Done Successfully!",
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

  getOptionFunction(option: number): () => void {
    const optionsMap: { [key: number]: (requestPayload?: any) => void } = {
      1: this.saveItemsForRecommendation,
      2: this.viewMenu,
      3: this.savefinalisedMenu,
      4: this.generateFeedbackReport,
      5: this.viewNotifications,
      6: this.viewDiscardMenuItemList,
    };
    return optionsMap[option];
  }
}
