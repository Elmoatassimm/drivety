"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.passwordUpdateSchema = exports.userUpdateSchema = exports.userLoginSchema = exports.userRegistrationSchema = void 0;
const zod_1 = require("zod");
exports.userRegistrationSchema = zod_1.z.object({
    email: zod_1.z.string().email('Invalid email format'),
    password: zod_1.z.string().min(6, 'Password must be at least 6 characters'),
    username: zod_1.z.string().min(3, 'Username must be at least 3 characters')
});
exports.userLoginSchema = zod_1.z.object({
    email: zod_1.z.string().email('Invalid email format'),
    password: zod_1.z.string().min(1, 'Password is required')
});
exports.userUpdateSchema = zod_1.z.object({
    email: zod_1.z.string().email('Invalid email format').optional(),
    username: zod_1.z.string().min(3, 'Username must be at least 3 characters').optional()
});
exports.passwordUpdateSchema = zod_1.z.object({
    currentPassword: zod_1.z.string().min(1, 'Current password is required'),
    newPassword: zod_1.z.string().min(6, 'New password must be at least 6 characters')
});
