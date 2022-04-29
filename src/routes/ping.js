import express from "express";

const api = express.Router();

api.get("/", async (req, res) => {
  res.send("PONG");
});

export default api;
