"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.default = authMiddleware;
const container_1 = require("../../config/container");
const jwt_utils_1 = __importDefault(require("../utils/jwt.utils"));
const AppError_1 = require("../errors/AppError");
function authMiddleware(req, res, next) {
    return __awaiter(this, void 0, void 0, function* () {
        var _a;
        try {
            const token = (_a = req.header("Authorization")) === null || _a === void 0 ? void 0 : _a.replace("Bearer ", "");
            if (!token) {
                throw new AppError_1.UnauthorizedError("Authentication token is required");
            }
            const jwt = container_1.container.resolve(jwt_utils_1.default);
            const decoded = jwt.getUserFromToken(token);
            // Map the decoded token to our RequestWithUser type
            req.user = {
                id: decoded.userId,
                email: decoded.email,
                username: decoded.username
            };
            next();
        }
        catch (error) {
            next(error);
        }
    });
}
