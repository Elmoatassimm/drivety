import { inject, singleton, injectable } from "tsyringe";
import { Response } from "express";
import HttpStatusCode from "./HttpStatusCode";

interface SuccessResponse<T> {
  success: true;
  data?: T;
  message?: string;
}

interface ErrorResponse<T> {
  success: false;
  error: {
    message: T;
    errors?: any[];
  };
}

@singleton()
@injectable()
class ResponseUtils {
  // Success response with data
  sendSuccessResponse<T>(
    res: Response,
    data: T,
    status = HttpStatusCode.OK,
  ): Response<SuccessResponse<T>> {
    return res.status(status).json({ success: true, data });
  }

  // Success response without data (e.g., for delete operations)
  sendSuccessNoDataResponse(
    res: Response,
    message = "Operation successful",
    status = HttpStatusCode.OK,
  ): Response<SuccessResponse<null>> {
    return res.status(status).json({ success: true, message });
  }

  // Error response
  sendErrorResponse<T>(
    res: Response,
    message: T,
    status = HttpStatusCode.INTERNAL_SERVER_ERROR,
  ): Response<ErrorResponse<T>> {
    return res.status(status).json({ success: false, error: { message } });
  }

  // Not Found response
  sendNotFoundResponse<T>(
    res: Response,
    message: T,
    status = HttpStatusCode.NOT_FOUND,
  ): Response<ErrorResponse<T>> {
    return res.status(status).json({ success: false, error: { message } });
  }

  // Validation Error response
  sendValidationError<T>(
    res: Response,
    message: T,
    errors: any[],
    status = HttpStatusCode.BAD_REQUEST,
  ): Response<ErrorResponse<T>> {
    return res.status(status).json({
      success: false,
      error: {
        message,
        errors,
      },
    });
  }

  // Unauthorized response
  sendUnauthorizedResponse<T>(
    res: Response,
    message = "Unauthorized",
    status = HttpStatusCode.UNAUTHORIZED,
  ): Response<ErrorResponse<T>> {
    return res.status(status).json({ success: false, error: { message } });
  }

  // Forbidden response
  sendForbiddenResponse<T>(
    res: Response,
    message = "Forbidden",
    status = HttpStatusCode.FORBIDDEN,
  ): Response<ErrorResponse<T>> {
    return res.status(status).json({ success: false, error: { message } });
  }

  // Bad Request response
  sendBadRequestResponse<T>(
    res: Response,
    message: T,
    status = HttpStatusCode.BAD_REQUEST,
  ): Response<ErrorResponse<T>> {
    return res.status(status).json({ success: false, error: { message } });
  }
}

export default ResponseUtils;
