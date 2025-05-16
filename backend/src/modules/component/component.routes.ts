import { Router } from "express";
import { injectable, inject } from "tsyringe";
import { ComponentController } from "./component.controller";
import authMiddleware from "../../core/middlewares/auth.middleware";
import { validateRequest } from "../../core/middlewares/RequestValidation.middleware";
import { checkRole } from "../../core/middlewares/role.middleware";

@injectable()
export class ComponentRouter {
  private router: Router;

  constructor(
    @inject(ComponentController) private componentController: ComponentController
  ) {
    this.router = Router();
    this.setupRoutes();
  }

  private setupRoutes(): void {
    // Get all components
    this.router.get(
      "/",
      authMiddleware,
      this.componentController.getAllComponents
    );

    // Get component by ID
    this.router.get(
      "/:id",
      authMiddleware,
      this.componentController.getComponentById
    );

    // Create a new component
    this.router.post(
      "/",
      authMiddleware,
      checkRole(["ADMIN", "MANAGER", "TECHNICIAN"]),
      this.componentController.createComponent
    );

    // Update a component
    this.router.put(
      "/:id",
      authMiddleware,
      checkRole(["ADMIN", "MANAGER", "TECHNICIAN"]),
      this.componentController.updateComponent
    );

    // Delete a component
    this.router.delete(
      "/:id",
      authMiddleware,
      checkRole(["ADMIN", "MANAGER"]),
      this.componentController.deleteComponent
    );

    // Get component health score
    this.router.get(
      "/:id/health-score",
      authMiddleware,
      this.componentController.getComponentHealthScore
    );

    // Get component maintenance records
    this.router.get(
      "/:id/maintenance-records",
      authMiddleware,
      this.componentController.getComponentMaintenanceRecords
    );

    // Trigger component alert
    this.router.post(
      "/:id/alert",
      authMiddleware,
      checkRole(["ADMIN", "MANAGER", "TECHNICIAN"]),
      this.componentController.triggerComponentAlert
    );
  }

  getRouter(): Router {
    return this.router;
  }
}
