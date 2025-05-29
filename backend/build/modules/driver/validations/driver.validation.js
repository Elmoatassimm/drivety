"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.updateDriverScoreSchema = exports.updateDriverSchema = exports.createDriverSchema = void 0;
const zod_1 = require("zod");
exports.createDriverSchema = zod_1.z.object({
    userId: zod_1.z.string().uuid('Invalid user ID format'),
    name: zod_1.z.string().min(2, 'Name must be at least 2 characters'),
    licenseNumber: zod_1.z.string().min(5, 'License number must be at least 5 characters'),
    licenseExpiry: zod_1.z.string().refine((val) => !isNaN(Date.parse(val)), {
        message: 'License expiry must be a valid date'
    }),
    phoneNumber: zod_1.z.string().min(10, 'Phone number must be at least 10 characters')
});
exports.updateDriverSchema = zod_1.z.object({
    name: zod_1.z.string().min(2, 'Name must be at least 2 characters').optional(),
    licenseNumber: zod_1.z.string().min(5, 'License number must be at least 5 characters').optional(),
    licenseExpiry: zod_1.z.string().refine((val) => !isNaN(Date.parse(val)), {
        message: 'License expiry must be a valid date'
    }).optional(),
    phoneNumber: zod_1.z.string().min(10, 'Phone number must be at least 10 characters').optional(),
    driverScore: zod_1.z.number().min(0).max(100).optional()
});
exports.updateDriverScoreSchema = zod_1.z.object({
    score: zod_1.z.number().min(0, 'Score must be at least 0').max(100, 'Score must be at most 100')
});
