import { container } from "tsyringe";
import { TripMetricsRepository } from "./tripMetrics.repository";
import { TripMetricsService } from "./tripMetrics.service";
import ITripMetricsRepository from "./tripMetrics.interface";
import { ITripMetricsService } from "./tripMetrics.interface";

export function registerTripMetricsDependencies() {
  // Register interfaces to implementations
  container.register("ITripMetricsRepository", { useClass: TripMetricsRepository });
  container.register("ITripMetricsService", { useClass: TripMetricsService });
  
  // Register concrete classes
  container.register(TripMetricsRepository, { useClass: TripMetricsRepository });
  container.register(TripMetricsService, { useClass: TripMetricsService });
}
