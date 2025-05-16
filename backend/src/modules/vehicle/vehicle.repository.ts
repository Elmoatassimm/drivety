import { injectable, inject } from "tsyringe";
import { BaseRepository } from "../../core/base/BaseRepository";
import { IVehicle, VehicleRepository } from "./interfaces/IVehicleRepository";
import PrismaService from "../../config/db";
import { NotFoundError } from "../../core/errors/AppError";

@injectable()
export class VehicleRepositoryImpl extends BaseRepository<IVehicle> implements VehicleRepository {
  protected modelName = "vehicle";

  constructor(@inject("db") prismaService: PrismaService) {
    super(prismaService);
  }

  async getComponents(vehicleId: string): Promise<any[]> {
    // First check if the vehicle exists
    const vehicle = await this.findById(vehicleId);
    if (!vehicle) {
      throw new NotFoundError("Vehicle", vehicleId);
    }

    // Return the components for this vehicle
    return this.prisma.component.findMany({
      where: { vehicleId }
    });
  }

  async updateHealthStatus(vehicleId: string, healthStatus: string): Promise<{ id: string; healthStatus: string }> {
    // First check if the vehicle exists
    const vehicle = await this.findById(vehicleId);
    if (!vehicle) {
      throw new NotFoundError("Vehicle", vehicleId);
    }

    // Update the vehicle status
    const updatedVehicle = await this.prisma.vehicle.update({
      where: { id: vehicleId },
      data: { status: healthStatus },
      select: {
        id: true,
        status: true
      }
    });

    // Return the updated vehicle with the renamed field
    return {
      id: updatedVehicle.id,
      healthStatus: updatedVehicle.status
    };
  }

  async getMaintenanceHistory(vehicleId: string): Promise<any[]> {
    // First check if the vehicle exists
    const vehicle = await this.findById(vehicleId);
    if (!vehicle) {
      throw new NotFoundError("Vehicle", vehicleId);
    }

    // Return the maintenance history for this vehicle
    return this.prisma.maintenance.findMany({
      where: { vehicleId },
      orderBy: { createdAt: 'desc' }
    });
  }
}
