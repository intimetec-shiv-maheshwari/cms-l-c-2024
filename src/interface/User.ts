export interface Role{
    getOptions(): string[];
    getOptionFunction(option: number): (requestPayload: any) => void;
}

export interface UserCredentials{
    userId : string,
    password : number
}