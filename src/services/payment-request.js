import RestClient from "../utils/rest-client.js";
import { v4 as uuidv4 } from "uuid";

const HUB_API = process.env["HUB_API"];
const HUB_CONFIG_API = process.env["HUB_CONFIG_API"];

const hubApi = RestClient(HUB_API);
const hubConfigApi = RestClient(HUB_CONFIG_API);

export const handlePaymentStatus = async (status) => {
  console.log(
    "LOG:  ~ file: payment-request.js ~ line 2 ~ handlePaymentStatus ~ status",
    JSON.stringify(status)
  );
};

const validate = async (payreq) => {
  return await hubConfigApi.request(
    "/payment-requests/validate",
    "POST",
    payreq
  );
};

export const paymentRequestInit = async (payreq) => {
  const ynohubId = uuidv4();
  const body = { ...payreq, ynohubId };

  // const data = await validate(body);

  // return data;
  return body;
};
