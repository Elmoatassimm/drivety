import { api, testContext } from './test-utils';

describe('User API Tests', () => {
  // Generate a unique email for this test run to avoid conflicts
  const uniqueEmail = `test-user-${Date.now()}@example.com`;
  const uniqueUsername = `testuser${Date.now()}`;
  const testPassword = 'Password123!';

  // Setup: Register and login a test user before all tests
  beforeAll(async () => {
    try {
      // Register a new user
      const registerResponse = await api.post('/api/auth/register', {
        email: uniqueEmail,
        password: testPassword,
        username: uniqueUsername
      });

      if (registerResponse.status !== 201) {
        throw new Error(`Failed to register test user: ${registerResponse.status}`);
      }

      testContext.userId = registerResponse.data.data.user.id;

      // Login with the new user
      const loginResponse = await api.post('/api/auth/login', {
        email: uniqueEmail,
        password: testPassword
      });

      if (loginResponse.status !== 200) {
        throw new Error(`Failed to login test user: ${loginResponse.status}`);
      }

      testContext.accessToken = loginResponse.data.data.accessToken;
      testContext.refreshToken = loginResponse.data.data.refreshToken;

      // Set the authorization header for future requests
      api.defaults.headers.common['Authorization'] = `Bearer ${testContext.accessToken}`;

      console.log('Test user setup completed successfully');
    } catch (error) {
      console.error('Setup failed:', error);
    }
  });

  // Test getting user profile
  describe('GET /api/users/profile', () => {
    it('should get current user profile', async () => {
      const response = await api.get('/api/users/profile');

      expect(response.status).toBe(200);
      expect(response.data.success).toBe(true);
      expect(response.data.data).toHaveProperty('id');
      expect(response.data.data).toHaveProperty('email');
    });

    it('should return 401 when not authenticated', async () => {
      // Temporarily remove access token from headers
      const savedAuthHeader = api.defaults.headers.common['Authorization'];
      delete api.defaults.headers.common['Authorization'];

      const response = await api.get('/api/users/profile');

      expect(response.status).toBe(401);
      expect(response.data.success).toBe(false);

      // Restore access token
      api.defaults.headers.common['Authorization'] = savedAuthHeader;
    });
  });

  // Test getting user profile by ID
  describe('GET /api/users/profile/:id', () => {
    it('should get user profile by ID', async () => {
      // Skip if no user ID is available
      if (!testContext.userId) {
        console.warn('Skipping get profile by ID test - no user ID available');
        return;
      }

      const response = await api.get(`/api/users/profile/${testContext.userId}`);

      expect(response.status).toBe(200);
      expect(response.data.success).toBe(true);
      expect(response.data.data).toHaveProperty('id', testContext.userId);
      expect(response.data.data).toHaveProperty('email');
    });

    it('should return 404 for non-existent user ID', async () => {
      const nonExistentId = '00000000-0000-0000-0000-000000000000';
      const response = await api.get(`/api/users/profile/${nonExistentId}`);

      expect(response.status).toBe(404);
      expect(response.data.success).toBe(false);
    });

    it('should return 401 when not authenticated', async () => {
      // Temporarily remove access token from headers
      const savedAuthHeader = api.defaults.headers.common['Authorization'];
      delete api.defaults.headers.common['Authorization'];

      const response = await api.get(`/api/users/profile/${testContext.userId}`);

      expect(response.status).toBe(401);
      expect(response.data.success).toBe(false);

      // Restore access token
      api.defaults.headers.common['Authorization'] = savedAuthHeader;
    });
  });
});
