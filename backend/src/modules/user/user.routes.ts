import { Router } from "express";
import { injectable } from "tsyringe";
import { RouteFactory } from "../../core/base/RouteFactory";
import { UserController } from "./user.controller";
import { IUser } from "./interfaces/IUserRepository";
import authMiddleware from "../../core/middlewares/auth.middleware";

@injectable()
export class UserRouter {
  private router: Router;
  private routeFactory: RouteFactory<IUser>;

  constructor(
    private userController: UserController
  ) {
    this.router = Router();
    this.routeFactory = new RouteFactory<IUser>(this.userController);
    this.setupRoutes();
  }

  private setupRoutes() {
    // Protected routes
    this.router.get("/profile/:id",
      authMiddleware,
      (req, res, next) => this.userController.getProfile(req, res, next)
    );

    this.router.get("/profile",
      authMiddleware,
      (req, res, next) => this.userController.getProfile(req, res, next)
    );
    // Other routes...
  }

  getRouter() {
    return this.router;
  }
}
