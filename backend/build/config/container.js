"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.container = void 0;
require("reflect-metadata"); // Required for tsyringe to work
const tsyringe_1 = require("tsyringe");
Object.defineProperty(exports, "container", { enumerable: true, get: function () { return tsyringe_1.container; } });
// Import core utilities
const response_utils_1 = __importDefault(require("../core/utils/response.utils"));
const jwt_utils_1 = __importDefault(require("../core/utils/jwt.utils"));
const errors_middleware_1 = __importDefault(require("../core/middlewares/errors.middleware"));
const logger_1 = __importDefault(require("../utils/logger"));
// Import database and redis
const db_1 = __importDefault(require("./db"));
const redis_1 = require("./redis");
// Import module containers
require("../modules/auth/auth.container");
const user_container_1 = require("../modules/user/user.container");
const driver_container_1 = require("../modules/driver/driver.container");
const vehicle_container_1 = require("../modules/vehicle/vehicle.container");
const component_container_1 = require("../modules/component/component.container");
const trip_container_1 = require("../modules/trip/trip.container");
const tripMetrics_container_1 = require("../core/tripMetrics/tripMetrics.container");
// Register core utilities
tsyringe_1.container.register("responseUtils", {
    useClass: response_utils_1.default,
});
tsyringe_1.container.register("jwt", {
    useClass: jwt_utils_1.default,
});
tsyringe_1.container.register("errorsHandler", {
    useClass: errors_middleware_1.default
});
tsyringe_1.container.register(logger_1.default, {
    useClass: logger_1.default
});
// Register database and redis
tsyringe_1.container.register("db", {
    useClass: db_1.default
});
tsyringe_1.container.register("PrismaService", {
    useClass: db_1.default
});
tsyringe_1.container.register("RedisClient", {
    useClass: redis_1.RedisClient,
});
// Register all module dependencies
(0, user_container_1.registerUserDependencies)();
(0, driver_container_1.registerDriverDependencies)();
(0, vehicle_container_1.registerVehicleDependencies)();
(0, component_container_1.registerComponentDependencies)();
(0, trip_container_1.registerTripDependencies)();
(0, tripMetrics_container_1.registerTripMetricsDependencies)();
