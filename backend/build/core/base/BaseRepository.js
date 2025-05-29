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
exports.BaseRepository = void 0;
const tsyringe_1 = require("tsyringe");
const db_1 = __importDefault(require("../../config/db"));
const handlePrismaErrors_1 = require("../utils/handlePrismaErrors");
let BaseRepository = class BaseRepository {
    constructor(prismaService) {
        this.prismaService = prismaService;
        this.prisma = prismaService.getClient();
    }
    findById(id) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                return yield this.prisma[this.modelName].findUnique({
                    where: { id }
                });
            }
            catch (error) {
                (0, handlePrismaErrors_1.handlePrismaError)(error, { resource: this.modelName, id });
                throw error;
            }
        });
    }
    findAll(options) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                return yield this.prisma[this.modelName].findMany(options);
            }
            catch (error) {
                (0, handlePrismaErrors_1.handlePrismaError)(error, { resource: this.modelName });
                throw error;
            }
        });
    }
    create(data) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                return yield this.prisma[this.modelName].create({ data });
            }
            catch (error) {
                (0, handlePrismaErrors_1.handlePrismaError)(error, { resource: this.modelName });
                throw error;
            }
        });
    }
    update(id, data) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                return yield this.prisma[this.modelName].update({
                    where: { id },
                    data
                });
            }
            catch (error) {
                (0, handlePrismaErrors_1.handlePrismaError)(error, { resource: this.modelName, id });
                throw error;
            }
        });
    }
    delete(id) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                return yield this.prisma[this.modelName].delete({
                    where: { id }
                });
            }
            catch (error) {
                (0, handlePrismaErrors_1.handlePrismaError)(error, { resource: this.modelName, id });
                throw error;
            }
        });
    }
    count(where) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                return yield this.prisma[this.modelName].count({ where });
            }
            catch (error) {
                (0, handlePrismaErrors_1.handlePrismaError)(error, { resource: this.modelName });
                throw error;
            }
        });
    }
};
exports.BaseRepository = BaseRepository;
exports.BaseRepository = BaseRepository = __decorate([
    __param(0, (0, tsyringe_1.inject)("db")),
    __metadata("design:paramtypes", [db_1.default])
], BaseRepository);
