import { Role } from "../interface/User";
import { chefOptions } from "../interface/optionMapping";
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

  getOptionFunction(option: number): () => void {
    const optionsMap: { [key: number]: (requestPayload?: any) => void } = {
      1: this.saveItemsForRecommendation,
      2: this.viewMenu,
      3: this.savefinalisedMenu,
      4: this.generateFeedbackReport,
      5: this.viewNotifications,
    };
    return optionsMap[option];
  }
}
