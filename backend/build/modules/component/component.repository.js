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
exports.ComponentRepositoryImpl = void 0;
const tsyringe_1 = require("tsyringe");
const BaseRepository_1 = require("../../core/base/BaseRepository");
const db_1 = __importDefault(require("../../config/db"));
const AppError_1 = require("../../core/errors/AppError");
let ComponentRepositoryImpl = class ComponentRepositoryImpl extends BaseRepository_1.BaseRepository {
    constructor(prismaService) {
        super(prismaService);
        this.modelName = "component";
    }
    getHealthScore(componentId) {
        return __awaiter(this, void 0, void 0, function* () {
            // First check if the component exists
            const component = yield this.findById(componentId);
            if (!component) {
                throw new AppError_1.NotFoundError("Component", componentId);
            }
            // Return the health score
            return component.healthScore;
        });
    }
    getMaintenanceRecords(componentId) {
        return __awaiter(this, void 0, void 0, function* () {
            // First check if the component exists
            const component = yield this.findById(componentId);
            if (!component) {
                throw new AppError_1.NotFoundError("Component", componentId);
            }
            // Return the maintenance records for this component
            return this.prisma.maintenance.findMany({
                where: { componentId },
                orderBy: { createdAt: 'desc' }
            });
        });
    }
    triggerAlert(componentId, message) {
        return __awaiter(this, void 0, void 0, function* () {
            // First check if the component exists
            const component = yield this.findById(componentId);
            if (!component) {
                throw new AppError_1.NotFoundError("Component", componentId);
            }
            // Create a new alert for this component
            return this.prisma.alert.create({
                data: {
                    type: "COMPONENT_ISSUE",
                    vehicleId: component.vehicleId,
                    componentId,
                    message,
                    actionRequired: true
                }
            });
        });
    }
};
exports.ComponentRepositoryImpl = ComponentRepositoryImpl;
exports.ComponentRepositoryImpl = ComponentRepositoryImpl = __decorate([
    (0, tsyringe_1.injectable)(),
    __param(0, (0, tsyringe_1.inject)("db")),
    __metadata("design:paramtypes", [db_1.default])
], ComponentRepositoryImpl);
