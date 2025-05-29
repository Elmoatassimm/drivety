"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
var GlobalErrorHandler_1;
Object.defineProperty(exports, "__esModule", { value: true });
const zod_1 = require("zod");
const library_1 = require("@prisma/client/runtime/library");
const tsyringe_1 = require("tsyringe");
const response_utils_1 = __importDefault(require("../utils/response.utils"));
const HttpStatusCode_1 = __importDefault(require("../utils/HttpStatusCode"));
const logger_1 = __importDefault(require("../../utils/logger"));
const AppError_1 = require("../errors/AppError");
let GlobalErrorHandler = GlobalErrorHandler_1 = class GlobalErrorHandler {
    constructor(responseUtils) {
        this.responseUtils = responseUtils;
        this.logger = new logger_1.default(GlobalErrorHandler_1.name);
    }
    handle(error, req, res, next) {
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
            case error instanceof AppError_1.BadRequestError:
                this.responseUtils.sendBadRequestResponse(res, error.message);
                break;
            case error instanceof AppError_1.UnauthorizedError:
                this.responseUtils.sendUnauthorizedResponse(res, error.message);
                break;
            case error instanceof AppError_1.ForbiddenError:
                this.responseUtils.sendForbiddenResponse(res, error.message);
                break;
            case error instanceof AppError_1.NotFoundError:
                this.responseUtils.sendNotFoundResponse(res, error.message);
                break;
            case error instanceof AppError_1.ConflictError:
                this.responseUtils.sendErrorResponse(res, error.message, HttpStatusCode_1.default.CONFLICT);
                break;
            case error instanceof AppError_1.InternalServerError:
                this.responseUtils.sendErrorResponse(res, error.message);
                break;
            case error instanceof AppError_1.AppError:
                this.responseUtils.sendErrorResponse(res, error.message, error.statusCode);
                break;
            case error instanceof zod_1.ZodError:
                const formattedErrors = error.errors.map((err) => ({
                    field: err.path.join("."),
                    message: err.message,
                }));
                this.responseUtils.sendValidationError(res, "Validation failed", formattedErrors);
                break;
            case error instanceof library_1.PrismaClientKnownRequestError:
                this.handlePrismaError(error, res);
                break;
            default:
                this.responseUtils.sendErrorResponse(res, "Internal server error", HttpStatusCode_1.default.INTERNAL_SERVER_ERROR);
                break;
        }
    }
    handlePrismaError(error, res) {
        var _a;
        switch (error.code) {
            case "P2002": // Unique constraint violation
                this.responseUtils.sendErrorResponse(res, `A record with this ${((_a = error.meta) === null || _a === void 0 ? void 0 : _a.target) || "field"} already exists`, HttpStatusCode_1.default.CONFLICT);
                break;
            case "P2025": // Record not found
                this.responseUtils.sendNotFoundResponse(res, "Record not found");
                break;
            default:
                this.responseUtils.sendErrorResponse(res, "Database error occurred", HttpStatusCode_1.default.INTERNAL_SERVER_ERROR);
                break;
        }
    }
};
GlobalErrorHandler = GlobalErrorHandler_1 = __decorate([
    (0, tsyringe_1.singleton)(),
    (0, tsyringe_1.injectable)(),
    __param(0, (0, tsyringe_1.inject)(response_utils_1.default)),
    __metadata("design:paramtypes", [response_utils_1.default])
], GlobalErrorHandler);
exports.default = GlobalErrorHandler;
