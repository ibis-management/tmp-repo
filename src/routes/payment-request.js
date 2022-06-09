import express from "express";
import { buildXML } from "../utils/xml.js";
import events from "../config/events.js";
import { getStatus } from "../utils/alchemy-status.js";
import { v4 as uuidv4 } from "uuid";
import logger from "../config/logger.js";
import { addToStream } from "../utils/stream-helper.js";

const api = express.Router();

api.post("/init", async (req, res) => {
  try {
    const body = req.body;
    const ynohubId = uuidv4();
    const status = getStatus(ynohubId, events.PAYMENT_REQUEST_ACCEPTED);
    await addToStream("PAYMENT_REQUEST_RECEIVED", ynohubId, body);
    res.set("Content-Type", "application/xml");
    res.send(buildXML(status));
  } catch (error) {
    logger.error(error.message);
    res.status(500).send(error.message);
  }
});

// api.post("/execute", async (req, res) => {
//   const body = req.body;

//   const {
//     root: { YNHIDN: ynohubId },
//   } = body;
//   try {
//     const status = getStatus(ynohubId, events.EXECUTION_RECEIVED);
//     await addToStream(events.EXECUTION_RECEIVED, ynohubId, body);
//     res.set("Content-Type", "application/xml");
//     res.send(buildXML(status));
//   } catch (error) {
//     console.log(
//       "LOG:  ~ file: payment-request.js ~ line 18 ~ api.post ~ error",
//       error.message
//     );
//   }
// });

export default api;
