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
exports.VehicleService = void 0;
const tsyringe_1 = require("tsyringe");
const BaseService_1 = require("../../core/base/BaseService");
const vehicle_repository_1 = require("./vehicle.repository");
const AppError_1 = require("../../core/errors/AppError");
let VehicleService = class VehicleService extends BaseService_1.BaseService {
    constructor(vehicleRepository, repository) {
        super(repository);
        this.vehicleRepository = vehicleRepository;
        this.entityName = "Vehicle";
    }
    // We don't need to override findById, findAll, create, update, delete as they're already implemented in BaseService
    getComponents(vehicleId) {
        return __awaiter(this, void 0, void 0, function* () {
            if (!vehicleId) {
                throw new AppError_1.BadRequestError("Vehicle ID is required");
            }
            try {
                return yield this.vehicleRepository.getComponents(vehicleId);
            }
            catch (error) {
                this.logger.error(`Error getting components for vehicle ${vehicleId}`, { error });
                throw this.handleError(error, `Failed to get components for vehicle ${vehicleId}`);
            }
        });
    }
    updateHealthStatus(vehicleId, healthStatus) {
        return __awaiter(this, void 0, void 0, function* () {
            if (!vehicleId) {
                throw new AppError_1.BadRequestError("Vehicle ID is required");
            }
            if (!healthStatus) {
                throw new AppError_1.BadRequestError("Health status is required");
            }
            // Validate health status - assuming valid statuses are: "GOOD", "FAIR", "POOR", "CRITICAL"
            const validStatuses = ["GOOD", "FAIR", "POOR", "CRITICAL"];
            if (!validStatuses.includes(healthStatus)) {
                throw new AppError_1.BadRequestError(`Invalid health status. Must be one of: ${validStatuses.join(", ")}`);
            }
            try {
                return yield this.vehicleRepository.updateHealthStatus(vehicleId, healthStatus);
            }
            catch (error) {
                this.logger.error(`Error updating health status for vehicle ${vehicleId}`, { error });
                throw this.handleError(error, `Failed to update health status for vehicle ${vehicleId}`);
            }
        });
    }
    getMaintenanceHistory(vehicleId) {
        return __awaiter(this, void 0, void 0, function* () {
            if (!vehicleId) {
                throw new AppError_1.BadRequestError("Vehicle ID is required");
            }
            try {
                return yield this.vehicleRepository.getMaintenanceHistory(vehicleId);
            }
            catch (error) {
                this.logger.error(`Error getting maintenance history for vehicle ${vehicleId}`, { error });
                throw this.handleError(error, `Failed to get maintenance history for vehicle ${vehicleId}`);
            }
        });
    }
    // Override validateCreate to add custom validation for vehicle creation
    validateCreate(data) {
        return __awaiter(this, void 0, void 0, function* () {
            if (!data.model) {
                throw new AppError_1.BadRequestError("Vehicle model is required");
            }
            if (!data.plateNumber) {
                throw new AppError_1.BadRequestError("Vehicle plate number is required");
            }
            // Check if a vehicle with the same plate number already exists
            const existingVehicle = yield this.vehicleRepository.findAll({
                where: { plateNumber: data.plateNumber }
            }).then(vehicles => vehicles[0] || null);
            if (existingVehicle) {
                throw new AppError_1.BadRequestError(`A vehicle with plate number ${data.plateNumber} already exists`);
            }
        });
    }
};
exports.VehicleService = VehicleService;
exports.VehicleService = VehicleService = __decorate([
    (0, tsyringe_1.injectable)(),
    __param(0, (0, tsyringe_1.inject)("VehicleRepository")),
    __param(1, (0, tsyringe_1.inject)(vehicle_repository_1.VehicleRepositoryImpl)),
    __metadata("design:paramtypes", [Object, vehicle_repository_1.VehicleRepositoryImpl])
], VehicleService);
