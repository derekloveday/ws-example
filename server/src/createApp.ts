import cors from "cors";
import express, { Express } from "express";
import path from "path";
import routes from "./routes";

const createApp = (): Express => {
  const app = express();

  app.use(cors());
  app.use(express.json());

  app.use(express.static(path.resolve(__dirname, "public")));

  app.use("/", routes());

  return app;
};

export default createApp;
