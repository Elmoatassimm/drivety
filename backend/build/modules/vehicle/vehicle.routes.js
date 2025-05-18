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
exports.VehicleRouter = void 0;
const express_1 = require("express");
const tsyringe_1 = require("tsyringe");
const vehicle_controller_1 = require("./vehicle.controller");
const auth_middleware_1 = __importDefault(require("../../core/middlewares/auth.middleware"));
const role_middleware_1 = require("../../core/middlewares/role.middleware");
let VehicleRouter = class VehicleRouter {
    constructor(vehicleController) {
        this.vehicleController = vehicleController;
        this.router = (0, express_1.Router)();
        this.setupRoutes();
    }
    setupRoutes() {
        // Get all vehicles
        this.router.get("/", auth_middleware_1.default, this.vehicleController.getAllVehicles);
        // Get vehicle by ID
        this.router.get("/:id", auth_middleware_1.default, this.vehicleController.getVehicleById);
        // Create a new vehicle
        this.router.post("/", auth_middleware_1.default, (0, role_middleware_1.checkRole)(["ADMIN"]), this.vehicleController.createVehicle);
        // Update a vehicle
        this.router.put("/:id", auth_middleware_1.default, (0, role_middleware_1.checkRole)(["ADMIN"]), this.vehicleController.updateVehicle);
        // Delete a vehicle
        this.router.delete("/:id", auth_middleware_1.default, (0, role_middleware_1.checkRole)(["ADMIN"]), this.vehicleController.deleteVehicle);
        // Get vehicle components
        this.router.get("/:id/components", auth_middleware_1.default, this.vehicleController.getVehicleComponents);
        // Update vehicle health status
        this.router.patch("/:id/health-status", auth_middleware_1.default, (0, role_middleware_1.checkRole)(["ADMIN"]), this.vehicleController.updateVehicleHealthStatus);
        // Get vehicle maintenance history
        this.router.get("/:id/maintenance-history", auth_middleware_1.default, this.vehicleController.getVehicleMaintenanceHistory);
    }
    getRouter() {
        return this.router;
    }
};
exports.VehicleRouter = VehicleRouter;
exports.VehicleRouter = VehicleRouter = __decorate([
    (0, tsyringe_1.injectable)(),
    __param(0, (0, tsyringe_1.inject)(vehicle_controller_1.VehicleController)),
    __metadata("design:paramtypes", [vehicle_controller_1.VehicleController])
], VehicleRouter);
