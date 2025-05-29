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
const db_1 = __importDefault(require("../../config/db"));
const BaseRepository_1 = require("../../core/base/BaseRepository");
let RefreshTokenRepository = class RefreshTokenRepository extends BaseRepository_1.BaseRepository {
    constructor(prismaService) {
        super(prismaService);
        this.modelName = "refreshToken";
    }
    create(dataOrUserId, token, expiresAt) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                let userId;
                let tokenValue;
                let expiresAtValue;
                if (typeof dataOrUserId === 'string') {
                    userId = dataOrUserId;
                    tokenValue = token;
                    expiresAtValue = expiresAt;
                }
                else {
                    userId = dataOrUserId.userId;
                    tokenValue = dataOrUserId.token;
                    expiresAtValue = dataOrUserId.expiresAt;
                }
                // First try to find an existing token
                const existingToken = yield this.prisma.refreshToken.findFirst({
                    where: { userId },
                });
                if (existingToken) {
                    // Update if exists
                    return this.prisma.refreshToken.update({
                        where: { id: existingToken.id },
                        data: {
                            token: tokenValue,
                            expiresAt: expiresAtValue,
                        },
                    });
                }
                else {
                    // Create if doesn't exist
                    return this.prisma.refreshToken.create({
                        data: {
                            userId,
                            token: tokenValue,
                            expiresAt: expiresAtValue,
                        },
                    });
                }
            }
            catch (error) {
                throw error;
            }
        });
    }
    findByUserId(userId) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                return this.prisma.refreshToken.findFirst({
                    where: { userId },
                });
            }
            catch (error) {
                throw error;
            }
        });
    }
    findByToken(token) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                return this.prisma.refreshToken.findFirst({
                    where: { token },
                });
            }
            catch (error) {
                throw error;
            }
        });
    }
    updateByUserId(userId, newToken, newExpiresAt) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const existingToken = yield this.prisma.refreshToken.findFirst({
                    where: { userId },
                });
                if (!existingToken) {
                    throw new Error(`No refresh token found for user ${userId}`);
                }
                return this.prisma.refreshToken.update({
                    where: { id: existingToken.id },
                    data: {
                        token: newToken,
                        expiresAt: newExpiresAt,
                    },
                });
            }
            catch (error) {
                throw error;
            }
        });
    }
    deleteByUserId(userId) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const existingToken = yield this.prisma.refreshToken.findFirst({
                    where: { userId },
                });
                if (!existingToken) {
                    throw new Error(`No refresh token found for user ${userId}`);
                }
                return this.prisma.refreshToken.delete({
                    where: { id: existingToken.id },
                });
            }
            catch (error) {
                throw error;
            }
        });
    }
};
RefreshTokenRepository = __decorate([
    (0, tsyringe_1.injectable)(),
    __param(0, (0, tsyringe_1.inject)("db")),
    __metadata("design:paramtypes", [db_1.default])
], RefreshTokenRepository);
exports.default = RefreshTokenRepository;
