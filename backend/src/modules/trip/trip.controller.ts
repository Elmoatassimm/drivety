import { Request, Response, NextFunction } from "express";
import { inject, injectable } from "tsyringe";
import { BaseController } from "../../core/base/BaseController";
import { TripService } from "./trip.service";
import ResponseUtils from "../../core/utils/response.utils";
import { ITrip } from "./interfaces/ITripRepository";
import { RequestWithUser } from "../../types/types";
import { NotFoundError, BadRequestError } from "../../core/errors/AppError";
import ITripService from "./interfaces/ITripService";

@injectable()
export class TripController extends BaseController<ITrip> {
  constructor(
    @inject("ITripService") private tripService: TripService,
    @inject("responseUtils") responseUtils: ResponseUtils
  ) {
    super(tripService as any, responseUtils);
  }

  startTrip(req: Request, res: Response, next: NextFunction): Promise<void> {
    console.log(`[TRIP CONTROLLER] Start trip request received:`, req.body);
    try {
      const { driverId, vehicleId, startLocation, startLatitude, startLongitude } = req.body;
      console.log(`[TRIP CONTROLLER] Starting trip for driver: ${driverId}, vehicle: ${vehicleId}, coordinates: ${startLatitude}, ${startLongitude}`);

      return this.tripService.startTrip(driverId, vehicleId, startLocation, startLatitude, startLongitude)
        .then(trip => {
          console.log(`[TRIP CONTROLLER] Trip started successfully with ID: ${trip.id}`);
          this.responseUtils.sendSuccessResponse(res, trip, 201);
        })
        .catch(error => {
          console.error(`[TRIP CONTROLLER] Error starting trip:`, error);
          next(error);
        });
    } catch (error) {
      console.error(`[TRIP CONTROLLER] Error starting trip:`, error);
      next(error);
      return Promise.resolve();
    }
  }

  endTrip(req: Request, res: Response, next: NextFunction): Promise<void> {
    console.log(`[TRIP CONTROLLER] End trip request received:`, req.body);
    try {
      const { tripId } = req.params;
      const { endLocation, endLatitude, endLongitude, distance, fuelConsumed } = req.body;
      console.log(`[TRIP CONTROLLER] Ending trip with ID: ${tripId}, coordinates: ${endLatitude}, ${endLongitude}, distance: ${distance}, fuelConsumed: ${fuelConsumed}`);

      return this.tripService.endTrip(tripId, endLocation, endLatitude, endLongitude, distance, fuelConsumed)
        .then(trip => {
          console.log(`[TRIP CONTROLLER] Trip ended successfully with ID: ${trip.id}`);
          this.responseUtils.sendSuccessResponse(res, trip);
        })
        .catch(error => {
          console.error(`[TRIP CONTROLLER] Error ending trip:`, error);
          next(error);
        });
    } catch (error) {
      console.error(`[TRIP CONTROLLER] Error ending trip:`, error);
      next(error);
      return Promise.resolve();
    }
  }

  getTripMetrics(req: Request, res: Response, next: NextFunction): Promise<void> {
    console.log(`[TRIP CONTROLLER] Get trip metrics request received`);
    try {
      const { tripId } = req.params;
      console.log(`[TRIP CONTROLLER] Getting metrics for trip with ID: ${tripId}`);

      return this.tripService.getTripMetrics(tripId)
        .then(metrics => {
          console.log(`[TRIP CONTROLLER] Retrieved ${metrics.length} metrics for trip ID: ${tripId}`);
          this.responseUtils.sendSuccessResponse(res, metrics);
        })
        .catch(error => {
          console.error(`[TRIP CONTROLLER] Error getting trip metrics:`, error);
          next(error);
        });
    } catch (error) {
      console.error(`[TRIP CONTROLLER] Error getting trip metrics:`, error);
      next(error);
      return Promise.resolve();
    }
  }

  getDriverTrips(req: Request, res: Response, next: NextFunction): Promise<void> {
    console.log(`[TRIP CONTROLLER] Get driver trips request received`);
    try {
      const { driverId } = req.params;
      console.log(`[TRIP CONTROLLER] Getting trips for driver with ID: ${driverId}`);

      return this.tripService.getDriverTrips(driverId)
        .then(trips => {
          console.log(`[TRIP CONTROLLER] Retrieved ${trips.length} trips for driver ID: ${driverId}`);
          this.responseUtils.sendSuccessResponse(res, trips);
        })
        .catch(error => {
          console.error(`[TRIP CONTROLLER] Error getting driver trips:`, error);
          next(error);
        });
    } catch (error) {
      console.error(`[TRIP CONTROLLER] Error getting driver trips:`, error);
      next(error);
      return Promise.resolve();
    }
  }
}
