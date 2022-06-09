// Generated project node-template
import "dotenv/config";

import { client } from "./config/redis-client.js";
import logger from "./config/logger.js";
import server from "./config/server.js";
import QuotationService from "./services/QuotationService.js";
import PublisherService from "./services/PublisherService.js";

const PORT = process.env["PORT"] || 5555;

try {
  if (client.isOpen) {
    await server.listen(PORT);
    logger.info(`Server is up on port: ${PORT}`);
    QuotationService();
    PublisherService();
  }
} catch (error) {
  logger.error(error.message);
}
