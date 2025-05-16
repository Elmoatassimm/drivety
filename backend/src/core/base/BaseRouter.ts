import { Router } from "express";
import { BaseController } from "./BaseController";
import { RouteFactory } from "./RouteFactory";
import { ZodSchema } from "zod";
import { injectable } from "tsyringe";
import Logger from "../../utils/logger";

/**
 * Base router class that combines a controller and route factory
 * to create a complete API router for a resource.
 */
@injectable()
export class BaseRouter<T extends { id: string }> {
  private router: Router;
  private routeFactory: RouteFactory<T>;
  private basePath: string;
  private logger: Logger;

  /**
   * Create a new base router
   * @param controller The controller to use for this router
   * @param basePath The base path for this router (e.g., "users")
   * @param createSchema Optional schema for validating create requests
   * @param updateSchema Optional schema for validating update requests
   * @param requireAuth Whether to require authentication for all routes
   */
  constructor(
    controller: BaseController<T>,
    basePath: string,
    createSchema?: ZodSchema,
    updateSchema?: ZodSchema,
    requireAuth: boolean = true
  ) {
    this.basePath = basePath;
    this.logger = new Logger(`${basePath}Router`);
    
    // Create route factory
    this.routeFactory = new RouteFactory<T>(
      controller,
      createSchema,
      updateSchema,
      requireAuth
    );
    
    this.router = this.routeFactory.getRouter();
    
    this.logger.info(`Initialized router for ${basePath}`);
  }

  /**
   * Get the Express router
   * @returns The Express router
   */
  getRouter(): Router {
    return this.router;
  }

  /**
   * Get the base path for this router
   * @returns The base path
   */
  getBasePath(): string {
    return this.basePath;
  }

  /**
   * Add a custom route to the router
   * @param method HTTP method
   * @param path Route path
   * @param handlers Request handlers
   */
  addCustomRoute(
    method: "get" | "post" | "put" | "delete" | "patch",
    path: string,
    handlers: any[]
  ): void {
    this.routeFactory.addCustomRoute(method, path, handlers);
    this.logger.info(`Added custom ${method.toUpperCase()} route: ${path}`);
  }
}

export default BaseRouter;
