import { Role } from "../interface/User";
import { employeeOptions } from "../interface/optionMapping";
export class Employee implements Role {
  getOptions(): string[] {
    return employeeOptions;
  }
  voteForDesiredMeal() {}

  provideFeedback() {}

  getOptionFunction(option: number): () => void {
    const optionsMap: { [key: number]: () => void } = {
      1: this.voteForDesiredMeal,
      2: this.provideFeedback,
    };
    return optionsMap[option];
  }
}
