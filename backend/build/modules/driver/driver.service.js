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
Object.defineProperty(exports, "__esModule", { value: true });
exports.DriverService = void 0;
const tsyringe_1 = require("tsyringe");
const BaseService_1 = require("../../core/base/BaseService");
const driver_repository_1 = require("./driver.repository");
const AppError_1 = require("../../core/errors/AppError");
let DriverService = class DriverService extends BaseService_1.BaseService {
    constructor(driverRepository, repository) {
        super(repository);
        this.driverRepository = driverRepository;
        this.entityName = "Driver";
    }
    // We don't need to override findById as it's already implemented in BaseService
    findByUserId(userId) {
        return __awaiter(this, void 0, void 0, function* () {
            console.log(`[DRIVER SERVICE] Finding driver by user ID: ${userId}`);
            const driver = yield this.driverRepository.findByUserId(userId);
            console.log(`[DRIVER SERVICE] Driver found by user ID: ${!!driver}`);
            return driver;
        });
    }
    create(data) {
        return __awaiter(this, void 0, void 0, function* () {
            console.log(`[DRIVER SERVICE] Creating driver for user ID: ${data.userId}, name: ${data.name}`);
            // Check if driver already exists for this user
            console.log(`[DRIVER SERVICE] Checking if driver already exists for user ID: ${data.userId}`);
            const existingDriver = yield this.driverRepository.findByUserId(data.userId);
            if (existingDriver) {
                console.log(`[DRIVER SERVICE] Driver already exists for user ID: ${data.userId}`);
                throw new AppError_1.ConflictError("Driver already exists for this user");
            }
            console.log(`[DRIVER SERVICE] No existing driver found, creating new driver`);
            const driver = yield this.driverRepository.create(data);
            console.log(`[DRIVER SERVICE] Driver created successfully with ID: ${driver.id}`);
            return driver;
        });
    }
    update(id, data) {
        return __awaiter(this, void 0, void 0, function* () {
            console.log(`[DRIVER SERVICE] Updating driver with ID: ${id}`);
            console.log(`[DRIVER SERVICE] Update data:`, data);
            console.log(`[DRIVER SERVICE] Checking if driver exists with ID: ${id}`);
            const driver = yield this.driverRepository.findById(id);
            if (!driver) {
                console.log(`[DRIVER SERVICE] Driver not found with ID: ${id}`);
                throw new AppError_1.NotFoundError("Driver");
            }
            console.log(`[DRIVER SERVICE] Driver found, proceeding with update`);
            const updatedDriver = yield this.driverRepository.update(id, data);
            console.log(`[DRIVER SERVICE] Driver updated successfully with ID: ${updatedDriver.id}`);
            return updatedDriver;
        });
    }
    updateDriverScore(id, score) {
        return __awaiter(this, void 0, void 0, function* () {
            console.log(`[DRIVER SERVICE] Updating driver score for driver ID: ${id}, new score: ${score}`);
            if (score < 0 || score > 100) {
                console.log(`[DRIVER SERVICE] Invalid score value: ${score}. Score must be between 0 and 100`);
                throw new Error("Driver score must be between 0 and 100");
            }
            console.log(`[DRIVER SERVICE] Score is valid, updating driver score`);
            const driver = yield this.driverRepository.updateDriverScore(id, score);
            console.log(`[DRIVER SERVICE] Driver score updated successfully for driver ID: ${driver.id}`);
            return driver;
        });
    }
};
exports.DriverService = DriverService;
exports.DriverService = DriverService = __decorate([
    (0, tsyringe_1.injectable)(),
    __param(0, (0, tsyringe_1.inject)("IDriverRepository")),
    __param(1, (0, tsyringe_1.inject)(driver_repository_1.DriverRepository)),
    __metadata("design:paramtypes", [Object, driver_repository_1.DriverRepository])
], DriverService);
