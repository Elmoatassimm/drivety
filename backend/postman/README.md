# Postman Collections for Backend Starter Kit

This directory contains Postman collections for testing the API endpoints of the Backend Starter Kit.

## Getting Started

1. Import the collections into Postman:
   - `tests-module-tests.json` - For testing the Tests module
   - `blogs-module-tests.json` - For testing the Blogs module (if implemented)

2. Import the environment:
   - `environment.json` - Contains variables used across collections

## Collections

### Tests Module Collection

This collection tests all the functionality of the Tests module:

1. **Auth (Setup)**: Registration and login endpoints to obtain authentication tokens
   - Register User
   - Login User

2. **Tests CRUD**: Core CRUD operations for Tests
   - Create Test
   - Create Test (Invalid Data)
   - Get All Tests
   - Get Tests By Status
   - Get Test By ID
   - Activate Test
   - Update Test
   - Delete Test

3. **Error Handling**: Tests for error handling and edge cases
   - Get Non-existent Test
   - Access Without Auth
   - Invalid Status Filter

## Running the Tests

1. Start the backend server:
   ```
   cd backend
   npm start
   ```

2. In Postman, select the "Backend Starter Kit - Local" environment.

3. Run the collections in order:
   - First run the "Auth (Setup)" folder to get authentication tokens
   - Then run the other folders

## Variables

The collection uses the following Postman variables:

- `baseUrl`: Base URL for API requests
- `authToken`: Access token for authentication
- `refreshToken`: Refresh token for auth renewal
- `testId`: ID of the test created during test execution

These variables are automatically set during test execution. 