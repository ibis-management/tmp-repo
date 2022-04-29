import axios from "axios";
import { buildXML } from "./xml.js";

export default (API) => {
  const request = async (
    path,
    method = "GET",
    optionalData = null,
    mime = "json"
  ) => {
    const url = `${API}${path}`;
    const options = {
      method,
      url,
      headers: {
        "Content-Type": `application/${mime}`,
        Accept: `application/${mime}`,
      },
    };

    if (optionalData) {
      let body = optionalData;
      switch (mime) {
        case "json":
          options.data = body;
          break;

        case "xml":
          body = await buildXML(optionalData);
          options.data = body;
          break;

        default:
          break;
      }
    }
    let badRequestData;
    const { status, data } = await axios(options).catch((err) => {
      switch (err.response?.status) {
        case 400:
          badRequestData = err.response?.data;
          return { status: 400 };
        case 401:
          console.log("LOG: ~ rest-client.js: ~ 401");
          throw new Error("Unauthorized");
        case 404:
          console.log("LOG: ~ rest-client.js ~ 404");
          throw new Error(`${err.config.url} not found`);
        default:
          throw new Error(JSON.stringify(err.response?.data));
      }
    });

    if (status >= 200 && status < 210) {
      return data;
    } else if (status === 400) {
      return badRequestData;
    } else {
      throw Error(`Status ${status}`);
    }
  };

  return { request };
};
