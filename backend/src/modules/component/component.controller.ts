import { Request, Response, NextFunction } from "express";
import { inject, injectable } from "tsyringe";
import { BaseController } from "../../core/base/BaseController";
import { ComponentService } from "./component.service";
import ResponseUtils from "../../core/utils/response.utils";
import { IComponent } from "./interfaces/IComponentRepository";
import { BadRequestError } from "../../core/errors/AppError";
import IComponentService from "./interfaces/IComponentService";

@injectable()
export class ComponentController extends BaseController<IComponent> {
  constructor(
    @inject("IComponentService") private componentService: IComponentService,
    @inject(ComponentService) private componentServiceImpl: ComponentService,
    @inject("responseUtils") responseUtils: ResponseUtils
  ) {
    super(componentServiceImpl, responseUtils);
  }

  /**
   * Get all components
   */
  getAllComponents = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const { skip, take, orderBy, ...filters } = req.query;
      
      const options: any = {};
      
      if (skip) options.skip = Number(skip);
      if (take) options.take = Number(take);
      if (orderBy) {
        const [field, direction] = String(orderBy).split(':');
        options.orderBy = { [field]: direction || 'asc' };
      }
      if (Object.keys(filters).length > 0) {
        options.where = filters;
      }
      
      const components = await this.componentService.findAll(options);
      
      this.responseUtils.sendSuccessResponse(res, components);
    } catch (error) {
      next(error);
    }
  };

  /**
   * Get a component by ID
   */
  getComponentById = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const { id } = req.params;
      const component = await this.componentService.findById(id);
      
      this.responseUtils.sendSuccessResponse(res, component);
    } catch (error) {
      next(error);
    }
  };

  /**
   * Create a new component
   */
  createComponent = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const componentData = req.body;
      
      const component = await this.componentService.create(componentData);
      
      this.responseUtils.sendSuccessResponse(res, component, 201);
    } catch (error) {
      next(error);
    }
  };

  /**
   * Update a component
   */
  updateComponent = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const { id } = req.params;
      const componentData = req.body;
      
      const component = await this.componentService.update(id, componentData);
      
      this.responseUtils.sendSuccessResponse(res, component);
    } catch (error) {
      next(error);
    }
  };

  /**
   * Delete a component
   */
  deleteComponent = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const { id } = req.params;
      
      const component = await this.componentService.delete(id);
      
      this.responseUtils.sendSuccessResponse(res, component);
    } catch (error) {
      next(error);
    }
  };

  /**
   * Get component health score
   */
  getComponentHealthScore = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const { id } = req.params;
      
      const healthScore = await this.componentService.getHealthScore(id);
      
      this.responseUtils.sendSuccessResponse(res, { id, healthScore });
    } catch (error) {
      next(error);
    }
  };

  /**
   * Get component maintenance records
   */
  getComponentMaintenanceRecords = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const { id } = req.params;
      
      const maintenanceRecords = await this.componentService.getMaintenanceRecords(id);
      
      this.responseUtils.sendSuccessResponse(res, maintenanceRecords);
    } catch (error) {
      next(error);
    }
  };

  /**
   * Trigger an alert for a component
   */
  triggerComponentAlert = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const { id } = req.params;
      const { message } = req.body;
      
      if (!message) {
        throw new BadRequestError("Alert message is required");
      }
      
      const alert = await this.componentService.triggerAlert(id, message);
      
      this.responseUtils.sendSuccessResponse(res, alert);
    } catch (error) {
      next(error);
    }
  };
}
