import { injectable, inject } from "tsyringe";
import { BaseRepository } from "../../core/base/BaseRepository";
import { IUser, CreateUserData } from "./interfaces/IUserRepository";
import PrismaService from "../../config/db";
import IUserRepository from "./interfaces/IUserRepository";
import { UserRole } from "../../types/user.types";

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
      if (!user) return null;
      
      return this.mapToIUser(user);
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
      if (!user) return null;
      
      return this.mapToIUser(user);
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

  async createUser(data: CreateUserData): Promise<IUser> {
    console.log(`[USER REPOSITORY] Creating user with email: ${data.email}`);
    try {
      // Ensure role is a valid UserRole or default to DRIVER
      const role = (data.role && Object.values(UserRole).includes(data.role as UserRole))
        ? data.role as UserRole
        : UserRole.DRIVER;
      
      console.log(`[USER REPOSITORY] User data:`, {
        email: data.email,
        role,
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
          role: role as any  // Type assertion needed due to Prisma enum typing
        }
      });
      console.log(`[USER REPOSITORY] User created successfully with ID: ${user.id}`);

      // Map to IUser interface
      return {
        ...user,
        username: data.username,
        role: role,
        password_hash: user.password
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

  private mapToIUser(user: any): IUser {
    return {
      ...user,
      role: user.role as UserRole,
      password_hash: user.password || user.password_hash,
      username: undefined // Not stored in the database
    };
  }

  async updatePassword(id: string, password: string): Promise<IUser> {
    console.log(`[USER REPOSITORY] Updating password for user ID: ${id}`);
    try {
      const user = await this.prisma.user.update({
        where: { id },
        data: { password }
      });
      console.log(`[USER REPOSITORY] Password updated successfully`);
      return this.mapToIUser(user);
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
      const user = await this.prisma.user.findUnique({
        where: { id },
        select: {
          id: true,
          email: true,
          role: true,
        },
      });
      console.log(`[USER REPOSITORY] Profile found: ${!!user}`);
      if (!user) return null;
      
      return {
        ...user,
        role: user.role as UserRole,
        username: undefined // Not stored in the database
      };
    } catch (error) {
      console.error(`[USER REPOSITORY] Error getting profile:`, error);
      throw error;
    }
  }
}
