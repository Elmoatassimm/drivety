import { PrismaClient } from "@prisma/client";
import { injectable, inject } from "tsyringe";
import PrismaService from "../../config/db";
import { handlePrismaError } from "../utils/handlePrismaErrors";

export abstract class BaseRepository<T extends { id: string }> {
  protected prisma: PrismaClient;
  protected abstract modelName: string;

  constructor(@inject("db") protected prismaService: PrismaService) {
    this.prisma = prismaService.getClient();
  }

  async findById(id: string): Promise<T | null> {
    try {
      return await (this.prisma as any)[this.modelName].findUnique({
        where: { id }
      });
    } catch (error) {
      handlePrismaError(error, { resource: this.modelName, id });
      throw error;
    }
  }

  async findAll(options?: {
    skip?: number;
    take?: number;
    orderBy?: Record<string, "asc" | "desc">;
    where?: Record<string, any>;
  }): Promise<T[]> {
    try {
      return await (this.prisma as any)[this.modelName].findMany(options);
    } catch (error) {
      handlePrismaError(error, { resource: this.modelName });
      throw error;
    }
  }

  async create(data: Omit<T, "id" | "createdAt" | "updatedAt">): Promise<T> {
    try {
      return await (this.prisma as any)[this.modelName].create({ data });
    } catch (error) {
      handlePrismaError(error, { resource: this.modelName });
      throw error;
    }
  }

  async update(id: string, data: Partial<Omit<T, "id" | "createdAt" | "updatedAt">>): Promise<T> {
    try {
      return await (this.prisma as any)[this.modelName].update({
        where: { id },
        data
      });
    } catch (error) {
      handlePrismaError(error, { resource: this.modelName, id });
      throw error;
    }
  }

  async delete(id: string): Promise<T> {
    try {
      return await (this.prisma as any)[this.modelName].delete({
        where: { id }
      });
    } catch (error) {
      handlePrismaError(error, { resource: this.modelName, id });
      throw error;
    }
  }

  async count(where?: Record<string, any>): Promise<number> {
    try {
      return await (this.prisma as any)[this.modelName].count({ where });
    } catch (error) {
      handlePrismaError(error, { resource: this.modelName });
      throw error;
    }
  }
}