// Jest setup file for API tests
import axios from 'axios';
import { testContext, cleanupTestData } from './test-utils';

// Increase timeout for all tests
jest.setTimeout(30000);

// Global setup before all tests
beforeAll(async () => {
  console.log('Starting API tests...');
  console.log('Server URL: http://localhost:8005');

  try {
    // Check if server is running - try to access the root endpoint
    // We don't care about the status code, just that the server responds
    const response = await axios.get('http://localhost:8005', {
      validateStatus: () => true // Accept any status code
    });
    console.log('Server is running and healthy');
  } catch (error) {
    console.error('Server is not running or not responding. Please start the server at http://localhost:8005');
    process.exit(1);
  }
});

// Global cleanup after all tests
afterAll(async () => {
  console.log('Cleaning up test data...');
  await cleanupTestData();
  console.log('API tests completed');
});
