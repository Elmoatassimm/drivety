"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.UserRepository = void 0;
const tsyringe_1 = require("tsyringe");
const BaseRepository_1 = require("../../core/base/BaseRepository");
const db_1 = __importDefault(require("../../config/db"));
let UserRepository = class UserRepository extends BaseRepository_1.BaseRepository {
    constructor(prismaService) {
        super(prismaService);
        this.modelName = "user";
        console.log(`[USER REPOSITORY] Initialized with model name: ${this.modelName}`);
    }
    findById(id) {
        return __awaiter(this, void 0, void 0, function* () {
            console.log(`[USER REPOSITORY] Finding user by ID: ${id}`);
            try {
                const user = yield this.prisma.user.findUnique({ where: { id } });
                console.log(`[USER REPOSITORY] User found by ID: ${!!user}`);
                return user;
            }
            catch (error) {
                console.error(`[USER REPOSITORY] Error finding user by ID:`, error);
                // If it's a Prisma error, log more details
                if (error && typeof error === 'object' && 'code' in error) {
                    console.error(`[USER REPOSITORY] Prisma error code: ${error.code}`);
                    console.error(`[USER REPOSITORY] Prisma error message: ${error.message}`);
                    console.error(`[USER REPOSITORY] Prisma error meta:`, error.meta);
                }
                throw error;
            }
        });
    }
    findByEmail(email) {
        return __awaiter(this, void 0, void 0, function* () {
            console.log(`[USER REPOSITORY] Finding user by email: ${email}`);
            try {
                const user = yield this.prisma.user.findUnique({ where: { email } });
                console.log(`[USER REPOSITORY] User found by email: ${!!user}`);
                return user;
            }
            catch (error) {
                console.error(`[USER REPOSITORY] Error finding user by email:`, error);
                // If it's a Prisma error, log more details
                if (error && typeof error === 'object' && 'code' in error) {
                    console.error(`[USER REPOSITORY] Prisma error code: ${error.code}`);
                    console.error(`[USER REPOSITORY] Prisma error message: ${error.message}`);
                    console.error(`[USER REPOSITORY] Prisma error meta:`, error.meta);
                }
                throw error;
            }
        });
    }
    createUser(data) {
        return __awaiter(this, void 0, void 0, function* () {
            console.log(`[USER REPOSITORY] Creating user with email: ${data.email}`);
            try {
                console.log(`[USER REPOSITORY] User data:`, {
                    email: data.email,
                    username: data.username,
                    password_hash_length: data.password_hash ? data.password_hash.length : 0
                });
                // Log the Prisma client connection status
                console.log(`[USER REPOSITORY] Prisma client available: ${!!this.prisma}`);
                // Log the database URL (without sensitive info)
                const dbUrl = process.env.DATABASE_URL || '';
                const sanitizedDbUrl = dbUrl.replace(/\/\/([^:]+):[^@]+@/, '//***:***@');
                console.log(`[USER REPOSITORY] Database URL: ${sanitizedDbUrl}`);
                console.log(`[USER REPOSITORY] Creating user in database...`);
                const user = yield this.prisma.user.create({
                    data: {
                        email: data.email,
                        password: data.password_hash,
                        role: "USER"
                    }
                });
                console.log(`[USER REPOSITORY] User created successfully with ID: ${user.id}`);
                // Add the username property to match the interface
                return Object.assign(Object.assign({}, user), { username: data.username });
            }
            catch (error) {
                console.error(`[USER REPOSITORY] Error creating user:`, error);
                // If it's a Prisma error, log more details
                if (error && typeof error === 'object' && 'code' in error) {
                    console.error(`[USER REPOSITORY] Prisma error code: ${error.code}`);
                    console.error(`[USER REPOSITORY] Prisma error message: ${error.message}`);
                    console.error(`[USER REPOSITORY] Prisma error meta:`, error.meta);
                }
                throw error;
            }
        });
    }
    updatePassword(id, password) {
        return __awaiter(this, void 0, void 0, function* () {
            console.log(`[USER REPOSITORY] Updating password for user ID: ${id}`);
            try {
                const user = yield this.prisma.user.update({
                    where: { id },
                    data: { password }
                });
                console.log(`[USER REPOSITORY] Password updated successfully for user ID: ${id}`);
                return user;
            }
            catch (error) {
                console.error(`[USER REPOSITORY] Error updating password:`, error);
                // If it's a Prisma error, log more details
                if (error && typeof error === 'object' && 'code' in error) {
                    console.error(`[USER REPOSITORY] Prisma error code: ${error.code}`);
                    console.error(`[USER REPOSITORY] Prisma error message: ${error.message}`);
                    console.error(`[USER REPOSITORY] Prisma error meta:`, error.meta);
                }
                throw error;
            }
        });
    }
    getProfile(id) {
        return __awaiter(this, void 0, void 0, function* () {
            console.log(`[USER REPOSITORY] Getting profile for user ID: ${id}`);
            try {
                const profile = yield this.prisma.user.findUnique({
                    where: { id },
                    select: { id: true, email: true, role: true }
                });
                console.log(`[USER REPOSITORY] Profile found: ${!!profile}`);
                return profile;
            }
            catch (error) {
                console.error(`[USER REPOSITORY] Error getting profile:`, error);
                // If it's a Prisma error, log more details
                if (error && typeof error === 'object' && 'code' in error) {
                    console.error(`[USER REPOSITORY] Prisma error code: ${error.code}`);
                    console.error(`[USER REPOSITORY] Prisma error message: ${error.message}`);
                    console.error(`[USER REPOSITORY] Prisma error meta:`, error.meta);
                }
                throw error;
            }
        });
    }
};
exports.UserRepository = UserRepository;
exports.UserRepository = UserRepository = __decorate([
    (0, tsyringe_1.injectable)(),
    __param(0, (0, tsyringe_1.inject)("db")),
    __metadata("design:paramtypes", [db_1.default])
], UserRepository);
