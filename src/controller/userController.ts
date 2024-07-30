import { Role } from "../interface/User";

export class User {
  constructor(
    public id: string,
    public name: string,
    public userId: string,
    public roleName: string,
    private role: Role
  ) {}

  getOptions(): string[] {
    return this.role.getOptions();
  }

  async executeOption(option: number, requestPayload?: any) {
    const optionFunction = this.role.getOptionFunction(option);
    if (optionFunction) {
      const response = await optionFunction.call(this.role, requestPayload);
      return response;
    } else {
      console.log(`No function found for option: ${option}`);
    }
  }
}
