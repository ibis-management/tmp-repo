import { newEventStreamService } from "@nelreina/redis-stream-consumer";
import { client } from "../config/redis-client.js";
import logger from "../config/logger.js";
import { faker } from "@faker-js/faker";
import { addToStream } from "../utils/stream-helper.js";
const sleep = (seconds = 2000) =>
  new Promise((resolve, reject) => {
    setTimeout(() => {
      resolve();
    }, seconds);
  });

const STREAM = process.env["STREAM"];
const events = ["PAYMENT_REQUEST_RECEIVED"];

const fakeQuotation = async (stream) => {
  const { streamId, aggregateId: ynohubId } = stream;
  await sleep(3000); // fake delay
  const amount = await faker.finance.amount(0, 300, 2);
  const quoteData = {
    quotationId: await faker.database.mongodbObjectId(),
    quotationCreationDate: await faker.date.soon(0),
    quotationExpirationDate: await faker.date.soon(1),
    feeAmount: faker.finance.amount(0, 20, 2),
    feeCurrency: "USD",
    destinationAmount: Math.round(amount * 1.8),
    sourceAmount: amount,
    fxRate: 1.8,
    isFeeInRange: true,
  };
  await addToStream("QUOTATION_RECEIVED", ynohubId, quoteData);
  console.log(
    "LOG:  ~ file: QuotationService.js ~ line 32 ~ fakeQuotation ~ quoteData",
    quoteData
  );
  stream.ack(streamId);
};

export default () => {
  logger.info("Creating event stream service");
  newEventStreamService(
    client,
    STREAM,
    "QUOTATION-SERVICE",
    events,
    fakeQuotation
  );
};
