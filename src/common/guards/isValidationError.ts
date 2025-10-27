import { StatusCodes } from "http-status-codes"
import { ValidationError } from "../errors/ValidationError"

export const isValidationError = (err: unknown): err is ValidationError => {
    return err !== null 
    && err !== undefined 
    && typeof err === 'object' 
    && 'status' in err
    && err.status === StatusCodes.BAD_REQUEST
    && 'message' in err
    && err.message === 'Validation Error'
    && 'errors' in err
    && err instanceof ValidationError
}