import * as jwt from "jsonwebtoken";
import errorHandler from "./error";

export const signJwt = (payload, key, options) => {
  return jwt.sign(payload, key || "e1ab3176-c260-4856-8e47-96a4b8e816a5", {
    ...(options && options),
    algorithm: "HS256",
  });
};

export const verifyJwt = (token, key) => {
  try {
    const decode: any = jwt.verify(token, key || "e1ab3176-c260-4856-8e47-96a4b8e816a5");
    return decode;
  } catch (error) {
    errorHandler(error);
  }
};
