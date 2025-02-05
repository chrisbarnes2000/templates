import Webhook from "./webhook";

export async function main({
  payload,
  config: { WEBHOOK_URL, WEBHOOK_METHOD, WEBHOOK_HEADERS },
  signatureHeaderName,
  signatureHeaderValue,
  action,
}) {
  try {
    const driver = new Webhook({
      WEBHOOK_URL,
      WEBHOOK_METHOD,
      WEBHOOK_HEADERS,
    });

    if (action === "testConnection") {
      return await driver.testConnection();
    }

    const { data, status } = await driver.makeRequest({
      signatureHeaderName,
      signatureHeaderValue,
      payload,
    });

    return { data, status };
  } catch (error) {
    let e: any = {};

    if (error.response) {
      // The request was made and the server responded with a status code
      // that falls out of the range of 2xx

      // console.error(error.response.data);
      // console.error(error.response.status);
      // console.error(error.response.headers);
      e = { data: error.response.data, status: error.response.status };
    } else if (error.request) {
      // The request was made but no response was received
      // `error.request` is an instance of XMLHttpRequest in the browser and an instance of
      // http.ClientRequest in node.js
      // e = error.request;
      e = { message: "unreachable endpoint", data: error.request }
    } else {
      // Something happened in setting up the request that triggered an Error
      e = { message: error.message };
    }

    throw e;
  }
}
