#!/bin/bash

# Run driver API tests
echo "Running Driver API tests..."
npx jest --config=jest.config.js src/tests/integration/driver-api.test.ts --verbose
