// Generated project node-template
import "dotenv/config";
import OS from "os";

import { client } from "./config/redis-client.js";
import logger from "./config/logger.js";
import Stream from "./config/redis-stream.js";
import server from "./config/server.js";
import { handlePaymentStatus } from "./services/payment-request.js";

const HUB_STATUS_STREAM = process.env["HUB_STATUS_STREAM"];
const CONSUMER_GROUP = process.env["CONSUMER_GROUP"];
const PORT = process.env["PORT"] || 5555;
const CONSUMER_NAME = OS.hostname();

try {
  if (client.isOpen) {
    logger.info("STREAM: " + HUB_STATUS_STREAM);
    logger.info("CONSUMER_GROUP: " + CONSUMER_GROUP);
    logger.info("CONSUMER_NAME: " + CONSUMER_NAME);
    logger.info("Successfully connected to redis");

    const stream = await Stream(
      HUB_STATUS_STREAM,
      CONSUMER_GROUP,
      CONSUMER_NAME
    );

    if (stream.listen) {
      stream.listen(handlePaymentStatus);
    }

    await server.listen(PORT);
    logger.info(`Server is up on port: ${PORT}`);
  }
} catch (error) {
  logger.error(error.message);
}
