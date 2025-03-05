import HttpStatusCode from "./httpStatusCode";

export class ApiException extends Error {
    constructor(
      public status: HttpStatusCode,
      public message: string,
      public errors?: any[]
    ) {
      super(message);
      this.name = "ApiException";
      Error.captureStackTrace(this, this.constructor);
    }
  }

export class UnauthorizedException extends ApiException {
    constructor(public errors?: any[]) {
        super(HttpStatusCode.UNAUTHORIZED, "Unauthorized");
        this.name = "UnauthorizedException";
        Error.captureStackTrace(this, this.constructor);
    }
}