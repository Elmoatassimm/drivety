import { Trip } from "@prisma/client";

export interface ITrip extends Trip {}

export default interface ITripRepository {
  findById(id: string): Promise<ITrip | null>;
  findAll(options?: {
    skip?: number;
    take?: number;
    orderBy?: Record<string, "asc" | "desc">;
    where?: Record<string, any>;
  }): Promise<ITrip[]>;
  create(data: Omit<ITrip, "id" | "updatedAt">): Promise<ITrip>;
  update(id: string, data: Partial<Omit<ITrip, "id" | "updatedAt">>): Promise<ITrip>;
  delete(id: string): Promise<ITrip>;
  
  // Custom methods for trip module
  startTrip(driverId: string, vehicleId: string, startLocation: string): Promise<ITrip>;
  endTrip(tripId: string, endLocation: string): Promise<ITrip>;
  getTripMetrics(tripId: string): Promise<any[]>;
  getDriverTrips(driverId: string): Promise<ITrip[]>;
}
