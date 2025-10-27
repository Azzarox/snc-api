import { CustomHttpError } from "../errors/CustomHttpError"
export const isCustomHttpError = (err:unknown): err is CustomHttpError  => {
    return  err !== null 
    && err !== undefined 
    && typeof err === 'object' 
    && 'status' in err
    && 'message' in err
    && err instanceof CustomHttpError
}
