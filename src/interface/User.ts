export interface Role{
    getOptions(): string[];
    getOptionFunction(option: number): () => void;
}

export interface UserCredentials{
    userId : string,
    password : number
}