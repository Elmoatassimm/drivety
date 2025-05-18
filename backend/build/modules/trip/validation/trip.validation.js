"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.endTripSchema = exports.startTripSchema = void 0;
const zod_1 = require("zod");
exports.startTripSchema = zod_1.z.object({
    driverId: zod_1.z.string().uuid({ message: "Driver ID must be a valid UUID" }),
    vehicleId: zod_1.z.string().uuid({ message: "Vehicle ID must be a valid UUID" }),
    startLocation: zod_1.z.string().min(1, { message: "Start location is required" })
});
exports.endTripSchema = zod_1.z.object({
    endLocation: zod_1.z.string().min(1, { message: "End location is required" })
});
