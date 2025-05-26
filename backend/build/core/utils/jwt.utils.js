"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __importStar = (this && this.__importStar) || (function () {
    var ownKeys = function(o) {
        ownKeys = Object.getOwnPropertyNames || function (o) {
            var ar = [];
            for (var k in o) if (Object.prototype.hasOwnProperty.call(o, k)) ar[ar.length] = k;
            return ar;
        };
        return ownKeys(o);
    };
    return function (mod) {
        if (mod && mod.__esModule) return mod;
        var result = {};
        if (mod != null) for (var k = ownKeys(mod), i = 0; i < k.length; i++) if (k[i] !== "default") __createBinding(result, mod, k[i]);
        __setModuleDefault(result, mod);
        return result;
    };
})();
Object.defineProperty(exports, "__esModule", { value: true });
const jwt = __importStar(require("jsonwebtoken"));
const tsyringe_1 = require("tsyringe");
const AppError_1 = require("../errors/AppError");
let JwtUtils = class JwtUtils {
    constructor() {
        var _a, _b;
        this.JWT_SECRET = (_a = process.env.JWT_SECRET) !== null && _a !== void 0 ? _a : "your-secret-key";
        this.JWT_EXPIRATION = process.env.JWT_EXPIRATION || "1d";
        this.REFRESH_TOKEN_SECRET = (_b = process.env.REFRESH_TOKEN_SECRET) !== null && _b !== void 0 ? _b : "your-refresh-secret";
        this.REFRESH_TOKEN_EXPIRY = process.env.REFRESH_TOKEN_EXPIRY || "15d";
    }
    generateAccessToken(userId, email, username, role) {
        const options = { expiresIn: this.JWT_EXPIRATION };
        return jwt.sign({ userId, email, username, role }, String(this.JWT_SECRET), options);
    }
    generateRefreshToken(userId, email) {
        const options = { expiresIn: this.REFRESH_TOKEN_EXPIRY };
        return jwt.sign({ userId, email }, String(this.REFRESH_TOKEN_SECRET), options);
    }
    verifyAccessToken(token) {
        try {
            const decoded = jwt.verify(token, String(this.JWT_SECRET));
            return {
                userId: decoded.userId,
                email: decoded.email,
                role: decoded.role
            };
        }
        catch (_a) {
            return null;
        }
    }
    verifyRefreshToken(token) {
        try {
            jwt.verify(token, String(this.REFRESH_TOKEN_SECRET));
            return true;
        }
        catch (_a) {
            return false;
        }
    }
    getUserIdFromToken(token) {
        try {
            const decoded = jwt.verify(token, String(this.JWT_SECRET));
            return decoded.userId;
        }
        catch (error) {
            throw new AppError_1.UnauthorizedError("Invalid token");
        }
    }
    getUserFromToken(token) {
        try {
            const decoded = jwt.verify(token, String(this.JWT_SECRET));
            return decoded;
        }
        catch (error) {
            throw new AppError_1.UnauthorizedError("Invalid token");
        }
    }
    getUserFromRefreshToken(token) {
        try {
            const decoded = jwt.verify(token, String(this.REFRESH_TOKEN_SECRET));
            return decoded.userId;
        }
        catch (error) {
            throw new AppError_1.UnauthorizedError("Invalid refresh token");
        }
    }
};
JwtUtils = __decorate([
    (0, tsyringe_1.singleton)(),
    (0, tsyringe_1.injectable)()
], JwtUtils);
exports.default = JwtUtils;
