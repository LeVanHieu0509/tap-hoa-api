import * as dotenv from "dotenv";
import { createClient } from "redis";
import { resolvePromise } from "../utils";
dotenv.config();

let client: any;

(async () => {
  client = createClient({
    password: process.env.PASS_WORD_REDIS,
    socket: {
      host: process.env.HOST_REDIS,
      port: +process.env.PORT_REDIS,
    },
    legacyMode: true,
  });

  client.on("connect", () => console.log("Redis Client Connected"));

  client.on("ready", () => console.log("Redis Client Ready"));

  await client.connect().catch((e) => console.log(e));
})();

export default client;
