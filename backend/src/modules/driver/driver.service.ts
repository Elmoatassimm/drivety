import { inject, injectable } from "tsyringe";
import { BaseService } from "../../core/base/BaseService";
import { IDriver } from "./interfaces/IDriverRepository";
import IDriverRepository from "./interfaces/IDriverRepository";
import IDriverService from "./interfaces/IDriverService";
import { DriverRepository } from "./driver.repository";
import { NotFoundError, ConflictError } from "../../core/errors/AppError";

@injectable()
export class DriverService extends BaseService<IDriver> implements IDriverService {
  protected entityName = "Driver";

  constructor(
    @inject("IDriverRepository") private driverRepository: IDriverRepository,
    @inject(DriverRepository) repository: DriverRepository
  ) {
    super(repository);
  }

  // We don't need to override findById as it's already implemented in BaseService

  async findByUserId(userId: string): Promise<IDriver | null> {
    console.log(`[DRIVER SERVICE] Finding driver by user ID: ${userId}`);
    const driver = await this.driverRepository.findByUserId(userId);
    console.log(`[DRIVER SERVICE] Driver found by user ID: ${!!driver}`);
    return driver;
  }

  async create(data: {
    userId: string;
    name: string;
    licenseNumber: string;
    licenseExpiry: Date;
    phoneNumber: string;
  }): Promise<IDriver> {
    console.log(`[DRIVER SERVICE] Creating driver for user ID: ${data.userId}, name: ${data.name}`);

    // Check if driver already exists for this user
    console.log(`[DRIVER SERVICE] Checking if driver already exists for user ID: ${data.userId}`);
    const existingDriver = await this.driverRepository.findByUserId(data.userId);

    if (existingDriver) {
      console.log(`[DRIVER SERVICE] Driver already exists for user ID: ${data.userId}`);
      throw new ConflictError("Driver already exists for this user");
    }

    console.log(`[DRIVER SERVICE] No existing driver found, creating new driver`);
    const driver = await this.driverRepository.create(data);
    console.log(`[DRIVER SERVICE] Driver created successfully with ID: ${driver.id}`);

    return driver;
  }

  async update(id: string, data: Partial<Omit<IDriver, "id" | "userId" | "createdAt" | "updatedAt">>): Promise<IDriver> {
    console.log(`[DRIVER SERVICE] Updating driver with ID: ${id}`);
    console.log(`[DRIVER SERVICE] Update data:`, data);

    console.log(`[DRIVER SERVICE] Checking if driver exists with ID: ${id}`);
    const driver = await this.driverRepository.findById(id);

    if (!driver) {
      console.log(`[DRIVER SERVICE] Driver not found with ID: ${id}`);
      throw new NotFoundError("Driver");
    }

    console.log(`[DRIVER SERVICE] Driver found, proceeding with update`);
    const updatedDriver = await this.driverRepository.update(id, data);
    console.log(`[DRIVER SERVICE] Driver updated successfully with ID: ${updatedDriver.id}`);

    return updatedDriver;
  }

  async updateDriverScore(id: string, score: number): Promise<IDriver> {
    console.log(`[DRIVER SERVICE] Updating driver score for driver ID: ${id}, new score: ${score}`);

    if (score < 0 || score > 100) {
      console.log(`[DRIVER SERVICE] Invalid score value: ${score}. Score must be between 0 and 100`);
      throw new Error("Driver score must be between 0 and 100");
    }

    console.log(`[DRIVER SERVICE] Score is valid, updating driver score`);
    const driver = await this.driverRepository.updateDriverScore(id, score);
    console.log(`[DRIVER SERVICE] Driver score updated successfully for driver ID: ${driver.id}`);

    return driver;
  }
}
