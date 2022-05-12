// Generated project node-template
import "dotenv/config";
import OS from "os";

import { client } from "./config/redis-client.js";
import logger from "./config/logger.js";
import server from "./config/server.js";
import { newStreamService } from "./config/redis-stream.js";
import events from "./config/events.js";
import { quotationHandler, statusHandler } from "./services/stream-handlers.js";

const PORT = process.env["PORT"] || 5555;

try {
  if (client.isOpen) {
    await server.listen(PORT);
    logger.info(`Server is up on port: ${PORT}`);

    newStreamService(
      "QUOTE-SRV",
      events.PAYMENT_REQUEST_ACCEPTED,
      quotationHandler
    );
    newStreamService("STATUS-SRV", false, statusHandler);
  }
} catch (error) {
  logger.error(error.message);
}
