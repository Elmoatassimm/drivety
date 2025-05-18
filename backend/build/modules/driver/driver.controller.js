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
exports.DriverController = void 0;
const tsyringe_1 = require("tsyringe");
const BaseController_1 = require("../../core/base/BaseController");
const driver_service_1 = require("./driver.service");
const response_utils_1 = __importDefault(require("../../core/utils/response.utils"));
const AppError_1 = require("../../core/errors/AppError");
let DriverController = class DriverController extends BaseController_1.BaseController {
    constructor(driverService, responseUtils) {
        super(driverService, responseUtils);
        this.driverService = driverService;
    }
    createDriver(req, res, next) {
        return __awaiter(this, void 0, void 0, function* () {
            console.log(`[DRIVER CONTROLLER] Create driver request received:`, req.body);
            try {
                const { userId, name, licenseNumber, licenseExpiry, phoneNumber } = req.body;
                console.log(`[DRIVER CONTROLLER] Creating driver for user ID: ${userId}, name: ${name}`);
                const driver = yield this.driverService.create({
                    userId,
                    name,
                    licenseNumber,
                    licenseExpiry: new Date(licenseExpiry),
                    phoneNumber
                });
                console.log(`[DRIVER CONTROLLER] Driver created successfully with ID: ${driver.id}`);
                this.responseUtils.sendSuccessResponse(res, driver, 201);
            }
            catch (error) {
                console.error(`[DRIVER CONTROLLER] Error creating driver:`, error);
                next(error);
            }
        });
    }
    getDriverByUserId(req, res, next) {
        return __awaiter(this, void 0, void 0, function* () {
            var _a;
            console.log(`[DRIVER CONTROLLER] Get driver by user ID request received`);
            try {
                const userId = req.params.userId || ((_a = req.user) === null || _a === void 0 ? void 0 : _a.id);
                console.log(`[DRIVER CONTROLLER] Looking up driver for user ID: ${userId}`);
                if (!userId) {
                    console.log(`[DRIVER CONTROLLER] User ID is missing`);
                    throw new AppError_1.NotFoundError("User ID is required");
                }
                const driver = yield this.driverService.findByUserId(userId);
                console.log(`[DRIVER CONTROLLER] Driver found: ${!!driver}`);
                if (!driver) {
                    console.log(`[DRIVER CONTROLLER] No driver found for user ID: ${userId}`);
                    throw new AppError_1.NotFoundError("Driver");
                }
                console.log(`[DRIVER CONTROLLER] Returning driver with ID: ${driver.id}`);
                this.responseUtils.sendSuccessResponse(res, driver);
            }
            catch (error) {
                console.error(`[DRIVER CONTROLLER] Error getting driver by user ID:`, error);
                next(error);
            }
        });
    }
    updateDriverScore(req, res, next) {
        return __awaiter(this, void 0, void 0, function* () {
            console.log(`[DRIVER CONTROLLER] Update driver score request received:`, req.body);
            try {
                const { id } = req.params;
                const { score } = req.body;
                console.log(`[DRIVER CONTROLLER] Updating score for driver ID: ${id}, new score: ${score}`);
                const driver = yield this.driverService.updateDriverScore(id, score);
                console.log(`[DRIVER CONTROLLER] Driver score updated successfully for driver ID: ${driver.id}`);
                this.responseUtils.sendSuccessResponse(res, driver);
            }
            catch (error) {
                console.error(`[DRIVER CONTROLLER] Error updating driver score:`, error);
                next(error);
            }
        });
    }
    getCurrentUserDriver(req, res, next) {
        return __awaiter(this, void 0, void 0, function* () {
            var _a;
            console.log(`[DRIVER CONTROLLER] Get current user driver request received`);
            try {
                if (!((_a = req.user) === null || _a === void 0 ? void 0 : _a.id)) {
                    console.log(`[DRIVER CONTROLLER] User not authenticated or user ID missing`);
                    throw new AppError_1.NotFoundError("User not authenticated");
                }
                console.log(`[DRIVER CONTROLLER] Looking up driver for current user ID: ${req.user.id}`);
                const driver = yield this.driverService.findByUserId(req.user.id);
                console.log(`[DRIVER CONTROLLER] Driver found for current user: ${!!driver}`);
                if (!driver) {
                    console.log(`[DRIVER CONTROLLER] No driver found for current user ID: ${req.user.id}`);
                    throw new AppError_1.NotFoundError("Driver not found for current user");
                }
                console.log(`[DRIVER CONTROLLER] Returning driver with ID: ${driver.id} for current user`);
                this.responseUtils.sendSuccessResponse(res, driver);
            }
            catch (error) {
                console.error(`[DRIVER CONTROLLER] Error getting current user driver:`, error);
                next(error);
            }
        });
    }
};
exports.DriverController = DriverController;
exports.DriverController = DriverController = __decorate([
    (0, tsyringe_1.injectable)(),
    __param(0, (0, tsyringe_1.inject)("IDriverService")),
    __param(1, (0, tsyringe_1.inject)("responseUtils")),
    __metadata("design:paramtypes", [driver_service_1.DriverService,
        response_utils_1.default])
], DriverController);
