import request from 'supertest';
import { container } from 'tsyringe';
import app from '../app';
import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcryptjs';
import JwtUtils from '../core/utils/jwt.utils';

describe('Driver API', () => {
  let prisma: PrismaClient;
  let authToken: string;
  let userId: string;
  let driverId: string;

  beforeAll(async () => {
    // Create a test database connection
    prisma = new PrismaClient();
    
    // Create a test user
    const hashedPassword = await bcrypt.hash('password123', 10);
    const user = await prisma.user.create({
      data: {
        email: 'driver-test@example.com',
        password: hashedPassword,
        role: 'USER'
      }
    });
    
    userId = user.id;
    
    // Generate a JWT token for authentication
    const jwtUtils = container.resolve<JwtUtils>('jwt');
    authToken = jwtUtils.generateAccessToken(user.id, user.email, 'testuser');
  });

  afterAll(async () => {
    // Clean up test data
    if (driverId) {
      await prisma.driver.delete({ where: { id: driverId } }).catch(() => {});
    }
    
    await prisma.user.delete({ where: { id: userId } }).catch(() => {});
    
    // Close the database connection
    await prisma.$disconnect();
  });

  describe('POST /api/drivers', () => {
    it('should create a new driver', async () => {
      const driverData = {
        userId,
        name: 'Test Driver',
        licenseNumber: 'DL12345678',
        licenseExpiry: new Date(Date.now() + 365 * 24 * 60 * 60 * 1000).toISOString(), // 1 year from now
        phoneNumber: '1234567890'
      };

      const response = await request(app)
        .post('/api/drivers')
        .set('Authorization', `Bearer ${authToken}`)
        .send(driverData);

      expect(response.status).toBe(201);
      expect(response.body.data).toHaveProperty('id');
      expect(response.body.data.name).toBe(driverData.name);
      expect(response.body.data.licenseNumber).toBe(driverData.licenseNumber);
      expect(response.body.data.phoneNumber).toBe(driverData.phoneNumber);
      expect(response.body.data.driverScore).toBe(0); // Default score

      // Save the driver ID for later tests
      driverId = response.body.data.id;
    });

    it('should return 400 for invalid driver data', async () => {
      const invalidData = {
        userId,
        name: 'T', // Too short
        licenseNumber: '123', // Too short
        licenseExpiry: 'invalid-date',
        phoneNumber: '123' // Too short
      };

      const response = await request(app)
        .post('/api/drivers')
        .set('Authorization', `Bearer ${authToken}`)
        .send(invalidData);

      expect(response.status).toBe(400);
      expect(response.body).toHaveProperty('errors');
    });

    it('should return 401 without authentication', async () => {
      const response = await request(app)
        .post('/api/drivers')
        .send({
          userId,
          name: 'Test Driver',
          licenseNumber: 'DL12345678',
          licenseExpiry: new Date().toISOString(),
          phoneNumber: '1234567890'
        });

      expect(response.status).toBe(401);
    });
  });

  describe('GET /api/drivers/:id', () => {
    it('should get a driver by ID', async () => {
      // Skip if no driver was created
      if (!driverId) {
        return;
      }

      const response = await request(app)
        .get(`/api/drivers/${driverId}`)
        .set('Authorization', `Bearer ${authToken}`);

      expect(response.status).toBe(200);
      expect(response.body.data).toHaveProperty('id', driverId);
      expect(response.body.data).toHaveProperty('name');
      expect(response.body.data).toHaveProperty('licenseNumber');
    });

    it('should return 404 for non-existent driver', async () => {
      const nonExistentId = '00000000-0000-0000-0000-000000000000';
      
      const response = await request(app)
        .get(`/api/drivers/${nonExistentId}`)
        .set('Authorization', `Bearer ${authToken}`);

      expect(response.status).toBe(404);
    });
  });

  describe('GET /api/drivers/me', () => {
    it('should get the current user\'s driver profile', async () => {
      // Skip if no driver was created
      if (!driverId) {
        return;
      }

      const response = await request(app)
        .get('/api/drivers/me')
        .set('Authorization', `Bearer ${authToken}`);

      expect(response.status).toBe(200);
      expect(response.body.data).toHaveProperty('id', driverId);
      expect(response.body.data).toHaveProperty('userId', userId);
    });
  });

  describe('PUT /api/drivers/:id', () => {
    it('should update a driver', async () => {
      // Skip if no driver was created
      if (!driverId) {
        return;
      }

      const updateData = {
        name: 'Updated Driver Name',
        phoneNumber: '9876543210'
      };

      const response = await request(app)
        .put(`/api/drivers/${driverId}`)
        .set('Authorization', `Bearer ${authToken}`)
        .send(updateData);

      expect(response.status).toBe(200);
      expect(response.body.data).toHaveProperty('name', updateData.name);
      expect(response.body.data).toHaveProperty('phoneNumber', updateData.phoneNumber);
    });
  });

  describe('PATCH /api/drivers/:id/score', () => {
    it('should update a driver\'s score', async () => {
      // Skip if no driver was created
      if (!driverId) {
        return;
      }

      const scoreData = {
        score: 85
      };

      const response = await request(app)
        .patch(`/api/drivers/${driverId}/score`)
        .set('Authorization', `Bearer ${authToken}`)
        .send(scoreData);

      expect(response.status).toBe(200);
      expect(response.body.data).toHaveProperty('driverScore', scoreData.score);
    });

    it('should return 400 for invalid score', async () => {
      // Skip if no driver was created
      if (!driverId) {
        return;
      }

      const invalidScore = {
        score: 101 // Above maximum
      };

      const response = await request(app)
        .patch(`/api/drivers/${driverId}/score`)
        .set('Authorization', `Bearer ${authToken}`)
        .send(invalidScore);

      expect(response.status).toBe(400);
    });
  });

  describe('GET /api/drivers', () => {
    it('should get all drivers', async () => {
      const response = await request(app)
        .get('/api/drivers')
        .set('Authorization', `Bearer ${authToken}`);

      expect(response.status).toBe(200);
      expect(Array.isArray(response.body.data)).toBe(true);
      expect(response.body.data.length).toBeGreaterThan(0);
    });
  });

  // We'll skip the DELETE test to avoid removing our test data before other tests run
  // In a real test suite, you might want to create a separate driver just for the delete test
  describe('DELETE /api/drivers/:id', () => {
    it('should delete a driver', async () => {
      // Create a driver specifically for deletion
      const deleteDriverData = {
        userId,
        name: 'Delete Test Driver',
        licenseNumber: 'DL87654321',
        licenseExpiry: new Date(Date.now() + 365 * 24 * 60 * 60 * 1000).toISOString(),
        phoneNumber: '9876543210'
      };

      // Create a driver to delete
      const createResponse = await request(app)
        .post('/api/drivers')
        .set('Authorization', `Bearer ${authToken}`)
        .send(deleteDriverData);
      
      const deleteDriverId = createResponse.body.data.id;

      // Delete the driver
      const response = await request(app)
        .delete(`/api/drivers/${deleteDriverId}`)
        .set('Authorization', `Bearer ${authToken}`);

      expect(response.status).toBe(200);
      expect(response.body.data).toHaveProperty('id', deleteDriverId);
    });
  });
});
