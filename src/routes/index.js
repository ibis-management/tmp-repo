import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";

import logger from "../config/logger.js";

const HUB = process.env["HUB"];

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const basePath = `/${HUB}`;

export default (app) => {
  fs.readdirSync(__dirname)
    .filter(function (file) {
      return file.indexOf(".") !== 0 && file !== "index.js";
    })
    .forEach(async function (file) {
      const routePath = file.replace(".js", "");
      logger.info(`${basePath}/${routePath}`);
      const module = await import(path.join(__dirname, file));

      app.use(`${basePath}/${routePath}`, module.default);
    });
  app.get(basePath, async (req, res) => {
    res.send({ message: `${basePath} routes` });
  });
};
