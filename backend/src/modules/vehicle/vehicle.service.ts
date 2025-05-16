import { inject, injectable } from "tsyringe";
import { BaseService } from "../../core/base/BaseService";
import { IVehicle } from "./interfaces/IVehicleRepository";
import VehicleRepository from "./interfaces/IVehicleRepository";
import IVehicleService from "./interfaces/IVehicleService";
import { VehicleRepositoryImpl } from "./vehicle.repository";
import { NotFoundError, BadRequestError } from "../../core/errors/AppError";

@injectable()
export class VehicleService extends BaseService<IVehicle> implements IVehicleService {
  protected entityName = "Vehicle";

  constructor(
    @inject("VehicleRepository") private vehicleRepository: VehicleRepository,
    @inject(VehicleRepositoryImpl) repository: VehicleRepositoryImpl
  ) {
    super(repository);
  }

  // We don't need to override findById, findAll, create, update, delete as they're already implemented in BaseService

  async getComponents(vehicleId: string): Promise<any[]> {
    if (!vehicleId) {
      throw new BadRequestError("Vehicle ID is required");
    }

    try {
      return await this.vehicleRepository.getComponents(vehicleId);
    } catch (error) {
      this.logger.error(`Error getting components for vehicle ${vehicleId}`, { error });
      throw this.handleError(error, `Failed to get components for vehicle ${vehicleId}`);
    }
  }

  async updateHealthStatus(vehicleId: string, healthStatus: string): Promise<{ id: string; healthStatus: string }> {
    if (!vehicleId) {
      throw new BadRequestError("Vehicle ID is required");
    }

    if (!healthStatus) {
      throw new BadRequestError("Health status is required");
    }

    // Validate health status - assuming valid statuses are: "GOOD", "FAIR", "POOR", "CRITICAL"
    const validStatuses = ["GOOD", "FAIR", "POOR", "CRITICAL"];
    if (!validStatuses.includes(healthStatus)) {
      throw new BadRequestError(`Invalid health status. Must be one of: ${validStatuses.join(", ")}`);
    }

    try {
      return await this.vehicleRepository.updateHealthStatus(vehicleId, healthStatus);
    } catch (error) {
      this.logger.error(`Error updating health status for vehicle ${vehicleId}`, { error });
      throw this.handleError(error, `Failed to update health status for vehicle ${vehicleId}`);
    }
  }

  async getMaintenanceHistory(vehicleId: string): Promise<any[]> {
    if (!vehicleId) {
      throw new BadRequestError("Vehicle ID is required");
    }

    try {
      return await this.vehicleRepository.getMaintenanceHistory(vehicleId);
    } catch (error) {
      this.logger.error(`Error getting maintenance history for vehicle ${vehicleId}`, { error });
      throw this.handleError(error, `Failed to get maintenance history for vehicle ${vehicleId}`);
    }
  }

  // Override validateCreate to add custom validation for vehicle creation
  protected async validateCreate(data: Omit<IVehicle, "id" | "createdAt" | "updatedAt">): Promise<void> {
    if (!data.model) {
      throw new BadRequestError("Vehicle model is required");
    }

    if (!data.plateNumber) {
      throw new BadRequestError("Vehicle plate number is required");
    }

    // Check if a vehicle with the same plate number already exists
    const existingVehicle = await this.vehicleRepository.findAll({
      where: { plateNumber: data.plateNumber }
    }).then(vehicles => vehicles[0] || null);

    if (existingVehicle) {
      throw new BadRequestError(`A vehicle with plate number ${data.plateNumber} already exists`);
    }
  }
}
