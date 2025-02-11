import { config } from "dotenv";
import path from "path";
import express from "express";

config({ path: ".env" });

const PORT = process.env.PORT || 3000;

const app = express();

app.use(express.json());

app.get("/api", (request, response) => {
    response.json({ message: "Hello World" });
});

if (process.env.NODE_ENV === 'production') {
    app.use(express.static(path.resolve(__dirname, '../../client/dist')));
    app.get('*', (_req, res) => {
      res.sendFile(path.resolve(__dirname, '../../client/dist/index.html'));
    });
  }

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
