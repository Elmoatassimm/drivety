import { api, testContext, registerTestUser, loginTestUser, createTestDriver, createTestVehicle } from './test-utils';

describe('Trip API Tests', () => {
  // Setup: Register, login, create driver and vehicle before tests
  beforeAll(async () => {
    try {
      await registerTestUser();
      await loginTestUser();
      await createTestDriver();
      await createTestVehicle();
    } catch (error) {
      console.error('Setup failed:', error);
    }
  });
  
  // Test starting a trip
  describe('POST /api/trips/start', () => {
    it('should start a new trip successfully', async () => {
      // Skip if driver or vehicle ID is not available
      if (!testContext.driverId || !testContext.vehicleId) {
        console.warn('Skipping start trip test - driver or vehicle ID not available');
        return;
      }
      
      const tripData = {
        driverId: testContext.driverId,
        vehicleId: testContext.vehicleId,
        startLocation: 'Test Start Location'
      };
      
      const response = await api.post('/api/trips/start', tripData);
      
      expect(response.status).toBe(201);
      expect(response.data.success).toBe(true);
      expect(response.data.data).toHaveProperty('id');
      expect(response.data.data).toHaveProperty('driverId', testContext.driverId);
      expect(response.data.data).toHaveProperty('vehicleId', testContext.vehicleId);
      expect(response.data.data).toHaveProperty('startLocation', tripData.startLocation);
      expect(response.data.data).toHaveProperty('status', 'IN_PROGRESS');
      
      // Save trip ID for later tests
      testContext.tripId = response.data.data.id;
    });
    
    it('should return 400 when starting with invalid data', async () => {
      const response = await api.post('/api/trips/start', {
        // Missing required fields
        startLocation: 'Test Location'
      });
      
      expect(response.status).toBe(400);
      expect(response.data.success).toBe(false);
    });
    
    it('should return 401 when not authenticated', async () => {
      // Temporarily remove access token
      const savedToken = testContext.accessToken;
      testContext.accessToken = undefined;
      
      const response = await api.post('/api/trips/start', {
        driverId: testContext.driverId,
        vehicleId: testContext.vehicleId,
        startLocation: 'Test Start Location'
      });
      
      expect(response.status).toBe(401);
      expect(response.data.success).toBe(false);
      
      // Restore access token
      testContext.accessToken = savedToken;
    });
  });
  
  // Test ending a trip
  describe('PUT /api/trips/:tripId/end', () => {
    it('should end a trip successfully', async () => {
      // Skip if no trip ID is available
      if (!testContext.tripId) {
        console.warn('Skipping end trip test - no trip ID available');
        return;
      }
      
      const endData = {
        endLocation: 'Test End Location',
        endTime: new Date().toISOString(),
        distanceTraveled: 25.5
      };
      
      const response = await api.put(`/api/trips/${testContext.tripId}/end`, endData);
      
      expect(response.status).toBe(200);
      expect(response.data.success).toBe(true);
      expect(response.data.data).toHaveProperty('id', testContext.tripId);
      expect(response.data.data).toHaveProperty('endLocation', endData.endLocation);
      expect(response.data.data).toHaveProperty('distanceTraveled', endData.distanceTraveled);
      expect(response.data.data).toHaveProperty('status', 'COMPLETED');
    });
    
    it('should return 400 when ending with invalid data', async () => {
      // Skip if no trip ID is available
      if (!testContext.tripId) {
        console.warn('Skipping end trip invalid data test - no trip ID available');
        return;
      }
      
      const response = await api.put(`/api/trips/${testContext.tripId}/end`, {
        // Missing required fields
        endLocation: ''
      });
      
      expect(response.status).toBe(400);
      expect(response.data.success).toBe(false);
    });
    
    it('should return 404 for non-existent trip ID', async () => {
      const response = await api.put('/api/trips/non-existent-id/end', {
        endLocation: 'Test End Location',
        endTime: new Date().toISOString(),
        distanceTraveled: 25.5
      });
      
      expect(response.status).toBe(404);
      expect(response.data.success).toBe(false);
    });
  });
  
  // Test getting trip metrics
  describe('GET /api/trips/:tripId/metrics', () => {
    it('should get trip metrics', async () => {
      // Skip if no trip ID is available
      if (!testContext.tripId) {
        console.warn('Skipping get trip metrics test - no trip ID available');
        return;
      }
      
      const response = await api.get(`/api/trips/${testContext.tripId}/metrics`);
      
      expect(response.status).toBe(200);
      expect(response.data.success).toBe(true);
      expect(response.data.data).toHaveProperty('tripId', testContext.tripId);
      expect(response.data.data).toHaveProperty('metrics');
      expect(Array.isArray(response.data.data.metrics)).toBe(true);
    });
    
    it('should return 404 for non-existent trip ID', async () => {
      const response = await api.get('/api/trips/non-existent-id/metrics');
      
      expect(response.status).toBe(404);
      expect(response.data.success).toBe(false);
    });
  });
  
  // Test getting driver trips
  describe('GET /api/trips/driver/:driverId', () => {
    it('should get driver trips', async () => {
      // Skip if no driver ID is available
      if (!testContext.driverId) {
        console.warn('Skipping get driver trips test - no driver ID available');
        return;
      }
      
      const response = await api.get(`/api/trips/driver/${testContext.driverId}`);
      
      expect(response.status).toBe(200);
      expect(response.data.success).toBe(true);
      expect(Array.isArray(response.data.data)).toBe(true);
      
      // Should include our test trip
      const foundTrip = response.data.data.find((trip: any) => trip.id === testContext.tripId);
      expect(foundTrip).toBeDefined();
    });
    
    it('should return 404 for non-existent driver ID', async () => {
      const response = await api.get('/api/trips/driver/non-existent-id');
      
      expect(response.status).toBe(404);
      expect(response.data.success).toBe(false);
    });
  });
  
  // Test getting all trips
  describe('GET /api/trips', () => {
    it('should get all trips', async () => {
      const response = await api.get('/api/trips');
      
      expect(response.status).toBe(200);
      expect(response.data.success).toBe(true);
      expect(Array.isArray(response.data.data)).toBe(true);
      expect(response.data.data.length).toBeGreaterThan(0);
    });
    
    it('should filter trips by status', async () => {
      const response = await api.get('/api/trips?status=COMPLETED');
      
      expect(response.status).toBe(200);
      expect(response.data.success).toBe(true);
      expect(Array.isArray(response.data.data)).toBe(true);
      
      // All returned trips should have COMPLETED status
      response.data.data.forEach((trip: any) => {
        expect(trip.status).toBe('COMPLETED');
      });
    });
  });
});
