import { Router } from "express";
import { injectable } from "tsyringe";
import { DriverController } from "./driver.controller";
import { IDriver } from "./interfaces/IDriverRepository";
import authMiddleware from "../../core/middlewares/auth.middleware";
import { validateRequest } from "../../core/middlewares/RequestValidation.middleware";
import { createDriverSchema, updateDriverSchema, updateDriverScoreSchema } from "./validations/driver.validation";

@injectable()
export class DriverRouter {
  private router: Router;

  constructor(
    private driverController: DriverController
  ) {
    this.router = Router();
    this.setupRoutes();
  }

  private setupRoutes() {
    // Public routes (if any)

    // Protected routes
    this.router.post(
      "/",
      authMiddleware,
      validateRequest(createDriverSchema),
      (req, res, next) => this.driverController.createDriver(req, res, next)
    );

    this.router.get(
      "/me",
      authMiddleware,
      (req, res, next) => this.driverController.getCurrentUserDriver(req, res, next)
    );

    this.router.get(
      "/user/:userId",
      authMiddleware,
      (req, res, next) => this.driverController.getDriverByUserId(req, res, next)
    );

    this.router.get(
      "/:id",
      authMiddleware,
      (req, res, next) => this.driverController.getById(req, res, next)
    );

    this.router.get(
      "/",
      authMiddleware,
      (req, res, next) => this.driverController.getAll(req, res, next)
    );

    this.router.put(
      "/:id",
      authMiddleware,
      validateRequest(updateDriverSchema),
      (req, res, next) => this.driverController.update(req, res, next)
    );

    this.router.patch(
      "/:id/score",
      authMiddleware,
      validateRequest(updateDriverScoreSchema),
      (req, res, next) => this.driverController.updateDriverScore(req, res, next)
    );

    this.router.delete(
      "/:id",
      authMiddleware,
      (req, res, next) => this.driverController.delete(req, res, next)
    );
  }

  getRouter() {
    return this.router;
  }
}
