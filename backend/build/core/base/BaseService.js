"use strict";
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
exports.BaseService = void 0;
const errors_1 = require("../../types/errors");
const logger_1 = __importDefault(require("../../utils/logger"));
class BaseService {
    constructor(repository) {
        this.repository = repository;
        this.logger = new logger_1.default(this.constructor.name);
    }
    /**
     * Find an entity by its ID
     * @param id The ID of the entity to find
     * @throws {BadRequestError} If the ID is invalid
     * @throws {NotFoundError} If the entity is not found
     */
    findById(id) {
        return __awaiter(this, void 0, void 0, function* () {
            this.validateId(id);
            const entity = yield this.repository.findById(id);
            if (!entity) {
                throw new errors_1.NotFoundError(this.entityName, id);
            }
            return entity;
        });
    }
    /**
     * Find all entities with optional filtering and pagination
     * @param options Query options including skip, take, orderBy, and where
     */
    findAll(options) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                return yield this.repository.findAll(options);
            }
            catch (error) {
                this.logger.error(`Error retrieving ${this.entityName} list`, { error, options });
                throw this.handleError(error, `Failed to retrieve ${this.entityName} list`);
            }
        });
    }
    /**
     * Create a new entity
     * @param data The data to create the entity with
     * @throws {BadRequestError} If the data is invalid
     */
    create(data) {
        return __awaiter(this, void 0, void 0, function* () {
            if (!data || Object.keys(data).length === 0) {
                throw new errors_1.BadRequestError(`Data is required to create ${this.entityName}`);
            }
            try {
                // Validate data before passing to repository
                yield this.validateCreate(data);
                return yield this.repository.create(data);
            }
            catch (error) {
                this.logger.error(`Error creating ${this.entityName}`, { error, data });
                throw this.handleError(error, `Failed to create ${this.entityName}`);
            }
        });
    }
    /**
     * Update an existing entity
     * @param id The ID of the entity to update
     * @param data The data to update the entity with
     * @throws {BadRequestError} If the ID or data is invalid
     * @throws {NotFoundError} If the entity is not found
     */
    update(id, data) {
        return __awaiter(this, void 0, void 0, function* () {
            this.validateId(id);
            if (!data || Object.keys(data).length === 0) {
                throw new errors_1.BadRequestError(`Data is required to update ${this.entityName}`);
            }
            try {
                // Validate entity exists
                const entity = yield this.findById(id);
                // Validate update data
                yield this.validateUpdate(id, data, entity);
                return yield this.repository.update(id, data);
            }
            catch (error) {
                if (error instanceof errors_1.NotFoundError || error instanceof errors_1.BadRequestError) {
                    throw error;
                }
                this.logger.error(`Error updating ${this.entityName}`, { error, id, data });
                throw this.handleError(error, `Failed to update ${this.entityName}`);
            }
        });
    }
    /**
     * Delete an entity by its ID
     * @param id The ID of the entity to delete
     * @throws {BadRequestError} If the ID is invalid
     * @throws {NotFoundError} If the entity is not found
     */
    delete(id) {
        return __awaiter(this, void 0, void 0, function* () {
            this.validateId(id);
            try {
                // Verify entity exists before deletion
                yield this.findById(id);
                // Check if entity can be deleted (hook for subclasses)
                yield this.beforeDelete(id);
                return yield this.repository.delete(id);
            }
            catch (error) {
                if (error instanceof errors_1.NotFoundError || error instanceof errors_1.BadRequestError) {
                    throw error;
                }
                this.logger.error(`Error deleting ${this.entityName}`, { error, id });
                throw this.handleError(error, `Failed to delete ${this.entityName}`);
            }
        });
    }
    /**
     * Count entities with optional filtering
     * @param where Optional filter conditions
     */
    count(where) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                return yield this.repository.count(where);
            }
            catch (error) {
                this.logger.error(`Error counting ${this.entityName}`, { error, where });
                throw this.handleError(error, `Failed to count ${this.entityName}`);
            }
        });
    }
    /**
     * Find one entity matching the given criteria
     * @param where Filter conditions
     * @throws {NotFoundError} If no entity is found
     */
    findOne(where) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const results = yield this.repository.findAll({ where, take: 1 });
                if (!results || results.length === 0) {
                    throw new errors_1.NotFoundError(this.entityName, JSON.stringify(where));
                }
                return results[0];
            }
            catch (error) {
                if (error instanceof errors_1.NotFoundError) {
                    throw error;
                }
                this.logger.error(`Error finding ${this.entityName}`, { error, where });
                throw this.handleError(error, `Failed to find ${this.entityName}`);
            }
        });
    }
    // Protected helper methods for subclasses
    /**
     * Validate entity ID
     * @param id The ID to validate
     * @throws {BadRequestError} If ID is invalid
     */
    validateId(id) {
        if (!id) {
            throw new errors_1.BadRequestError(`${this.entityName} ID is required`);
        }
    }
    /**
     * Handle errors consistently
     * @param error The caught error
     * @param defaultMessage Default error message
     */
    handleError(error, defaultMessage) {
        // Rethrow domain errors
        if (error instanceof errors_1.NotFoundError ||
            error instanceof errors_1.BadRequestError ||
            error instanceof errors_1.ConflictError ||
            error instanceof errors_1.InternalServerError) {
            return error;
        }
        // Otherwise create InternalServerError
        return new errors_1.InternalServerError(defaultMessage);
    }
    /**
     * Hook for validating creation data (to be implemented by subclasses)
     * @param data The data to validate
     */
    validateCreate(data) {
        return __awaiter(this, void 0, void 0, function* () {
            // Base implementation does nothing - subclasses can override
        });
    }
    /**
     * Hook for validating update data (to be implemented by subclasses)
     * @param id The entity ID
     * @param data The update data
     * @param entity The existing entity
     */
    validateUpdate(id, data, entity) {
        return __awaiter(this, void 0, void 0, function* () {
            // Base implementation does nothing - subclasses can override
        });
    }
    /**
     * Hook executed before deletion (to be implemented by subclasses)
     * @param id The entity ID to be deleted
     * @throws {BadRequestError} If the entity cannot be deleted
     */
    beforeDelete(id) {
        return __awaiter(this, void 0, void 0, function* () {
            // Base implementation does nothing - subclasses can override
        });
    }
}
exports.BaseService = BaseService;
