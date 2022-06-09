import axios from "axios";
import { buildXML } from "./xml.js";

export default (API, mime = "xml") => {
  const request = async (path, method = "GET", optionalData = null) => {
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

  const get = async (path, token) => await request(path, (token = token));
  const post = async (path, data, token) =>
    await request(path, "POST", data, token);
  const put = async (path, data, token) =>
    await request(path, "PUT", data, token);

  return { request, get, post, put };
};
