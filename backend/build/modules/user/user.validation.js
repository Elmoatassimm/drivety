"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.passwordUpdateSchema = exports.userUpdateSchema = exports.userLoginSchema = exports.userRegistrationSchema = void 0;
const zod_1 = require("zod");
const user_types_1 = require("../../types/user.types");
exports.userRegistrationSchema = zod_1.z.object({
    email: zod_1.z.string().email('Invalid email format'),
    password: zod_1.z.string()
        .min(8, 'Password must be at least 8 characters')
        .regex(/[A-Z]/, 'Password must contain at least one uppercase letter')
        .regex(/[a-z]/, 'Password must contain at least one lowercase letter')
        .regex(/[0-9]/, 'Password must contain at least one number')
        .regex(/[^A-Za-z0-9]/, 'Password must contain at least one special character'),
    username: zod_1.z.string()
        .min(3, 'Username must be at least 3 characters')
        .max(30, 'Username cannot be longer than 30 characters'),
    role: zod_1.z.nativeEnum(user_types_1.UserRole).default(user_types_1.UserRole.DRIVER).optional()
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
