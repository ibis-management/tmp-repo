import express from "express";
import { paymentRequestInit } from "../services/payment-request.js";
import { mapRequest } from "../services/ynohub-config.js";
import { buildXML } from "../utils/xml.js";

const api = express.Router();

api.post("/init", async (req, res) => {
  const body = req.body;
  const mapped = await mapRequest(body);
  try {
    const resp = await paymentRequestInit(mapped);
    const status = {
      ynohubId: resp.ynohubId,
      status: "SUCCESSFUL_RECEIVED",
    };
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
