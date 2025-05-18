import { api, testContext, TEST_DRIVER, registerTestUser, loginTestUser } from './test-utils';

describe('Driver API Tests', () => {
  // Setup: Register and login a test user before tests
  beforeAll(async () => {
    try {
      await registerTestUser();
      await loginTestUser();
    } catch (error) {
      console.error('Setup failed:', error);
    }
  });
  
  // Test driver creation
  describe('POST /api/drivers', () => {
    it('should create a new driver successfully', async () => {
      const driverData = {
        ...TEST_DRIVER,
        userId: testContext.userId
      };
      
      const response = await api.post('/api/drivers', driverData);
      
      expect(response.status).toBe(201);
      expect(response.data.success).toBe(true);
      expect(response.data.data).toHaveProperty('id');
      expect(response.data.data.name).toBe(TEST_DRIVER.name);
      expect(response.data.data.licenseNumber).toBe(TEST_DRIVER.licenseNumber);
      
      // Save driver ID for later tests
      testContext.driverId = response.data.data.id;
    });
    
    it('should return 400 when creating with invalid data', async () => {
      const response = await api.post('/api/drivers', {
        name: '', // Empty name
        licenseNumber: '',
        licenseExpiry: 'invalid-date',
        phoneNumber: '123' // Invalid phone number
      });
      
      expect(response.status).toBe(400);
      expect(response.data.success).toBe(false);
    });
    
    it('should return 401 when not authenticated', async () => {
      // Temporarily remove access token
      const savedToken = testContext.accessToken;
      testContext.accessToken = undefined;
      
      const response = await api.post('/api/drivers', TEST_DRIVER);
      
      expect(response.status).toBe(401);
      expect(response.data.success).toBe(false);
      
      // Restore access token
      testContext.accessToken = savedToken;
    });
  });
  
  // Test getting current user's driver
  describe('GET /api/drivers/me', () => {
    it('should get current user driver', async () => {
      const response = await api.get('/api/drivers/me');
      
      expect(response.status).toBe(200);
      expect(response.data.success).toBe(true);
      expect(response.data.data).toHaveProperty('id', testContext.driverId);
      expect(response.data.data).toHaveProperty('name', TEST_DRIVER.name);
    });
    
    it('should return 401 when not authenticated', async () => {
      // Temporarily remove access token
      const savedToken = testContext.accessToken;
      testContext.accessToken = undefined;
      
      const response = await api.get('/api/drivers/me');
      
      expect(response.status).toBe(401);
      expect(response.data.success).toBe(false);
      
      // Restore access token
      testContext.accessToken = savedToken;
    });
  });
  
  // Test getting driver by ID
  describe('GET /api/drivers/:id', () => {
    it('should get driver by ID', async () => {
      // Skip if no driver ID is available
      if (!testContext.driverId) {
        console.warn('Skipping get driver by ID test - no driver ID available');
        return;
      }
      
      const response = await api.get(`/api/drivers/${testContext.driverId}`);
      
      expect(response.status).toBe(200);
      expect(response.data.success).toBe(true);
      expect(response.data.data).toHaveProperty('id', testContext.driverId);
      expect(response.data.data).toHaveProperty('name', TEST_DRIVER.name);
    });
    
    it('should return 404 for non-existent driver ID', async () => {
      const response = await api.get('/api/drivers/non-existent-id');
      
      expect(response.status).toBe(404);
      expect(response.data.success).toBe(false);
    });
  });
  
  // Test getting driver by user ID
  describe('GET /api/drivers/user/:userId', () => {
    it('should get driver by user ID', async () => {
      // Skip if no user ID is available
      if (!testContext.userId) {
        console.warn('Skipping get driver by user ID test - no user ID available');
        return;
      }
      
      const response = await api.get(`/api/drivers/user/${testContext.userId}`);
      
      expect(response.status).toBe(200);
      expect(response.data.success).toBe(true);
      expect(response.data.data).toHaveProperty('id', testContext.driverId);
      expect(response.data.data).toHaveProperty('name', TEST_DRIVER.name);
    });
    
    it('should return 404 for non-existent user ID', async () => {
      const response = await api.get('/api/drivers/user/non-existent-id');
      
      expect(response.status).toBe(404);
      expect(response.data.success).toBe(false);
    });
  });
  
  // Test getting all drivers
  describe('GET /api/drivers', () => {
    it('should get all drivers', async () => {
      const response = await api.get('/api/drivers');
      
      expect(response.status).toBe(200);
      expect(response.data.success).toBe(true);
      expect(Array.isArray(response.data.data)).toBe(true);
      expect(response.data.data.length).toBeGreaterThan(0);
    });
  });
  
  // Test updating driver
  describe('PUT /api/drivers/:id', () => {
    it('should update driver successfully', async () => {
      // Skip if no driver ID is available
      if (!testContext.driverId) {
        console.warn('Skipping update driver test - no driver ID available');
        return;
      }
      
      const updatedData = {
        name: 'Updated Driver Name',
        phoneNumber: '5559876543'
      };
      
      const response = await api.put(`/api/drivers/${testContext.driverId}`, updatedData);
      
      expect(response.status).toBe(200);
      expect(response.data.success).toBe(true);
      expect(response.data.data).toHaveProperty('id', testContext.driverId);
      expect(response.data.data).toHaveProperty('name', updatedData.name);
      expect(response.data.data).toHaveProperty('phoneNumber', updatedData.phoneNumber);
    });
    
    it('should return 404 for non-existent driver ID', async () => {
      const response = await api.put('/api/drivers/non-existent-id', {
        name: 'Updated Name'
      });
      
      expect(response.status).toBe(404);
      expect(response.data.success).toBe(false);
    });
  });
  
  // Test updating driver score
  describe('PATCH /api/drivers/:id/score', () => {
    it('should update driver score successfully', async () => {
      // Skip if no driver ID is available
      if (!testContext.driverId) {
        console.warn('Skipping update driver score test - no driver ID available');
        return;
      }
      
      const scoreData = {
        driverScore: 85
      };
      
      const response = await api.patch(`/api/drivers/${testContext.driverId}/score`, scoreData);
      
      expect(response.status).toBe(200);
      expect(response.data.success).toBe(true);
      expect(response.data.data).toHaveProperty('id', testContext.driverId);
      expect(response.data.data).toHaveProperty('driverScore', scoreData.driverScore);
    });
    
    it('should return 404 for non-existent driver ID', async () => {
      const response = await api.patch('/api/drivers/non-existent-id/score', {
        driverScore: 90
      });
      
      expect(response.status).toBe(404);
      expect(response.data.success).toBe(false);
    });
  });
});
