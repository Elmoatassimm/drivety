"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.RouteFactory = void 0;
const express_1 = require("express");
const RequestValidation_middleware_1 = require("../middlewares/RequestValidation.middleware");
const auth_middleware_1 = __importDefault(require("../middlewares/auth.middleware"));
class RouteFactory {
    constructor(controller, createSchema, updateSchema, requireAuth = true) {
        this.controller = controller;
        this.createSchema = createSchema;
        this.updateSchema = updateSchema;
        this.requireAuth = requireAuth;
        this.router = (0, express_1.Router)();
        this.setupRoutes();
    }
    setupRoutes() {
        // Apply auth middleware conditionally
        if (this.requireAuth) {
            this.router.use(auth_middleware_1.default);
        }
        // GET all entities
        this.router.get("/", this.handleRequest(this.controller.getAll.bind(this.controller)));
        // GET entity by ID
        this.router.get("/:id", this.handleRequest(this.controller.getById.bind(this.controller)));
        // POST create entity
        this.router.post("/", this.createSchema ? (0, RequestValidation_middleware_1.validateRequest)(this.createSchema) : [], this.handleRequest(this.controller.create.bind(this.controller)));
        // PUT update entity
        this.router.put("/:id", this.updateSchema ? (0, RequestValidation_middleware_1.validateRequest)(this.updateSchema) : [], this.handleRequest(this.controller.update.bind(this.controller)));
        // DELETE entity
        this.router.delete("/:id", this.handleRequest(this.controller.delete.bind(this.controller)));
    }
    // Helper to maintain consistent request handling
    handleRequest(handler) {
        return (req, res, next) => handler(req, res, next);
    }
    // Add custom route
    addCustomRoute(method, path, handlers) {
        this.router[method](path, ...handlers);
    }
    getRouter() {
        return this.router;
    }
}
exports.RouteFactory = RouteFactory;
