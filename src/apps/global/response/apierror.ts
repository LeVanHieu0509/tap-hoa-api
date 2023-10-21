class APIError extends Error {
  public ErrorID: any;
  public data: any;
  constructor(message: string, ErrorID: number, data = null) {
    super();
    Error.captureStackTrace(this, this.constructor);
    this.name = "api error";
    this.message = message;
    if (ErrorID) this.ErrorID = ErrorID;
    if (data) this.data = data;
  }
}
export default APIError;
