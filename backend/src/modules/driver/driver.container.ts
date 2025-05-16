import { container } from "tsyringe";
import { DriverController } from "./driver.controller";
import { DriverRepository } from "./driver.repository";
import { DriverService } from "./driver.service";
import { DriverRouter } from "./driver.routes";

export function registerDriverDependencies() {
  // Register interfaces to implementations
  container.register("IDriverRepository", { useClass: DriverRepository });
  container.register("IDriverService", { useClass: DriverService });
  
  // Register concrete classes
  container.register(DriverRepository, { useClass: DriverRepository });
  container.register(DriverService, { useClass: DriverService });
  container.register(DriverController, { useClass: DriverController });
  container.register(DriverRouter, { useClass: DriverRouter });
}
