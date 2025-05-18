#!/bin/bash

# Run tripMetrics module tests
echo "Running TripMetrics Repository tests..."
npx jest --config=jest.config.js src/core/tripMetrics/__tests__/tripMetrics.repository.test.ts --verbose

echo "Running TripMetrics Service tests..."
npx jest --config=jest.config.js src/core/tripMetrics/__tests__/tripMetrics.service.test.ts --verbose

echo "All TripMetrics tests completed!"
