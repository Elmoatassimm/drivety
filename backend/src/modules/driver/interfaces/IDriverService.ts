import { IDriver } from "./IDriverRepository";

export default interface IDriverService {
  findById(id: string): Promise<IDriver | null>;
  findByUserId(userId: string): Promise<IDriver | null>;
  create(data: {
    userId: string;
    name: string;
    licenseNumber: string;
    licenseExpiry: Date;
    phoneNumber: string;
  }): Promise<IDriver>;
  update(id: string, data: Partial<Omit<IDriver, "id" | "userId" | "createdAt" | "updatedAt">>): Promise<IDriver>;
  delete(id: string): Promise<IDriver>;
  findAll(options?: {
    skip?: number;
    take?: number;
    orderBy?: Record<string, "asc" | "desc">;
    where?: Record<string, any>;
  }): Promise<IDriver[]>;
  updateDriverScore(id: string, score: number): Promise<IDriver>;
}
