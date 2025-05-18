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
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.TripController = void 0;
const tsyringe_1 = require("tsyringe");
const BaseController_1 = require("../../core/base/BaseController");
const trip_service_1 = require("./trip.service");
const response_utils_1 = __importDefault(require("../../core/utils/response.utils"));
let TripController = class TripController extends BaseController_1.BaseController {
    constructor(tripService, responseUtils) {
        super(tripService, responseUtils);
        this.tripService = tripService;
    }
    startTrip(req, res, next) {
        console.log(`[TRIP CONTROLLER] Start trip request received:`, req.body);
        try {
            const { driverId, vehicleId, startLocation } = req.body;
            console.log(`[TRIP CONTROLLER] Starting trip for driver: ${driverId}, vehicle: ${vehicleId}`);
            return this.tripService.startTrip(driverId, vehicleId, startLocation)
                .then(trip => {
                console.log(`[TRIP CONTROLLER] Trip started successfully with ID: ${trip.id}`);
                this.responseUtils.sendSuccessResponse(res, trip, 201);
            })
                .catch(error => {
                console.error(`[TRIP CONTROLLER] Error starting trip:`, error);
                next(error);
            });
        }
        catch (error) {
            console.error(`[TRIP CONTROLLER] Error starting trip:`, error);
            next(error);
            return Promise.resolve();
        }
    }
    endTrip(req, res, next) {
        console.log(`[TRIP CONTROLLER] End trip request received:`, req.body);
        try {
            const { tripId } = req.params;
            const { endLocation } = req.body;
            console.log(`[TRIP CONTROLLER] Ending trip with ID: ${tripId}`);
            return this.tripService.endTrip(tripId, endLocation)
                .then(trip => {
                console.log(`[TRIP CONTROLLER] Trip ended successfully with ID: ${trip.id}`);
                this.responseUtils.sendSuccessResponse(res, trip);
            })
                .catch(error => {
                console.error(`[TRIP CONTROLLER] Error ending trip:`, error);
                next(error);
            });
        }
        catch (error) {
            console.error(`[TRIP CONTROLLER] Error ending trip:`, error);
            next(error);
            return Promise.resolve();
        }
    }
    getTripMetrics(req, res, next) {
        console.log(`[TRIP CONTROLLER] Get trip metrics request received`);
        try {
            const { tripId } = req.params;
            console.log(`[TRIP CONTROLLER] Getting metrics for trip with ID: ${tripId}`);
            return this.tripService.getTripMetrics(tripId)
                .then(metrics => {
                console.log(`[TRIP CONTROLLER] Retrieved ${metrics.length} metrics for trip ID: ${tripId}`);
                this.responseUtils.sendSuccessResponse(res, metrics);
            })
                .catch(error => {
                console.error(`[TRIP CONTROLLER] Error getting trip metrics:`, error);
                next(error);
            });
        }
        catch (error) {
            console.error(`[TRIP CONTROLLER] Error getting trip metrics:`, error);
            next(error);
            return Promise.resolve();
        }
    }
    getDriverTrips(req, res, next) {
        console.log(`[TRIP CONTROLLER] Get driver trips request received`);
        try {
            const { driverId } = req.params;
            console.log(`[TRIP CONTROLLER] Getting trips for driver with ID: ${driverId}`);
            return this.tripService.getDriverTrips(driverId)
                .then(trips => {
                console.log(`[TRIP CONTROLLER] Retrieved ${trips.length} trips for driver ID: ${driverId}`);
                this.responseUtils.sendSuccessResponse(res, trips);
            })
                .catch(error => {
                console.error(`[TRIP CONTROLLER] Error getting driver trips:`, error);
                next(error);
            });
        }
        catch (error) {
            console.error(`[TRIP CONTROLLER] Error getting driver trips:`, error);
            next(error);
            return Promise.resolve();
        }
    }
};
exports.TripController = TripController;
exports.TripController = TripController = __decorate([
    (0, tsyringe_1.injectable)(),
    __param(0, (0, tsyringe_1.inject)("ITripService")),
    __param(1, (0, tsyringe_1.inject)("responseUtils")),
    __metadata("design:paramtypes", [trip_service_1.TripService,
        response_utils_1.default])
], TripController);
