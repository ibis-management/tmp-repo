import { addToEventLog } from "@nelreina/redis-stream-consumer";
import { client } from "../config/redis-client.js";

const STREAM = process.env["STREAM"];

export const addToStream = async (event, ynohubId, payload) => {
  const streamData = {
    streamKeyName: STREAM,
    aggregateId: ynohubId,
    payload,
    event,
  };
  await addToEventLog(client, streamData);
};
