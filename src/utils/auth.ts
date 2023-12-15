import * as jwt from "jsonwebtoken";
import errorHandler from "./error";
import client from "../dbs/init.redis";
import { AuthFailureError } from "../core/error.response";

export const signJwt = (payload, key, options) => {
  return jwt.sign(payload, key, {
    ...(options && options),
    algorithm: "HS256",
  });
};

export const verifyJwt = (token, key) => {
  try {
    const decode: { usr_id: any } = jwt.verify(token, key);

    return decode;
  } catch (error) {
    errorHandler(error);
  }
};

export const verifyRefreshToken = (token, key) => {
  return new Promise((resolve, reject) => {
    jwt.verify(token, key, (err, payload) => {
      if (err) {
        reject(err);
      } else return resolve(payload);
      // client.get(`usr_id:${payload.usr_id.toString()}`, (err, reply) => {
      //   if (err) {
      //     return reject(err);
      //   }
      //   if (reply == token) {
      //     return resolve(payload);
      //   }
      //   return reject(new AuthFailureError("Unauthorized"));
      // });
    });
  });
};

export const signRefreshToken = (payload, key, options) => {
  return new Promise((resolve, reject) => {
    jwt.sign(
      payload,
      key,
      {
        ...(options && options),
        algorithm: "HS256",
      },
      (err, token) => {
        if (err) {
          reject(err);
        }
        // client.set(`usr_id:${payload.usr_id.toString()}`, token, "EX", 365 * 24 * 60 * 60, (err, reply) => {
        //   if (err) {
        //     return reject(err);
        //   }
        // });
        else resolve(token);
      }
    );
  });
};
