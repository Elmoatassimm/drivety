import request from 'supertest';
import app from '../../app';
import { 
  createTestUser, 
  createTestDriver, 
  generateAuthToken, 
  cleanupTestData, 
  closeDbConnection 
} from '../helpers/test-utils';
import { User, Driver } from '@prisma/client';

describe('Driver API Integration Tests', () => {
  let testUser: User;
  let testDriver: Driver;
  let authToken: string;

  beforeAll(async () => {
    // Create test user
    testUser = await createTestUser();
    
    // Generate auth token
    authToken = generateAuthToken(testUser.id, testUser.email);
  });

  afterAll(async () => {
    // Clean up test data
    await cleanupTestData(testUser.id, testDriver?.id);
    
    // Close database connection
    await closeDbConnection();
  });

  describe('Driver Creation', () => {
    it('should create a new driver successfully', async () => {
      const driverData = {
        userId: testUser.id,
        name: 'Integration Test Driver',
        licenseNumber: 'DL-INT-12345',
        licenseExpiry: new Date(Date.now() + 365 * 24 * 60 * 60 * 1000).toISOString(),
        phoneNumber: '5551234567'
      };

      const response = await request(app)
        .post('/api/drivers')
        .set('Authorization', `Bearer ${authToken}`)
        .send(driverData);

      expect(response.status).toBe(201);
      expect(response.body.data).toHaveProperty('id');
      expect(response.body.data.name).toBe(driverData.name);
      expect(response.body.data.licenseNumber).toBe(driverData.licenseNumber);
      
      // Save the created driver for later tests
      testDriver = response.body.data;
    });
  });

  describe('Driver Retrieval', () => {
    it('should get a driver by ID', async () => {
      // Skip if no driver was created
      if (!testDriver) {
        return;
      }

      const response = await request(app)
        .get(`/api/drivers/${testDriver.id}`)
        .set('Authorization', `Bearer ${authToken}`);

      expect(response.status).toBe(200);
      expect(response.body.data).toHaveProperty('id', testDriver.id);
      expect(response.body.data.name).toBe(testDriver.name);
    });

    it('should get the current user\'s driver profile', async () => {
      // Skip if no driver was created
      if (!testDriver) {
        return;
      }

      const response = await request(app)
        .get('/api/drivers/me')
        .set('Authorization', `Bearer ${authToken}`);

      expect(response.status).toBe(200);
      expect(response.body.data).toHaveProperty('id', testDriver.id);
      expect(response.body.data).toHaveProperty('userId', testUser.id);
    });

    it('should get a driver by user ID', async () => {
      // Skip if no driver was created
      if (!testDriver) {
        return;
      }

      const response = await request(app)
        .get(`/api/drivers/user/${testUser.id}`)
        .set('Authorization', `Bearer ${authToken}`);

      expect(response.status).toBe(200);
      expect(response.body.data).toHaveProperty('id', testDriver.id);
      expect(response.body.data).toHaveProperty('userId', testUser.id);
    });
  });

  describe('Driver Update', () => {
    it('should update driver information', async () => {
      // Skip if no driver was created
      if (!testDriver) {
        return;
      }

      const updateData = {
        name: 'Updated Integration Driver',
        phoneNumber: '5559876543'
      };

      const response = await request(app)
        .put(`/api/drivers/${testDriver.id}`)
        .set('Authorization', `Bearer ${authToken}`)
        .send(updateData);

      expect(response.status).toBe(200);
      expect(response.body.data).toHaveProperty('name', updateData.name);
      expect(response.body.data).toHaveProperty('phoneNumber', updateData.phoneNumber);
      
      // Update our test driver object
      testDriver = response.body.data;
    });

    it('should update driver score', async () => {
      // Skip if no driver was created
      if (!testDriver) {
        return;
      }

      const scoreData = {
        score: 92
      };

      const response = await request(app)
        .patch(`/api/drivers/${testDriver.id}/score`)
        .set('Authorization', `Bearer ${authToken}`)
        .send(scoreData);

      expect(response.status).toBe(200);
      expect(response.body.data).toHaveProperty('driverScore', scoreData.score);
      
      // Update our test driver object
      testDriver = response.body.data;
    });
  });

  describe('Error Handling', () => {
    it('should return 401 without authentication', async () => {
      const response = await request(app)
        .get('/api/drivers');

      expect(response.status).toBe(401);
    });

    it('should return 404 for non-existent driver', async () => {
      const nonExistentId = '00000000-0000-0000-0000-000000000000';
      
      const response = await request(app)
        .get(`/api/drivers/${nonExistentId}`)
        .set('Authorization', `Bearer ${authToken}`);

      expect(response.status).toBe(404);
    });

    it('should return 400 for invalid driver data', async () => {
      const invalidData = {
        userId: testUser.id,
        name: '', // Empty name
        licenseNumber: 'DL',
        licenseExpiry: 'invalid-date',
        phoneNumber: '123'
      };

      const response = await request(app)
        .post('/api/drivers')
        .set('Authorization', `Bearer ${authToken}`)
        .send(invalidData);

      expect(response.status).toBe(400);
      expect(response.body).toHaveProperty('errors');
    });
  });
});
