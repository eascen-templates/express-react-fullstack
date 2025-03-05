import { eq, or } from "drizzle-orm";
import { db } from "../../db/drizzle";
import { refreshTokens, users } from "../../db/schema/users";
import { ApiException } from "../../types/exceptions";
import bcryptjs from "bcryptjs";
import crypto from "crypto";
import {
  generateJwtTokens,
  REFRESH_TOKEN_EXPIRATION,
} from "../../lib/jwtUtils";
import HttpStatusCode from "../../types/httpStatusCode";

export const authService = {
  register: async (data: {
    username: string;
    email: string;
    password: string;
  }) => {
    const existingUser = await db.query.users.findFirst({
      where: or(eq(users.email, data.email), eq(users.username, data.username)),
    });

    if (existingUser)
      throw new ApiException(
        HttpStatusCode.CONFLICT,
        "This user is already registered"
      );

    const hashedPassword = await bcryptjs.hash(data.password, 10);
    const verificationToken = crypto.randomBytes(32).toString("hex");

    const [user] = await db
      .insert(users)
      .values({
        username: data.username,
        email: data.email,
        password: hashedPassword,
        verificationToken,
      })
      .returning();

    return user;
  },

  login: async (data: { email: string; password: string }) => {
    const existingUser = await db.query.users.findFirst({
      where: eq(users.email, data.email),
    });

    if (!existingUser)
      throw new ApiException(HttpStatusCode.BAD_REQUEST, "Invalid credentials");

    if (!existingUser.isVerified)
      throw new ApiException(
        HttpStatusCode.BAD_REQUEST,
        "Verify your email before trying to log in"
      );

    if (!existingUser.password)
      throw new ApiException(
        HttpStatusCode.BAD_REQUEST,
        "Please log in using the provider you registered with"
      );

    const isValidPassword = await bcryptjs.compare(
      data.password,
      existingUser.password
    );

    if (!isValidPassword)
      throw new ApiException(HttpStatusCode.BAD_REQUEST, "Invalid credentials");

    const { accessToken, refreshToken } = generateJwtTokens(existingUser.id);

    await db.insert(refreshTokens).values({
      userId: existingUser.id,
      token: refreshToken,
      expiresAt: new Date(Date.now() + REFRESH_TOKEN_EXPIRATION),
    });

    return {
      accessToken,
      refreshToken,
    };
  },

  logout: async (userId: number) => {
    await db.delete(refreshTokens).where(eq(refreshTokens.userId, userId));
  },

  refreshToken: async (token: string) => {
    const existingToken = await db.query.refreshTokens.findFirst({
      where: eq(refreshTokens.token, token),
    });

    if (!existingToken || existingToken.expiresAt < new Date())
      throw new ApiException(
        HttpStatusCode.UNAUTHORIZED,
        "Invalid or expired refresh token"
      );

    const { accessToken, refreshToken } = generateJwtTokens(
      existingToken.userId
    );

    await db
      .delete(refreshTokens)
      .where(eq(refreshTokens.userId, existingToken.userId));
    await db.insert(refreshTokens).values({
      userId: existingToken.userId,
      token: refreshToken,
      expiresAt: new Date(Date.now() + REFRESH_TOKEN_EXPIRATION),
    });

    return { accessToken, refreshToken };
  },

  verifyEmail: async (token: string) => {
    const user = await db.query.users.findFirst({
      where: eq(users.verificationToken, token),
    });

    if (!user)
      throw new ApiException(
        HttpStatusCode.BAD_REQUEST,
        "Invalid verfication token"
      );

    await db
      .update(users)
      .set({
        isVerified: true,
        verificationToken: null,
      })
      .where(eq(users.id, user.id));

    return true;
  },
};
