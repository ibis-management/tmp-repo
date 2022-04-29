import { Client } from "redis-om";
import { createClient } from "redis";

const url = process.env.REDIS_HOST;

export const client = createClient({ url });
await client.connect();

const OM = await new Client().use(client);

export default OM;
