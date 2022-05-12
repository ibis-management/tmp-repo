import express from "express";
import { buildXML } from "../utils/xml.js";

const api = express.Router();

api.post("/", async (req, res) => {
  const body = req.body;
  console.log("LOG:  ~ file: alchemy-mock.js ~ line 9 ~ api.post ~ body", body);
  res.set("Content-Type", "application/xml");
  res.send(buildXML({ message: "" }));
});

export default api;
