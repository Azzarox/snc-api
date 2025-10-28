import { StatusCodes } from "http-status-codes";
import { Errors } from "../errors/shared/types";


class GenericResponse {
    public success: boolean;

    constructor(public status: StatusCodes) {
        this.success = status >= 200 && status < 300;
    }
}

export class SuccessResponse<T> extends GenericResponse {
    constructor(public status: StatusCodes, public message: string | null, public data: T) {
        super(status);
    }
}

export class FailResponse extends GenericResponse {
    constructor(public status: StatusCodes, public message: string | null) {
        super(status);
    }
}

export class ErrorResponse extends GenericResponse {
  constructor(public status: StatusCodes, public message: string | null, public errors: Errors) {
    super(status);
  }
}