"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.registerComponentDependencies = registerComponentDependencies;
const tsyringe_1 = require("tsyringe");
const component_repository_1 = require("./component.repository");
const component_service_1 = require("./component.service");
const component_controller_1 = require("./component.controller");
const component_routes_1 = require("./component.routes");
function registerComponentDependencies() {
    // Register interfaces to implementations
    tsyringe_1.container.register("ComponentRepository", { useClass: component_repository_1.ComponentRepositoryImpl });
    tsyringe_1.container.register("IComponentService", { useClass: component_service_1.ComponentService });
    // Register concrete classes
    tsyringe_1.container.register(component_repository_1.ComponentRepositoryImpl, { useClass: component_repository_1.ComponentRepositoryImpl });
    tsyringe_1.container.register(component_service_1.ComponentService, { useClass: component_service_1.ComponentService });
    tsyringe_1.container.register(component_controller_1.ComponentController, { useClass: component_controller_1.ComponentController });
    tsyringe_1.container.register(component_routes_1.ComponentRouter, { useClass: component_routes_1.ComponentRouter });
}
