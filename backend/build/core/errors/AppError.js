"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.InternalServerError = exports.ConflictError = exports.NotFoundError = exports.ForbiddenError = exports.UnauthorizedError = exports.BadRequestError = exports.AppError = void 0;
const HttpStatusCode_1 = __importDefault(require("../utils/HttpStatusCode"));
class AppError extends Error {
    constructor(message, statusCode, details) {
        super(message);
        this.message = message;
        this.statusCode = statusCode;
        this.details = details;
        this.name = "AppError";
        Object.setPrototypeOf(this, new.target.prototype);
    }
}
exports.AppError = AppError;
class BadRequestError extends Error {
    constructor(message = "Bad Request") {
        super(message);
        this.statusCode = HttpStatusCode_1.default.BAD_REQUEST;
        this.name = "BadRequestError";
        Object.setPrototypeOf(this, new.target.prototype);
    }
}
exports.BadRequestError = BadRequestError;
class UnauthorizedError extends Error {
    constructor(message = "Unauthorized") {
        super(message);
        this.statusCode = HttpStatusCode_1.default.UNAUTHORIZED;
        this.name = "UnauthorizedError";
        Object.setPrototypeOf(this, new.target.prototype);
    }
}
exports.UnauthorizedError = UnauthorizedError;
class ForbiddenError extends Error {
    constructor(message = "Forbidden") {
        super(message);
        this.statusCode = HttpStatusCode_1.default.FORBIDDEN;
        this.name = "ForbiddenError";
        Object.setPrototypeOf(this, new.target.prototype);
    }
}
exports.ForbiddenError = ForbiddenError;
class NotFoundError extends Error {
    constructor(resource, id) {
        const message = id
            ? `${resource} with id ${id} not found`
            : `${resource} not found`;
        super(message);
        this.statusCode = HttpStatusCode_1.default.NOT_FOUND;
        this.name = "NotFoundError";
        Object.setPrototypeOf(this, new.target.prototype);
    }
}
exports.NotFoundError = NotFoundError;
class ConflictError extends Error {
    constructor(message = "Conflict") {
        super(message);
        this.statusCode = HttpStatusCode_1.default.CONFLICT;
        this.name = "ConflictError";
        Object.setPrototypeOf(this, new.target.prototype);
    }
}
exports.ConflictError = ConflictError;
class InternalServerError extends Error {
    constructor(message = "Internal Server Error") {
        super(message);
        this.statusCode = HttpStatusCode_1.default.INTERNAL_SERVER_ERROR;
        this.name = "InternalServerError";
        Object.setPrototypeOf(this, new.target.prototype);
    }
}
exports.InternalServerError = InternalServerError;
