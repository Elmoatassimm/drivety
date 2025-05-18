import { PrismaClient } from "@prisma/client";
import { injectable, singleton } from "tsyringe";

/**
 * Test database service using SQLite in-memory database
 */
@singleton()
@injectable()
export default class TestPrismaService {
  private prisma: PrismaClient;

  constructor() {
    // Create a new PrismaClient instance with SQLite configuration
    this.prisma = new PrismaClient({
      datasources: {
        db: {
          url: "file:./test.db?mode=memory&cache=shared"
        }
      }
    });
  }

  public getClient(): PrismaClient {
    return this.prisma;
  }

  public async disconnect(): Promise<void> {
    await this.prisma.$disconnect();
  }

  public async connect(): Promise<void> {
    await this.prisma.$connect();
  }
}
