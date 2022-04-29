import express from "express";
import { paymentRequestInit } from "../services/payment-request.js";
import { mapRequest } from "../services/ynohub-config.js";

const api = express.Router();

api.post("/init", async (req, res) => {
  const body = req.body;
  const mapped = await mapRequest(body);
  try {
    const resp = await paymentRequestInit(mapped);
    console.log(
      "LOG:  ~ file: payment-request.js ~ line 12 ~ api.post ~ resp",
      JSON.stringify(resp, null, 2)
    );
  } catch (error) {
    console.log(
      "LOG:  ~ file: payment-request.js ~ line 18 ~ api.post ~ error",
      error.message
    );
  }
  res.send(mapped);
});

export default api;
