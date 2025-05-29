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
exports.TripMetricsService = void 0;
const tsyringe_1 = require("tsyringe");
const BaseService_1 = require("../base/BaseService");
const tripMetrics_repository_1 = require("./tripMetrics.repository");
const AppError_1 = require("../errors/AppError");
let TripMetricsService = class TripMetricsService extends BaseService_1.BaseService {
    constructor(tripMetricsRepository, repository) {
        super(repository);
        this.tripMetricsRepository = tripMetricsRepository;
        this.entityName = "TripMetric";
    }
    /**
     * Get all metrics for a specific trip
     * @param tripId The ID of the trip
     * @returns Promise resolving to an array of trip metrics
     */
    getMetricsByTrip(tripId) {
        return __awaiter(this, void 0, void 0, function* () {
            this.logger.info(`Getting metrics for trip with ID: ${tripId}`);
            if (!tripId) {
                throw new AppError_1.BadRequestError("Trip ID is required");
            }
            try {
                return yield this.tripMetricsRepository.getMetricsByTrip(tripId);
            }
            catch (error) {
                this.logger.error(`Error getting trip metrics:`, { error });
                throw this.handleError(error, `Failed to get metrics for trip ${tripId}`);
            }
        });
    }
    /**
     * Calculate the fuel consumption for a trip
     * @param tripId The ID of the trip
     * @returns Promise resolving to the calculated fuel consumption
     */
    calculateFuelConsumption(tripId) {
        return __awaiter(this, void 0, void 0, function* () {
            this.logger.info(`Calculating fuel consumption for trip with ID: ${tripId}`);
            if (!tripId) {
                throw new AppError_1.BadRequestError("Trip ID is required");
            }
            try {
                return yield this.tripMetricsRepository.calculateFuelConsumption(tripId);
            }
            catch (error) {
                this.logger.error(`Error calculating fuel consumption:`, { error });
                throw this.handleError(error, `Failed to calculate fuel consumption for trip ${tripId}`);
            }
        });
    }
};
exports.TripMetricsService = TripMetricsService;
exports.TripMetricsService = TripMetricsService = __decorate([
    (0, tsyringe_1.injectable)(),
    __param(0, (0, tsyringe_1.inject)("ITripMetricsRepository")),
    __param(1, (0, tsyringe_1.inject)(tripMetrics_repository_1.TripMetricsRepository)),
    __metadata("design:paramtypes", [Object, tripMetrics_repository_1.TripMetricsRepository])
], TripMetricsService);
