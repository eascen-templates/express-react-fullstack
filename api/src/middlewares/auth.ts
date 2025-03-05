import passport from "passport";
import { Strategy as JwtStrategy } from "passport-jwt";
import { db } from "../db/drizzle";
import { eq } from "drizzle-orm";
import { users } from "../db/schema/users";
import { ApiException, UnauthorizedException } from "../types/exceptions";
import { NextFunction, Request, Response } from "express";
import HttpStatusCode from "../types/httpStatusCode";

export interface TokenPayload {
  userId: number;
}

const extractJwtFromAccessTokenCookie = (request: Request): string | null => {
  if (!request || !request.cookies) return null;

  return request.cookies["access_token"];
};

const jwtStrategy = new JwtStrategy(
  {
    jwtFromRequest: extractJwtFromAccessTokenCookie,
    secretOrKey: process.env.ACCESS_TOKEN_SECRET!,
  },
  async (payload: TokenPayload, done) => {
    try {
      const user = await db.query.users.findFirst({
        where: eq(users.id, payload.userId),
      });

      if (!user) return done(null, false);

      return done(null, user);
    } catch (error) {
      return done(error, false);
    }
  }
);

passport.use(jwtStrategy);

export const requireAuth = (
  request: Request,
  response: Response,
  next: NextFunction
) => {
  passport.authenticate(
    jwtStrategy,
    { session: false },
    (e: Error, user: any) => {
      if (e)
        return next(
          new ApiException(
            HttpStatusCode.INTERNAL_SERVER_ERROR,
            "Internal server error"
          )
        );

      if (!user) return next(new UnauthorizedException());

      request.user = user;

      next();
    }
  )(request, response, next);
};

export const optionalAuth = (
  request: Request,
  response: Response,
  next: NextFunction
) => {
  passport.authenticate(
    jwtStrategy,
    { session: false },
    (e: Error, user: any) => {
      if (e)
        return next(
          new ApiException(
            HttpStatusCode.INTERNAL_SERVER_ERROR,
            "Internal server error"
          )
        );

      if (user) {
        request.user = user;
      }

      next();
    }
  )(request, response, next);
};
