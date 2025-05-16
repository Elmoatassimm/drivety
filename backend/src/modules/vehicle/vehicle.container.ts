import { container } from "tsyringe";
import { VehicleRepositoryImpl } from "./vehicle.repository";
import { VehicleService } from "./vehicle.service";
import { VehicleController } from "./vehicle.controller";
import { VehicleRouter } from "./vehicle.routes";

export function registerVehicleDependencies() {
  // Register interfaces to implementations
  container.register("VehicleRepository", { useClass: VehicleRepositoryImpl });
  container.register("IVehicleService", { useClass: VehicleService });
  
  // Register concrete classes
  container.register(VehicleRepositoryImpl, { useClass: VehicleRepositoryImpl });
  container.register(VehicleService, { useClass: VehicleService });
  container.register(VehicleController, { useClass: VehicleController });
  container.register(VehicleRouter, { useClass: VehicleRouter });
}
