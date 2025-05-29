"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.handlePrismaError = handlePrismaError;
const client_1 = require("@prisma/client");
const AppError_1 = require("../errors/AppError");
const logger_1 = __importDefault(require("../../utils/logger"));
function handlePrismaError(error, context) {
    var _a, _b;
    const logger = new logger_1.default("PrismaErrorHandler");
    // Handle Prisma-specific errors
    if (error instanceof client_1.Prisma.PrismaClientKnownRequestError) {
        // Unique constraint violation (e.g., duplicate email)
        if (error.code === "P2002") {
            throw new AppError_1.ConflictError(`${(context === null || context === void 0 ? void 0 : context.resource) || "Record"} already exists`);
        }
        // Record not found
        if (error.code === "P2025") {
            throw new AppError_1.NotFoundError((context === null || context === void 0 ? void 0 : context.resource) || "Record", context === null || context === void 0 ? void 0 : context.id);
        }
        // Foreign key constraint failed
        if (error.code === "P2003") {
            throw new AppError_1.BadRequestError(`Related ${((_a = error.meta) === null || _a === void 0 ? void 0 : _a.field_name) || "record"} not found`);
        }
        // Required field constraint failed
        if (error.code === "P2011") {
            throw new AppError_1.BadRequestError(`Required field ${((_b = error.meta) === null || _b === void 0 ? void 0 : _b.target) || "unknown"} is missing`);
        }
    }
    // For other types of errors or unhandled Prisma errors
    logger.error(`Unexpected database error`, {
        error: error.message,
        stack: error.stack,
        resource: context === null || context === void 0 ? void 0 : context.resource,
        id: context === null || context === void 0 ? void 0 : context.id
    });
    throw new AppError_1.InternalServerError("Unexpected error occurred");
}
exports.default = handlePrismaError;
