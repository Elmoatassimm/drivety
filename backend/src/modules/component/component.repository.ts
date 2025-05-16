import { injectable, inject } from "tsyringe";
import { BaseRepository } from "../../core/base/BaseRepository";
import { IComponent, ComponentRepository } from "./interfaces/IComponentRepository";
import PrismaService from "../../config/db";
import { NotFoundError } from "../../core/errors/AppError";

@injectable()
export class ComponentRepositoryImpl extends BaseRepository<IComponent> implements ComponentRepository {
  protected modelName = "component";

  constructor(@inject("db") prismaService: PrismaService) {
    super(prismaService);
  }

  async getHealthScore(componentId: string): Promise<number | null> {
    // First check if the component exists
    const component = await this.findById(componentId);
    if (!component) {
      throw new NotFoundError("Component", componentId);
    }

    // Return the health score
    return component.healthScore;
  }

  async getMaintenanceRecords(componentId: string): Promise<any[]> {
    // First check if the component exists
    const component = await this.findById(componentId);
    if (!component) {
      throw new NotFoundError("Component", componentId);
    }

    // Return the maintenance records for this component
    return this.prisma.maintenance.findMany({
      where: { componentId },
      orderBy: { createdAt: 'desc' }
    });
  }

  async triggerAlert(componentId: string, message: string): Promise<any> {
    // First check if the component exists
    const component = await this.findById(componentId);
    if (!component) {
      throw new NotFoundError("Component", componentId);
    }

    // Create a new alert for this component
    return this.prisma.alert.create({
      data: {
        type: "COMPONENT_ISSUE",
        vehicleId: component.vehicleId,
        componentId,
        message,
        actionRequired: true
      }
    });
  }
}
