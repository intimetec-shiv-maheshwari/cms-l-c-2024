import { Role } from "../interface/User";
import { chefOptions } from "../interface/optionMapping";
import menuService from "../service/menuService";
export class Chef implements Role {
  getOptions(): string[] {
    return chefOptions;
  }

  viewMenu() {
  }

  async saveItemsForRecommendation(requestPayload: any) {
    console.log(requestPayload)
    const response = await menuService.saveItemsForRecommendation(requestPayload)
    return response;
  }

  generateFeedbackReport() {}

  viewEmployeeChoices() {}
  getOptionFunction(option: number): () => void {
    const optionsMap: { [key: number]: (requestPayload?:any) => void } = {
      1: this.saveItemsForRecommendation,
      2: this.viewMenu,
      3: this.generateFeedbackReport,
      4: this.viewEmployeeChoices,
    };
    return optionsMap[option];
  }
}
