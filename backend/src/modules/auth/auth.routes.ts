import { Router } from "express";
import { container } from "../../config/container";
import AuthController from "./auth.controller";
import { validateRequest } from "../../core/middlewares/RequestValidation.middleware";
import { userLoginSchema, userRegistrationSchema } from "../user/user.validation";
import authMiddleware from "../../core/middlewares/auth.middleware";

const authRouter = Router();
const authController = container.resolve(AuthController);

// Public routes
authRouter.post(
  "/register",
  validateRequest(userRegistrationSchema),
  (req, res, next) => authController.register(req, res, next)
);

authRouter.post(
  "/login",
  validateRequest(userLoginSchema),
  (req, res, next) => authController.login(req, res, next)
);

authRouter.post(
  "/refresh-token",
  (req, res, next) => authController.refreshToken(req, res, next)
);

// Protected routes
authRouter.post(
  "/logout",
  authMiddleware,
  (req, res, next) => authController.logout(req, res, next)
);

export default authRouter;
