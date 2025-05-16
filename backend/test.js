// Simple test script to test the core functionality of the starter kit
const axios = require('axios');

const API_URL = 'http://localhost:8000/api/v1';

// Test user data
const testUser = {
  username: 'testuser',
  email: 'test@example.com',
  password: 'password123'
};

// Test functions
async function testRegister() {
  try {
    console.log('Testing user registration...');
    const response = await axios.post(`${API_URL}/auth/register`, testUser);
    console.log('Registration successful:', response.data);
    return response.data;
  } catch (error) {
    console.error('Registration failed:', error.response ? error.response.data : error.message);
    return null;
  }
}

async function testLogin() {
  try {
    console.log('Testing user login...');
    const response = await axios.post(`${API_URL}/auth/login`, {
      email: testUser.email,
      password: testUser.password
    });
    console.log('Login successful:', response.data);
    return response.data;
  } catch (error) {
    console.error('Login failed:', error.response ? error.response.data : error.message);
    return null;
  }
}

async function testRefreshToken(refreshToken) {
  try {
    console.log('Testing token refresh...');
    const response = await axios.post(
      `${API_URL}/auth/refresh-token`,
      {},
      {
        headers: {
          'x-refresh-token': refreshToken
        }
      }
    );
    console.log('Token refresh successful:', response.data);
    return response.data;
  } catch (error) {
    console.error('Token refresh failed:', error.response ? error.response.data : error.message);
    return null;
  }
}

async function testLogout(accessToken) {
  try {
    console.log('Testing logout...');
    const response = await axios.post(
      `${API_URL}/auth/logout`,
      {},
      {
        headers: {
          'Authorization': `Bearer ${accessToken}`
        }
      }
    );
    console.log('Logout successful:', response.data);
    return response.data;
  } catch (error) {
    console.error('Logout failed:', error.response ? error.response.data : error.message);
    return null;
  }
}

// Run tests
async function runTests() {
  try {
    // Test registration
    const registerData = await testRegister();
    if (!registerData) {
      console.log('Trying login instead...');
    }
    
    // Test login
    const loginData = await testLogin();
    if (!loginData) {
      console.error('Login failed, cannot continue tests');
      return;
    }
    
    const { accessToken, refreshToken } = loginData.data;
    
    // Test token refresh
    const refreshData = await testRefreshToken(refreshToken);
    
    // Test logout
    const logoutData = await testLogout(accessToken);
    
    console.log('All tests completed!');
  } catch (error) {
    console.error('Error running tests:', error.message);
  }
}

// Run the tests
runTests();
