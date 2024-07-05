/**
 * User-defined function (UDF) to transform events
 * as part of a Dataflow template job.
 *
 * @param {string} inJson input Pub/Sub JSON message (stringified)
 */
function process(inJson) {
    const obj = JSON.parse(inJson);
    const includePubsubMessage = obj.data && obj.attributes;
    const data = includePubsubMessage ? obj.data : obj;

    if (!data.hasOwnProperty('url')) {
      throw new Error("No url found");
    } else if (data.url !== "https://www.duoc.cl/") {
      throw new Error("Unrecognized url");
    }

    return JSON.stringify(obj);
  }