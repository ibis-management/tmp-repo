import express from "express";
import routes from "../routes/index.js";
import xmlParser from "express-xml-bodyparser";
import pino from "pino-http";
const HUB_SOURCE_MIME = process.env["HUB_SOURCE_MIME"] || "json";

const app = express();
app.use(pino());

if (HUB_SOURCE_MIME === "xml") {
  app.use(xmlParser({ explicitArray: false, normalizeTags: false }));
}

routes(app);
export default app;
