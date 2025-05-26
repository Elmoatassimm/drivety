"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const container_1 = require("../../config/container");
const auth_controller_1 = __importDefault(require("./auth.controller"));
const RequestValidation_middleware_1 = require("../../core/middlewares/RequestValidation.middleware");
const user_validation_1 = require("../user/user.validation");
const auth_middleware_1 = __importDefault(require("../../core/middlewares/auth.middleware"));
const authRouter = (0, express_1.Router)();
const authController = container_1.container.resolve(auth_controller_1.default);
// Public routes
authRouter.post("/register", (0, RequestValidation_middleware_1.validateRequest)(user_validation_1.userRegistrationSchema), (req, res, next) => authController.register(req, res, next));
authRouter.post("/login", (0, RequestValidation_middleware_1.validateRequest)(user_validation_1.userLoginSchema), (req, res, next) => authController.login(req, res, next));
authRouter.post("/refresh-token", (req, res, next) => authController.refreshToken(req, res, next));
// Protected routes
authRouter.post("/logout", auth_middleware_1.default, (req, res, next) => authController.logout(req, res, next));
exports.default = authRouter;
