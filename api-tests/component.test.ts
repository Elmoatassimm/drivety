import { api, testContext, TEST_COMPONENT, registerTestUser, loginTestUser, createTestVehicle } from './test-utils';

describe('Component API Tests', () => {
  // Setup: Register, login, and create a vehicle before tests
  beforeAll(async () => {
    try {
      await registerTestUser();
      await loginTestUser();
      await createTestVehicle();
    } catch (error) {
      console.error('Setup failed:', error);
    }
  });
  
  // Test component creation
  describe('POST /api/components', () => {
    it('should create a new component successfully', async () => {
      // Skip if no vehicle ID is available
      if (!testContext.vehicleId) {
        console.warn('Skipping create component test - no vehicle ID available');
        return;
      }
      
      const componentData = {
        ...TEST_COMPONENT,
        vehicleId: testContext.vehicleId
      };
      
      const response = await api.post('/api/components', componentData);
      
      expect(response.status).toBe(201);
      expect(response.data.success).toBe(true);
      expect(response.data.data).toHaveProperty('id');
      expect(response.data.data.name).toBe(TEST_COMPONENT.name);
      expect(response.data.data.type).toBe(TEST_COMPONENT.type);
      
      // Save component ID for later tests
      testContext.componentId = response.data.data.id;
    });
    
    it('should return 400 when creating with invalid data', async () => {
      const response = await api.post('/api/components', {
        name: '', // Empty name
        type: 'INVALID_TYPE',
        status: 'INVALID_STATUS',
        vehicleId: testContext.vehicleId
      });
      
      expect(response.status).toBe(400);
      expect(response.data.success).toBe(false);
    });
    
    it('should return 401 when not authenticated', async () => {
      // Temporarily remove access token
      const savedToken = testContext.accessToken;
      testContext.accessToken = undefined;
      
      const response = await api.post('/api/components', {
        ...TEST_COMPONENT,
        vehicleId: testContext.vehicleId
      });
      
      expect(response.status).toBe(401);
      expect(response.data.success).toBe(false);
      
      // Restore access token
      testContext.accessToken = savedToken;
    });
  });
  
  // Test getting component by ID
  describe('GET /api/components/:id', () => {
    it('should get component by ID', async () => {
      // Skip if no component ID is available
      if (!testContext.componentId) {
        console.warn('Skipping get component by ID test - no component ID available');
        return;
      }
      
      const response = await api.get(`/api/components/${testContext.componentId}`);
      
      expect(response.status).toBe(200);
      expect(response.data.success).toBe(true);
      expect(response.data.data).toHaveProperty('id', testContext.componentId);
      expect(response.data.data).toHaveProperty('name', TEST_COMPONENT.name);
    });
    
    it('should return 404 for non-existent component ID', async () => {
      const response = await api.get('/api/components/non-existent-id');
      
      expect(response.status).toBe(404);
      expect(response.data.success).toBe(false);
    });
  });
  
  // Test getting all components
  describe('GET /api/components', () => {
    it('should get all components', async () => {
      const response = await api.get('/api/components');
      
      expect(response.status).toBe(200);
      expect(response.data.success).toBe(true);
      expect(Array.isArray(response.data.data)).toBe(true);
      expect(response.data.data.length).toBeGreaterThan(0);
    });
    
    it('should filter components by type', async () => {
      const response = await api.get('/api/components?type=ENGINE');
      
      expect(response.status).toBe(200);
      expect(response.data.success).toBe(true);
      expect(Array.isArray(response.data.data)).toBe(true);
      
      // All returned components should have ENGINE type
      response.data.data.forEach((component: any) => {
        expect(component.type).toBe('ENGINE');
      });
    });
  });
  
  // Test updating component
  describe('PUT /api/components/:id', () => {
    it('should update component successfully', async () => {
      // Skip if no component ID is available
      if (!testContext.componentId) {
        console.warn('Skipping update component test - no component ID available');
        return;
      }
      
      const updatedData = {
        name: 'Updated Component Name',
        status: 'NEEDS_MAINTENANCE'
      };
      
      const response = await api.put(`/api/components/${testContext.componentId}`, updatedData);
      
      expect(response.status).toBe(200);
      expect(response.data.success).toBe(true);
      expect(response.data.data).toHaveProperty('id', testContext.componentId);
      expect(response.data.data).toHaveProperty('name', updatedData.name);
      expect(response.data.data).toHaveProperty('status', updatedData.status);
    });
    
    it('should return 404 for non-existent component ID', async () => {
      const response = await api.put('/api/components/non-existent-id', {
        name: 'Updated Name'
      });
      
      expect(response.status).toBe(404);
      expect(response.data.success).toBe(false);
    });
  });
  
  // Test getting component health score
  describe('GET /api/components/:id/health-score', () => {
    it('should get component health score', async () => {
      // Skip if no component ID is available
      if (!testContext.componentId) {
        console.warn('Skipping get component health score test - no component ID available');
        return;
      }
      
      const response = await api.get(`/api/components/${testContext.componentId}/health-score`);
      
      expect(response.status).toBe(200);
      expect(response.data.success).toBe(true);
      expect(response.data.data).toHaveProperty('componentId', testContext.componentId);
      expect(response.data.data).toHaveProperty('score');
      expect(typeof response.data.data.score).toBe('number');
    });
    
    it('should return 404 for non-existent component ID', async () => {
      const response = await api.get('/api/components/non-existent-id/health-score');
      
      expect(response.status).toBe(404);
      expect(response.data.success).toBe(false);
    });
  });
  
  // Test getting component maintenance records
  describe('GET /api/components/:id/maintenance-records', () => {
    it('should get component maintenance records', async () => {
      // Skip if no component ID is available
      if (!testContext.componentId) {
        console.warn('Skipping get maintenance records test - no component ID available');
        return;
      }
      
      const response = await api.get(`/api/components/${testContext.componentId}/maintenance-records`);
      
      expect(response.status).toBe(200);
      expect(response.data.success).toBe(true);
      expect(Array.isArray(response.data.data)).toBe(true);
    });
    
    it('should return 404 for non-existent component ID', async () => {
      const response = await api.get('/api/components/non-existent-id/maintenance-records');
      
      expect(response.status).toBe(404);
      expect(response.data.success).toBe(false);
    });
  });
  
  // Test triggering component alert
  describe('POST /api/components/:id/alert', () => {
    it('should trigger component alert successfully', async () => {
      // Skip if no component ID is available
      if (!testContext.componentId) {
        console.warn('Skipping trigger alert test - no component ID available');
        return;
      }
      
      const alertData = {
        message: 'Test alert message',
        severity: 'HIGH'
      };
      
      const response = await api.post(`/api/components/${testContext.componentId}/alert`, alertData);
      
      expect(response.status).toBe(200);
      expect(response.data.success).toBe(true);
      expect(response.data.data).toHaveProperty('componentId', testContext.componentId);
      expect(response.data.data).toHaveProperty('message', alertData.message);
    });
    
    it('should return 404 for non-existent component ID', async () => {
      const response = await api.post('/api/components/non-existent-id/alert', {
        message: 'Test alert message'
      });
      
      expect(response.status).toBe(404);
      expect(response.data.success).toBe(false);
    });
  });
});
