import { config } from "dotenv";
import express from "express";
import passport from "passport";

config({ path: ".env" });

const PORT = process.env.PORT || 8080;

const app = express();

app.use(express.json());
app.use(passport.initialize())

app.use((request, response, next) => {
  console.log(request.method + request.path);
  next();
});

app.get("/", (request, response) => {
  response.json({ message: "Hello Worl" });
});

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
