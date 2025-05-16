import { Router, Request, Response, NextFunction } from "express";
import { BaseController } from "./BaseController";
import { validateRequest } from "../middlewares/RequestValidation.middleware";
import { ZodSchema } from "zod";
import authMiddleware from "../middlewares/auth.middleware";

export class RouteFactory<T extends { id: string }> {
  private router: Router;

  constructor(
    private controller: BaseController<T>,
    private createSchema?: ZodSchema,
    private updateSchema?: ZodSchema,
    private requireAuth: boolean = true
  ) {
    this.router = Router();
    this.setupRoutes();
  }

  private setupRoutes(): void {
    // Apply auth middleware conditionally
    if (this.requireAuth) {
      this.router.use(authMiddleware);
    }

    // GET all entities
    this.router.get("/", this.handleRequest(this.controller.getAll.bind(this.controller)));

    // GET entity by ID
    this.router.get("/:id", this.handleRequest(this.controller.getById.bind(this.controller)));

    // POST create entity
    this.router.post(
      "/",
      this.createSchema ? validateRequest(this.createSchema) : [],
      this.handleRequest(this.controller.create.bind(this.controller))
    );

    // PUT update entity
    this.router.put(
      "/:id",
      this.updateSchema ? validateRequest(this.updateSchema) : [],
      this.handleRequest(this.controller.update.bind(this.controller))
    );

    // DELETE entity
    this.router.delete("/:id", this.handleRequest(this.controller.delete.bind(this.controller)));
  }

  // Helper to maintain consistent request handling
  private handleRequest(handler: (req: Request, res: Response, next: NextFunction) => Promise<void>) {
    return (req: Request, res: Response, next: NextFunction) => handler(req, res, next);
  }

  // Add custom route
  public addCustomRoute(
    method: "get" | "post" | "put" | "delete" | "patch",
    path: string,
    handlers: Array<(req: Request, res: Response, next: NextFunction) => void | Promise<void>>
  ): void {
    this.router[method](path, ...handlers);
  }

  public getRouter(): Router {
    return this.router;
  }
}
