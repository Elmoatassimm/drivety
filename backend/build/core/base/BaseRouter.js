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
exports.BaseRouter = void 0;
const BaseController_1 = require("./BaseController");
const RouteFactory_1 = require("./RouteFactory");
const zod_1 = require("zod");
const tsyringe_1 = require("tsyringe");
const logger_1 = __importDefault(require("../../utils/logger"));
/**
 * Base router class that combines a controller and route factory
 * to create a complete API router for a resource.
 */
let BaseRouter = class BaseRouter {
    /**
     * Create a new base router
     * @param controller The controller to use for this router
     * @param basePath The base path for this router (e.g., "users")
     * @param createSchema Optional schema for validating create requests
     * @param updateSchema Optional schema for validating update requests
     * @param requireAuth Whether to require authentication for all routes
     */
    constructor(controller, basePath, createSchema, updateSchema, requireAuth = true) {
        this.basePath = basePath;
        this.logger = new logger_1.default(`${basePath}Router`);
        // Create route factory
        this.routeFactory = new RouteFactory_1.RouteFactory(controller, createSchema, updateSchema, requireAuth);
        this.router = this.routeFactory.getRouter();
        this.logger.info(`Initialized router for ${basePath}`);
    }
    /**
     * Get the Express router
     * @returns The Express router
     */
    getRouter() {
        return this.router;
    }
    /**
     * Get the base path for this router
     * @returns The base path
     */
    getBasePath() {
        return this.basePath;
    }
    /**
     * Add a custom route to the router
     * @param method HTTP method
     * @param path Route path
     * @param handlers Request handlers
     */
    addCustomRoute(method, path, handlers) {
        this.routeFactory.addCustomRoute(method, path, handlers);
        this.logger.info(`Added custom ${method.toUpperCase()} route: ${path}`);
    }
};
exports.BaseRouter = BaseRouter;
exports.BaseRouter = BaseRouter = __decorate([
    (0, tsyringe_1.injectable)(),
    __metadata("design:paramtypes", [BaseController_1.BaseController, String, zod_1.ZodSchema,
        zod_1.ZodSchema, Boolean])
], BaseRouter);
exports.default = BaseRouter;
