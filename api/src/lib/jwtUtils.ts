import { config } from "dotenv";
import jwt from "jsonwebtoken";

config({ path: ".env" });

const REFRESH_TOKEN_SECRET = process.env.REFRESH_TOKEN_SECRET!;
const ACCESS_TOKEN_SECRET = process.env.ACCESS_TOKEN_SECRET!;

/** Constant for 5 min (in ms) */
export const ACCESS_TOKEN_EXPIRATION = 1000 * 60 * 5;

/** Constant for 1 day (in ms) */
export const REFRESH_TOKEN_EXPIRATION = 1000 * 60 * 60 * 24 

export function generateJwtTokens(userId: number) {
  const accessToken = jwt.sign({ userId }, ACCESS_TOKEN_SECRET, {
    expiresIn: ACCESS_TOKEN_EXPIRATION,
  });

  const refreshToken = jwt.sign({ userId }, REFRESH_TOKEN_SECRET, {
    expiresIn: REFRESH_TOKEN_EXPIRATION,
  });

  return { accessToken, refreshToken };
}

export function verifyAccessToken(token: string) {
  try {
    return jwt.verify(token, ACCESS_TOKEN_SECRET);
  } catch (error) {
    return null;
  }
}

export function verifyRefreshToken(token: string) {
    try {
      return jwt.verify(token, REFRESH_TOKEN_SECRET);
    } catch (error) {
      return null;
    }
  }
