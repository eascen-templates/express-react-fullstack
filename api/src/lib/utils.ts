import { NextFunction, Request, Response } from "express";

interface RouteHandler {
  (request: Request, response: Response, next: NextFunction): Promise<any>;
}

export const asyncExceptionHandler = (routeHandler: RouteHandler) => {
  return async (
    request: Request,
    response: Response,
    next: NextFunction
  ): Promise<void> => {
    try {
      await routeHandler(request, response, next);
    } catch (error) {
      next(error);
    }
  };
};
