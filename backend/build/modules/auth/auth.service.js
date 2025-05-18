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
const bcryptjs_1 = __importDefault(require("bcryptjs"));
const jwt_utils_1 = __importDefault(require("../../core/utils/jwt.utils"));
const AppError_1 = require("../../core/errors/AppError");
let AuthService = class AuthService {
    constructor(userRepository, refreshTokenRepository, jwt) {
        this.userRepository = userRepository;
        this.refreshTokenRepository = refreshTokenRepository;
        this.jwt = jwt;
    }
    register(email, password, username) {
        return __awaiter(this, void 0, void 0, function* () {
            console.log(`[AUTH SERVICE] Register attempt for email: ${email}, username: ${username}`);
            try {
                const existingUser = yield this.userRepository.findByEmail(email);
                console.log(`[AUTH SERVICE] Existing user check: ${existingUser ? 'User exists' : 'User does not exist'}`);
                if (existingUser)
                    throw new AppError_1.ConflictError("User already exists");
                console.log(`[AUTH SERVICE] Hashing password...`);
                const password_hash = yield bcryptjs_1.default.hash(password, 10);
                console.log(`[AUTH SERVICE] Password hashed successfully`);
                console.log(`[AUTH SERVICE] Creating user in database...`);
                const user = yield this.userRepository.createUser({
                    email,
                    password_hash,
                    username,
                });
                console.log(`[AUTH SERVICE] User created successfully with ID: ${user.id}`);
                console.log(`[AUTH SERVICE] Generating tokens...`);
                const accessToken = this.jwt.generateAccessToken(user.id, user.email, user.username || 'user');
                const refreshToken = this.jwt.generateRefreshToken(user.id, user.email);
                console.log(`[AUTH SERVICE] Tokens generated successfully`);
                const expiresAt = new Date();
                expiresAt.setDate(expiresAt.getDate() + 15);
                console.log(`[AUTH SERVICE] Storing refresh token in database...`);
                yield this.refreshTokenRepository.create(user.id, refreshToken, expiresAt);
                console.log(`[AUTH SERVICE] Refresh token stored successfully`);
                return { accessToken, refreshToken };
            }
            catch (error) {
                console.error(`[AUTH SERVICE] Registration error:`, error);
                // If it's a Prisma error, log more details
                if (error && typeof error === 'object' && 'code' in error) {
                    console.error(`[AUTH SERVICE] Prisma error code: ${error.code}`);
                    console.error(`[AUTH SERVICE] Prisma error message: ${error.message}`);
                    console.error(`[AUTH SERVICE] Prisma error meta:`, error.meta);
                }
                if (error instanceof AppError_1.ConflictError)
                    throw error;
                throw new AppError_1.InternalServerError("Failed to register user");
            }
        });
    }
    login(email, password) {
        return __awaiter(this, void 0, void 0, function* () {
            console.log(`[AUTH SERVICE] Login attempt for email: ${email}`);
            try {
                console.log(`[AUTH SERVICE] Finding user by email...`);
                const user = yield this.userRepository.findByEmail(email);
                console.log(`[AUTH SERVICE] User found: ${user ? 'Yes' : 'No'}`);
                if (!user)
                    throw new AppError_1.NotFoundError("User");
                console.log(`[AUTH SERVICE] Validating password...`);
                console.log(`[AUTH SERVICE] User has password_hash: ${!!user.password_hash}, password: ${!!user.password}`);
                const isPasswordValid = yield bcryptjs_1.default.compare(password, user.password_hash || user.password);
                console.log(`[AUTH SERVICE] Password validation result: ${isPasswordValid ? 'Valid' : 'Invalid'}`);
                if (!isPasswordValid)
                    throw new AppError_1.UnauthorizedError("Invalid credentials");
                console.log(`[AUTH SERVICE] Generating tokens...`);
                const accessToken = this.jwt.generateAccessToken(user.id, user.email, user.username || 'user');
                const refreshToken = this.jwt.generateRefreshToken(user.id, user.email);
                console.log(`[AUTH SERVICE] Tokens generated successfully`);
                const expiresAt = new Date();
                expiresAt.setDate(expiresAt.getDate() + 15);
                console.log(`[AUTH SERVICE] Storing refresh token in database...`);
                yield this.refreshTokenRepository.create(user.id, refreshToken, expiresAt);
                console.log(`[AUTH SERVICE] Refresh token stored successfully`);
                return { accessToken, refreshToken };
            }
            catch (error) {
                console.error(`[AUTH SERVICE] Login error:`, error);
                // If it's a Prisma error, log more details
                if (error && typeof error === 'object' && 'code' in error) {
                    console.error(`[AUTH SERVICE] Prisma error code: ${error.code}`);
                    console.error(`[AUTH SERVICE] Prisma error message: ${error.message}`);
                    console.error(`[AUTH SERVICE] Prisma error meta:`, error.meta);
                }
                if (error instanceof AppError_1.NotFoundError ||
                    error instanceof AppError_1.UnauthorizedError) {
                    throw error;
                }
                throw new AppError_1.InternalServerError("Failed to login");
            }
        });
    }
    refreshTokens(refreshToken) {
        return __awaiter(this, void 0, void 0, function* () {
            console.log(`[AUTH SERVICE] Refresh token attempt`);
            try {
                console.log(`[AUTH SERVICE] Verifying refresh token...`);
                const userId = this.jwt.getUserFromRefreshToken(refreshToken);
                console.log(`[AUTH SERVICE] Token verified, user ID: ${userId}`);
                console.log(`[AUTH SERVICE] Finding stored refresh token...`);
                const storedRefreshToken = yield this.refreshTokenRepository.findByUserId(userId);
                console.log(`[AUTH SERVICE] Stored token found: ${storedRefreshToken ? 'Yes' : 'No'}`);
                if (!storedRefreshToken ||
                    storedRefreshToken.token !== refreshToken ||
                    storedRefreshToken.expiresAt < new Date()) {
                    console.log(`[AUTH SERVICE] Token validation failed:
          - Token exists: ${!!storedRefreshToken}
          - Token matches: ${storedRefreshToken ? storedRefreshToken.token === refreshToken : false}
          - Not expired: ${storedRefreshToken ? storedRefreshToken.expiresAt >= new Date() : false}
        `);
                    throw new AppError_1.UnauthorizedError("Invalid refresh token");
                }
                console.log(`[AUTH SERVICE] Finding user...`);
                const user = yield this.userRepository.findById(userId);
                console.log(`[AUTH SERVICE] User found: ${user ? 'Yes' : 'No'}`);
                if (!user)
                    throw new AppError_1.NotFoundError("User");
                console.log(`[AUTH SERVICE] Generating new tokens...`);
                const newAccessToken = this.jwt.generateAccessToken(user.id, user.email, user.username || 'user');
                const newRefreshToken = this.jwt.generateRefreshToken(user.id, user.email);
                console.log(`[AUTH SERVICE] New tokens generated successfully`);
                const expiresAt = new Date();
                expiresAt.setDate(expiresAt.getDate() + 15);
                console.log(`[AUTH SERVICE] Updating refresh token in database...`);
                yield this.refreshTokenRepository.updateByUserId(user.id, newRefreshToken, expiresAt);
                console.log(`[AUTH SERVICE] Refresh token updated successfully`);
                return { accessToken: newAccessToken, refreshToken: newRefreshToken };
            }
            catch (error) {
                console.error(`[AUTH SERVICE] Refresh token error:`, error);
                // If it's a Prisma error, log more details
                if (error && typeof error === 'object' && 'code' in error) {
                    console.error(`[AUTH SERVICE] Prisma error code: ${error.code}`);
                    console.error(`[AUTH SERVICE] Prisma error message: ${error.message}`);
                    console.error(`[AUTH SERVICE] Prisma error meta:`, error.meta);
                }
                if (error instanceof AppError_1.UnauthorizedError ||
                    error instanceof AppError_1.NotFoundError) {
                    throw error;
                }
                throw new AppError_1.InternalServerError("Failed to refresh tokens");
            }
        });
    }
    logout(token) {
        return __awaiter(this, void 0, void 0, function* () {
            console.log(`[AUTH SERVICE] Logout attempt`);
            try {
                console.log(`[AUTH SERVICE] Getting user ID from token...`);
                const userId = this.jwt.getUserIdFromToken(token);
                console.log(`[AUTH SERVICE] User ID from token: ${userId}`);
                console.log(`[AUTH SERVICE] Deleting refresh token from database...`);
                yield this.refreshTokenRepository.deleteByUserId(userId);
                console.log(`[AUTH SERVICE] Refresh token deleted successfully`);
            }
            catch (error) {
                console.error(`[AUTH SERVICE] Logout error:`, error);
                // If it's a Prisma error, log more details
                if (error && typeof error === 'object' && 'code' in error) {
                    console.error(`[AUTH SERVICE] Prisma error code: ${error.code}`);
                    console.error(`[AUTH SERVICE] Prisma error message: ${error.message}`);
                    console.error(`[AUTH SERVICE] Prisma error meta:`, error.meta);
                }
                if (error instanceof AppError_1.UnauthorizedError) {
                    throw error;
                }
                throw new AppError_1.InternalServerError("Failed to logout");
            }
        });
    }
};
AuthService = __decorate([
    (0, tsyringe_1.injectable)(),
    __param(0, (0, tsyringe_1.inject)("IUserRepository")),
    __param(1, (0, tsyringe_1.inject)("IRefreshTokenRepository")),
    __param(2, (0, tsyringe_1.inject)("jwt")),
    __metadata("design:paramtypes", [Object, Object, jwt_utils_1.default])
], AuthService);
exports.default = AuthService;
