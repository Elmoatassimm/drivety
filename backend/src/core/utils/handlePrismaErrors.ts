import { Prisma } from "@prisma/client";
import { NotFoundError, InternalServerError, ConflictError, BadRequestError } from "../errors/AppError";
import Logger from "../../utils/logger";

export function handlePrismaError(
  error: any,
  context?: { resource?: string; id?: string },
) {
  const logger = new Logger("PrismaErrorHandler");
  // Handle Prisma-specific errors
  if (error instanceof Prisma.PrismaClientKnownRequestError) {
    // Unique constraint violation (e.g., duplicate email)
    if (error.code === "P2002") {
      throw new ConflictError(
        `${context?.resource || "Record"} already exists`
      );
    }

    // Record not found
    if (error.code === "P2025") {
      throw new NotFoundError(context?.resource || "Record", context?.id);
    }

    // Foreign key constraint failed
    if (error.code === "P2003") {
      throw new BadRequestError(
        `Related ${error.meta?.field_name || "record"} not found`
      );
    }

    // Required field constraint failed
    if (error.code === "P2011") {
      throw new BadRequestError(
        `Required field ${error.meta?.target || "unknown"} is missing`
      );
    }
  }

  // For other types of errors or unhandled Prisma errors
  logger.error(`Unexpected database error`, {
    error: error.message,
    stack: error.stack,
    resource: context?.resource,
    id: context?.id
  });
  throw new InternalServerError("Unexpected error occurred");
}

export default handlePrismaError;
