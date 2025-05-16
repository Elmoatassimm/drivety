import { NextFunction, Request, Response } from "express";
import { ZodError } from "zod";
import { PrismaClientKnownRequestError } from "@prisma/client/runtime/library";
import { injectable, inject, singleton } from "tsyringe";
import ResponseUtils from "../utils/response.utils";
import HttpStatusCode from "../utils/HttpStatusCode";
import Logger from "../../utils/logger";
import {
  BadRequestError,
  UnauthorizedError,
  ForbiddenError,
  ConflictError,
  InternalServerError,
  NotFoundError,
  AppError,
} from "../errors/AppError";

@singleton()
@injectable()
export default class GlobalErrorHandler {
  private logger: Logger;

  constructor(
    @inject(ResponseUtils) private responseUtils: ResponseUtils
  ) {
    this.logger = new Logger(GlobalErrorHandler.name);
  }

  handle(error: Error, req: Request, res: Response, next: NextFunction): void {
    this.logger.error(`Error processing request: ${req.method} ${req.path}`, {
      error: error.message,
      stack: error.stack,
      url: req.originalUrl,
      method: req.method,
      ip: req.ip
    });

    if (res.headersSent) {
      next(error);
      return;
    }

    // Handle custom error classes
    switch (true) {
      case error instanceof BadRequestError:
        this.responseUtils.sendBadRequestResponse(res, error.message);
        break;

      case error instanceof UnauthorizedError:
        this.responseUtils.sendUnauthorizedResponse(res, error.message);
        break;

      case error instanceof ForbiddenError:
        this.responseUtils.sendForbiddenResponse(res, error.message);
        break;

      case error instanceof NotFoundError:
        this.responseUtils.sendNotFoundResponse(res, error.message);
        break;

      case error instanceof ConflictError:
        this.responseUtils.sendErrorResponse(
          res,
          error.message,
          HttpStatusCode.CONFLICT,
        );
        break;

      case error instanceof InternalServerError:
        this.responseUtils.sendErrorResponse(res, error.message);
        break;

      case error instanceof AppError:
        this.responseUtils.sendErrorResponse(
          res,
          error.message,
          error.statusCode,
        );
        break;

      case error instanceof ZodError:
        const formattedErrors = error.errors.map((err) => ({
          field: err.path.join("."),
          message: err.message,
        }));
        this.responseUtils.sendValidationError(
          res,
          "Validation failed",
          formattedErrors,
        );
        break;

      case error instanceof PrismaClientKnownRequestError:
        this.handlePrismaError(error, res);
        break;

      default:
        this.responseUtils.sendErrorResponse(
          res,
          "Internal server error",
          HttpStatusCode.INTERNAL_SERVER_ERROR,
        );
        break;
    }
  }

  private handlePrismaError(error: PrismaClientKnownRequestError, res: Response): void {
    switch (error.code) {
      case "P2002": // Unique constraint violation
        this.responseUtils.sendErrorResponse(
          res,
          `A record with this ${error.meta?.target || "field"} already exists`,
          HttpStatusCode.CONFLICT,
        );
        break;

      case "P2025": // Record not found
        this.responseUtils.sendNotFoundResponse(
          res,
          "Record not found",
        );
        break;

      default:
        this.responseUtils.sendErrorResponse(
          res,
          "Database error occurred",
          HttpStatusCode.INTERNAL_SERVER_ERROR,
        );
        break;
    }
  }
}
