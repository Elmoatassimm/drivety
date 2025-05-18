"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.registerTripMetricsDependencies = registerTripMetricsDependencies;
const tsyringe_1 = require("tsyringe");
const tripMetrics_repository_1 = require("./tripMetrics.repository");
const tripMetrics_service_1 = require("./tripMetrics.service");
function registerTripMetricsDependencies() {
    // Register interfaces to implementations
    tsyringe_1.container.register("ITripMetricsRepository", { useClass: tripMetrics_repository_1.TripMetricsRepository });
    tsyringe_1.container.register("ITripMetricsService", { useClass: tripMetrics_service_1.TripMetricsService });
    // Register concrete classes
    tsyringe_1.container.register(tripMetrics_repository_1.TripMetricsRepository, { useClass: tripMetrics_repository_1.TripMetricsRepository });
    tsyringe_1.container.register(tripMetrics_service_1.TripMetricsService, { useClass: tripMetrics_service_1.TripMetricsService });
}
