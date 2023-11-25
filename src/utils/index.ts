import _ from "lodash";
import { customAlphabet } from "nanoid";

export const resolvePromise = (resolve, reject) => {
  return (err, data) => {
    if (err) {
      reject(err);
    }
    resolve(data);
  };
};

export function env(key: string, defaulValue?: any) {
  return process.env[key] ?? defaulValue;
}

export const unGetSelectData = (select = []) => {
  return Object.fromEntries(select.map((el) => [el, 0]));
};

export const getSelectData = (select = []) => {
  return Object.fromEntries(select.map((el) => [el, 0]));
};

export const updateNestedObjectParser = (obj: any) => {
  const final = {};

  Object.keys(obj).forEach((k) => {
    if (typeof obj[k] === "object" && !Array.isArray(obj[k])) {
      const response = updateNestedObjectParser(obj[k]);

      Object.keys(response).forEach((a) => {
        final[`${k}.${a}`] = response[a];
      });
    } else {
      final[k] = obj[k];
    }
  });

  return final;
};
export const responseClient = ({ status, data, message }: { status: string | number; data?: any; message: string }) => {
  return {
    status,
    data,
    message,
  };
};

export const isCheckHasValue = (value: string) => {
  return typeof value == "string" ? value.length > 0 : !_.isNil(value);
};

export function generateId(length = 6): string {
  // String include number and uppercase character
  const generateId = customAlphabet("123456789", length);
  return generateId();
}
