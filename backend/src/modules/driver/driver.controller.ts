import { Request, Response, NextFunction } from "express";
import { inject, injectable } from "tsyringe";
import { BaseController } from "../../core/base/BaseController";
import { DriverService } from "./driver.service";
import ResponseUtils from "../../core/utils/response.utils";
import { IDriver } from "./interfaces/IDriverRepository";
import { RequestWithUser } from "../../types/types";
import { NotFoundError } from "../../core/errors/AppError";

@injectable()
export class DriverController extends BaseController<IDriver> {
  constructor(
    @inject("IDriverService") private driverService: DriverService,
    @inject("responseUtils") responseUtils: ResponseUtils
  ) {
    super(driverService, responseUtils);
  }

  async createDriver(req: Request, res: Response, next: NextFunction): Promise<void> {
    console.log(`[DRIVER CONTROLLER] Create driver request received:`, req.body);
    try {
      const { userId, name, licenseNumber, licenseExpiry, phoneNumber } = req.body;
      console.log(`[DRIVER CONTROLLER] Creating driver for user ID: ${userId}, name: ${name}`);

      const driver = await this.driverService.create({
        userId,
        name,
        licenseNumber,
        licenseExpiry: new Date(licenseExpiry),
        phoneNumber
      });

      console.log(`[DRIVER CONTROLLER] Driver created successfully with ID: ${driver.id}`);
      this.responseUtils.sendSuccessResponse(res, driver, 201);
    } catch (error: any) {
      console.error(`[DRIVER CONTROLLER] Error creating driver:`, error);
      next(error);
    }
  }

  async getDriverByUserId(req: RequestWithUser, res: Response, next: NextFunction): Promise<void> {
    console.log(`[DRIVER CONTROLLER] Get driver by user ID request received`);
    try {
      const userId = req.params.userId || req.user?.id;
      console.log(`[DRIVER CONTROLLER] Looking up driver for user ID: ${userId}`);

      if (!userId) {
        console.log(`[DRIVER CONTROLLER] User ID is missing`);
        throw new NotFoundError("User ID is required");
      }

      const driver = await this.driverService.findByUserId(userId);
      console.log(`[DRIVER CONTROLLER] Driver found: ${!!driver}`);

      if (!driver) {
        console.log(`[DRIVER CONTROLLER] No driver found for user ID: ${userId}`);
        throw new NotFoundError("Driver");
      }

      console.log(`[DRIVER CONTROLLER] Returning driver with ID: ${driver.id}`);
      this.responseUtils.sendSuccessResponse(res, driver);
    } catch (error: any) {
      console.error(`[DRIVER CONTROLLER] Error getting driver by user ID:`, error);
      next(error);
    }
  }

  async updateDriverScore(req: Request, res: Response, next: NextFunction): Promise<void> {
    console.log(`[DRIVER CONTROLLER] Update driver score request received:`, req.body);
    try {
      const { id } = req.params;
      const { score } = req.body;
      console.log(`[DRIVER CONTROLLER] Updating score for driver ID: ${id}, new score: ${score}`);

      const driver = await this.driverService.updateDriverScore(id, score);

      console.log(`[DRIVER CONTROLLER] Driver score updated successfully for driver ID: ${driver.id}`);
      this.responseUtils.sendSuccessResponse(res, driver);
    } catch (error: any) {
      console.error(`[DRIVER CONTROLLER] Error updating driver score:`, error);
      next(error);
    }
  }

  async getCurrentUserDriver(req: RequestWithUser, res: Response, next: NextFunction): Promise<void> {
    console.log(`[DRIVER CONTROLLER] Get current user driver request received`);
    try {
      if (!req.user?.id) {
        console.log(`[DRIVER CONTROLLER] User not authenticated or user ID missing`);
        throw new NotFoundError("User not authenticated");
      }

      console.log(`[DRIVER CONTROLLER] Looking up driver for current user ID: ${req.user.id}`);
      const driver = await this.driverService.findByUserId(req.user.id);
      console.log(`[DRIVER CONTROLLER] Driver found for current user: ${!!driver}`);

      if (!driver) {
        console.log(`[DRIVER CONTROLLER] No driver found for current user ID: ${req.user.id}`);
        throw new NotFoundError("Driver not found for current user");
      }

      console.log(`[DRIVER CONTROLLER] Returning driver with ID: ${driver.id} for current user`);
      this.responseUtils.sendSuccessResponse(res, driver);
    } catch (error: any) {
      console.error(`[DRIVER CONTROLLER] Error getting current user driver:`, error);
      next(error);
    }
  }
}
