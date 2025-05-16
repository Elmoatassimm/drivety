import { IComponent } from "./IComponentRepository";

export default interface IComponentService {
  findById(id: string): Promise<IComponent>;
  findAll(options?: {
    skip?: number;
    take?: number;
    orderBy?: Record<string, "asc" | "desc">;
    where?: Record<string, any>;
  }): Promise<IComponent[]>;
  create(data: Omit<IComponent, "id" | "createdAt" | "updatedAt">): Promise<IComponent>;
  update(id: string, data: Partial<Omit<IComponent, "id" | "createdAt" | "updatedAt">>): Promise<IComponent>;
  delete(id: string): Promise<IComponent>;
  getHealthScore(componentId: string): Promise<number | null>;
  getMaintenanceRecords(componentId: string): Promise<any[]>;
  triggerAlert(componentId: string, message: string): Promise<any>;
}
