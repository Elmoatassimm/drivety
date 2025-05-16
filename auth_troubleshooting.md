# Authentication Troubleshooting Guide

This guide will help you troubleshoot common authentication issues when using the Drivety API Postman collection.

## Fixed Issues

### 1. Registration Error: "Failed to register user" - FIXED

```
InternalServerError: Failed to register user
```

**Issue Identified and Fixed:**
- The refresh token was too long for the database column
- We updated the schema to increase the token column length to 500 characters
- Migration was applied to update the database structure

**Solution:**
1. Updated the Prisma schema to specify a longer length for the token column:
   ```prisma
   token     String   @db.VarChar(500)
   ```
2. Applied a migration to update the database structure:
   ```bash
   npx prisma migrate dev --name increase_refresh_token_length
   ```

### 2. Testing Authentication

Now that the issue is fixed, you can test the authentication endpoints:

1. **Register a new user:**
   ```json
   {
     "email": "test@example.com",
     "password": "Password123!",
     "username": "testuser"
   }
   ```

2. **Login with the registered user:**
   ```json
   {
     "email": "test@example.com",
     "password": "Password123!"
   }
   ```

3. **Use the refresh token to get a new access token**
   - Add the refresh token to the `x-refresh-token` header

4. **Logout to invalidate the tokens**
   - Add the access token to the `Authorization` header with the format `Bearer {token}`

### 2. Login Error: "Failed to login"

```
InternalServerError: Failed to login
```

**Identified Issue:**
After analyzing the code, I found that:
- The login error occurs in the `AuthService.login()` method
- The error might be related to how passwords are stored and compared
- The code tries to compare with both `password_hash` and `password` fields

**Solutions:**
1. Make sure you've successfully registered a user first
2. Check that the database is running and accessible
3. Verify the email and password match what you used during registration
4. Check if there's a mismatch between how passwords are stored in the database:
   - The code uses `bcrypt.compare(password, user.password_hash || user.password)`
   - This suggests there might be inconsistency in how passwords are stored
5. Check the database directly to verify the user exists and has the correct password field:
   ```sql
   SELECT * FROM users WHERE email = 'test@example.com';
   ```

### 3. Refresh Token Error: "Invalid refresh token"

```
UnauthorizedError: Invalid refresh token
```

**Identified Issue:**
After analyzing the code, I found that:
- The error occurs in the `JwtUtils.getUserFromRefreshToken()` method
- The refresh token is expected in the `x-refresh-token` header
- The token might be invalid, expired, or not properly formatted
- The error is thrown when JWT verification fails

**Solutions:**
1. Make sure you have successfully logged in first and received a valid refresh token
2. Check that the refresh token is being sent in the `x-refresh-token` header (not in the Authorization header)
3. Verify the refresh token hasn't expired:
   - Refresh tokens are set to expire after 15 days in the code
   - The expiration is stored in the `RefreshToken` table in the database
4. Try logging in again to get a new refresh token
5. Check if the JWT secret keys are properly set in your environment:
   ```
   JWT_SECRET="your-secret-key"
   REFRESH_TOKEN_SECRET="your-refresh-secret"
   ```
6. Verify the refresh token exists in the database:
   ```sql
   SELECT * FROM refresh_tokens WHERE token = 'your-refresh-token';
   ```

## Debugging Steps

### 1. Check Server Logs

Look for detailed error messages in the server logs. The errors you provided show stack traces that can help identify the root cause.

### 2. Verify Database Connection

Make sure your database is running and accessible. The errors suggest there might be issues with database operations.

### 3. Check Request Format

Ensure your requests match the expected format:

- **Register:**
  ```json
  {
    "email": "test@example.com",
    "password": "Password123!",
    "username": "testuser",
    "role": "USER"
  }
  ```

- **Login:**
  ```json
  {
    "email": "test@example.com",
    "password": "Password123!"
  }
  ```

- **Refresh Token:** Make sure the `x-refresh-token` header is set with a valid refresh token

### 4. Check Environment Variables

In Postman, verify that your environment variables are being set correctly:
- After registration, check if `accessToken` and `refreshToken` are set
- After login, check if `accessToken` and `refreshToken` are set
- Before using protected endpoints, make sure `accessToken` is set

### 5. Test with Curl

If Postman is still having issues, try testing with curl to isolate the problem:

```bash
# Register
curl -X POST http://localhost:3000/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{"email":"test@example.com","password":"Password123!","username":"testuser","role":"USER"}'

# Login
curl -X POST http://localhost:3000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"test@example.com","password":"Password123!"}'

# Refresh Token (replace YOUR_REFRESH_TOKEN with the actual token)
curl -X POST http://localhost:3000/api/auth/refresh-token \
  -H "x-refresh-token: YOUR_REFRESH_TOKEN"
```

## Possible Backend Issues

Based on the error messages, there might be issues with:

1. **Database Connection:** Check your database connection string in the `.env` file
2. **Schema Validation:** Make sure the user schema matches what the API expects
3. **JWT Configuration:** Verify that JWT_SECRET and REFRESH_TOKEN_SECRET are properly set
4. **Error Handling:** The errors are being caught but might be originating from deeper issues

## Next Steps

If you continue to experience issues:

1. Check the implementation of `AuthService` in `auth.service.ts`
2. Verify the database schema and migrations
3. Look for any initialization errors in the server logs
4. Consider temporarily modifying the error handling to provide more detailed information
