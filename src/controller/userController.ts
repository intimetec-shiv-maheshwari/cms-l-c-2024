import { Role } from "../interface/User";

export class User {
  constructor(
    public id: string,
    public name: string,
    public userId: string,
    private role: Role
  ) {}

  getOptions(): string[] {
    return this.role.getOptions();
  }

  executeOption(option: number) {
    const optionFunction = this.role.getOptionFunction(option);
    if (optionFunction) {
      optionFunction.call(this.role);
    } else {
      console.log(`No function found for option: ${option}`);
    }
  }
}
