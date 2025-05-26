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
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.ComponentRouter = void 0;
const express_1 = require("express");
const tsyringe_1 = require("tsyringe");
const component_controller_1 = require("./component.controller");
const auth_middleware_1 = __importDefault(require("../../core/middlewares/auth.middleware"));
const role_middleware_1 = require("../../core/middlewares/role.middleware");
const user_types_1 = require("../../types/user.types");
let ComponentRouter = class ComponentRouter {
    constructor(componentController) {
        this.componentController = componentController;
        this.router = (0, express_1.Router)();
        this.setupRoutes();
    }
    setupRoutes() {
        // Get all components
        this.router.get("/", auth_middleware_1.default, this.componentController.getAllComponents);
        // Get component by ID
        this.router.get("/:id", auth_middleware_1.default, this.componentController.getComponentById);
        // Create a new component
        this.router.post("/", auth_middleware_1.default, (0, role_middleware_1.checkRole)([user_types_1.UserRole.ADMIN, user_types_1.UserRole.MANAGER, user_types_1.UserRole.TECHNICIAN]), this.componentController.createComponent);
        // Update a component
        this.router.put("/:id", auth_middleware_1.default, (0, role_middleware_1.checkRole)([user_types_1.UserRole.ADMIN, user_types_1.UserRole.MANAGER, user_types_1.UserRole.TECHNICIAN]), this.componentController.updateComponent);
        // Delete a component
        this.router.delete("/:id", auth_middleware_1.default, (0, role_middleware_1.checkRole)([user_types_1.UserRole.ADMIN, user_types_1.UserRole.MANAGER]), this.componentController.deleteComponent);
        // Get component health score
        this.router.get("/:id/health-score", auth_middleware_1.default, this.componentController.getComponentHealthScore);
        // Get component maintenance records
        this.router.get("/:id/maintenance-records", auth_middleware_1.default, this.componentController.getComponentMaintenanceRecords);
        // Get components by vehicle ID
        this.router.get("/vehicle/:id", auth_middleware_1.default, (0, role_middleware_1.checkRole)([user_types_1.UserRole.ADMIN, user_types_1.UserRole.MANAGER, user_types_1.UserRole.TECHNICIAN]), this.componentController.getAllComponents);
        // Trigger component alert
        this.router.post("/:id/alert", auth_middleware_1.default, (0, role_middleware_1.checkRole)([user_types_1.UserRole.ADMIN, user_types_1.UserRole.MANAGER, user_types_1.UserRole.TECHNICIAN]), this.componentController.triggerComponentAlert);
    }
    getRouter() {
        return this.router;
    }
};
exports.ComponentRouter = ComponentRouter;
exports.ComponentRouter = ComponentRouter = __decorate([
    (0, tsyringe_1.injectable)(),
    __param(0, (0, tsyringe_1.inject)(component_controller_1.ComponentController)),
    __metadata("design:paramtypes", [component_controller_1.ComponentController])
], ComponentRouter);
