import HttpStatusCode from "../utils/HttpStatusCode";

export class AppError extends Error {
  constructor(
    public message: string,
    public statusCode: number,
    public details?: any,
  ) {
    super(message);
    this.name = "AppError";
    Object.setPrototypeOf(this, new.target.prototype);
  }
}

export class BadRequestError extends Error {
  statusCode = HttpStatusCode.BAD_REQUEST;

  constructor(message = "Bad Request") {
    super(message);
    this.name = "BadRequestError";
    Object.setPrototypeOf(this, new.target.prototype);
  }
}

export class UnauthorizedError extends Error {
  statusCode = HttpStatusCode.UNAUTHORIZED;

  constructor(message = "Unauthorized") {
    super(message);
    this.name = "UnauthorizedError";
    Object.setPrototypeOf(this, new.target.prototype);
  }
}

export class ForbiddenError extends Error {
  statusCode = HttpStatusCode.FORBIDDEN;

  constructor(message = "Forbidden") {
    super(message);
    this.name = "ForbiddenError";
    Object.setPrototypeOf(this, new.target.prototype);
  }
}

export class NotFoundError extends Error {
  statusCode = HttpStatusCode.NOT_FOUND;

  constructor(resource: string, id?: string) {
    const message = id
      ? `${resource} with id ${id} not found`
      : `${resource} not found`;
    super(message);
    this.name = "NotFoundError";
    Object.setPrototypeOf(this, new.target.prototype);
  }
}

export class ConflictError extends Error {
  statusCode = HttpStatusCode.CONFLICT;

  constructor(message = "Conflict") {
    super(message);
    this.name = "ConflictError";
    Object.setPrototypeOf(this, new.target.prototype);
  }
}

export class InternalServerError extends Error {
  statusCode = HttpStatusCode.INTERNAL_SERVER_ERROR;

  constructor(message = "Internal Server Error") {
    super(message);
    this.name = "InternalServerError";
    Object.setPrototypeOf(this, new.target.prototype);
  }
}
