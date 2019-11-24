import express from "express";
import bodyParser from "body-parser";
import cors from "cors";
import helmet from "helmet";
import { Routes } from "./config/routes";
import { sequelizeInit, database } from "./config/database";

class App {
  public app: express.Application;
  public routes: Routes = new Routes();

  constructor() {
    this.app = express();
    this.config();
    this.routes.routes(this.app);
  }

  private config(): void {
    this.app.use(bodyParser.urlencoded({ extended: false }));
    this.app.use(bodyParser.json());
    this.app.use(cors());
    this.app.use(helmet());
    this.app.use(bodyParser());
    sequelizeInit();
  }
}

export default new App().app;