import { StatusCodes } from "http-status-codes";

type CustomError = {
    message: string,
    data?: any;
}

export class CustomHttpError extends Error {
    
    constructor(public status: StatusCodes, public message: string) {
        super();
    }
}