import { NextFunction, Request, Response } from "express";
import { ZodError } from "zod";
import { ApiException } from "../types/exceptions";
import HttpStatusCode from "../types/httpStatusCode";

const formatZodError = (e: ZodError) => {
  const firstError = e.errors[0];

  return {
    message: firstError.message,
    field: firstError.path.join("."),
    details: e.errors.map((error) => ({
      field: error.path.join("."),
      message: error.message,
      code: error.code,
    })),
  };
};

export const exceptionHandler = (
  e: Error | ApiException | ZodError,
  request: Request,
  response: Response,
  next: NextFunction
) => {
  console.error("Error: ", {
    name: e.name,
    message: e.message,
  });

  if (e instanceof ZodError) {
    const formattedError = formatZodError(e);

    response.status(HttpStatusCode.BAD_REQUEST).json({
      status: "error",
      message: formattedError.message,
      field: formattedError.field,
    });
    return;
  }

  if (e instanceof ApiException) {
    response.status(e.status).json({
      status: "error",
      message: e.message,
      errors: e.errors,
    });
    return;
  }

  response.status(HttpStatusCode.INTERNAL_SERVER_ERROR).json({
    status: "error",
    message: "Internal Server Error",
  });
  return;
};
