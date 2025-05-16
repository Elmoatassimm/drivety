import { inject, injectable } from "tsyringe";
import { BaseService } from "../../core/base/BaseService";
import { IComponent } from "./interfaces/IComponentRepository";
import ComponentRepository from "./interfaces/IComponentRepository";
import IComponentService from "./interfaces/IComponentService";
import { ComponentRepositoryImpl } from "./component.repository";
import { NotFoundError, BadRequestError } from "../../core/errors/AppError";

@injectable()
export class ComponentService extends BaseService<IComponent> implements IComponentService {
  protected entityName = "Component";

  constructor(
    @inject("ComponentRepository") private componentRepository: ComponentRepository,
    @inject(ComponentRepositoryImpl) repository: ComponentRepositoryImpl
  ) {
    super(repository);
  }

  // We don't need to override findById, findAll, create, update, delete as they're already implemented in BaseService

  async getHealthScore(componentId: string): Promise<number | null> {
    if (!componentId) {
      throw new BadRequestError("Component ID is required");
    }

    try {
      return await this.componentRepository.getHealthScore(componentId);
    } catch (error) {
      this.logger.error(`Error getting health score for component ${componentId}`, { error });
      throw this.handleError(error, `Failed to get health score for component ${componentId}`);
    }
  }

  async getMaintenanceRecords(componentId: string): Promise<any[]> {
    if (!componentId) {
      throw new BadRequestError("Component ID is required");
    }

    try {
      return await this.componentRepository.getMaintenanceRecords(componentId);
    } catch (error) {
      this.logger.error(`Error getting maintenance records for component ${componentId}`, { error });
      throw this.handleError(error, `Failed to get maintenance records for component ${componentId}`);
    }
  }

  async triggerAlert(componentId: string, message: string): Promise<any> {
    if (!componentId) {
      throw new BadRequestError("Component ID is required");
    }

    if (!message) {
      throw new BadRequestError("Alert message is required");
    }

    try {
      return await this.componentRepository.triggerAlert(componentId, message);
    } catch (error) {
      this.logger.error(`Error triggering alert for component ${componentId}`, { error });
      throw this.handleError(error, `Failed to trigger alert for component ${componentId}`);
    }
  }

  // Override validateCreate to add custom validation for component creation
  protected async validateCreate(data: Omit<IComponent, "id" | "createdAt" | "updatedAt">): Promise<void> {
    if (!data.name) {
      throw new BadRequestError("Component name is required");
    }

    if (!data.vehicleId) {
      throw new BadRequestError("Vehicle ID is required");
    }

    if (!data.componentType) {
      throw new BadRequestError("Component type is required");
    }

    if (data.healthScore < 0 || data.healthScore > 100) {
      throw new BadRequestError("Health score must be between 0 and 100");
    }

    // Check if the vehicle exists using the repository
    const vehicleRepository = this.componentRepository as any;
    const vehicle = await vehicleRepository.prisma.vehicle.findUnique({
      where: { id: data.vehicleId }
    });

    if (!vehicle) {
      throw new BadRequestError(`Vehicle with ID ${data.vehicleId} does not exist`);
    }
  }
}
