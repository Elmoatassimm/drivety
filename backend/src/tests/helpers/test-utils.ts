import { PrismaClient, User, Driver } from '@prisma/client';
import bcrypt from 'bcryptjs';
import { container } from 'tsyringe';
import JwtUtils from '../../core/utils/jwt.utils';

const prisma = new PrismaClient();

/**
 * Create a test user
 */
export async function createTestUser(email: string = `test-${Date.now()}@example.com`): Promise<User> {
  const hashedPassword = await bcrypt.hash('password123', 10);
  
  return prisma.user.create({
    data: {
      email,
      password: hashedPassword,
      role: 'USER'
    }
  });
}

/**
 * Create a test driver
 */
export async function createTestDriver(userId: string): Promise<Driver> {
  return prisma.driver.create({
    data: {
      userId,
      name: `Test Driver ${Date.now()}`,
      licenseNumber: `DL${Date.now()}`,
      licenseExpiry: new Date(Date.now() + 365 * 24 * 60 * 60 * 1000), // 1 year from now
      phoneNumber: `${Math.floor(1000000000 + Math.random() * 9000000000)}`,
      driverScore: 0
    }
  });
}

/**
 * Generate an auth token for a user
 */
export function generateAuthToken(userId: string, email: string): string {
  const jwtUtils = container.resolve<JwtUtils>('jwt');
  return jwtUtils.generateAccessToken(userId, email, 'testuser');
}

/**
 * Clean up test data
 */
export async function cleanupTestData(userId?: string, driverId?: string): Promise<void> {
  if (driverId) {
    await prisma.driver.delete({ where: { id: driverId } }).catch(() => {});
  }
  
  if (userId) {
    await prisma.user.delete({ where: { id: userId } }).catch(() => {});
  }
}

/**
 * Close database connection
 */
export async function closeDbConnection(): Promise<void> {
  await prisma.$disconnect();
}
