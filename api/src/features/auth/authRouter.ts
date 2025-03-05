import { Router } from "express";
import {
  login,
  logout,
  me,
  refreshToken,
  register,
  verifyEmail,
} from "./authController";
import { requireAuth } from "../../middlewares/auth";

const authRouter = Router();

authRouter.post("/register", register);
authRouter.post("/login", login);
authRouter.get("/logout", requireAuth, logout);
authRouter.get("/verify-email/:token", verifyEmail);
authRouter.post("/refresh", refreshToken);
authRouter.get("/me", requireAuth, me);

export { authRouter };
