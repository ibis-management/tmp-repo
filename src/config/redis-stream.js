import Stream from "@nelreina/redis-stream-consumer";
import { client } from "./redis-client.js";
import logger from "../config/logger.js";

const STREAM = process.env["STREAM"];

const eventStream = async (appName, watchEvent, callback) => {
  const stream = await Stream(client, STREAM, appName, { logger });

  if (stream.listen) {
    logger.info(
      `"${appName}" listening to stream "${STREAM}" for "${
        watchEvent ? "event " + watchEvent : "all events"
      }"`
    );
    stream.listen(async (id, message, ack) => {
      const { event, ynohubId, timestamp } = message;
      const payload = JSON.parse(message.payload);
      if (!watchEvent || event === watchEvent) {
        logger.info(
          JSON.stringify({ log: "listen", appName, event, ynohubId, timestamp })
        );
        await callback({ streamId: id, ynohubId, payload, ack, event });
      } else {
        await ack(id);
      }
    });
  }
};

export const addToStream = async (event, ynohubId, data) => {
  logger.info(JSON.stringify({ log: "addToStream", event, ynohubId }));
  const timestamp = new Date().toLocaleString();
  const streamData = {
    event,
    ynohubId,
    timestamp,
    payload: JSON.stringify(data),
  };
  await client.xAdd(STREAM, "*", streamData);
};

export const newStreamService = async (appName, event, handler) => {
  return eventStream(appName, event, handler);
};
