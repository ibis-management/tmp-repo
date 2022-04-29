import { client } from "./redis-client.js";
import logger from "../config/logger.js";

const BLOCK = 30000; // For 1 minute

const createGroup = async (key, group) => {
  try {
    const resp = await client.xGroupCreate(key, group, "$", {
      MKSTREAM: true,
    });
    return true;
  } catch (error) {
    if (error.message.includes("already exists")) {
      const info = await client.xInfoGroups(key);
      logger.info(JSON.stringify(info));
      return true;
    } else {
      logger.error(error.message);
      return false;
    }
  }
};

const createConsumer = async (key, group, consumer) => {
  try {
    await client.xGroupCreateConsumer(key, group, consumer);
    const info = await client.xInfoConsumers(key, group);
    logger.info(JSON.stringify(info));
    return true;
  } catch (error) {
    console.log(
      "LOG:  ~ file: redis-stream.js ~ line 9 ~ error",
      error.message
    );
    return false;
  }
};

export default async (key, group, consumer, ack = true) => {
  const groupOK = await createGroup(key, group);
  if (!groupOK) return {};
  const consumerOK = await createConsumer(key, group, consumer);
  if (!consumerOK) return {};
  const streamClient = client.duplicate();
  await streamClient.connect();

  // Start listen to stream
  const listen = async (streamHandler) => {
    const messages = await streamClient.xReadGroup(
      group,
      consumer,
      { key, id: ">" },
      { BLOCK, COUNT: 1 }
    );
    if (messages) {
      const msg = messages[0];
      const [payload] = msg.messages;
      await streamHandler(payload);
      if (ack) {
        await streamClient.xAck(key, group, payload.id);
      }

      listen(streamHandler);
    } else {
      listen(streamHandler);
    }
  };
  return { listen };
};
