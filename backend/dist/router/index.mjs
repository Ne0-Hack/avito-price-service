import * as main from "./handler/index.mjs";
import * as api from "./api/router.mjs";
export const routes = (app) => {
    app.use("/", main.router);
    app.use("/api", api.router);
};
