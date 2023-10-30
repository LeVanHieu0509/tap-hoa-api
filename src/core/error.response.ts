const StatusCode = {
  FORBIDDEN: 403,
  CONFLICT: 409,
  UNAUTHORIZED: 401,
  NOT_FOUND: 404,
  INTERNAL_SERVER: 500,
};

const ReasonStatusCode = {
  FORBIDDEN: "Bad request error",
  CONFLICT: "conflict error",
  UNAUTHORIZED: "unauthorized",
  NOT_FOUND: "not found",
  INTERNAL_SERVER: "Internal Server",
};

class ErrorResponse extends Error {
  status: any;

  constructor(message, status) {
    super(message);
    this.status = status;
  }
}

class ConflictRequestError extends ErrorResponse {
  constructor(message, statusCode) {
    super(message, statusCode);
  }
}

class BadRequestError extends ErrorResponse {
  constructor(message = ReasonStatusCode.CONFLICT, statusCode = StatusCode.FORBIDDEN) {
    super(message, statusCode);
  }
}

class AuthFailureError extends ErrorResponse {
  constructor(message = ReasonStatusCode.UNAUTHORIZED, statusCode = StatusCode.UNAUTHORIZED) {
    super(message, statusCode);
  }
}

class NotFoundError extends ErrorResponse {
  constructor(message = ReasonStatusCode.NOT_FOUND, statusCode = StatusCode.NOT_FOUND) {
    super(message, statusCode);
  }
}

class Forbidden extends ErrorResponse {
  constructor(message = ReasonStatusCode.FORBIDDEN, statusCode = StatusCode.FORBIDDEN) {
    super(message, statusCode);
  }
}

class InternalServer extends ErrorResponse {
  constructor(message = ReasonStatusCode.INTERNAL_SERVER, statusCode = StatusCode.INTERNAL_SERVER) {
    super(message, statusCode);
  }
}

export { ConflictRequestError, BadRequestError, AuthFailureError, NotFoundError, Forbidden, InternalServer };
