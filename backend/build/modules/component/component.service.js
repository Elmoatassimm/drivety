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
exports.ComponentService = void 0;
const tsyringe_1 = require("tsyringe");
const BaseService_1 = require("../../core/base/BaseService");
const component_repository_1 = require("./component.repository");
const AppError_1 = require("../../core/errors/AppError");
let ComponentService = class ComponentService extends BaseService_1.BaseService {
    constructor(componentRepository, repository) {
        super(repository);
        this.componentRepository = componentRepository;
        this.entityName = "Component";
    }
    // We don't need to override findById, findAll, create, update, delete as they're already implemented in BaseService
    getHealthScore(componentId) {
        return __awaiter(this, void 0, void 0, function* () {
            if (!componentId) {
                throw new AppError_1.BadRequestError("Component ID is required");
            }
            try {
                return yield this.componentRepository.getHealthScore(componentId);
            }
            catch (error) {
                this.logger.error(`Error getting health score for component ${componentId}`, { error });
                throw this.handleError(error, `Failed to get health score for component ${componentId}`);
            }
        });
    }
    getMaintenanceRecords(componentId) {
        return __awaiter(this, void 0, void 0, function* () {
            if (!componentId) {
                throw new AppError_1.BadRequestError("Component ID is required");
            }
            try {
                return yield this.componentRepository.getMaintenanceRecords(componentId);
            }
            catch (error) {
                this.logger.error(`Error getting maintenance records for component ${componentId}`, { error });
                throw this.handleError(error, `Failed to get maintenance records for component ${componentId}`);
            }
        });
    }
    triggerAlert(componentId, message) {
        return __awaiter(this, void 0, void 0, function* () {
            if (!componentId) {
                throw new AppError_1.BadRequestError("Component ID is required");
            }
            if (!message) {
                throw new AppError_1.BadRequestError("Alert message is required");
            }
            try {
                return yield this.componentRepository.triggerAlert(componentId, message);
            }
            catch (error) {
                this.logger.error(`Error triggering alert for component ${componentId}`, { error });
                throw this.handleError(error, `Failed to trigger alert for component ${componentId}`);
            }
        });
    }
    // Override validateCreate to add custom validation for component creation
    validateCreate(data) {
        return __awaiter(this, void 0, void 0, function* () {
            if (!data.name) {
                throw new AppError_1.BadRequestError("Component name is required");
            }
            if (!data.vehicleId) {
                throw new AppError_1.BadRequestError("Vehicle ID is required");
            }
            if (!data.componentType) {
                throw new AppError_1.BadRequestError("Component type is required");
            }
            if (data.healthScore < 0 || data.healthScore > 100) {
                throw new AppError_1.BadRequestError("Health score must be between 0 and 100");
            }
            // Check if the vehicle exists using the repository
            const vehicleRepository = this.componentRepository;
            const vehicle = yield vehicleRepository.prisma.vehicle.findUnique({
                where: { id: data.vehicleId }
            });
            if (!vehicle) {
                throw new AppError_1.BadRequestError(`Vehicle with ID ${data.vehicleId} does not exist`);
            }
        });
    }
};
exports.ComponentService = ComponentService;
exports.ComponentService = ComponentService = __decorate([
    (0, tsyringe_1.injectable)(),
    __param(0, (0, tsyringe_1.inject)("ComponentRepository")),
    __param(1, (0, tsyringe_1.inject)(component_repository_1.ComponentRepositoryImpl)),
    __metadata("design:paramtypes", [Object, component_repository_1.ComponentRepositoryImpl])
], ComponentService);
