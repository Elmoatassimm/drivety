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
exports.TripRepository = void 0;
const tsyringe_1 = require("tsyringe");
const BaseRepository_1 = require("../../core/base/BaseRepository");
const db_1 = __importDefault(require("../../config/db"));
const AppError_1 = require("../../core/errors/AppError");
let TripRepository = class TripRepository extends BaseRepository_1.BaseRepository {
    constructor(prismaService) {
        super(prismaService);
        this.modelName = "trip";
        console.log(`[TRIP REPOSITORY] Initialized with model name: ${this.modelName}`);
    }
    startTrip(driverId, vehicleId, startLocation) {
        return __awaiter(this, void 0, void 0, function* () {
            console.log(`[TRIP REPOSITORY] Starting trip for driver: ${driverId}, vehicle: ${vehicleId}`);
            try {
                // Check if driver exists
                const driver = yield this.prisma.driver.findUnique({
                    where: { id: driverId }
                });
                if (!driver) {
                    throw new AppError_1.NotFoundError("Driver", driverId);
                }
                // Check if vehicle exists
                const vehicle = yield this.prisma.vehicle.findUnique({
                    where: { id: vehicleId }
                });
                if (!vehicle) {
                    throw new AppError_1.NotFoundError("Vehicle", vehicleId);
                }
                // Create a new trip
                const trip = yield this.prisma.trip.create({
                    data: {
                        driverId,
                        vehicleId,
                        startLocation,
                        startTime: new Date(),
                        status: "IN_PROGRESS"
                    }
                });
                console.log(`[TRIP REPOSITORY] Trip started successfully with ID: ${trip.id}`);
                return trip;
            }
            catch (error) {
                console.error(`[TRIP REPOSITORY] Error starting trip:`, error);
                throw error;
            }
        });
    }
    endTrip(tripId, endLocation) {
        return __awaiter(this, void 0, void 0, function* () {
            console.log(`[TRIP REPOSITORY] Ending trip with ID: ${tripId}`);
            try {
                // Check if trip exists and is in progress
                const trip = yield this.prisma.trip.findUnique({
                    where: { id: tripId }
                });
                if (!trip) {
                    throw new AppError_1.NotFoundError("Trip", tripId);
                }
                if (trip.status !== "IN_PROGRESS") {
                    throw new AppError_1.BadRequestError(`Trip with ID ${tripId} is not in progress`);
                }
                // Calculate trip duration and other metrics
                const endTime = new Date();
                const duration = endTime.getTime() - trip.startTime.getTime();
                // Update the trip with end details
                const updatedTrip = yield this.prisma.trip.update({
                    where: { id: tripId },
                    data: {
                        endLocation,
                        endTime,
                        status: "COMPLETED"
                        // We'll calculate distance and fuel consumed in a real implementation
                    }
                });
                console.log(`[TRIP REPOSITORY] Trip ended successfully with ID: ${updatedTrip.id}`);
                return updatedTrip;
            }
            catch (error) {
                console.error(`[TRIP REPOSITORY] Error ending trip:`, error);
                throw error;
            }
        });
    }
    getTripMetrics(tripId) {
        return __awaiter(this, void 0, void 0, function* () {
            console.log(`[TRIP REPOSITORY] Getting metrics for trip with ID: ${tripId}`);
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
                    where: { tripId }
                });
                console.log(`[TRIP REPOSITORY] Found ${metrics.length} metrics for trip ID: ${tripId}`);
                return metrics;
            }
            catch (error) {
                console.error(`[TRIP REPOSITORY] Error getting trip metrics:`, error);
                throw error;
            }
        });
    }
    getDriverTrips(driverId) {
        return __awaiter(this, void 0, void 0, function* () {
            console.log(`[TRIP REPOSITORY] Getting trips for driver with ID: ${driverId}`);
            try {
                // Check if driver exists
                const driver = yield this.prisma.driver.findUnique({
                    where: { id: driverId }
                });
                if (!driver) {
                    throw new AppError_1.NotFoundError("Driver", driverId);
                }
                // Get trips for this driver
                const trips = yield this.prisma.trip.findMany({
                    where: { driverId },
                    orderBy: { startTime: 'desc' }
                });
                console.log(`[TRIP REPOSITORY] Found ${trips.length} trips for driver ID: ${driverId}`);
                return trips;
            }
            catch (error) {
                console.error(`[TRIP REPOSITORY] Error getting driver trips:`, error);
                throw error;
            }
        });
    }
};
exports.TripRepository = TripRepository;
exports.TripRepository = TripRepository = __decorate([
    (0, tsyringe_1.injectable)(),
    __param(0, (0, tsyringe_1.inject)("db")),
    __metadata("design:paramtypes", [db_1.default])
], TripRepository);
