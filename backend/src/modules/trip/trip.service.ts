import { inject, injectable } from "tsyringe";
import { BaseService } from "../../core/base/BaseService";
import { ITrip } from "./interfaces/ITripRepository";
import ITripRepository from "./interfaces/ITripRepository";
import ITripService from "./interfaces/ITripService";
import { TripRepository } from "./trip.repository";
import { NotFoundError, BadRequestError } from "../../core/errors/AppError";
import Logger from "../../utils/logger";

@injectable()
export class TripService extends BaseService<ITrip> implements ITripService {
  protected entityName = "Trip";

  constructor(
    @inject("ITripRepository") private tripRepository: ITripRepository,
    @inject(TripRepository) repository: TripRepository
  ) {
    super(repository);
  }

  async startTrip(driverId: string, vehicleId: string, startLocation: string): Promise<ITrip> {
    console.log(`[TRIP SERVICE] Starting trip for driver: ${driverId}, vehicle: ${vehicleId}`);

    if (!driverId) {
      throw new BadRequestError("Driver ID is required");
    }

    if (!vehicleId) {
      throw new BadRequestError("Vehicle ID is required");
    }

    if (!startLocation) {
      throw new BadRequestError("Start location is required");
    }

    try {
      return await this.tripRepository.startTrip(driverId, vehicleId, startLocation);
    } catch (error) {
      console.error(`[TRIP SERVICE] Error starting trip:`, error);
      throw error;
    }
  }

  async endTrip(tripId: string, endLocation: string): Promise<ITrip> {
    console.log(`[TRIP SERVICE] Ending trip with ID: ${tripId}`);

    if (!tripId) {
      throw new BadRequestError("Trip ID is required");
    }

    if (!endLocation) {
      throw new BadRequestError("End location is required");
    }

    try {
      return await this.tripRepository.endTrip(tripId, endLocation);
    } catch (error) {
      console.error(`[TRIP SERVICE] Error ending trip:`, error);
      throw error;
    }
  }

  async getTripMetrics(tripId: string): Promise<any[]> {
    console.log(`[TRIP SERVICE] Getting metrics for trip with ID: ${tripId}`);

    if (!tripId) {
      throw new BadRequestError("Trip ID is required");
    }

    try {
      return await this.tripRepository.getTripMetrics(tripId);
    } catch (error) {
      console.error(`[TRIP SERVICE] Error getting trip metrics:`, error);
      throw error;
    }
  }

  async getDriverTrips(driverId: string): Promise<ITrip[]> {
    console.log(`[TRIP SERVICE] Getting trips for driver with ID: ${driverId}`);

    if (!driverId) {
      throw new BadRequestError("Driver ID is required");
    }

    try {
      return await this.tripRepository.getDriverTrips(driverId);
    } catch (error) {
      console.error(`[TRIP SERVICE] Error getting driver trips:`, error);
      throw error;
    }
  }

  /**
   * Override findAll to handle Trip-specific ordering
   * Trip model doesn't have createdAt, only updatedAt
   */
  async findAll(options?: {
    skip?: number;
    take?: number;
    orderBy?: Record<string, "asc" | "desc">;
    where?: Record<string, any>;
  }): Promise<ITrip[]> {
    try {
      // If orderBy contains createdAt, replace it with updatedAt
      if (options?.orderBy && 'createdAt' in options.orderBy) {
        const orderDirection = options.orderBy['createdAt'];
        const newOrderBy = { ...options.orderBy };

        // Remove createdAt and add updatedAt with the same direction
        delete newOrderBy['createdAt'];
        newOrderBy['updatedAt'] = orderDirection;

        // Create new options with the fixed orderBy
        const newOptions = { ...options, orderBy: newOrderBy };
        console.log(`[TRIP SERVICE] Replacing createdAt with updatedAt in orderBy`, {
          originalOptions: options,
          newOptions
        });

        return await this.repository.findAll(newOptions);
      }

      // If no createdAt in orderBy, use the parent implementation
      return await super.findAll(options);
    } catch (error) {
      this.logger.error(`Error retrieving ${this.entityName} list`, { error, options });
      throw this.handleError(error, `Failed to retrieve ${this.entityName} list`);
    }
  }
}
