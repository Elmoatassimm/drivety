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
const tsyringe_1 = require("tsyringe");
const response_utils_1 = __importDefault(require("../../core/utils/response.utils"));
const AppError_1 = require("../../core/errors/AppError");
let AuthController = class AuthController {
    constructor(authService, responseUtils) {
        this.authService = authService;
        this.responseUtils = responseUtils;
    }
    register(req, res, next) {
        return __awaiter(this, void 0, void 0, function* () {
            console.log(`[AUTH CONTROLLER] Register request received:`, req.body);
            try {
                const { email, password, username } = req.body;
                console.log(`[AUTH CONTROLLER] Calling auth service register with email: ${email}, username: ${username}`);
                const tokens = yield this.authService.register(email, password, username);
                console.log(`[AUTH CONTROLLER] Registration successful, sending response`);
                this.responseUtils.sendSuccessResponse(res, tokens, 201);
            }
            catch (error) {
                console.error(`[AUTH CONTROLLER] Register error:`, error);
                next(error);
            }
        });
    }
    login(req, res, next) {
        return __awaiter(this, void 0, void 0, function* () {
            console.log(`[AUTH CONTROLLER] Login request received:`, req.body);
            try {
                const { email, password } = req.body;
                console.log(`[AUTH CONTROLLER] Calling auth service login with email: ${email}`);
                const tokens = yield this.authService.login(email, password);
                console.log(`[AUTH CONTROLLER] Login successful, sending response`);
                this.responseUtils.sendSuccessResponse(res, tokens);
            }
            catch (error) {
                console.error(`[AUTH CONTROLLER] Login error:`, error);
                next(error);
            }
        });
    }
    refreshToken(req, res, next) {
        return __awaiter(this, void 0, void 0, function* () {
            console.log(`[AUTH CONTROLLER] Refresh token request received`);
            try {
                const refreshToken = req.header("x-refresh-token");
                console.log(`[AUTH CONTROLLER] Refresh token present: ${!!refreshToken}`);
                if (!refreshToken) {
                    console.log(`[AUTH CONTROLLER] No refresh token provided`);
                    throw new AppError_1.UnauthorizedError("Refresh token is required");
                }
                console.log(`[AUTH CONTROLLER] Calling auth service refreshTokens`);
                const tokens = yield this.authService.refreshTokens(refreshToken);
                console.log(`[AUTH CONTROLLER] Token refresh successful, sending response`);
                this.responseUtils.sendSuccessResponse(res, tokens);
            }
            catch (error) {
                console.error(`[AUTH CONTROLLER] Refresh token error:`, error);
                next(error);
            }
        });
    }
    logout(req, res, next) {
        return __awaiter(this, void 0, void 0, function* () {
            var _a;
            console.log(`[AUTH CONTROLLER] Logout request received`);
            try {
                const token = (_a = req.header("Authorization")) === null || _a === void 0 ? void 0 : _a.replace("Bearer ", "");
                console.log(`[AUTH CONTROLLER] Authorization token present: ${!!token}`);
                if (!token) {
                    console.log(`[AUTH CONTROLLER] No authorization token provided`);
                    throw new AppError_1.UnauthorizedError("Authentication token is required");
                }
                console.log(`[AUTH CONTROLLER] Calling auth service logout`);
                yield this.authService.logout(token);
                console.log(`[AUTH CONTROLLER] Logout successful, sending response`);
                this.responseUtils.sendSuccessNoDataResponse(res, "Logged out successfully");
            }
            catch (error) {
                console.error(`[AUTH CONTROLLER] Logout error:`, error);
                next(error);
            }
        });
    }
};
AuthController = __decorate([
    (0, tsyringe_1.injectable)(),
    __param(0, (0, tsyringe_1.inject)("IAuthService")),
    __param(1, (0, tsyringe_1.inject)("responseUtils")),
    __metadata("design:paramtypes", [Object, response_utils_1.default])
], AuthController);
exports.default = AuthController;
