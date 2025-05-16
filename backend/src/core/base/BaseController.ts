import { Request, Response, NextFunction } from "express";
import { inject } from "tsyringe";
import { BaseService } from "./BaseService";
import ResponseUtils from "../utils/response.utils";
import { TFindInput } from "../../types/types";

export abstract class BaseController<T extends { id: string }> {
  constructor(
    protected service: BaseService<T>,
    @inject("responseUtils") protected responseUtils: ResponseUtils
  ) {}

  async getById(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const { id } = req.params;
      const entity = await this.service.findById(id);

      if (!entity) {
        this.responseUtils.sendNotFoundResponse(res, `Entity with id ${id} not found`);
        return;
      }

      this.responseUtils.sendSuccessResponse(res, entity);
    } catch (error) {
      next(error);
    }
  }

  async getAll(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const { page = 1, limit = 10, sortBy = 'createdAt', order = 'desc' } = req.query as unknown as TFindInput;
      const skip = (page - 1) * limit;

      const [entities, totalCount] = await Promise.all([
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
    } catch (error) {
      next(error);
    }
  }

  async create(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const entity = await this.service.create(req.body);
      this.responseUtils.sendSuccessResponse(res, entity, 201);
    } catch (error) {
      next(error);
    }
  }

  async update(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const { id } = req.params;
      const entity = await this.service.update(id, req.body);
      this.responseUtils.sendSuccessResponse(res, entity);
    } catch (error) {
      next(error);
    }
  }

  async delete(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const { id } = req.params;
      await this.service.delete(id);
      this.responseUtils.sendSuccessNoDataResponse(res, "Entity deleted successfully");
    } catch (error) {
      next(error);
    }
  }
}
