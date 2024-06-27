import { Role } from "../interface/User";
import { chefOptions } from "../interface/optionMapping";
import menuService from "../service/menuService";
export class Chef implements Role {
  getOptions(): string[] {
    return chefOptions;
  }

  viewMenu() {}

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
        message: "There was an error in doing so!",
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
    };
    return optionsMap[option];
  }
}
