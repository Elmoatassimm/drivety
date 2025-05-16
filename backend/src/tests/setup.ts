// Jest setup file
import "reflect-metadata";

// Extend the timeout for all tests
jest.setTimeout(30000);

// Mock container registrations
import { container } from "tsyringe";

// Clear container before each test
beforeEach(() => {
  container.clearInstances();
});

// Cleanup after all tests
afterAll(async () => {
  jest.clearAllMocks();
}); 