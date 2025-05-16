import { injectable, inject } from "tsyringe";
import { BaseRepository } from "../../core/base/BaseRepository";
import { IDriver } from "./interfaces/IDriverRepository";
import IDriverRepository from "./interfaces/IDriverRepository";
import PrismaService from "../../config/db";
import { NotFoundError } from "../../core/errors/AppError";

@injectable()
export class DriverRepository extends BaseRepository<IDriver> implements IDriverRepository {
  protected modelName = "driver";

  constructor(@inject("db") prismaService: PrismaService) {
    super(prismaService);
    console.log(`[DRIVER REPOSITORY] Initialized with model name: ${this.modelName}`);
  }

  async findById(id: string): Promise<IDriver | null> {
    console.log(`[DRIVER REPOSITORY] Finding driver by ID: ${id}`);
    try {
      const driver = await this.prisma.driver.findUnique({
        where: { id }
      });
      console.log(`[DRIVER REPOSITORY] Driver found by ID: ${!!driver}`);
      return driver;
    } catch (error: any) {
      console.error(`[DRIVER REPOSITORY] Error finding driver by ID:`, error);
      // If it's a Prisma error, log more details
      if (error && typeof error === 'object' && 'code' in error) {
        console.error(`[DRIVER REPOSITORY] Prisma error code: ${error.code}`);
        console.error(`[DRIVER REPOSITORY] Prisma error message: ${error.message}`);
        console.error(`[DRIVER REPOSITORY] Prisma error meta:`, error.meta);
      }
      throw error;
    }
  }

  async findByUserId(userId: string): Promise<IDriver | null> {
    console.log(`[DRIVER REPOSITORY] Finding driver by user ID: ${userId}`);
    try {
      const driver = await this.prisma.driver.findUnique({
        where: { userId }
      });
      console.log(`[DRIVER REPOSITORY] Driver found by user ID: ${!!driver}`);
      return driver;
    } catch (error: any) {
      console.error(`[DRIVER REPOSITORY] Error finding driver by user ID:`, error);
      // If it's a Prisma error, log more details
      if (error && typeof error === 'object' && 'code' in error) {
        console.error(`[DRIVER REPOSITORY] Prisma error code: ${error.code}`);
        console.error(`[DRIVER REPOSITORY] Prisma error message: ${error.message}`);
        console.error(`[DRIVER REPOSITORY] Prisma error meta:`, error.meta);
      }
      throw error;
    }
  }

  async create(data: {
    userId: string;
    name: string;
    licenseNumber: string;
    licenseExpiry: Date;
    phoneNumber: string;
  }): Promise<IDriver> {
    console.log(`[DRIVER REPOSITORY] Creating driver for user ID: ${data.userId}, name: ${data.name}`);
    try {
      console.log(`[DRIVER REPOSITORY] Driver data:`, {
        userId: data.userId,
        name: data.name,
        licenseNumber: data.licenseNumber,
        licenseExpiry: data.licenseExpiry,
        phoneNumber: data.phoneNumber
      });

      const driver = await this.prisma.driver.create({
        data: {
          userId: data.userId,
          name: data.name,
          licenseNumber: data.licenseNumber,
          licenseExpiry: data.licenseExpiry,
          phoneNumber: data.phoneNumber,
          driverScore: 0 // Default score for new drivers
        }
      });

      console.log(`[DRIVER REPOSITORY] Driver created successfully with ID: ${driver.id}`);
      return driver;
    } catch (error: any) {
      console.error(`[DRIVER REPOSITORY] Error creating driver:`, error);
      // If it's a Prisma error, log more details
      if (error && typeof error === 'object' && 'code' in error) {
        console.error(`[DRIVER REPOSITORY] Prisma error code: ${error.code}`);
        console.error(`[DRIVER REPOSITORY] Prisma error message: ${error.message}`);
        console.error(`[DRIVER REPOSITORY] Prisma error meta:`, error.meta);
      }
      throw error;
    }
  }

  async updateDriverScore(id: string, score: number): Promise<IDriver> {
    console.log(`[DRIVER REPOSITORY] Updating driver score for driver ID: ${id}, new score: ${score}`);
    try {
      console.log(`[DRIVER REPOSITORY] Checking if driver exists with ID: ${id}`);
      const driver = await this.findById(id);

      if (!driver) {
        console.log(`[DRIVER REPOSITORY] Driver not found with ID: ${id}`);
        throw new NotFoundError("Driver");
      }

      console.log(`[DRIVER REPOSITORY] Driver found, updating score`);
      const updatedDriver = await this.prisma.driver.update({
        where: { id },
        data: { driverScore: score }
      });

      console.log(`[DRIVER REPOSITORY] Driver score updated successfully for driver ID: ${updatedDriver.id}`);
      return updatedDriver;
    } catch (error: any) {
      console.error(`[DRIVER REPOSITORY] Error updating driver score:`, error);
      // If it's a Prisma error, log more details
      if (error && typeof error === 'object' && 'code' in error) {
        console.error(`[DRIVER REPOSITORY] Prisma error code: ${error.code}`);
        console.error(`[DRIVER REPOSITORY] Prisma error message: ${error.message}`);
        console.error(`[DRIVER REPOSITORY] Prisma error meta:`, error.meta);
      }
      throw error;
    }
  }

  async update(id: string, data: Partial<Omit<IDriver, "id" | "userId" | "createdAt" | "updatedAt">>): Promise<IDriver> {
    console.log(`[DRIVER REPOSITORY] Updating driver with ID: ${id}`);
    console.log(`[DRIVER REPOSITORY] Update data:`, data);

    try {
      const updatedDriver = await this.prisma.driver.update({
        where: { id },
        data
      });

      console.log(`[DRIVER REPOSITORY] Driver updated successfully with ID: ${updatedDriver.id}`);
      return updatedDriver;
    } catch (error: any) {
      console.error(`[DRIVER REPOSITORY] Error updating driver:`, error);
      // If it's a Prisma error, log more details
      if (error && typeof error === 'object' && 'code' in error) {
        console.error(`[DRIVER REPOSITORY] Prisma error code: ${error.code}`);
        console.error(`[DRIVER REPOSITORY] Prisma error message: ${error.message}`);
        console.error(`[DRIVER REPOSITORY] Prisma error meta:`, error.meta);
      }
      throw error;
    }
  }
}
