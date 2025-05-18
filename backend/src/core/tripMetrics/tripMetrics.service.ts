import { inject, injectable } from "tsyringe";
import { BaseService } from "../base/BaseService";
import { ITripMetric } from "./tripMetrics.interface";
import ITripMetricsRepository from "./tripMetrics.interface";
import { TripMetricsRepository } from "./tripMetrics.repository";
import { ITripMetricsService } from "./tripMetrics.interface";
import { BadRequestError } from "../errors/AppError";

@injectable()
export class TripMetricsService extends BaseService<ITripMetric> implements ITripMetricsService {
  protected entityName = "TripMetric";

  constructor(
    @inject("ITripMetricsRepository") private tripMetricsRepository: ITripMetricsRepository,
    @inject(TripMetricsRepository) repository: TripMetricsRepository
  ) {
    super(repository);
  }

  /**
   * Get all metrics for a specific trip
   * @param tripId The ID of the trip
   * @returns Promise resolving to an array of trip metrics
   */
  async getMetricsByTrip(tripId: string): Promise<ITripMetric[]> {
    this.logger.info(`Getting metrics for trip with ID: ${tripId}`);

    if (!tripId) {
      throw new BadRequestError("Trip ID is required");
    }

    try {
      return await this.tripMetricsRepository.getMetricsByTrip(tripId);
    } catch (error: any) {
      this.logger.error(`Error getting trip metrics:`, { error });
      throw this.handleError(error, `Failed to get metrics for trip ${tripId}`);
    }
  }

  /**
   * Calculate the fuel consumption for a trip
   * @param tripId The ID of the trip
   * @returns Promise resolving to the calculated fuel consumption
   */
  async calculateFuelConsumption(tripId: string): Promise<number> {
    this.logger.info(`Calculating fuel consumption for trip with ID: ${tripId}`);

    if (!tripId) {
      throw new BadRequestError("Trip ID is required");
    }

    try {
      return await this.tripMetricsRepository.calculateFuelConsumption(tripId);
    } catch (error: any) {
      this.logger.error(`Error calculating fuel consumption:`, { error });
      throw this.handleError(error, `Failed to calculate fuel consumption for trip ${tripId}`);
    }
  }
}
