import { injectable, inject } from "tsyringe";
import { BaseRepository } from "../base/BaseRepository";
import { ITripMetric } from "./tripMetrics.interface";
import ITripMetricsRepository from "./tripMetrics.interface";
import PrismaService from "../../config/db";
import { NotFoundError } from "../errors/AppError";

@injectable()
export class TripMetricsRepository extends BaseRepository<ITripMetric> implements ITripMetricsRepository {
  protected modelName = "tripMetric";

  constructor(@inject("db") prismaService: PrismaService) {
    super(prismaService);
    console.log(`[TRIP METRICS REPOSITORY] Initialized with model name: ${this.modelName}`);
  }

  /**
   * Get all metrics for a specific trip
   * @param tripId The ID of the trip
   * @returns Promise resolving to an array of trip metrics
   */
  async getMetricsByTrip(tripId: string): Promise<ITripMetric[]> {
    console.log(`[TRIP METRICS REPOSITORY] Getting metrics for trip with ID: ${tripId}`);
    
    try {
      // Check if trip exists
      const trip = await this.prisma.trip.findUnique({
        where: { id: tripId }
      });
      
      if (!trip) {
        throw new NotFoundError("Trip", tripId);
      }
      
      // Get metrics for this trip
      const metrics = await this.prisma.tripMetric.findMany({
        where: { tripId },
        orderBy: { createdAt: 'asc' }
      });
      
      console.log(`[TRIP METRICS REPOSITORY] Found ${metrics.length} metrics for trip ID: ${tripId}`);
      return metrics;
    } catch (error) {
      console.error(`[TRIP METRICS REPOSITORY] Error getting trip metrics:`, error);
      throw error;
    }
  }

  /**
   * Calculate the fuel consumption for a trip
   * @param tripId The ID of the trip
   * @returns Promise resolving to the calculated fuel consumption
   */
  async calculateFuelConsumption(tripId: string): Promise<number> {
    console.log(`[TRIP METRICS REPOSITORY] Calculating fuel consumption for trip with ID: ${tripId}`);
    
    try {
      // Check if trip exists
      const trip = await this.prisma.trip.findUnique({
        where: { id: tripId }
      });
      
      if (!trip) {
        throw new NotFoundError("Trip", tripId);
      }
      
      // If trip has fuelConsumed value, return it
      if (trip.fuelConsumed !== null && trip.fuelConsumed !== undefined) {
        console.log(`[TRIP METRICS REPOSITORY] Using stored fuel consumption value: ${trip.fuelConsumed}`);
        return trip.fuelConsumed;
      }
      
      // Otherwise calculate from metrics
      const metrics = await this.prisma.tripMetric.findMany({
        where: { tripId },
        select: { fuelConsumption: true }
      });
      
      // Sum up all fuel consumption values
      let totalFuelConsumption = 0;
      metrics.forEach(metric => {
        if (metric.fuelConsumption) {
          totalFuelConsumption += metric.fuelConsumption;
        }
      });
      
      console.log(`[TRIP METRICS REPOSITORY] Calculated fuel consumption: ${totalFuelConsumption}`);
      
      // Update the trip with the calculated fuel consumption
      await this.prisma.trip.update({
        where: { id: tripId },
        data: { fuelConsumed: totalFuelConsumption }
      });
      
      return totalFuelConsumption;
    } catch (error) {
      console.error(`[TRIP METRICS REPOSITORY] Error calculating fuel consumption:`, error);
      throw error;
    }
  }
}
