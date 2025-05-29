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
exports.UserRouter = void 0;
const express_1 = require("express");
const tsyringe_1 = require("tsyringe");
const RouteFactory_1 = require("../../core/base/RouteFactory");
const user_controller_1 = require("./user.controller");
const auth_middleware_1 = __importDefault(require("../../core/middlewares/auth.middleware"));
let UserRouter = class UserRouter {
    constructor(userController) {
        this.userController = userController;
        this.router = (0, express_1.Router)();
        this.routeFactory = new RouteFactory_1.RouteFactory(this.userController);
        this.setupRoutes();
    }
    setupRoutes() {
        // Protected routes
        this.router.get("/profile/:id", auth_middleware_1.default, (req, res, next) => this.userController.getProfile(req, res, next));
        this.router.get("/profile", auth_middleware_1.default, (req, res, next) => this.userController.getProfile(req, res, next));
        // Other routes...
    }
    getRouter() {
        return this.router;
    }
};
exports.UserRouter = UserRouter;
exports.UserRouter = UserRouter = __decorate([
    (0, tsyringe_1.injectable)(),
    __metadata("design:paramtypes", [user_controller_1.UserController])
], UserRouter);
