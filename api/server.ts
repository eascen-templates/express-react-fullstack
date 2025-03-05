/// <reference path="./src/types/global.d.ts" />

import cookieParser from "cookie-parser";
import { config } from "dotenv";
import express from "express";
import passport from "passport";
import { exceptionHandler } from "./src/middlewares/exceptionHandler";
import { authRouter } from "./src/features/auth/authRouter";
import cors from "cors";
import { optionalAuth } from "./src/middlewares/auth";

config({ path: ".env" });

const PORT = process.env.PORT || 8080;

const app = express();

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(
  cors({
    origin: process.env.APP_ORIGIN,
    credentials: true,
  })
);
app.use(cookieParser());
app.use(passport.initialize());

app.use(optionalAuth);

app.use((request, response, next) => {
  console.log(request.method + request.path + " " + new Date().toLocaleTimeString());
  next();
});

app.get("/", (request, response) => {
  response.json({ message: "Hello World" });
});

app.use("/auth", authRouter);

app.use(exceptionHandler);

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
