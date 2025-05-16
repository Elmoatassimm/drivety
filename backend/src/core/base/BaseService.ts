import { BaseRepository } from "./BaseRepository";
import {
  NotFoundError,
  BadRequestError,
  InternalServerError,
  ConflictError
} from "../../types/errors";

import Logger from "../../utils/logger";

export abstract class BaseService<T extends { id: string }> {
  protected abstract entityName: string;
  protected logger: Logger;

  constructor(
    protected repository: BaseRepository<T>
  ) {
    this.logger = new Logger(this.constructor.name);
  }

  /**
   * Find an entity by its ID
   * @param id The ID of the entity to find
   * @throws {BadRequestError} If the ID is invalid
   * @throws {NotFoundError} If the entity is not found
   */
  async findById(id: string): Promise<T> {
    this.validateId(id);

    const entity = await this.repository.findById(id);

    if (!entity) {
      throw new NotFoundError(this.entityName, id);
    }

    return entity;
  }

  /**
   * Find all entities with optional filtering and pagination
   * @param options Query options including skip, take, orderBy, and where
   */
  async findAll(options?: {
    skip?: number;
    take?: number;
    orderBy?: Record<string, "asc" | "desc">;
    where?: Record<string, any>;
  }): Promise<T[]> {
    try {
      return await this.repository.findAll(options);
    } catch (error) {
      this.logger.error(`Error retrieving ${this.entityName} list`, { error, options });
      throw this.handleError(error, `Failed to retrieve ${this.entityName} list`);
    }
  }

  /**
   * Create a new entity
   * @param data The data to create the entity with
   * @throws {BadRequestError} If the data is invalid
   */
  async create(data: Omit<T, "id" | "createdAt" | "updatedAt">): Promise<T> {
    if (!data || Object.keys(data).length === 0) {
      throw new BadRequestError(`Data is required to create ${this.entityName}`);
    }

    try {
      // Validate data before passing to repository
      await this.validateCreate(data);

      return await this.repository.create(data);
    } catch (error) {
      this.logger.error(`Error creating ${this.entityName}`, { error, data });
      throw this.handleError(error, `Failed to create ${this.entityName}`);
    }
  }

  /**
   * Update an existing entity
   * @param id The ID of the entity to update
   * @param data The data to update the entity with
   * @throws {BadRequestError} If the ID or data is invalid
   * @throws {NotFoundError} If the entity is not found
   */
  async update(id: string, data: Partial<Omit<T, "id" | "createdAt" | "updatedAt">>): Promise<T> {
    this.validateId(id);

    if (!data || Object.keys(data).length === 0) {
      throw new BadRequestError(`Data is required to update ${this.entityName}`);
    }

    try {
      // Validate entity exists
      const entity = await this.findById(id);

      // Validate update data
      await this.validateUpdate(id, data, entity);

      return await this.repository.update(id, data);
    } catch (error) {
      if (error instanceof NotFoundError || error instanceof BadRequestError) {
        throw error;
      }

      this.logger.error(`Error updating ${this.entityName}`, { error, id, data });
      throw this.handleError(error, `Failed to update ${this.entityName}`);
    }
  }

  /**
   * Delete an entity by its ID
   * @param id The ID of the entity to delete
   * @throws {BadRequestError} If the ID is invalid
   * @throws {NotFoundError} If the entity is not found
   */
  async delete(id: string): Promise<T> {
    this.validateId(id);

    try {
      // Verify entity exists before deletion
      await this.findById(id);

      // Check if entity can be deleted (hook for subclasses)
      await this.beforeDelete(id);

      return await this.repository.delete(id);
    } catch (error) {
      if (error instanceof NotFoundError || error instanceof BadRequestError) {
        throw error;
      }

      this.logger.error(`Error deleting ${this.entityName}`, { error, id });
      throw this.handleError(error, `Failed to delete ${this.entityName}`);
    }
  }

  /**
   * Count entities with optional filtering
   * @param where Optional filter conditions
   */
  async count(where?: Record<string, any>): Promise<number> {
    try {
      return await this.repository.count(where);
    } catch (error) {
      this.logger.error(`Error counting ${this.entityName}`, { error, where });
      throw this.handleError(error, `Failed to count ${this.entityName}`);
    }
  }

  /**
   * Find one entity matching the given criteria
   * @param where Filter conditions
   * @throws {NotFoundError} If no entity is found
   */
  async findOne(where: Record<string, any>): Promise<T> {
    try {
      const results = await this.repository.findAll({ where, take: 1 });

      if (!results || results.length === 0) {
        throw new NotFoundError(this.entityName, JSON.stringify(where));
      }

      return results[0];
    } catch (error) {
      if (error instanceof NotFoundError) {
        throw error;
      }

      this.logger.error(`Error finding ${this.entityName}`, { error, where });
      throw this.handleError(error, `Failed to find ${this.entityName}`);
    }
  }

  // Protected helper methods for subclasses

  /**
   * Validate entity ID
   * @param id The ID to validate
   * @throws {BadRequestError} If ID is invalid
   */
  protected validateId(id: string): void {
    if (!id) {
      throw new BadRequestError(`${this.entityName} ID is required`);
    }
  }

  /**
   * Handle errors consistently
   * @param error The caught error
   * @param defaultMessage Default error message
   */
  protected handleError(error: any, defaultMessage: string): Error {
    // Rethrow domain errors
    if (
      error instanceof NotFoundError ||
      error instanceof BadRequestError ||
      error instanceof ConflictError ||
      error instanceof InternalServerError
    ) {
      return error;
    }

    // Otherwise create InternalServerError
    return new InternalServerError(defaultMessage);
  }

  /**
   * Hook for validating creation data (to be implemented by subclasses)
   * @param data The data to validate
   */
  protected async validateCreate(data: Omit<T, "id" | "createdAt" | "updatedAt">): Promise<void> {
    // Base implementation does nothing - subclasses can override
  }

  /**
   * Hook for validating update data (to be implemented by subclasses)
   * @param id The entity ID
   * @param data The update data
   * @param entity The existing entity
   */
  protected async validateUpdate(
    id: string,
    data: Partial<Omit<T, "id" | "createdAt" | "updatedAt">>,
    entity: T
  ): Promise<void> {
    // Base implementation does nothing - subclasses can override
  }

  /**
   * Hook executed before deletion (to be implemented by subclasses)
   * @param id The entity ID to be deleted
   * @throws {BadRequestError} If the entity cannot be deleted
   */
  protected async beforeDelete(id: string): Promise<void> {
    // Base implementation does nothing - subclasses can override
  }
}