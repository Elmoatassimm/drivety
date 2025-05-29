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
var __rest = (this && this.__rest) || function (s, e) {
    var t = {};
    for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p) && e.indexOf(p) < 0)
        t[p] = s[p];
    if (s != null && typeof Object.getOwnPropertySymbols === "function")
        for (var i = 0, p = Object.getOwnPropertySymbols(s); i < p.length; i++) {
            if (e.indexOf(p[i]) < 0 && Object.prototype.propertyIsEnumerable.call(s, p[i]))
                t[p[i]] = s[p[i]];
        }
    return t;
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.VehicleController = void 0;
const tsyringe_1 = require("tsyringe");
const BaseController_1 = require("../../core/base/BaseController");
const vehicle_service_1 = require("./vehicle.service");
const response_utils_1 = __importDefault(require("../../core/utils/response.utils"));
const AppError_1 = require("../../core/errors/AppError");
let VehicleController = class VehicleController extends BaseController_1.BaseController {
    constructor(vehicleService, vehicleServiceImpl, responseUtils) {
        super(vehicleServiceImpl, responseUtils);
        this.vehicleService = vehicleService;
        this.vehicleServiceImpl = vehicleServiceImpl;
        /**
         * Get all vehicles
         */
        this.getAllVehicles = (req, res, next) => __awaiter(this, void 0, void 0, function* () {
            try {
                const _a = req.query, { skip, take, orderBy } = _a, filters = __rest(_a, ["skip", "take", "orderBy"]);
                const options = {};
                if (skip)
                    options.skip = Number(skip);
                if (take)
                    options.take = Number(take);
                if (orderBy) {
                    const [field, direction] = String(orderBy).split(':');
                    options.orderBy = { [field]: direction || 'asc' };
                }
                if (Object.keys(filters).length > 0) {
                    options.where = filters;
                }
                const vehicles = yield this.vehicleService.findAll(options);
                this.responseUtils.sendSuccessResponse(res, vehicles);
            }
            catch (error) {
                next(error);
            }
        });
        /**
         * Get a vehicle by ID
         */
        this.getVehicleById = (req, res, next) => __awaiter(this, void 0, void 0, function* () {
            try {
                const { id } = req.params;
                const vehicle = yield this.vehicleService.findById(id);
                this.responseUtils.sendSuccessResponse(res, vehicle);
            }
            catch (error) {
                next(error);
            }
        });
        /**
         * Create a new vehicle
         */
        this.createVehicle = (req, res, next) => __awaiter(this, void 0, void 0, function* () {
            try {
                const vehicleData = req.body;
                const vehicle = yield this.vehicleService.create(vehicleData);
                this.responseUtils.sendSuccessResponse(res, vehicle, 201);
            }
            catch (error) {
                next(error);
            }
        });
        /**
         * Update a vehicle
         */
        this.updateVehicle = (req, res, next) => __awaiter(this, void 0, void 0, function* () {
            try {
                const { id } = req.params;
                const vehicleData = req.body;
                const vehicle = yield this.vehicleService.update(id, vehicleData);
                this.responseUtils.sendSuccessResponse(res, vehicle);
            }
            catch (error) {
                next(error);
            }
        });
        /**
         * Delete a vehicle
         */
        this.deleteVehicle = (req, res, next) => __awaiter(this, void 0, void 0, function* () {
            try {
                const { id } = req.params;
                const vehicle = yield this.vehicleService.delete(id);
                this.responseUtils.sendSuccessResponse(res, vehicle);
            }
            catch (error) {
                next(error);
            }
        });
        /**
         * Get vehicle components
         */
        this.getVehicleComponents = (req, res, next) => __awaiter(this, void 0, void 0, function* () {
            try {
                const { id } = req.params;
                const components = yield this.vehicleService.getComponents(id);
                this.responseUtils.sendSuccessResponse(res, components);
            }
            catch (error) {
                next(error);
            }
        });
        /**
         * Update vehicle health status
         */
        this.updateVehicleHealthStatus = (req, res, next) => __awaiter(this, void 0, void 0, function* () {
            try {
                const { id } = req.params;
                const { healthStatus } = req.body;
                if (!healthStatus) {
                    throw new AppError_1.BadRequestError("Health status is required");
                }
                const updatedVehicle = yield this.vehicleService.updateHealthStatus(id, healthStatus);
                this.responseUtils.sendSuccessResponse(res, updatedVehicle);
            }
            catch (error) {
                next(error);
            }
        });
        /**
         * Get vehicle maintenance history
         */
        this.getVehicleMaintenanceHistory = (req, res, next) => __awaiter(this, void 0, void 0, function* () {
            try {
                const { id } = req.params;
                const maintenanceHistory = yield this.vehicleService.getMaintenanceHistory(id);
                this.responseUtils.sendSuccessResponse(res, maintenanceHistory);
            }
            catch (error) {
                next(error);
            }
        });
    }
};
exports.VehicleController = VehicleController;
exports.VehicleController = VehicleController = __decorate([
    (0, tsyringe_1.injectable)(),
    __param(0, (0, tsyringe_1.inject)("IVehicleService")),
    __param(1, (0, tsyringe_1.inject)(vehicle_service_1.VehicleService)),
    __param(2, (0, tsyringe_1.inject)("responseUtils")),
    __metadata("design:paramtypes", [Object, vehicle_service_1.VehicleService,
        response_utils_1.default])
], VehicleController);
