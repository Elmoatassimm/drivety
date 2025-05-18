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
exports.ComponentController = void 0;
const tsyringe_1 = require("tsyringe");
const BaseController_1 = require("../../core/base/BaseController");
const component_service_1 = require("./component.service");
const response_utils_1 = __importDefault(require("../../core/utils/response.utils"));
const AppError_1 = require("../../core/errors/AppError");
let ComponentController = class ComponentController extends BaseController_1.BaseController {
    constructor(componentService, componentServiceImpl, responseUtils) {
        super(componentServiceImpl, responseUtils);
        this.componentService = componentService;
        this.componentServiceImpl = componentServiceImpl;
        /**
         * Get all components
         */
        this.getAllComponents = (req, res, next) => __awaiter(this, void 0, void 0, function* () {
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
                const components = yield this.componentService.findAll(options);
                this.responseUtils.sendSuccessResponse(res, components);
            }
            catch (error) {
                next(error);
            }
        });
        /**
         * Get a component by ID
         */
        this.getComponentById = (req, res, next) => __awaiter(this, void 0, void 0, function* () {
            try {
                const { id } = req.params;
                const component = yield this.componentService.findById(id);
                this.responseUtils.sendSuccessResponse(res, component);
            }
            catch (error) {
                next(error);
            }
        });
        /**
         * Create a new component
         */
        this.createComponent = (req, res, next) => __awaiter(this, void 0, void 0, function* () {
            try {
                const componentData = req.body;
                const component = yield this.componentService.create(componentData);
                this.responseUtils.sendSuccessResponse(res, component, 201);
            }
            catch (error) {
                next(error);
            }
        });
        /**
         * Update a component
         */
        this.updateComponent = (req, res, next) => __awaiter(this, void 0, void 0, function* () {
            try {
                const { id } = req.params;
                const componentData = req.body;
                const component = yield this.componentService.update(id, componentData);
                this.responseUtils.sendSuccessResponse(res, component);
            }
            catch (error) {
                next(error);
            }
        });
        /**
         * Delete a component
         */
        this.deleteComponent = (req, res, next) => __awaiter(this, void 0, void 0, function* () {
            try {
                const { id } = req.params;
                const component = yield this.componentService.delete(id);
                this.responseUtils.sendSuccessResponse(res, component);
            }
            catch (error) {
                next(error);
            }
        });
        /**
         * Get component health score
         */
        this.getComponentHealthScore = (req, res, next) => __awaiter(this, void 0, void 0, function* () {
            try {
                const { id } = req.params;
                const healthScore = yield this.componentService.getHealthScore(id);
                this.responseUtils.sendSuccessResponse(res, { id, healthScore });
            }
            catch (error) {
                next(error);
            }
        });
        /**
         * Get component maintenance records
         */
        this.getComponentMaintenanceRecords = (req, res, next) => __awaiter(this, void 0, void 0, function* () {
            try {
                const { id } = req.params;
                const maintenanceRecords = yield this.componentService.getMaintenanceRecords(id);
                this.responseUtils.sendSuccessResponse(res, maintenanceRecords);
            }
            catch (error) {
                next(error);
            }
        });
        /**
         * Trigger an alert for a component
         */
        this.triggerComponentAlert = (req, res, next) => __awaiter(this, void 0, void 0, function* () {
            try {
                const { id } = req.params;
                const { message } = req.body;
                if (!message) {
                    throw new AppError_1.BadRequestError("Alert message is required");
                }
                const alert = yield this.componentService.triggerAlert(id, message);
                this.responseUtils.sendSuccessResponse(res, alert);
            }
            catch (error) {
                next(error);
            }
        });
    }
};
exports.ComponentController = ComponentController;
exports.ComponentController = ComponentController = __decorate([
    (0, tsyringe_1.injectable)(),
    __param(0, (0, tsyringe_1.inject)("IComponentService")),
    __param(1, (0, tsyringe_1.inject)(component_service_1.ComponentService)),
    __param(2, (0, tsyringe_1.inject)("responseUtils")),
    __metadata("design:paramtypes", [Object, component_service_1.ComponentService,
        response_utils_1.default])
], ComponentController);
