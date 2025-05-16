#!/bin/bash

# Run component API tests
echo "Running Component API tests..."
npx jest --config=jest.config.js src/tests/integration/component-api.test.ts --verbose
