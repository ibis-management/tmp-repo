import RestClient from "../utils/rest-client.js";
import { get } from "lodash-es";

const YNOHUB_CONFIG_API = process.env["YNOHUB_CONFIG_API"];

const ynohubConfigApi = RestClient(YNOHUB_CONFIG_API);

export const mapRequest = async (body, type = "REQUEST") => {
  const mapped = {};
  const { field_mappings } = await ynohubConfigApi.request("/hubs/1");

  field_mappings
    .filter((f) => f.type === type)
    .forEach((field) => {
      mapped[field.target] = get(body, field.source, field.defaultValue);
    });

  return mapped;
};
