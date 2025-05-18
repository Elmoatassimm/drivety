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
exports.BaseController = void 0;
const tsyringe_1 = require("tsyringe");
const BaseService_1 = require("./BaseService");
const response_utils_1 = __importDefault(require("../utils/response.utils"));
let BaseController = class BaseController {
    constructor(service, responseUtils) {
        this.service = service;
        this.responseUtils = responseUtils;
    }
    getById(req, res, next) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const { id } = req.params;
                const entity = yield this.service.findById(id);
                if (!entity) {
                    this.responseUtils.sendNotFoundResponse(res, `Entity with id ${id} not found`);
                    return;
                }
                this.responseUtils.sendSuccessResponse(res, entity);
            }
            catch (error) {
                next(error);
            }
        });
    }
    getAll(req, res, next) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const { page = 1, limit = 10, sortBy = 'createdAt', order = 'desc' } = req.query;
                const skip = (page - 1) * limit;
                const [entities, totalCount] = yield Promise.all([
                    this.service.findAll({
                        skip,
                        take: limit,
                        orderBy: { [sortBy]: order }
                    }),
                    this.service.count()
                ]);
                const totalPages = Math.ceil(totalCount / limit);
                this.responseUtils.sendSuccessResponse(res, {
                    data: entities,
                    pagination: {
                        totalCount,
                        totalPages,
                        currentPage: page,
                        perPage: limit
                    }
                });
            }
            catch (error) {
                next(error);
            }
        });
    }
    create(req, res, next) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const entity = yield this.service.create(req.body);
                this.responseUtils.sendSuccessResponse(res, entity, 201);
            }
            catch (error) {
                next(error);
            }
        });
    }
    update(req, res, next) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const { id } = req.params;
                const entity = yield this.service.update(id, req.body);
                this.responseUtils.sendSuccessResponse(res, entity);
            }
            catch (error) {
                next(error);
            }
        });
    }
    delete(req, res, next) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const { id } = req.params;
                yield this.service.delete(id);
                this.responseUtils.sendSuccessNoDataResponse(res, "Entity deleted successfully");
            }
            catch (error) {
                next(error);
            }
        });
    }
};
exports.BaseController = BaseController;
exports.BaseController = BaseController = __decorate([
    __param(1, (0, tsyringe_1.inject)("responseUtils")),
    __metadata("design:paramtypes", [BaseService_1.BaseService,
        response_utils_1.default])
], BaseController);
