import axios, { AxiosInstance, InternalAxiosRequestConfig } from 'axios';
import * as fs from 'fs';
import * as path from 'path';

// Base URL for the API
const BASE_URL = 'http://localhost:8005';

// Test data
export const TEST_USER = {
  email: `test-user-${Date.now()}@example.com`,
  password: 'Password123!',
  username: `testuser${Date.now()}`
};

export const TEST_DRIVER = {
  name: 'Test Driver',
  licenseNumber: `DL-${Date.now()}`,
  licenseExpiry: new Date(Date.now() + 365 * 24 * 60 * 60 * 1000).toISOString(), // 1 year from now
  phoneNumber: '5551234567'
};

export const TEST_VEHICLE = {
  model: 'Test Model',
  year: 2023,
  plateNumber: `TEST-${Date.now()}`,
  status: 'ACTIVE',
  fuelType: 'GASOLINE',
  fuelLevel: 75.5,
  insuranceExpiry: new Date(Date.now() + 365 * 24 * 60 * 60 * 1000).toISOString() // 1 year from now
};

export const TEST_COMPONENT = {
  name: 'Test Component',
  type: 'ENGINE',
  status: 'OPERATIONAL',
  installationDate: new Date().toISOString(),
  lastMaintenanceDate: new Date().toISOString()
};

// Store tokens and IDs
export interface TestContext {
  accessToken?: string;
  refreshToken?: string;
  userId?: string;
  driverId?: string;
  vehicleId?: string;
  componentId?: string;
  tripId?: string;
}

// Create a test context to share data between tests
export const testContext: TestContext = {};

// Create an axios instance for API requests
export const api = axios.create({
  baseURL: BASE_URL,
  validateStatus: () => true // Don't throw on error status codes
});

// Add auth token to requests when available
api.interceptors.request.use((config: InternalAxiosRequestConfig) => {
  if (testContext.accessToken && config.headers) {
    config.headers.Authorization = `Bearer ${testContext.accessToken}`;
  }
  return config;
});

// Helper to register a test user
export async function registerTestUser(): Promise<void> {
  const response = await api.post('/api/auth/register', TEST_USER);

  if (response.status !== 201) {
    console.error('Failed to register test user:', response.data);
    throw new Error(`Failed to register test user: ${response.status}`);
  }

  testContext.userId = response.data.data.user.id;
  console.log(`Test user registered with ID: ${testContext.userId}`);
}

// Helper to login and get tokens
export async function loginTestUser(): Promise<void> {
  const response = await api.post('/api/auth/login', {
    email: TEST_USER.email,
    password: TEST_USER.password
  });

  if (response.status !== 200) {
    console.error('Failed to login test user:', response.data);
    throw new Error(`Failed to login test user: ${response.status}`);
  }

  testContext.accessToken = response.data.data.accessToken;
  testContext.refreshToken = response.data.data.refreshToken;

  // Update the Authorization header for all future requests
  api.defaults.headers.common['Authorization'] = `Bearer ${testContext.accessToken}`;

  console.log('Test user logged in successfully');
}

// Helper to create a test driver
export async function createTestDriver(): Promise<void> {
  const response = await api.post('/api/drivers', {
    ...TEST_DRIVER,
    userId: testContext.userId
  });

  if (response.status !== 201) {
    console.error('Failed to create test driver:', response.data);
    throw new Error(`Failed to create test driver: ${response.status}`);
  }

  testContext.driverId = response.data.data.id;
  console.log(`Test driver created with ID: ${testContext.driverId}`);
}

// Helper to create a test vehicle
export async function createTestVehicle(): Promise<void> {
  const response = await api.post('/api/vehicles', TEST_VEHICLE);

  if (response.status !== 201) {
    console.error('Failed to create test vehicle:', response.data);
    throw new Error(`Failed to create test vehicle: ${response.status}`);
  }

  testContext.vehicleId = response.data.data.id;
  console.log(`Test vehicle created with ID: ${testContext.vehicleId}`);
}

// Helper to create a test component
export async function createTestComponent(): Promise<void> {
  const response = await api.post('/api/components', {
    ...TEST_COMPONENT,
    vehicleId: testContext.vehicleId
  });

  if (response.status !== 201) {
    console.error('Failed to create test component:', response.data);
    throw new Error(`Failed to create test component: ${response.status}`);
  }

  testContext.componentId = response.data.data.id;
  console.log(`Test component created with ID: ${testContext.componentId}`);
}

// Helper to start a test trip
export async function startTestTrip(): Promise<void> {
  const response = await api.post('/api/trips/start', {
    driverId: testContext.driverId,
    vehicleId: testContext.vehicleId,
    startLocation: 'Test Start Location'
  });

  if (response.status !== 201) {
    console.error('Failed to start test trip:', response.data);
    throw new Error(`Failed to start test trip: ${response.status}`);
  }

  testContext.tripId = response.data.data.id;
  console.log(`Test trip started with ID: ${testContext.tripId}`);
}

// Helper to clean up test data
export async function cleanupTestData(): Promise<void> {
  try {
    // Clean up in reverse order of creation to avoid foreign key constraints
    if (testContext.tripId) {
      await api.delete(`/api/trips/${testContext.tripId}`);
      console.log(`Deleted test trip: ${testContext.tripId}`);
    }

    if (testContext.componentId) {
      await api.delete(`/api/components/${testContext.componentId}`);
      console.log(`Deleted test component: ${testContext.componentId}`);
    }

    if (testContext.vehicleId) {
      await api.delete(`/api/vehicles/${testContext.vehicleId}`);
      console.log(`Deleted test vehicle: ${testContext.vehicleId}`);
    }

    if (testContext.driverId) {
      await api.delete(`/api/drivers/${testContext.driverId}`);
      console.log(`Deleted test driver: ${testContext.driverId}`);
    }

    if (testContext.userId) {
      await api.delete(`/api/users/${testContext.userId}`);
      console.log(`Deleted test user: ${testContext.userId}`);
    }
  } catch (error) {
    console.error('Error during cleanup:', error);
  }
}
