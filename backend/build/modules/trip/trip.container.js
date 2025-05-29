"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.registerTripDependencies = registerTripDependencies;
const tsyringe_1 = require("tsyringe");
const trip_repository_1 = require("./trip.repository");
const trip_service_1 = require("./trip.service");
const trip_controller_1 = require("./trip.controller");
const trip_routes_1 = require("./trip.routes");
function registerTripDependencies() {
    // Register interfaces to implementations
    tsyringe_1.container.register("ITripRepository", { useClass: trip_repository_1.TripRepository });
    tsyringe_1.container.register("ITripService", { useClass: trip_service_1.TripService });
    // Register concrete classes
    tsyringe_1.container.register(trip_repository_1.TripRepository, { useClass: trip_repository_1.TripRepository });
    tsyringe_1.container.register(trip_service_1.TripService, { useClass: trip_service_1.TripService });
    tsyringe_1.container.register(trip_controller_1.TripController, { useClass: trip_controller_1.TripController });
    tsyringe_1.container.register(trip_routes_1.TripRouter, { useClass: trip_routes_1.TripRouter });
}
