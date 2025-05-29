"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
// Import dependencies
const express_1 = require("express");
const container_1 = require("./config/container");
// Import module routes
const auth_routes_1 = __importDefault(require("./modules/auth/auth.routes"));
const user_routes_1 = require("./modules/user/user.routes");
const driver_routes_1 = require("./modules/driver/driver.routes");
const vehicle_routes_1 = require("./modules/vehicle/vehicle.routes");
const component_routes_1 = require("./modules/component/component.routes");
const trip_routes_1 = require("./modules/trip/trip.routes");
// Create router instance
const router = (0, express_1.Router)();
// Register Auth routes
router.use('/api/auth', auth_routes_1.default);
// Register User routes
const userRouter = container_1.container.resolve(user_routes_1.UserRouter);
router.use('/api/users', userRouter.getRouter());
// Register Driver routes
const driverRouter = container_1.container.resolve(driver_routes_1.DriverRouter);
router.use('/api/drivers', driverRouter.getRouter());
// Register Vehicle routes
const vehicleRouter = container_1.container.resolve(vehicle_routes_1.VehicleRouter);
router.use('/api/vehicles', vehicleRouter.getRouter());
// Register Component routes
const componentRouter = container_1.container.resolve(component_routes_1.ComponentRouter);
router.use('/api/components', componentRouter.getRouter());
// Register Trip routes
const tripRouter = container_1.container.resolve(trip_routes_1.TripRouter);
router.use('/api/trips', tripRouter.getRouter());
exports.default = router;
