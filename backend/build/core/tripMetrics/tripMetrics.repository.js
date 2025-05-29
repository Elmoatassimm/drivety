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
exports.TripMetricsRepository = void 0;
const tsyringe_1 = require("tsyringe");
const BaseRepository_1 = require("../base/BaseRepository");
const db_1 = __importDefault(require("../../config/db"));
const AppError_1 = require("../errors/AppError");
let TripMetricsRepository = class TripMetricsRepository extends BaseRepository_1.BaseRepository {
    constructor(prismaService) {
        super(prismaService);
        this.modelName = "tripMetric";
        console.log(`[TRIP METRICS REPOSITORY] Initialized with model name: ${this.modelName}`);
    }
    /**
     * Get all metrics for a specific trip
     * @param tripId The ID of the trip
     * @returns Promise resolving to an array of trip metrics
     */
    getMetricsByTrip(tripId) {
        return __awaiter(this, void 0, void 0, function* () {
            console.log(`[TRIP METRICS REPOSITORY] Getting metrics for trip with ID: ${tripId}`);
            try {
                // Check if trip exists
                const trip = yield this.prisma.trip.findUnique({
                    where: { id: tripId }
                });
                if (!trip) {
                    throw new AppError_1.NotFoundError("Trip", tripId);
                }
                // Get metrics for this trip
                const metrics = yield this.prisma.tripMetric.findMany({
                    where: { tripId },
                    orderBy: { createdAt: 'asc' }
                });
                console.log(`[TRIP METRICS REPOSITORY] Found ${metrics.length} metrics for trip ID: ${tripId}`);
                return metrics;
            }
            catch (error) {
                console.error(`[TRIP METRICS REPOSITORY] Error getting trip metrics:`, error);
                throw error;
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
            console.log(`[TRIP METRICS REPOSITORY] Calculating fuel consumption for trip with ID: ${tripId}`);
            try {
                // Check if trip exists
                const trip = yield this.prisma.trip.findUnique({
                    where: { id: tripId }
                });
                if (!trip) {
                    throw new AppError_1.NotFoundError("Trip", tripId);
                }
                // If trip has fuelConsumed value, return it
                if (trip.fuelConsumed !== null && trip.fuelConsumed !== undefined) {
                    console.log(`[TRIP METRICS REPOSITORY] Using stored fuel consumption value: ${trip.fuelConsumed}`);
                    return trip.fuelConsumed;
                }
                // Otherwise calculate from metrics
                const metrics = yield this.prisma.tripMetric.findMany({
                    where: { tripId },
                    select: { fuelConsumption: true }
                });
                // Sum up all fuel consumption values
                let totalFuelConsumption = 0;
                metrics.forEach(metric => {
                    if (metric.fuelConsumption) {
                        totalFuelConsumption += metric.fuelConsumption;
                    }
                });
                console.log(`[TRIP METRICS REPOSITORY] Calculated fuel consumption: ${totalFuelConsumption}`);
                // Update the trip with the calculated fuel consumption
                yield this.prisma.trip.update({
                    where: { id: tripId },
                    data: { fuelConsumed: totalFuelConsumption }
                });
                return totalFuelConsumption;
            }
            catch (error) {
                console.error(`[TRIP METRICS REPOSITORY] Error calculating fuel consumption:`, error);
                throw error;
            }
        });
    }
};
exports.TripMetricsRepository = TripMetricsRepository;
exports.TripMetricsRepository = TripMetricsRepository = __decorate([
    (0, tsyringe_1.injectable)(),
    __param(0, (0, tsyringe_1.inject)("db")),
    __metadata("design:paramtypes", [db_1.default])
], TripMetricsRepository);
