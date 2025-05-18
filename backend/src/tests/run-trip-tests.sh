#!/bin/bash

# Run trip module tests
echo "Running Trip Repository tests..."
npx jest --config=jest.config.js src/modules/trip/__tests__/trip.repository.test.ts --verbose

echo "Running Trip Service tests..."
npx jest --config=jest.config.js src/modules/trip/__tests__/trip.service.test.ts --verbose

echo "Running Trip Controller tests..."
npx jest --config=jest.config.js src/modules/trip/__tests__/trip.controller.test.ts --verbose

echo "Running Trip API Integration tests..."
npx jest --config=jest.config.js src/tests/integration/trip-api.test.ts --verbose
