"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const tsyringe_1 = require("tsyringe");
const HttpStatusCode_1 = __importDefault(require("./HttpStatusCode"));
let ResponseUtils = class ResponseUtils {
    // Success response with data
    sendSuccessResponse(res, data, status = HttpStatusCode_1.default.OK) {
        return res.status(status).json({ success: true, data });
    }
    // Success response without data (e.g., for delete operations)
    sendSuccessNoDataResponse(res, message = "Operation successful", status = HttpStatusCode_1.default.OK) {
        return res.status(status).json({ success: true, message });
    }
    // Error response
    sendErrorResponse(res, message, status = HttpStatusCode_1.default.INTERNAL_SERVER_ERROR) {
        return res.status(status).json({ success: false, error: { message } });
    }
    // Not Found response
    sendNotFoundResponse(res, message, status = HttpStatusCode_1.default.NOT_FOUND) {
        return res.status(status).json({ success: false, error: { message } });
    }
    // Validation Error response
    sendValidationError(res, message, errors, status = HttpStatusCode_1.default.BAD_REQUEST) {
        return res.status(status).json({
            success: false,
            error: {
                message,
                errors,
            },
        });
    }
    // Unauthorized response
    sendUnauthorizedResponse(res, message = "Unauthorized", status = HttpStatusCode_1.default.UNAUTHORIZED) {
        return res.status(status).json({ success: false, error: { message } });
    }
    // Forbidden response
    sendForbiddenResponse(res, message = "Forbidden", status = HttpStatusCode_1.default.FORBIDDEN) {
        return res.status(status).json({ success: false, error: { message } });
    }
    // Bad Request response
    sendBadRequestResponse(res, message, status = HttpStatusCode_1.default.BAD_REQUEST) {
        return res.status(status).json({ success: false, error: { message } });
    }
};
ResponseUtils = __decorate([
    (0, tsyringe_1.singleton)(),
    (0, tsyringe_1.injectable)()
], ResponseUtils);
exports.default = ResponseUtils;
