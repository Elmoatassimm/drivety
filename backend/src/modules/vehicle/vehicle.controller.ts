import { Request, Response, NextFunction } from "express";
import { inject, injectable } from "tsyringe";
import { BaseController } from "../../core/base/BaseController";
import { VehicleService } from "./vehicle.service";
import ResponseUtils from "../../core/utils/response.utils";
import { IVehicle } from "./interfaces/IVehicleRepository";
import { BadRequestError } from "../../core/errors/AppError";
import IVehicleService from "./interfaces/IVehicleService";

@injectable()
export class VehicleController extends BaseController<IVehicle> {
  constructor(
    @inject("IVehicleService") private vehicleService: IVehicleService,
    @inject(VehicleService) private vehicleServiceImpl: VehicleService,
    @inject("responseUtils") responseUtils: ResponseUtils
  ) {
    super(vehicleServiceImpl, responseUtils);
  }

  /**
   * Get all vehicles
   */
  getAllVehicles = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
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

      const vehicles = await this.vehicleService.findAll(options);

      this.responseUtils.sendSuccessResponse(res, vehicles);
    } catch (error) {
      next(error);
    }
  };

  /**
   * Get a vehicle by ID
   */
  getVehicleById = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const { id } = req.params;
      const vehicle = await this.vehicleService.findById(id);

      this.responseUtils.sendSuccessResponse(res, vehicle);
    } catch (error) {
      next(error);
    }
  };

  /**
   * Create a new vehicle
   */
  createVehicle = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const vehicleData = req.body;

      const vehicle = await this.vehicleService.create(vehicleData);

      this.responseUtils.sendSuccessResponse(res, vehicle, 201);
    } catch (error) {
      next(error);
    }
  };

  /**
   * Update a vehicle
   */
  updateVehicle = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const { id } = req.params;
      const vehicleData = req.body;

      const vehicle = await this.vehicleService.update(id, vehicleData);

      this.responseUtils.sendSuccessResponse(res, vehicle);
    } catch (error) {
      next(error);
    }
  };

  /**
   * Delete a vehicle
   */
  deleteVehicle = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const { id } = req.params;

      const vehicle = await this.vehicleService.delete(id);

      this.responseUtils.sendSuccessResponse(res, vehicle);
    } catch (error) {
      next(error);
    }
  };

  /**
   * Get vehicle components
   */
  getVehicleComponents = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const { id } = req.params;

      const components = await this.vehicleService.getComponents(id);

      this.responseUtils.sendSuccessResponse(res, components);
    } catch (error) {
      next(error);
    }
  };

  /**
   * Update vehicle health status
   */
  updateVehicleHealthStatus = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const { id } = req.params;
      const { healthStatus } = req.body;

      if (!healthStatus) {
        throw new BadRequestError("Health status is required");
      }

      const updatedVehicle = await this.vehicleService.updateHealthStatus(id, healthStatus);

      this.responseUtils.sendSuccessResponse(res, updatedVehicle);
    } catch (error) {
      next(error);
    }
  };

  /**
   * Get vehicle maintenance history
   */
  getVehicleMaintenanceHistory = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const { id } = req.params;

      const maintenanceHistory = await this.vehicleService.getMaintenanceHistory(id);

      this.responseUtils.sendSuccessResponse(res, maintenanceHistory);
    } catch (error) {
      next(error);
    }
  };
}
