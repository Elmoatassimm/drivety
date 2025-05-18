import { container } from "tsyringe";
import { TripRepository } from "./trip.repository";
import { TripService } from "./trip.service";
import { TripController } from "./trip.controller";
import { TripRouter } from "./trip.routes";
import ITripRepository from "./interfaces/ITripRepository";
import ITripService from "./interfaces/ITripService";

export function registerTripDependencies() {
  // Register interfaces to implementations
  container.register("ITripRepository", { useClass: TripRepository });
  container.register("ITripService", { useClass: TripService });
  
  // Register concrete classes
  container.register(TripRepository, { useClass: TripRepository });
  container.register(TripService, { useClass: TripService });
  container.register(TripController, { useClass: TripController });
  container.register(TripRouter, { useClass: TripRouter });
}
