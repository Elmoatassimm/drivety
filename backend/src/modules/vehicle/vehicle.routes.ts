import { Router } from "express";
import { injectable, inject } from "tsyringe";
import { VehicleController } from "./vehicle.controller";
import authMiddleware from "../../core/middlewares/auth.middleware";
import { validateRequest } from "../../core/middlewares/RequestValidation.middleware";
import { checkRole } from "../../core/middlewares/role.middleware";

@injectable()
export class VehicleRouter {
  private router: Router;

  constructor(
    @inject(VehicleController) private vehicleController: VehicleController
  ) {
    this.router = Router();
    this.setupRoutes();
  }

  private setupRoutes(): void {
    // Get all vehicles
    this.router.get(
      "/",
      authMiddleware,
      this.vehicleController.getAllVehicles
    );

    // Get vehicle by ID
    this.router.get(
      "/:id",
      authMiddleware,
      this.vehicleController.getVehicleById
    );

    // Create a new vehicle
    this.router.post(
      "/",
      authMiddleware,
      checkRole(["ADMIN"]),
      this.vehicleController.createVehicle
    );

    // Update a vehicle
    this.router.put(
      "/:id",
      authMiddleware,
      checkRole(["ADMIN"]),
      this.vehicleController.updateVehicle
    );

    // Delete a vehicle
    this.router.delete(
      "/:id",
      authMiddleware,
      checkRole(["ADMIN"]),
      this.vehicleController.deleteVehicle
    );

    // Get vehicle components
    this.router.get(
      "/:id/components",
      authMiddleware,
      this.vehicleController.getVehicleComponents
    );

    // Update vehicle health status
    this.router.patch(
      "/:id/health-status",
      authMiddleware,
      checkRole(["ADMIN"]),
      this.vehicleController.updateVehicleHealthStatus
    );

    // Get vehicle maintenance history
    this.router.get(
      "/:id/maintenance-history",
      authMiddleware,
      this.vehicleController.getVehicleMaintenanceHistory
    );
  }

  getRouter(): Router {
    return this.router;
  }
}
