const parseRedisSearchResult = (res) => {
  const result = [];
  const [count, ...data] = res;
  const loopCount = count >= 10 ? 10 : count;
  for (let index = 0; index < loopCount; index++) {
    const id = data[index * 2];
    const [_, jsonText] = data[index * 2 + 1];
    const json = JSON.parse(jsonText);
    json["key"] = id;
    result.push(json);
  }
  return { total: count, data: result };
};

export const searchEntry = async (client, model, q) => {
  const entries = await client.sendCommand([
    "FT.SEARCH",
    `${model}:index`,
    q + "*",
  ]);
  return parseRedisSearchResult(entries);
};
