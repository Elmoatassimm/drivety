#!/bin/bash

# Check if server is running
echo "Checking if server is running at http://localhost:8005..."
# We don't care about the HTTP status code, just that the server responds
curl -s -o /dev/null -w "%{http_code}" http://localhost:8005 > /dev/null
if [ $? -ne 0 ]; then
  echo "Error: Server is not running at http://localhost:8005"
  echo "Please start the server before running the tests"
  exit 1
fi
echo "Server is running!"

# Install dependencies if needed
if [ ! -d "node_modules" ]; then
  echo "Installing dependencies..."
  npm install axios jest ts-jest @types/jest typescript
fi

# Run all API tests
echo "Running API tests..."
npx jest --config=jest.config.js *.test.ts --verbose

# Exit with the Jest exit code
exit $?
