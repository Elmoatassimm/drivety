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
exports.VehicleRepositoryImpl = void 0;
const tsyringe_1 = require("tsyringe");
const BaseRepository_1 = require("../../core/base/BaseRepository");
const db_1 = __importDefault(require("../../config/db"));
const AppError_1 = require("../../core/errors/AppError");
let VehicleRepositoryImpl = class VehicleRepositoryImpl extends BaseRepository_1.BaseRepository {
    constructor(prismaService) {
        super(prismaService);
        this.modelName = "vehicle";
    }
    getComponents(vehicleId) {
        return __awaiter(this, void 0, void 0, function* () {
            // First check if the vehicle exists
            const vehicle = yield this.findById(vehicleId);
            if (!vehicle) {
                throw new AppError_1.NotFoundError("Vehicle", vehicleId);
            }
            // Return the components for this vehicle
            return this.prisma.component.findMany({
                where: { vehicleId }
            });
        });
    }
    updateHealthStatus(vehicleId, healthStatus) {
        return __awaiter(this, void 0, void 0, function* () {
            // First check if the vehicle exists
            const vehicle = yield this.findById(vehicleId);
            if (!vehicle) {
                throw new AppError_1.NotFoundError("Vehicle", vehicleId);
            }
            // Update the vehicle status
            const updatedVehicle = yield this.prisma.vehicle.update({
                where: { id: vehicleId },
                data: { status: healthStatus },
                select: {
                    id: true,
                    status: true
                }
            });
            // Return the updated vehicle with the renamed field
            return {
                id: updatedVehicle.id,
                healthStatus: updatedVehicle.status
            };
        });
    }
    getMaintenanceHistory(vehicleId) {
        return __awaiter(this, void 0, void 0, function* () {
            // First check if the vehicle exists
            const vehicle = yield this.findById(vehicleId);
            if (!vehicle) {
                throw new AppError_1.NotFoundError("Vehicle", vehicleId);
            }
            // Return the maintenance history for this vehicle
            return this.prisma.maintenance.findMany({
                where: { vehicleId },
                orderBy: { createdAt: 'desc' }
            });
        });
    }
};
exports.VehicleRepositoryImpl = VehicleRepositoryImpl;
exports.VehicleRepositoryImpl = VehicleRepositoryImpl = __decorate([
    (0, tsyringe_1.injectable)(),
    __param(0, (0, tsyringe_1.inject)("db")),
    __metadata("design:paramtypes", [db_1.default])
], VehicleRepositoryImpl);
