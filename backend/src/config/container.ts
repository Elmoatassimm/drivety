import "reflect-metadata"; // Required for tsyringe to work
import { container } from "tsyringe";

// Import core utilities
import ResponseUtils from "../core/utils/response.utils";
import JwtUtils from "../core/utils/jwt.utils";
import GlobalErrorHandler from "../core/middlewares/errors.middleware";
import Logger from "../utils/logger";

// Import database and redis
import PrismaService from "./db";
import { RedisClient } from "./redis";

// Import module containers
import '../modules/auth/auth.container';
import { registerUserDependencies } from "../modules/user/user.container";
import { registerDriverDependencies } from "../modules/driver/driver.container";
import { registerVehicleDependencies } from "../modules/vehicle/vehicle.container";
import { registerComponentDependencies } from "../modules/component/component.container";
import { registerTripDependencies } from "../modules/trip/trip.container";
import { registerTripMetricsDependencies } from "../core/tripMetrics/tripMetrics.container";



// Register core utilities
container.register("responseUtils", {
  useClass: ResponseUtils,
});

container.register("jwt", {
  useClass: JwtUtils,
});

container.register("errorsHandler", {
  useClass: GlobalErrorHandler
});

container.register(Logger, {
  useClass: Logger
});

// Register database and redis
container.register("db", {
  useClass: PrismaService
});

container.register("PrismaService", {
  useClass: PrismaService
});

container.register("RedisClient", {
  useClass: RedisClient,
});


// Register all module dependencies
registerUserDependencies();
registerDriverDependencies();
registerVehicleDependencies();
registerComponentDependencies();
registerTripDependencies();
registerTripMetricsDependencies();

export { container };
