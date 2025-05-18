import { injectable, inject } from "tsyringe";
import { BaseRepository } from "../../core/base/BaseRepository";
import { ITrip } from "./interfaces/ITripRepository";
import ITripRepository from "./interfaces/ITripRepository";
import PrismaService from "../../config/db";
import { NotFoundError, BadRequestError } from "../../core/errors/AppError";

@injectable()
export class TripRepository extends BaseRepository<ITrip> implements ITripRepository {
  protected modelName = "trip";

  constructor(@inject("db") prismaService: PrismaService) {
    super(prismaService);
    console.log(`[TRIP REPOSITORY] Initialized with model name: ${this.modelName}`);
  }

  async startTrip(driverId: string, vehicleId: string, startLocation: string): Promise<ITrip> {
    console.log(`[TRIP REPOSITORY] Starting trip for driver: ${driverId}, vehicle: ${vehicleId}`);
    
    try {
      // Check if driver exists
      const driver = await this.prisma.driver.findUnique({
        where: { id: driverId }
      });
      
      if (!driver) {
        throw new NotFoundError("Driver", driverId);
      }
      
      // Check if vehicle exists
      const vehicle = await this.prisma.vehicle.findUnique({
        where: { id: vehicleId }
      });
      
      if (!vehicle) {
        throw new NotFoundError("Vehicle", vehicleId);
      }
      
      // Create a new trip
      const trip = await this.prisma.trip.create({
        data: {
          driverId,
          vehicleId,
          startLocation,
          startTime: new Date(),
          status: "IN_PROGRESS"
        }
      });
      
      console.log(`[TRIP REPOSITORY] Trip started successfully with ID: ${trip.id}`);
      return trip;
    } catch (error) {
      console.error(`[TRIP REPOSITORY] Error starting trip:`, error);
      throw error;
    }
  }

  async endTrip(tripId: string, endLocation: string): Promise<ITrip> {
    console.log(`[TRIP REPOSITORY] Ending trip with ID: ${tripId}`);
    
    try {
      // Check if trip exists and is in progress
      const trip = await this.prisma.trip.findUnique({
        where: { id: tripId }
      });
      
      if (!trip) {
        throw new NotFoundError("Trip", tripId);
      }
      
      if (trip.status !== "IN_PROGRESS") {
        throw new BadRequestError(`Trip with ID ${tripId} is not in progress`);
      }
      
      // Calculate trip duration and other metrics
      const endTime = new Date();
      const duration = endTime.getTime() - trip.startTime.getTime();
      
      // Update the trip with end details
      const updatedTrip = await this.prisma.trip.update({
        where: { id: tripId },
        data: {
          endLocation,
          endTime,
          status: "COMPLETED"
          // We'll calculate distance and fuel consumed in a real implementation
        }
      });
      
      console.log(`[TRIP REPOSITORY] Trip ended successfully with ID: ${updatedTrip.id}`);
      return updatedTrip;
    } catch (error) {
      console.error(`[TRIP REPOSITORY] Error ending trip:`, error);
      throw error;
    }
  }

  async getTripMetrics(tripId: string): Promise<any[]> {
    console.log(`[TRIP REPOSITORY] Getting metrics for trip with ID: ${tripId}`);
    
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
        where: { tripId }
      });
      
      console.log(`[TRIP REPOSITORY] Found ${metrics.length} metrics for trip ID: ${tripId}`);
      return metrics;
    } catch (error) {
      console.error(`[TRIP REPOSITORY] Error getting trip metrics:`, error);
      throw error;
    }
  }

  async getDriverTrips(driverId: string): Promise<ITrip[]> {
    console.log(`[TRIP REPOSITORY] Getting trips for driver with ID: ${driverId}`);
    
    try {
      // Check if driver exists
      const driver = await this.prisma.driver.findUnique({
        where: { id: driverId }
      });
      
      if (!driver) {
        throw new NotFoundError("Driver", driverId);
      }
      
      // Get trips for this driver
      const trips = await this.prisma.trip.findMany({
        where: { driverId },
        orderBy: { startTime: 'desc' }
      });
      
      console.log(`[TRIP REPOSITORY] Found ${trips.length} trips for driver ID: ${driverId}`);
      return trips;
    } catch (error) {
      console.error(`[TRIP REPOSITORY] Error getting driver trips:`, error);
      throw error;
    }
  }
}
