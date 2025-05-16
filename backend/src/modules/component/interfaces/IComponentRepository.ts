import { Component } from "@prisma/client";
import { BaseRepository } from "../../../core/base/BaseRepository";

export interface IComponent extends Component {}

export interface ComponentRepository extends BaseRepository<{ id: string; vehicleId: string; name: string; healthScore: number }> {
  getHealthScore(componentId: string): Promise<number | null>;
  getMaintenanceRecords(componentId: string): Promise<any[]>;
  triggerAlert(componentId: string, message: string): Promise<any>;
}

export default ComponentRepository;
