import {Express} from "express";

import * as main from "./handler/index.mjs";
import * as api from "./api/router.mjs";

export const routes = (app: Express) => {
  app.use("/", main.router)
  app.use("/api", api.router)
}

