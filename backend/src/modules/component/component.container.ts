import { container } from "tsyringe";
import { ComponentRepositoryImpl } from "./component.repository";
import { ComponentService } from "./component.service";
import { ComponentController } from "./component.controller";
import { ComponentRouter } from "./component.routes";

export function registerComponentDependencies() {
  // Register interfaces to implementations
  container.register("ComponentRepository", { useClass: ComponentRepositoryImpl });
  container.register("IComponentService", { useClass: ComponentService });
  
  // Register concrete classes
  container.register(ComponentRepositoryImpl, { useClass: ComponentRepositoryImpl });
  container.register(ComponentService, { useClass: ComponentService });
  container.register(ComponentController, { useClass: ComponentController });
  container.register(ComponentRouter, { useClass: ComponentRouter });
}
