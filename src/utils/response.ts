export enum MESSAGE_TYPE {
  success = 1,
  warning = 2,
  failed = -1,
}

export function commonResponse(status: number, message: number, data?: any, note?: string | unknown) {
  return {
    status: status,
    message: MESSAGE_TYPE[message].toString(),
    data: data ?? {},
    note: note || "",
  };
}
