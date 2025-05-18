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
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.TripRouter = void 0;
const express_1 = require("express");
const tsyringe_1 = require("tsyringe");
const trip_controller_1 = require("./trip.controller");
const auth_middleware_1 = __importDefault(require("../../core/middlewares/auth.middleware"));
const RequestValidation_middleware_1 = require("../../core/middlewares/RequestValidation.middleware");
const trip_validation_1 = require("./validation/trip.validation");
const role_middleware_1 = require("../../core/middlewares/role.middleware");
let TripRouter = class TripRouter {
    constructor(tripController) {
        this.tripController = tripController;
        this.router = (0, express_1.Router)();
        this.setupRoutes();
    }
    setupRoutes() {
        // Start a new trip
        this.router.post("/start", auth_middleware_1.default, (0, role_middleware_1.checkRole)(["DRIVER", "ADMIN"]), (0, RequestValidation_middleware_1.validateRequest)(trip_validation_1.startTripSchema), (req, res, next) => this.tripController.startTrip(req, res, next));
        // End a trip
        this.router.put("/:tripId/end", auth_middleware_1.default, (0, role_middleware_1.checkRole)(["DRIVER", "ADMIN"]), (0, RequestValidation_middleware_1.validateRequest)(trip_validation_1.endTripSchema), (req, res, next) => this.tripController.endTrip(req, res, next));
        // Get trip metrics
        this.router.get("/:tripId/metrics", auth_middleware_1.default, (req, res, next) => this.tripController.getTripMetrics(req, res, next));
        // Get driver trips
        this.router.get("/driver/:driverId", auth_middleware_1.default, (req, res, next) => this.tripController.getDriverTrips(req, res, next));
        // Get all trips (using BaseController's getAll method)
        this.router.get("/", auth_middleware_1.default, (req, res, next) => this.tripController.getAll(req, res, next));
        // Get trip by ID (using BaseController's getById method)
        this.router.get("/:id", auth_middleware_1.default, (req, res, next) => this.tripController.getById(req, res, next));
    }
    getRouter() {
        return this.router;
    }
};
exports.TripRouter = TripRouter;
exports.TripRouter = TripRouter = __decorate([
    (0, tsyringe_1.injectable)(),
    __metadata("design:paramtypes", [trip_controller_1.TripController])
], TripRouter);
