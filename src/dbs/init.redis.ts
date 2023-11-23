import * as dotenv from "dotenv";
import { createClient } from "redis";
import { resolvePromise } from "../utils";
dotenv.config();

let client: any;

(async () => {
  client = createClient({
    password: process.env.REDIS_PASS,
    socket: {
      host: process.env.REDIS_HOST,
      port: +process.env.REDIS_PORT,
    },
    legacyMode: true,
  });

  // client = createClient({
  //   url: process.env.REDIS_HOST,
  //   legacyMode: true,
  // });

  client.on("connect", () => console.log("Redis Client Connected"));

  client.on("ready", () => console.log("Redis Client Ready"));

  await client.connect().catch((e) => console.log(e));
})();

export default client;
