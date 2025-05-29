"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.endTripSchema = exports.startTripSchema = void 0;
const zod_1 = require("zod");
exports.startTripSchema = zod_1.z.object({
    driverId: zod_1.z.string().uuid({ message: "Driver ID must be a valid UUID" }),
    vehicleId: zod_1.z.string().uuid({ message: "Vehicle ID must be a valid UUID" }),
    startLocation: zod_1.z.string().optional(),
    startLatitude: zod_1.z.coerce.number().min(-90).max(90, { message: "Start latitude must be between -90 and 90" }).optional(),
    startLongitude: zod_1.z.coerce.number().min(-180).max(180, { message: "Start longitude must be between -180 and 180" }).optional()
});
exports.endTripSchema = zod_1.z.object({
    endLocation: zod_1.z.string().optional(),
    endLatitude: zod_1.z.coerce.number().min(-90).max(90, { message: "End latitude must be between -90 and 90" }).optional(),
    endLongitude: zod_1.z.coerce.number().min(-180).max(180, { message: "End longitude must be between -180 and 180" }).optional(),
    distance: zod_1.z.coerce.number().min(0, { message: "Distance must be a positive number" }).optional(),
    fuelConsumed: zod_1.z.coerce.number().min(0, { message: "Fuel consumed must be a positive number" }).optional()
});
