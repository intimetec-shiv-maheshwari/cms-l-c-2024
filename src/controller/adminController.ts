import { Item } from "../interface/Menu";
import { Role } from "../interface/User";
import { adminOptions } from "../interface/optionMapping";
import discardService from "../service/discardService";
import itemService from "../service/itemService";

export class Admin implements Role {
  getOptions(): string[] {
    return adminOptions;
  }

  async addMenuItem(requestPayload: Item) {
    const response = await itemService.addNewItem(requestPayload);
    return response;
  }

  async updateItemPrice(requestPayload: Item) {
    const response = await itemService.updateItemPrice(requestPayload);
    return response;
  }

  async updateAvailibilityStatus(requestPayload: Item) {
    const response = await itemService.updateItemAvailibilityStatus(
      requestPayload
    );
    return response;
  }

  async deleteMenuItem(requestPayload: Item) {
    console.log(requestPayload);
    const response = await itemService.deleteItem(requestPayload);
    return response;
  }

  async viewMenu() {
    const menu = await itemService.viewMenu();
    return menu;
  }

  async viewDiscardMenuItemList(requestPayload: {
    selectedOption: number;
    itemId: number;
    userId: string;
  }) {
    try {
      if (requestPayload.selectedOption === 1) {
        const result = await itemService.deleteItemById(requestPayload.itemId);
      } else if (requestPayload.selectedOption === 2) {
        const result = await discardService.insertDiscardFeedbackItem(
          requestPayload.itemId
        );
      }
      const usageLog = await discardService.insertUsageLog(
        requestPayload.selectedOption,
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

  getOptionFunction(option: number) {
    const optionsMap: { [key: number]: (requestPayload?: any) => any } = {
      1: this.addMenuItem,
      2: this.updateItemPrice,
      3: this.updateAvailibilityStatus,
      4: this.deleteMenuItem,
      5: this.viewMenu,
      6: this.viewDiscardMenuItemList,
    };
    return optionsMap[option];
  }
}
