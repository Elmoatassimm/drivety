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
exports.DriverRepository = void 0;
const tsyringe_1 = require("tsyringe");
const BaseRepository_1 = require("../../core/base/BaseRepository");
const db_1 = __importDefault(require("../../config/db"));
const AppError_1 = require("../../core/errors/AppError");
let DriverRepository = class DriverRepository extends BaseRepository_1.BaseRepository {
    constructor(prismaService) {
        super(prismaService);
        this.modelName = "driver";
        console.log(`[DRIVER REPOSITORY] Initialized with model name: ${this.modelName}`);
    }
    findById(id) {
        return __awaiter(this, void 0, void 0, function* () {
            console.log(`[DRIVER REPOSITORY] Finding driver by ID: ${id}`);
            try {
                const driver = yield this.prisma.driver.findUnique({
                    where: { id }
                });
                console.log(`[DRIVER REPOSITORY] Driver found by ID: ${!!driver}`);
                return driver;
            }
            catch (error) {
                console.error(`[DRIVER REPOSITORY] Error finding driver by ID:`, error);
                // If it's a Prisma error, log more details
                if (error && typeof error === 'object' && 'code' in error) {
                    console.error(`[DRIVER REPOSITORY] Prisma error code: ${error.code}`);
                    console.error(`[DRIVER REPOSITORY] Prisma error message: ${error.message}`);
                    console.error(`[DRIVER REPOSITORY] Prisma error meta:`, error.meta);
                }
                throw error;
            }
        });
    }
    findByUserId(userId) {
        return __awaiter(this, void 0, void 0, function* () {
            console.log(`[DRIVER REPOSITORY] Finding driver by user ID: ${userId}`);
            try {
                const driver = yield this.prisma.driver.findUnique({
                    where: { userId }
                });
                console.log(`[DRIVER REPOSITORY] Driver found by user ID: ${!!driver}`);
                return driver;
            }
            catch (error) {
                console.error(`[DRIVER REPOSITORY] Error finding driver by user ID:`, error);
                // If it's a Prisma error, log more details
                if (error && typeof error === 'object' && 'code' in error) {
                    console.error(`[DRIVER REPOSITORY] Prisma error code: ${error.code}`);
                    console.error(`[DRIVER REPOSITORY] Prisma error message: ${error.message}`);
                    console.error(`[DRIVER REPOSITORY] Prisma error meta:`, error.meta);
                }
                throw error;
            }
        });
    }
    create(data) {
        return __awaiter(this, void 0, void 0, function* () {
            console.log(`[DRIVER REPOSITORY] Creating driver for user ID: ${data.userId}, name: ${data.name}`);
            try {
                console.log(`[DRIVER REPOSITORY] Driver data:`, {
                    userId: data.userId,
                    name: data.name,
                    licenseNumber: data.licenseNumber,
                    licenseExpiry: data.licenseExpiry,
                    phoneNumber: data.phoneNumber
                });
                const driver = yield this.prisma.driver.create({
                    data: {
                        userId: data.userId,
                        name: data.name,
                        licenseNumber: data.licenseNumber,
                        licenseExpiry: data.licenseExpiry,
                        phoneNumber: data.phoneNumber,
                        driverScore: 0 // Default score for new drivers
                    }
                });
                console.log(`[DRIVER REPOSITORY] Driver created successfully with ID: ${driver.id}`);
                return driver;
            }
            catch (error) {
                console.error(`[DRIVER REPOSITORY] Error creating driver:`, error);
                // If it's a Prisma error, log more details
                if (error && typeof error === 'object' && 'code' in error) {
                    console.error(`[DRIVER REPOSITORY] Prisma error code: ${error.code}`);
                    console.error(`[DRIVER REPOSITORY] Prisma error message: ${error.message}`);
                    console.error(`[DRIVER REPOSITORY] Prisma error meta:`, error.meta);
                }
                throw error;
            }
        });
    }
    updateDriverScore(id, score) {
        return __awaiter(this, void 0, void 0, function* () {
            console.log(`[DRIVER REPOSITORY] Updating driver score for driver ID: ${id}, new score: ${score}`);
            try {
                console.log(`[DRIVER REPOSITORY] Checking if driver exists with ID: ${id}`);
                const driver = yield this.findById(id);
                if (!driver) {
                    console.log(`[DRIVER REPOSITORY] Driver not found with ID: ${id}`);
                    throw new AppError_1.NotFoundError("Driver");
                }
                console.log(`[DRIVER REPOSITORY] Driver found, updating score`);
                const updatedDriver = yield this.prisma.driver.update({
                    where: { id },
                    data: { driverScore: score }
                });
                console.log(`[DRIVER REPOSITORY] Driver score updated successfully for driver ID: ${updatedDriver.id}`);
                return updatedDriver;
            }
            catch (error) {
                console.error(`[DRIVER REPOSITORY] Error updating driver score:`, error);
                // If it's a Prisma error, log more details
                if (error && typeof error === 'object' && 'code' in error) {
                    console.error(`[DRIVER REPOSITORY] Prisma error code: ${error.code}`);
                    console.error(`[DRIVER REPOSITORY] Prisma error message: ${error.message}`);
                    console.error(`[DRIVER REPOSITORY] Prisma error meta:`, error.meta);
                }
                throw error;
            }
        });
    }
    update(id, data) {
        return __awaiter(this, void 0, void 0, function* () {
            console.log(`[DRIVER REPOSITORY] Updating driver with ID: ${id}`);
            console.log(`[DRIVER REPOSITORY] Update data:`, data);
            try {
                const updatedDriver = yield this.prisma.driver.update({
                    where: { id },
                    data
                });
                console.log(`[DRIVER REPOSITORY] Driver updated successfully with ID: ${updatedDriver.id}`);
                return updatedDriver;
            }
            catch (error) {
                console.error(`[DRIVER REPOSITORY] Error updating driver:`, error);
                // If it's a Prisma error, log more details
                if (error && typeof error === 'object' && 'code' in error) {
                    console.error(`[DRIVER REPOSITORY] Prisma error code: ${error.code}`);
                    console.error(`[DRIVER REPOSITORY] Prisma error message: ${error.message}`);
                    console.error(`[DRIVER REPOSITORY] Prisma error meta:`, error.meta);
                }
                throw error;
            }
        });
    }
};
exports.DriverRepository = DriverRepository;
exports.DriverRepository = DriverRepository = __decorate([
    (0, tsyringe_1.injectable)(),
    __param(0, (0, tsyringe_1.inject)("db")),
    __metadata("design:paramtypes", [db_1.default])
], DriverRepository);
