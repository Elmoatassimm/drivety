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
exports.TripService = void 0;
const tsyringe_1 = require("tsyringe");
const BaseService_1 = require("../../core/base/BaseService");
const trip_repository_1 = require("./trip.repository");
const AppError_1 = require("../../core/errors/AppError");
let TripService = class TripService extends BaseService_1.BaseService {
    constructor(tripRepository, repository) {
        super(repository);
        this.tripRepository = tripRepository;
        this.entityName = "Trip";
    }
    startTrip(driverId, vehicleId, startLocation) {
        return __awaiter(this, void 0, void 0, function* () {
            console.log(`[TRIP SERVICE] Starting trip for driver: ${driverId}, vehicle: ${vehicleId}`);
            if (!driverId) {
                throw new AppError_1.BadRequestError("Driver ID is required");
            }
            if (!vehicleId) {
                throw new AppError_1.BadRequestError("Vehicle ID is required");
            }
            if (!startLocation) {
                throw new AppError_1.BadRequestError("Start location is required");
            }
            try {
                return yield this.tripRepository.startTrip(driverId, vehicleId, startLocation);
            }
            catch (error) {
                console.error(`[TRIP SERVICE] Error starting trip:`, error);
                throw error;
            }
        });
    }
    endTrip(tripId, endLocation) {
        return __awaiter(this, void 0, void 0, function* () {
            console.log(`[TRIP SERVICE] Ending trip with ID: ${tripId}`);
            if (!tripId) {
                throw new AppError_1.BadRequestError("Trip ID is required");
            }
            if (!endLocation) {
                throw new AppError_1.BadRequestError("End location is required");
            }
            try {
                return yield this.tripRepository.endTrip(tripId, endLocation);
            }
            catch (error) {
                console.error(`[TRIP SERVICE] Error ending trip:`, error);
                throw error;
            }
        });
    }
    getTripMetrics(tripId) {
        return __awaiter(this, void 0, void 0, function* () {
            console.log(`[TRIP SERVICE] Getting metrics for trip with ID: ${tripId}`);
            if (!tripId) {
                throw new AppError_1.BadRequestError("Trip ID is required");
            }
            try {
                return yield this.tripRepository.getTripMetrics(tripId);
            }
            catch (error) {
                console.error(`[TRIP SERVICE] Error getting trip metrics:`, error);
                throw error;
            }
        });
    }
    getDriverTrips(driverId) {
        return __awaiter(this, void 0, void 0, function* () {
            console.log(`[TRIP SERVICE] Getting trips for driver with ID: ${driverId}`);
            if (!driverId) {
                throw new AppError_1.BadRequestError("Driver ID is required");
            }
            try {
                return yield this.tripRepository.getDriverTrips(driverId);
            }
            catch (error) {
                console.error(`[TRIP SERVICE] Error getting driver trips:`, error);
                throw error;
            }
        });
    }
    /**
     * Override findAll to handle Trip-specific ordering
     * Trip model doesn't have createdAt, only updatedAt
     */
    findAll(options) {
        const _super = Object.create(null, {
            findAll: { get: () => super.findAll }
        });
        return __awaiter(this, void 0, void 0, function* () {
            try {
                // If orderBy contains createdAt, replace it with updatedAt
                if ((options === null || options === void 0 ? void 0 : options.orderBy) && 'createdAt' in options.orderBy) {
                    const orderDirection = options.orderBy['createdAt'];
                    const newOrderBy = Object.assign({}, options.orderBy);
                    // Remove createdAt and add updatedAt with the same direction
                    delete newOrderBy['createdAt'];
                    newOrderBy['updatedAt'] = orderDirection;
                    // Create new options with the fixed orderBy
                    const newOptions = Object.assign(Object.assign({}, options), { orderBy: newOrderBy });
                    console.log(`[TRIP SERVICE] Replacing createdAt with updatedAt in orderBy`, {
                        originalOptions: options,
                        newOptions
                    });
                    return yield this.repository.findAll(newOptions);
                }
                // If no createdAt in orderBy, use the parent implementation
                return yield _super.findAll.call(this, options);
            }
            catch (error) {
                this.logger.error(`Error retrieving ${this.entityName} list`, { error, options });
                throw this.handleError(error, `Failed to retrieve ${this.entityName} list`);
            }
        });
    }
};
exports.TripService = TripService;
exports.TripService = TripService = __decorate([
    (0, tsyringe_1.injectable)(),
    __param(0, (0, tsyringe_1.inject)("ITripRepository")),
    __param(1, (0, tsyringe_1.inject)(trip_repository_1.TripRepository)),
    __metadata("design:paramtypes", [Object, trip_repository_1.TripRepository])
], TripService);
