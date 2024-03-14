import express from "express";
import cors from "cors";
import bodyParser from "body-parser";
import * as dotenv from "dotenv";
import { initStorage } from "./matrix/storage.mjs";
import { routes } from "./router/index.mjs";
dotenv.config();
const app = express();
app.use(bodyParser.json());
app.use(cors({
    origin: '*'
}));
const port = Number(process.env.PORT) ?? 3000;
try {
    await initStorage();
    setInterval(async () => {
        await initStorage();
    }, 500);
}
catch (e) {
    console.log(e);
}
routes(app);
app.listen(port, () => {
    console.log(`Server started at: http://localhost:${port}`);
});
