import express from "express";
import { addToStream } from "../config/redis-stream.js";
import { paymentRequestInit } from "../services/payment-request.js";
import { mapRequest } from "../services/ynohub-config.js";
import { buildXML } from "../utils/xml.js";
import events from "../config/events.js";
import { getStatus } from "../services/alchemy-status.js";

const api = express.Router();

api.post("/init", async (req, res) => {
  const body = req.body;
  // const mapped = await mapRequest(body);
  const mapped = [];
  try {
    const resp = await paymentRequestInit(mapped);
    const { ynohubId } = resp;
    const status = getStatus(ynohubId, events.PAYMENT_REQUEST_ACCEPTED);
    await addToStream(events.PAYMENT_REQUEST_ACCEPTED, ynohubId, body);
    res.set("Content-Type", "application/xml");
    res.send(buildXML(status));
  } catch (error) {
    console.log(
      "LOG:  ~ file: payment-request.js ~ line 18 ~ api.post ~ error",
      error.message
    );
  }
});
api.post("/execute", async (req, res) => {
  const body = req.body;

  const {
    root: { YNHIDN: ynohubId },
  } = body;
  try {
    const status = getStatus(ynohubId, events.EXECUTION_RECEIVED);
    await addToStream(events.EXECUTION_RECEIVED, ynohubId, body);
    res.set("Content-Type", "application/xml");
    res.send(buildXML(status));
  } catch (error) {
    console.log(
      "LOG:  ~ file: payment-request.js ~ line 18 ~ api.post ~ error",
      error.message
    );
  }
});

export default api;
