# Drivety API Postman Collection

This repository contains Postman collection and environment files for testing the Drivety application APIs.

## Files

- `drivety_api_collection.json`: Postman collection with all API endpoints
- `drivety_environment.json`: Postman environment with variables

## Setup Instructions

1. Install [Postman](https://www.postman.com/downloads/)
2. Import the collection and environment files:
   - Click on "Import" in Postman
   - Select both JSON files
3. Select the "Drivety Environment" from the environment dropdown in the top right corner
4. Update the `baseUrl` variable if your API is running on a different URL

## Authentication Flow

The collection includes authentication endpoints that automatically set environment variables:

1. Register a new user using the "Register" endpoint
2. Login with the registered user credentials using the "Login" endpoint
   - This will automatically set the `accessToken` and `refreshToken` variables
3. Use the "Refresh Token" endpoint to get a new access token when it expires
4. Use the "Logout" endpoint to invalidate your tokens

## Testing Endpoints

The collection is organized into folders for each module:

### Auth Endpoints
- Register
- Login
- Refresh Token
- Logout

### User Endpoints
- Get User Profile

### Driver Endpoints
- Create Driver
- Get All Drivers
- Get Driver by ID
- Get Current User Driver
- Update Driver
- Update Driver Score
- Delete Driver

### Vehicle Endpoints
- Create Vehicle
- Get All Vehicles
- Get Vehicle by ID
- Update Vehicle
- Delete Vehicle
- Get Vehicle Components
- Update Vehicle Health Status
- Get Vehicle Maintenance History

### Component Endpoints
- Create Component
- Get All Components
- Get Component by ID
- Update Component
- Delete Component
- Get Component Health Score
- Get Component Maintenance Records
- Trigger Component Alert

## Environment Variables

The collection uses the following environment variables:

- `baseUrl`: Base URL of the API (default: http://localhost:3000)
- `accessToken`: JWT access token (set automatically after login)
- `refreshToken`: JWT refresh token (set automatically after login)
- `userId`: ID of the current user
- `driverId`: ID of a driver (for testing driver endpoints)
- `vehicleId`: ID of a vehicle (for testing vehicle endpoints)
- `componentId`: ID of a component (for testing component endpoints)

## Testing Workflow

1. Register a new user
2. Login to get tokens
3. Create a driver profile
4. Create a vehicle
5. Add components to the vehicle
6. Test other endpoints as needed

## Notes

- All protected endpoints automatically include the Authorization header with the access token
- The collection includes test scripts that automatically set environment variables from responses
- You can use the environment variables in request paths and bodies by using the syntax `{{variableName}}`
