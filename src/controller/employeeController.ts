import { Role } from "../interface/User";
import { employeeOptions } from "../interface/optionMapping";
import menuService from "../service/menuService";
export class Employee implements Role {
  getOptions(): string[] {
    return employeeOptions;
  }
  async voteForDesiredMeal(requestPayload: any) {
    try {
      const response = await menuService.incrementVoteForMeal(requestPayload);
      return {
        success: true,
        message: "Voting Done Successfully!",
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

  provideFeedback() {}

  getOptionFunction(option: number): () => void {
    const optionsMap: { [key: number]: (requestPayload?: any) => void } = {
      1: this.voteForDesiredMeal,
      2: this.provideFeedback,
    };
    return optionsMap[option];
  }
}
