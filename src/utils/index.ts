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
