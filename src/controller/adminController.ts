import { Item } from "../interface/Menu";
import { Role } from "../interface/User";
import { adminOptions } from "../interface/optionMapping";
import itemService from "../service/itemService";
// import { adminOptions } from '../mappings/adminOptions';

export class Admin implements Role {
  getOptions(): string[] {
    return adminOptions;
  }

  async addMenuItem(requestPayload: Item) {
    console.log(requestPayload);
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

  getOptionFunction(option: number) {
    const optionsMap: { [key: number]: (requestPayload?: any) => any } = {
      1: this.addMenuItem,
      2: this.updateItemPrice,
      3: this.updateAvailibilityStatus,
      4: this.deleteMenuItem,
      5: this.viewMenu,
    };
    return optionsMap[option];
  }
}
