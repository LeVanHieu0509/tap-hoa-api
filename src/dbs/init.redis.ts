import * as dotenv from "dotenv";
import { createClient } from "redis";
import { resolvePromise } from "../utils";
dotenv.config();

let cli: any;

(async () => {
  cli = createClient({
    password: process.env.PASS_WORD_REDIS,
    socket: {
      host: process.env.HOST_REDIS,
      port: +process.env.PORT_REDIS,
    },
    legacyMode: true,
  });

  cli.on("connect", () => console.log("Redis Client Connected"));

  cli.on("ready", () => console.log("Redis Client Ready"));

  await cli.connect().catch((e) => console.log(e));
})();

const get = ({ key }: { key: string }) =>
  new Promise((a, b) => {
    cli.get(key, resolvePromise(a, b));
  });

const set = ({ key, value, option = "xx" }: { key: string; value: string; option: any }) =>
  new Promise((a, b) => cli.set(key, value, resolvePromise(a, b)));

const redis = {
  get,
  set,
};

export default redis;
