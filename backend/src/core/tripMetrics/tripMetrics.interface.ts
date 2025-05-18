import { TripMetric } from "@prisma/client";

export interface ITripMetric extends TripMetric {}

export default interface ITripMetricsRepository {
  /**
   * Get all metrics for a specific trip
   * @param tripId The ID of the trip
   * @returns Promise resolving to an array of trip metrics
   */
  getMetricsByTrip(tripId: string): Promise<ITripMetric[]>;
  
  /**
   * Calculate the fuel consumption for a trip
   * @param tripId The ID of the trip
   * @returns Promise resolving to the calculated fuel consumption
   */
  calculateFuelConsumption(tripId: string): Promise<number>;
}

export interface ITripMetricsService {
  /**
   * Get all metrics for a specific trip
   * @param tripId The ID of the trip
   * @returns Promise resolving to an array of trip metrics
   */
  getMetricsByTrip(tripId: string): Promise<ITripMetric[]>;
  
  /**
   * Calculate the fuel consumption for a trip
   * @param tripId The ID of the trip
   * @returns Promise resolving to the calculated fuel consumption
   */
  calculateFuelConsumption(tripId: string): Promise<number>;
}
