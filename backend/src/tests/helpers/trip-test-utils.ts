import { PrismaClient, User, Driver, Vehicle, Trip, TripMetric } from '@prisma/client';
import { container } from 'tsyringe';
import TestPrismaService from '../config/test-db';
import JwtUtils from '../../core/utils/jwt.utils';
import bcrypt from 'bcryptjs';

// Use the test database service
const testPrismaService = new TestPrismaService();
const prisma = testPrismaService.getClient();

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
 * Create a test vehicle
 */
export async function createTestVehicle(): Promise<Vehicle> {
  return prisma.vehicle.create({
    data: {
      model: `Test Model ${Date.now()}`,
      year: 2023,
      plateNumber: `TEST-${Date.now()}`,
      status: 'ACTIVE',
      fuelType: 'GASOLINE',
      fuelLevel: 0.75,
      insuranceExpiry: new Date(Date.now() + 365 * 24 * 60 * 60 * 1000) // 1 year from now
    }
  });
}

/**
 * Create a test trip
 */
export async function createTestTrip(driverId: string, vehicleId: string): Promise<Trip> {
  return prisma.trip.create({
    data: {
      driverId,
      vehicleId,
      startLocation: 'Test Start Location',
      startTime: new Date(),
      status: 'IN_PROGRESS'
    }
  });
}

/**
 * Create test trip metrics
 */
export async function createTestTripMetrics(tripId: string, count: number = 3): Promise<TripMetric[]> {
  const metrics: TripMetric[] = [];
  
  for (let i = 0; i < count; i++) {
    const metric = await prisma.tripMetric.create({
      data: {
        tripId,
        speed: 60 + Math.random() * 20,
        acceleration: Math.random() * 5,
        braking: Math.random() * 5,
        fuelConsumption: 5 + Math.random() * 10,
        latitude: 40 + Math.random(),
        longitude: -74 + Math.random()
      }
    });
    
    metrics.push(metric);
  }
  
  return metrics;
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
export async function cleanupTestData(
  userId?: string, 
  driverId?: string, 
  vehicleId?: string, 
  tripId?: string
): Promise<void> {
  if (tripId) {
    await prisma.tripMetric.deleteMany({ where: { tripId } }).catch(() => {});
    await prisma.trip.delete({ where: { id: tripId } }).catch(() => {});
  }
  
  if (driverId) {
    await prisma.driver.delete({ where: { id: driverId } }).catch(() => {});
  }
  
  if (vehicleId) {
    await prisma.vehicle.delete({ where: { id: vehicleId } }).catch(() => {});
  }
  
  if (userId) {
    await prisma.user.delete({ where: { id: userId } }).catch(() => {});
  }
}

/**
 * Close database connection
 */
export async function closeTestDbConnection(): Promise<void> {
  await prisma.$disconnect();
}
