import { Vehicle } from "@prisma/client";

export interface IVehicle extends Vehicle {}

export interface VehicleRepository {
  findById(id: string): Promise<IVehicle | null>;
  findAll(options?: {
    skip?: number;
    take?: number;
    orderBy?: Record<string, "asc" | "desc">;
    where?: Record<string, any>;
  }): Promise<IVehicle[]>;
  create(data: Omit<IVehicle, "id" | "createdAt" | "updatedAt">): Promise<IVehicle>;
  update(id: string, data: Partial<Omit<IVehicle, "id" | "createdAt" | "updatedAt">>): Promise<IVehicle>;
  delete(id: string): Promise<IVehicle>;
  getComponents(vehicleId: string): Promise<any[]>;
  updateHealthStatus(vehicleId: string, healthStatus: string): Promise<{ id: string; healthStatus: string }>;
  getMaintenanceHistory(vehicleId: string): Promise<any[]>;
}

export default VehicleRepository;
