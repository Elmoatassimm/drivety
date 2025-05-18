"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.registerUserDependencies = registerUserDependencies;
const tsyringe_1 = require("tsyringe");
const user_controller_1 = require("./user.controller");
const user_repository_1 = require("./user.repository");
const user_service_1 = require("./user.service");
const user_routes_1 = require("./user.routes");
function registerUserDependencies() {
    // Register interfaces to implementations
    tsyringe_1.container.register("IUserRepository", { useClass: user_repository_1.UserRepository });
    // Register concrete classes
    tsyringe_1.container.register(user_repository_1.UserRepository, { useClass: user_repository_1.UserRepository });
    tsyringe_1.container.register(user_service_1.UserService, { useClass: user_service_1.UserService });
    tsyringe_1.container.register(user_controller_1.UserController, { useClass: user_controller_1.UserController });
    tsyringe_1.container.register(user_routes_1.UserRouter, { useClass: user_routes_1.UserRouter });
    // Register for string-based injection
    tsyringe_1.container.register("UserService", { useClass: user_service_1.UserService });
    tsyringe_1.container.register("UserController", { useClass: user_controller_1.UserController });
}
