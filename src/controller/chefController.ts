import { Role } from "../interface/User";
import { chefOptions } from "../interface/optionMapping";
export class Chef implements Role {
  getOptions(): string[] {
    return chefOptions;
  }

  viewMenu() {}

  rollOutItemsRecommendation() {}

  generateFeedbackReport() {}

  viewEmployeeChoices() {}
  getOptionFunction(option: number): () => void {
    const optionsMap: { [key: number]: () => void } = {
      1: this.viewMenu,
      2: this.rollOutItemsRecommendation,
      3: this.generateFeedbackReport,
      4: this.viewEmployeeChoices,
    };
    return optionsMap[option];
  }
}
