import { Router } from "express";
import { injectable } from "tsyringe";
import { TripController } from "./trip.controller";
import authMiddleware from "../../core/middlewares/auth.middleware";
import { validateRequest } from "../../core/middlewares/RequestValidation.middleware";
import { startTripSchema, endTripSchema } from "./validation/trip.validation";
import { checkRole } from "../../core/middlewares/role.middleware";
import { UserRole } from "../../types/user.types";

@injectable()
export class TripRouter {
  private router: Router;

  constructor(
    private tripController: TripController
  ) {
    this.router = Router();
    this.setupRoutes();
  }

  private setupRoutes(): void {
    // Start a new trip
    this.router.post(
      "/start",
      authMiddleware,
      checkRole([UserRole.DRIVER, UserRole.ADMIN]),
      validateRequest(startTripSchema),
      (req, res, next) => this.tripController.startTrip(req, res, next)
    );

    // End a trip
    this.router.put(
      "/:tripId/end",
      authMiddleware,
      checkRole([UserRole.DRIVER, UserRole.ADMIN]),
      validateRequest(endTripSchema),
      (req, res, next) => this.tripController.endTrip(req, res, next)
    );

    // Get trip metrics
    this.router.get(
      "/:tripId/metrics",
      authMiddleware,
      (req, res, next) => this.tripController.getTripMetrics(req, res, next)
    );

    // Get driver trips
    this.router.get(
      "/driver/:driverId",
      authMiddleware,
      (req, res, next) => this.tripController.getDriverTrips(req, res, next)
    );

    // Get all trips (using BaseController's getAll method)
    this.router.get(
      "/",
      authMiddleware,
      (req, res, next) => this.tripController.getAll(req, res, next)
    );

    // Get trip by ID (using BaseController's getById method)
    this.router.get(
      "/:id",
      authMiddleware,
      (req, res, next) => this.tripController.getById(req, res, next)
    );
  }

  getRouter(): Router {
    return this.router;
  }
}
