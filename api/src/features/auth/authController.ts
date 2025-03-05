import { Request, Response } from "express";
import { asyncExceptionHandler } from "../../lib/utils";
import { authValidator } from "../../lib/validators";
import { authService } from "./authService";
import { ApiException, UnauthorizedException } from "../../types/exceptions";
import {
  ACCESS_TOKEN_EXPIRATION,
  REFRESH_TOKEN_EXPIRATION,
} from "../../lib/jwtUtils";
import HttpStatusCode from "../../types/httpStatusCode";

export const me = asyncExceptionHandler(
  async (request: Request, response: Response) => {;
    if (!request.user) throw new UnauthorizedException();
    
    response.status(HttpStatusCode.OK).json(request.user);
  }
);

export const register = asyncExceptionHandler(
  async (request: Request, response: Response) => {
    const data = authValidator.register.parse(request.body);
    await authService.register(data);

    response.status(HttpStatusCode.CREATED).json({
      status: "success",
      message: "Registration successful. Please verify your email",
    });
  }
);

export const verifyEmail = asyncExceptionHandler(
  async (request: Request, response: Response) => {
    const { token } = request.params;
    await authService.verifyEmail(token);

    response.status(HttpStatusCode.CREATED).json({
      status: "success",
      message: "Email verified Successfully",
    });
  }
);

export const login = asyncExceptionHandler(
  async (request: Request, response: Response) => {
    const data = authValidator.login.parse(request.body);
    const { accessToken, refreshToken } = await authService.login(data);

    response
      .status(HttpStatusCode.CREATED)
      .cookie("access_token", accessToken, {
        httpOnly: true,
        sameSite: "strict",
        secure: true,
        expires: new Date(Date.now() + ACCESS_TOKEN_EXPIRATION),
      })
      .cookie("refresh_token", refreshToken, {
        httpOnly: true,
        sameSite: "strict",
        secure: true,
        expires: new Date(Date.now() + REFRESH_TOKEN_EXPIRATION),
      })
      .json({
        status: "success",
        message: "You have successfully logged in",
      });
  }
);

export const refreshToken = asyncExceptionHandler(
  async (request: Request, response: Response) => {
    const token = request.cookies["refresh_token"];

    if (!token)
      throw new ApiException(
        HttpStatusCode.UNAUTHORIZED,
        "No refresh token provided"
      );

    const { accessToken, refreshToken } = await authService.refreshToken(token);

    response
      .status(201)
      .cookie("access_token", accessToken, {
        httpOnly: true,
        sameSite: "strict",
        secure: true,
        expires: new Date(Date.now() + ACCESS_TOKEN_EXPIRATION),
      })
      .cookie("refresh_token", refreshToken, {
        httpOnly: true,
        sameSite: "strict",
        secure: true,
        expires: new Date(Date.now() + REFRESH_TOKEN_EXPIRATION),
      })
      .json({
        status: "success",
        message: "Tokens refreshed",
      });
  }
);

export const logout = asyncExceptionHandler(
  async (request: Request, response: Response) => {
    if (!request.user) throw new UnauthorizedException();

    await authService.logout(request.user.id);

    response
      .status(HttpStatusCode.CREATED)
      .clearCookie("access_token")
      .clearCookie("refresh_token")
      .json({
        status: "success",
        message: "You have successfully logged out",
      });
  }
);

export const forgotPassword = asyncExceptionHandler(
  async (request: Request, response: Response) => {}
);

export const resetPassword = asyncExceptionHandler(
  async (request: Request, response: Response) => {}
);
