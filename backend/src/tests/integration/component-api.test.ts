import request from 'supertest';
import app from '../../app';
import { 
  createTestUser, 
  createTestDriver, 
  generateAuthToken, 
  cleanupTestData, 
  closeDbConnection 
} from '../helpers/test-utils';
import { User, Driver, PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

describe('Component API Integration Tests', () => {
  let testUser: User;
  let testDriver: Driver;
  let testVehicleId: string;
  let testComponentId: string;
  let authToken: string;

  // Helper function to create a test vehicle
  async function createTestVehicle() {
    return prisma.vehicle.create({
      data: {
        make: 'Test Make',
        model: 'Test Model',
        year: 2023,
        plateNumber: `TEST-${Date.now()}`,
        vin: `VIN${Date.now()}`,
        status: 'GOOD'
      }
    });
  }

  // Helper function to delete a test vehicle
  async function deleteTestVehicle(vehicleId: string) {
    await prisma.vehicle.delete({
      where: { id: vehicleId }
    }).catch(() => {});
  }

  // Helper function to delete a test component
  async function deleteTestComponent(componentId: string) {
    await prisma.component.delete({
      where: { id: componentId }
    }).catch(() => {});
  }

  beforeAll(async () => {
    // Create test user
    testUser = await createTestUser();
    
    // Generate auth token
    authToken = generateAuthToken(testUser.id, testUser.email);

    // Create a test vehicle
    const vehicle = await createTestVehicle();
    testVehicleId = vehicle.id;
  });

  afterAll(async () => {
    // Clean up test data
    if (testComponentId) {
      await deleteTestComponent(testComponentId);
    }
    
    if (testVehicleId) {
      await deleteTestVehicle(testVehicleId);
    }
    
    await cleanupTestData(testUser.id, testDriver?.id);
    
    // Close database connection
    await closeDbConnection();
  });

  describe('Component Creation', () => {
    it('should create a new component successfully', async () => {
      const componentData = {
        vehicleId: testVehicleId,
        name: 'Test Component',
        componentType: 'ENGINE',
        healthScore: 85,
        manufacturer: 'Test Manufacturer',
        serialNumber: `SN-${Date.now()}`
      };

      const response = await request(app)
        .post('/api/components')
        .set('Authorization', `Bearer ${authToken}`)
        .send(componentData);

      expect(response.status).toBe(201);
      expect(response.body.data).toHaveProperty('id');
      expect(response.body.data.name).toBe(componentData.name);
      expect(response.body.data.healthScore).toBe(componentData.healthScore);
      expect(response.body.data.vehicleId).toBe(testVehicleId);
      
      // Save the created component for later tests
      testComponentId = response.body.data.id;
    });

    it('should return 400 for invalid component data', async () => {
      const invalidData = {
        // Missing vehicleId
        name: 'Invalid Component',
        componentType: 'ENGINE',
        healthScore: 150, // Invalid health score (over 100)
      };

      const response = await request(app)
        .post('/api/components')
        .set('Authorization', `Bearer ${authToken}`)
        .send(invalidData);

      expect(response.status).toBe(400);
      expect(response.body).toHaveProperty('errors');
    });
  });

  describe('Component Retrieval', () => {
    it('should get a component by ID', async () => {
      // Skip if no component was created
      if (!testComponentId) {
        return;
      }

      const response = await request(app)
        .get(`/api/components/${testComponentId}`)
        .set('Authorization', `Bearer ${authToken}`);

      expect(response.status).toBe(200);
      expect(response.body.data).toHaveProperty('id', testComponentId);
      expect(response.body.data.name).toBe('Test Component');
    });

    it('should get all components', async () => {
      const response = await request(app)
        .get('/api/components')
        .set('Authorization', `Bearer ${authToken}`);

      expect(response.status).toBe(200);
      expect(Array.isArray(response.body.data)).toBe(true);
      
      // Should include our test component
      if (testComponentId) {
        const foundComponent = response.body.data.find((c: any) => c.id === testComponentId);
        expect(foundComponent).toBeTruthy();
      }
    });

    it('should get component health score', async () => {
      // Skip if no component was created
      if (!testComponentId) {
        return;
      }

      const response = await request(app)
        .get(`/api/components/${testComponentId}/health-score`)
        .set('Authorization', `Bearer ${authToken}`);

      expect(response.status).toBe(200);
      expect(response.body.data).toHaveProperty('id', testComponentId);
      expect(response.body.data).toHaveProperty('healthScore', 85);
    });
  });

  describe('Component Update', () => {
    it('should update component information', async () => {
      // Skip if no component was created
      if (!testComponentId) {
        return;
      }

      const updateData = {
        name: 'Updated Component Name',
        healthScore: 90,
        notes: 'Updated component notes'
      };

      const response = await request(app)
        .put(`/api/components/${testComponentId}`)
        .set('Authorization', `Bearer ${authToken}`)
        .send(updateData);

      expect(response.status).toBe(200);
      expect(response.body.data).toHaveProperty('name', updateData.name);
      expect(response.body.data).toHaveProperty('healthScore', updateData.healthScore);
      expect(response.body.data).toHaveProperty('notes', updateData.notes);
    });
  });

  describe('Component Alert', () => {
    it('should trigger an alert for a component', async () => {
      // Skip if no component was created
      if (!testComponentId) {
        return;
      }

      const alertData = {
        message: 'Component needs immediate attention'
      };

      const response = await request(app)
        .post(`/api/components/${testComponentId}/alert`)
        .set('Authorization', `Bearer ${authToken}`)
        .send(alertData);

      expect(response.status).toBe(200);
      expect(response.body.data).toHaveProperty('componentId', testComponentId);
      expect(response.body.data).toHaveProperty('message', alertData.message);
      expect(response.body.data).toHaveProperty('type', 'COMPONENT_ISSUE');
    });
  });

  describe('Error Handling', () => {
    it('should return 401 without authentication', async () => {
      const response = await request(app)
        .get('/api/components');

      expect(response.status).toBe(401);
    });

    it('should return 404 for non-existent component', async () => {
      const nonExistentId = '00000000-0000-0000-0000-000000000000';
      
      const response = await request(app)
        .get(`/api/components/${nonExistentId}`)
        .set('Authorization', `Bearer ${authToken}`);

      expect(response.status).toBe(404);
    });
  });
});
