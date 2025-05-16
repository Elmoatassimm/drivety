import { injectable, inject } from "tsyringe";
import { BaseRepository } from "../../core/base/BaseRepository";
import { IUser } from "./interfaces/IUserRepository";
import PrismaService from "../../config/db";
import IUserRepository from "./interfaces/IUserRepository";

@injectable()
export class UserRepository extends BaseRepository<IUser> implements IUserRepository {
  protected modelName = "user";

  constructor(@inject("db") prismaService: PrismaService) {
    super(prismaService);
    console.log(`[USER REPOSITORY] Initialized with model name: ${this.modelName}`);
  }

  async findById(id: string): Promise<IUser | null> {
    console.log(`[USER REPOSITORY] Finding user by ID: ${id}`);
    try {
      const user = await this.prisma.user.findUnique({ where: { id } });
      console.log(`[USER REPOSITORY] User found by ID: ${!!user}`);
      return user;
    } catch (error: any) {
      console.error(`[USER REPOSITORY] Error finding user by ID:`, error);
      // If it's a Prisma error, log more details
      if (error && typeof error === 'object' && 'code' in error) {
        console.error(`[USER REPOSITORY] Prisma error code: ${error.code}`);
        console.error(`[USER REPOSITORY] Prisma error message: ${error.message}`);
        console.error(`[USER REPOSITORY] Prisma error meta:`, error.meta);
      }
      throw error;
    }
  }

  async findByEmail(email: string): Promise<IUser | null> {
    console.log(`[USER REPOSITORY] Finding user by email: ${email}`);
    try {
      const user = await this.prisma.user.findUnique({ where: { email } });
      console.log(`[USER REPOSITORY] User found by email: ${!!user}`);
      return user;
    } catch (error: any) {
      console.error(`[USER REPOSITORY] Error finding user by email:`, error);
      // If it's a Prisma error, log more details
      if (error && typeof error === 'object' && 'code' in error) {
        console.error(`[USER REPOSITORY] Prisma error code: ${error.code}`);
        console.error(`[USER REPOSITORY] Prisma error message: ${error.message}`);
        console.error(`[USER REPOSITORY] Prisma error meta:`, error.meta);
      }
      throw error;
    }
  }

  async createUser(data: { email: string; password_hash: string; username: string }): Promise<IUser> {
    console.log(`[USER REPOSITORY] Creating user with email: ${data.email}`);
    try {
      console.log(`[USER REPOSITORY] User data:`, {
        email: data.email,
        username: data.username,
        password_hash_length: data.password_hash ? data.password_hash.length : 0
      });

      // Log the Prisma client connection status
      console.log(`[USER REPOSITORY] Prisma client available: ${!!this.prisma}`);

      // Log the database URL (without sensitive info)
      const dbUrl = process.env.DATABASE_URL || '';
      const sanitizedDbUrl = dbUrl.replace(/\/\/([^:]+):[^@]+@/, '//***:***@');
      console.log(`[USER REPOSITORY] Database URL: ${sanitizedDbUrl}`);

      console.log(`[USER REPOSITORY] Creating user in database...`);
      const user = await this.prisma.user.create({
        data: {
          email: data.email,
          password: data.password_hash,
          role: "USER"
        }
      });
      console.log(`[USER REPOSITORY] User created successfully with ID: ${user.id}`);

      // Add the username property to match the interface
      return {
        ...user,
        username: data.username
      };
    } catch (error: any) {
      console.error(`[USER REPOSITORY] Error creating user:`, error);
      // If it's a Prisma error, log more details
      if (error && typeof error === 'object' && 'code' in error) {
        console.error(`[USER REPOSITORY] Prisma error code: ${error.code}`);
        console.error(`[USER REPOSITORY] Prisma error message: ${error.message}`);
        console.error(`[USER REPOSITORY] Prisma error meta:`, error.meta);
      }
      throw error;
    }
  }

  async updatePassword(id: string, password: string): Promise<IUser> {
    console.log(`[USER REPOSITORY] Updating password for user ID: ${id}`);
    try {
      const user = await this.prisma.user.update({
        where: { id },
        data: { password }
      });
      console.log(`[USER REPOSITORY] Password updated successfully for user ID: ${id}`);
      return user;
    } catch (error: any) {
      console.error(`[USER REPOSITORY] Error updating password:`, error);
      // If it's a Prisma error, log more details
      if (error && typeof error === 'object' && 'code' in error) {
        console.error(`[USER REPOSITORY] Prisma error code: ${error.code}`);
        console.error(`[USER REPOSITORY] Prisma error message: ${error.message}`);
        console.error(`[USER REPOSITORY] Prisma error meta:`, error.meta);
      }
      throw error;
    }
  }

  async getProfile(id: string): Promise<Partial<IUser> | null> {
    console.log(`[USER REPOSITORY] Getting profile for user ID: ${id}`);
    try {
      const profile = await this.prisma.user.findUnique({
        where: { id },
        select: { id: true, email: true, role: true }
      });
      console.log(`[USER REPOSITORY] Profile found: ${!!profile}`);
      return profile;
    } catch (error: any) {
      console.error(`[USER REPOSITORY] Error getting profile:`, error);
      // If it's a Prisma error, log more details
      if (error && typeof error === 'object' && 'code' in error) {
        console.error(`[USER REPOSITORY] Prisma error code: ${error.code}`);
        console.error(`[USER REPOSITORY] Prisma error message: ${error.message}`);
        console.error(`[USER REPOSITORY] Prisma error meta:`, error.meta);
      }
      throw error;
    }
  }
}
