import { Role } from "../interface/User";
import { adminOptions } from "../interface/optionMapping";
// import { adminOptions } from '../mappings/adminOptions';

export class Admin implements Role {
  getOptions(): string[] {
    return adminOptions;
  }

  addMenuItem() {
    console.log("in add item");
  }

  updateMenuItem() {}

  deleteMenuItem() {}

  getOptionFunction(option: number) {
    const optionsMap: { [key: number]: () => void } = {
      1: this.addMenuItem,
      2: this.updateMenuItem,
      3: this.deleteMenuItem,
    };
    return optionsMap[option];
  }
}
