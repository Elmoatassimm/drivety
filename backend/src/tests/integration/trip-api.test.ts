import request from 'supertest';
import app from '../../app';
import { 
  createTestUser, 
  createTestDriver, 
  createTestVehicle,
  createTestTrip,
  createTestTripMetrics,
  generateAuthToken, 
  cleanupTestData, 
  closeTestDbConnection 
} from '../helpers/trip-test-utils';
import { User, Driver, Vehicle, Trip } from '@prisma/client';

describe('Trip API Integration Tests', () => {
  let testUser: User;
  let testDriver: Driver;
  let testVehicle: Vehicle;
  let testTrip: Trip;
  let authToken: string;

  beforeAll(async () => {
    // Create test user
    testUser = await createTestUser();
    
    // Create test driver
    testDriver = await createTestDriver(testUser.id);
    
    // Create test vehicle
    testVehicle = await createTestVehicle();
    
    // Generate auth token
    authToken = generateAuthToken(testUser.id, testUser.email);
  });

  afterAll(async () => {
    // Clean up test data
    await cleanupTestData(testUser.id, testDriver?.id, testVehicle?.id, testTrip?.id);
    
    // Close database connection
    await closeTestDbConnection();
  });

  describe('POST /api/trips/start', () => {
    it('should start a new trip', async () => {
      const tripData = {
        driverId: testDriver.id,
        vehicleId: testVehicle.id,
        startLocation: 'Test Start Location'
      };

      const response = await request(app)
        .post('/api/trips/start')
        .set('Authorization', `Bearer ${authToken}`)
        .send(tripData);

      expect(response.status).toBe(201);
      expect(response.body.success).toBe(true);
      expect(response.body.data).toHaveProperty('id');
      expect(response.body.data.driverId).toBe(testDriver.id);
      expect(response.body.data.vehicleId).toBe(testVehicle.id);
      expect(response.body.data.startLocation).toBe('Test Start Location');
      expect(response.body.data.status).toBe('IN_PROGRESS');

      // Save the trip ID for later tests
      testTrip = response.body.data;
    });

    it('should return 400 if required fields are missing', async () => {
      const invalidTripData = {
        // Missing driverId
        vehicleId: testVehicle.id,
        startLocation: 'Test Start Location'
      };

      const response = await request(app)
        .post('/api/trips/start')
        .set('Authorization', `Bearer ${authToken}`)
        .send(invalidTripData);

      expect(response.status).toBe(400);
      expect(response.body.success).toBe(false);
    });
  });

  describe('PUT /api/trips/:tripId/end', () => {
    it('should end an existing trip', async () => {
      const endTripData = {
        endLocation: 'Test End Location'
      };

      const response = await request(app)
        .put(`/api/trips/${testTrip.id}/end`)
        .set('Authorization', `Bearer ${authToken}`)
        .send(endTripData);

      expect(response.status).toBe(200);
      expect(response.body.success).toBe(true);
      expect(response.body.data.id).toBe(testTrip.id);
      expect(response.body.data.endLocation).toBe('Test End Location');
      expect(response.body.data.status).toBe('COMPLETED');
      expect(response.body.data).toHaveProperty('endTime');
    });

    it('should return 404 if trip does not exist', async () => {
      const endTripData = {
        endLocation: 'Test End Location'
      };

      const response = await request(app)
        .put('/api/trips/non-existent-id/end')
        .set('Authorization', `Bearer ${authToken}`)
        .send(endTripData);

      expect(response.status).toBe(404);
      expect(response.body.success).toBe(false);
    });
  });

  describe('GET /api/trips/driver/:driverId', () => {
    it('should get all trips for a driver', async () => {
      const response = await request(app)
        .get(`/api/trips/driver/${testDriver.id}`)
        .set('Authorization', `Bearer ${authToken}`);

      expect(response.status).toBe(200);
      expect(response.body.success).toBe(true);
      expect(Array.isArray(response.body.data)).toBe(true);
      expect(response.body.data.length).toBeGreaterThan(0);
      expect(response.body.data[0].driverId).toBe(testDriver.id);
    });

    it('should return 404 if driver does not exist', async () => {
      const response = await request(app)
        .get('/api/trips/driver/non-existent-id')
        .set('Authorization', `Bearer ${authToken}`);

      expect(response.status).toBe(404);
      expect(response.body.success).toBe(false);
    });
  });

  describe('GET /api/trips/:tripId/metrics', () => {
    let tripWithMetrics: Trip;
    
    beforeAll(async () => {
      // Create a new trip with metrics
      const newTrip = await createTestTrip(testDriver.id, testVehicle.id);
      await createTestTripMetrics(newTrip.id, 3);
      tripWithMetrics = newTrip;
    });
    
    afterAll(async () => {
      // Clean up the test trip
      await cleanupTestData(undefined, undefined, undefined, tripWithMetrics.id);
    });
    
    it('should get metrics for a trip', async () => {
      const response = await request(app)
        .get(`/api/trips/${tripWithMetrics.id}/metrics`)
        .set('Authorization', `Bearer ${authToken}`);

      expect(response.status).toBe(200);
      expect(response.body.success).toBe(true);
      expect(Array.isArray(response.body.data)).toBe(true);
      expect(response.body.data.length).toBe(3);
      expect(response.body.data[0].tripId).toBe(tripWithMetrics.id);
    });

    it('should return 404 if trip does not exist', async () => {
      const response = await request(app)
        .get('/api/trips/non-existent-id/metrics')
        .set('Authorization', `Bearer ${authToken}`);

      expect(response.status).toBe(404);
      expect(response.body.success).toBe(false);
    });
  });
});
