"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.registerDriverDependencies = registerDriverDependencies;
const tsyringe_1 = require("tsyringe");
const driver_controller_1 = require("./driver.controller");
const driver_repository_1 = require("./driver.repository");
const driver_service_1 = require("./driver.service");
const driver_routes_1 = require("./driver.routes");
function registerDriverDependencies() {
    // Register interfaces to implementations
    tsyringe_1.container.register("IDriverRepository", { useClass: driver_repository_1.DriverRepository });
    tsyringe_1.container.register("IDriverService", { useClass: driver_service_1.DriverService });
    // Register concrete classes
    tsyringe_1.container.register(driver_repository_1.DriverRepository, { useClass: driver_repository_1.DriverRepository });
    tsyringe_1.container.register(driver_service_1.DriverService, { useClass: driver_service_1.DriverService });
    tsyringe_1.container.register(driver_controller_1.DriverController, { useClass: driver_controller_1.DriverController });
    tsyringe_1.container.register(driver_routes_1.DriverRouter, { useClass: driver_routes_1.DriverRouter });
}
