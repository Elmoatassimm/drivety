"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.registerVehicleDependencies = registerVehicleDependencies;
const tsyringe_1 = require("tsyringe");
const vehicle_repository_1 = require("./vehicle.repository");
const vehicle_service_1 = require("./vehicle.service");
const vehicle_controller_1 = require("./vehicle.controller");
const vehicle_routes_1 = require("./vehicle.routes");
function registerVehicleDependencies() {
    // Register interfaces to implementations
    tsyringe_1.container.register("VehicleRepository", { useClass: vehicle_repository_1.VehicleRepositoryImpl });
    tsyringe_1.container.register("IVehicleService", { useClass: vehicle_service_1.VehicleService });
    // Register concrete classes
    tsyringe_1.container.register(vehicle_repository_1.VehicleRepositoryImpl, { useClass: vehicle_repository_1.VehicleRepositoryImpl });
    tsyringe_1.container.register(vehicle_service_1.VehicleService, { useClass: vehicle_service_1.VehicleService });
    tsyringe_1.container.register(vehicle_controller_1.VehicleController, { useClass: vehicle_controller_1.VehicleController });
    tsyringe_1.container.register(vehicle_routes_1.VehicleRouter, { useClass: vehicle_routes_1.VehicleRouter });
}
