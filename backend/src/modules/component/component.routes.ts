import { Router } from "express";
import { injectable, inject } from "tsyringe";
import { ComponentController } from "./component.controller";
import authMiddleware from "../../core/middlewares/auth.middleware";
import { validateRequest } from "../../core/middlewares/RequestValidation.middleware";
import { checkRole } from "../../core/middlewares/role.middleware";
import { UserRole } from "../../types/user.types";

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
      checkRole([UserRole.ADMIN, UserRole.MANAGER, UserRole.TECHNICIAN]),
      this.componentController.createComponent
    );

    // Update a component
    this.router.put(
      "/:id",
      authMiddleware,
      checkRole([UserRole.ADMIN, UserRole.MANAGER, UserRole.TECHNICIAN]),
      this.componentController.updateComponent
    );

    // Delete a component
    this.router.delete(
      "/:id",
      authMiddleware,
      checkRole([UserRole.ADMIN, UserRole.MANAGER]),
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

    // Get components by vehicle ID
    this.router.get(
      "/vehicle/:id",
      authMiddleware,
      checkRole([UserRole.ADMIN, UserRole.MANAGER, UserRole.TECHNICIAN]),
      this.componentController.getAllComponents
    );

    // Trigger component alert
    this.router.post(
      "/:id/alert",
      authMiddleware,
      checkRole([UserRole.ADMIN, UserRole.MANAGER, UserRole.TECHNICIAN]),
      this.componentController.triggerComponentAlert
    );
  }

  getRouter(): Router {
    return this.router;
  }
}
