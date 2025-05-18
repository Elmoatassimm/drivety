import { api, testContext, TEST_VEHICLE, registerTestUser, loginTestUser } from './test-utils';

describe('Vehicle API Tests', () => {
  // Setup: Register and login a test user before tests
  beforeAll(async () => {
    try {
      await registerTestUser();
      await loginTestUser();
    } catch (error) {
      console.error('Setup failed:', error);
    }
  });
  
  // Test vehicle creation
  describe('POST /api/vehicles', () => {
    it('should create a new vehicle successfully', async () => {
      const response = await api.post('/api/vehicles', TEST_VEHICLE);
      
      expect(response.status).toBe(201);
      expect(response.data.success).toBe(true);
      expect(response.data.data).toHaveProperty('id');
      expect(response.data.data.model).toBe(TEST_VEHICLE.model);
      expect(response.data.data.plateNumber).toBe(TEST_VEHICLE.plateNumber);
      
      // Save vehicle ID for later tests
      testContext.vehicleId = response.data.data.id;
    });
    
    it('should return 400 when creating with invalid data', async () => {
      const response = await api.post('/api/vehicles', {
        model: '', // Empty model
        year: 'invalid-year', // Not a number
        plateNumber: '',
        status: 'INVALID_STATUS',
        fuelType: 'INVALID_FUEL_TYPE'
      });
      
      expect(response.status).toBe(400);
      expect(response.data.success).toBe(false);
    });
    
    it('should return 401 when not authenticated', async () => {
      // Temporarily remove access token
      const savedToken = testContext.accessToken;
      testContext.accessToken = undefined;
      
      const response = await api.post('/api/vehicles', TEST_VEHICLE);
      
      expect(response.status).toBe(401);
      expect(response.data.success).toBe(false);
      
      // Restore access token
      testContext.accessToken = savedToken;
    });
  });
  
  // Test getting vehicle by ID
  describe('GET /api/vehicles/:id', () => {
    it('should get vehicle by ID', async () => {
      // Skip if no vehicle ID is available
      if (!testContext.vehicleId) {
        console.warn('Skipping get vehicle by ID test - no vehicle ID available');
        return;
      }
      
      const response = await api.get(`/api/vehicles/${testContext.vehicleId}`);
      
      expect(response.status).toBe(200);
      expect(response.data.success).toBe(true);
      expect(response.data.data).toHaveProperty('id', testContext.vehicleId);
      expect(response.data.data).toHaveProperty('model', TEST_VEHICLE.model);
    });
    
    it('should return 404 for non-existent vehicle ID', async () => {
      const response = await api.get('/api/vehicles/non-existent-id');
      
      expect(response.status).toBe(404);
      expect(response.data.success).toBe(false);
    });
  });
  
  // Test getting all vehicles
  describe('GET /api/vehicles', () => {
    it('should get all vehicles', async () => {
      const response = await api.get('/api/vehicles');
      
      expect(response.status).toBe(200);
      expect(response.data.success).toBe(true);
      expect(Array.isArray(response.data.data)).toBe(true);
      expect(response.data.data.length).toBeGreaterThan(0);
    });
    
    it('should filter vehicles by status', async () => {
      const response = await api.get('/api/vehicles?status=ACTIVE');
      
      expect(response.status).toBe(200);
      expect(response.data.success).toBe(true);
      expect(Array.isArray(response.data.data)).toBe(true);
      
      // All returned vehicles should have ACTIVE status
      response.data.data.forEach((vehicle: any) => {
        expect(vehicle.status).toBe('ACTIVE');
      });
    });
  });
  
  // Test updating vehicle
  describe('PUT /api/vehicles/:id', () => {
    it('should update vehicle successfully', async () => {
      // Skip if no vehicle ID is available
      if (!testContext.vehicleId) {
        console.warn('Skipping update vehicle test - no vehicle ID available');
        return;
      }
      
      const updatedData = {
        model: 'Updated Vehicle Model',
        fuelLevel: 80.0
      };
      
      const response = await api.put(`/api/vehicles/${testContext.vehicleId}`, updatedData);
      
      expect(response.status).toBe(200);
      expect(response.data.success).toBe(true);
      expect(response.data.data).toHaveProperty('id', testContext.vehicleId);
      expect(response.data.data).toHaveProperty('model', updatedData.model);
      expect(response.data.data).toHaveProperty('fuelLevel', updatedData.fuelLevel);
    });
    
    it('should return 404 for non-existent vehicle ID', async () => {
      const response = await api.put('/api/vehicles/non-existent-id', {
        model: 'Updated Model'
      });
      
      expect(response.status).toBe(404);
      expect(response.data.success).toBe(false);
    });
  });
  
  // Test updating vehicle status
  describe('PATCH /api/vehicles/:id/status', () => {
    it('should update vehicle status successfully', async () => {
      // Skip if no vehicle ID is available
      if (!testContext.vehicleId) {
        console.warn('Skipping update vehicle status test - no vehicle ID available');
        return;
      }
      
      const statusData = {
        status: 'MAINTENANCE'
      };
      
      const response = await api.patch(`/api/vehicles/${testContext.vehicleId}/status`, statusData);
      
      expect(response.status).toBe(200);
      expect(response.data.success).toBe(true);
      expect(response.data.data).toHaveProperty('id', testContext.vehicleId);
      expect(response.data.data).toHaveProperty('status', statusData.status);
    });
    
    it('should return 404 for non-existent vehicle ID', async () => {
      const response = await api.patch('/api/vehicles/non-existent-id/status', {
        status: 'INACTIVE'
      });
      
      expect(response.status).toBe(404);
      expect(response.data.success).toBe(false);
    });
  });
  
  // Test getting vehicle components
  describe('GET /api/vehicles/:id/components', () => {
    it('should get vehicle components', async () => {
      // Skip if no vehicle ID is available
      if (!testContext.vehicleId) {
        console.warn('Skipping get vehicle components test - no vehicle ID available');
        return;
      }
      
      const response = await api.get(`/api/vehicles/${testContext.vehicleId}/components`);
      
      expect(response.status).toBe(200);
      expect(response.data.success).toBe(true);
      expect(Array.isArray(response.data.data)).toBe(true);
    });
    
    it('should return 404 for non-existent vehicle ID', async () => {
      const response = await api.get('/api/vehicles/non-existent-id/components');
      
      expect(response.status).toBe(404);
      expect(response.data.success).toBe(false);
    });
  });
});
