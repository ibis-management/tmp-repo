import { newEventStreamService } from "@nelreina/redis-stream-consumer";
import { client } from "../config/redis-client.js";
import logger from "../config/logger.js";
import RestClient from "../utils/rest-client.js";
import { getStatus } from "../utils/alchemy-status.js";

const STREAM = process.env["STREAM"];
const events = ["QUOTATION_RECEIVED"];
const ALCHEMY_HOST = process.env["ALCHEMY_HOST"];
const alchemyService = RestClient(ALCHEMY_HOST, "xml");

const publish = async (stream) => {
  const { streamId, aggregateId: ynohubId, payload } = stream;

  const status = getStatus(ynohubId, "QUOTATION_RECEIVED", payload);

  alchemyService.post(`/`, status);

  stream.ack(streamId);
};

export default () => {
  logger.info("Creating event stream service");
  newEventStreamService(client, STREAM, "PUBLISHER-SERVICE", events, publish);
};
