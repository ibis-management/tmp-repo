import events from "../config/events.js";
import logger from "../config/logger.js";
import { addToStream } from "../config/redis-stream.js";
import RestClient from "../utils/rest-client.js";
import { getStatus } from "./alchemy-status.js";

const ALCHEMY_HOST = process.env["ALCHEMY_HOST"];

const alchemy = RestClient(ALCHEMY_HOST);

const quoteData = {
  quotationId: 19012600,
  quotationCreationDate: "2022-03-30T19:16:36Z",
  quotationExpirationDate: "2022-03-30T20:16:36Z",
  feeAmount: 4,
  feeCurrency: "USD",
  destinationAmount: 1661.02,
  sourceAmount: 50,
  fxRate: 33.2203389830509,
  isFeeInRange: true,
};

export const quotationHandler = async ({ streamId, ynohubId, ack }) => {
  console.log(
    "LOG:  ~ file: quotation.js ~ line 5 ~ handle ~ ynohubId",
    ynohubId
  );
  await addToStream(events.QUOTATION_RECEIVED, ynohubId, quoteData);
  await ack(streamId);
};

export const statusHandler = async (streamData) => {
  const { streamId, ynohubId, payload, ack, event } = streamData;
  let status = {};
  switch (event) {
    case events.PAYMENT_REQUEST_ACCEPTED:
    case events.TRANSACTION_INITIATED:
      return await ack(streamId);

    case events.QUOTATION_RECEIVED:
      status = getStatus(ynohubId, event, payload);

      break;
    default:
      status = getStatus(ynohubId, event);

      break;
  }

  try {
    logger.info(`Status Handler for event: ${event}`);
    const resp = await alchemy.request("", "POST", status, "xml");
    console.log(
      "LOG:  ~ file: stream-handlers.js ~ line 52 ~ statusHandler ~ resp",
      resp
    );
    await ack(streamId);
  } catch (error) {
    logger.error(error.message);
  }
};
