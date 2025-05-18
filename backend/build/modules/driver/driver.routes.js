"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.DriverRouter = void 0;
const express_1 = require("express");
const tsyringe_1 = require("tsyringe");
const driver_controller_1 = require("./driver.controller");
const auth_middleware_1 = __importDefault(require("../../core/middlewares/auth.middleware"));
const RequestValidation_middleware_1 = require("../../core/middlewares/RequestValidation.middleware");
const driver_validation_1 = require("./validations/driver.validation");
let DriverRouter = class DriverRouter {
    constructor(driverController) {
        this.driverController = driverController;
        this.router = (0, express_1.Router)();
        this.setupRoutes();
    }
    setupRoutes() {
        // Public routes (if any)
        // Protected routes
        this.router.post("/", auth_middleware_1.default, (0, RequestValidation_middleware_1.validateRequest)(driver_validation_1.createDriverSchema), (req, res, next) => this.driverController.createDriver(req, res, next));
        this.router.get("/me", auth_middleware_1.default, (req, res, next) => this.driverController.getCurrentUserDriver(req, res, next));
        this.router.get("/user/:userId", auth_middleware_1.default, (req, res, next) => this.driverController.getDriverByUserId(req, res, next));
        this.router.get("/:id", auth_middleware_1.default, (req, res, next) => this.driverController.getById(req, res, next));
        this.router.get("/", auth_middleware_1.default, (req, res, next) => this.driverController.getAll(req, res, next));
        this.router.put("/:id", auth_middleware_1.default, (0, RequestValidation_middleware_1.validateRequest)(driver_validation_1.updateDriverSchema), (req, res, next) => this.driverController.update(req, res, next));
        this.router.patch("/:id/score", auth_middleware_1.default, (0, RequestValidation_middleware_1.validateRequest)(driver_validation_1.updateDriverScoreSchema), (req, res, next) => this.driverController.updateDriverScore(req, res, next));
        this.router.delete("/:id", auth_middleware_1.default, (req, res, next) => this.driverController.delete(req, res, next));
    }
    getRouter() {
        return this.router;
    }
};
exports.DriverRouter = DriverRouter;
exports.DriverRouter = DriverRouter = __decorate([
    (0, tsyringe_1.injectable)(),
    __metadata("design:paramtypes", [driver_controller_1.DriverController])
], DriverRouter);
