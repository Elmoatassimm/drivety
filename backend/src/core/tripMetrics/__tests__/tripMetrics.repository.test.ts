import { TripMetricsRepository } from "../tripMetrics.repository";
import { Trip, TripMetric } from "@prisma/client";
import { NotFoundError } from "../../errors/AppError";
import { container } from "tsyringe";
import PrismaService from "../../../config/db";

describe("TripMetricsRepository", () => {
  let tripMetricsRepository: TripMetricsRepository;
  let mockPrismaService: any;
  let mockPrisma: any;
  let testTrip: Trip;
  let testTripMetrics: TripMetric[];

  beforeEach(() => {
    // Create mock trip data
    testTrip = {
      id: "test-trip-id",
      driverId: "test-driver-id",
      vehicleId: "test-vehicle-id",
      startLocation: "Test Start Location",
      endLocation: null,
      startTime: new Date(),
      endTime: null,
      distance: null,
      fuelConsumed: null,
      status: "IN_PROGRESS",
      updatedAt: new Date()
    } as Trip;

    // Create mock trip metrics
    testTripMetrics = [];
    for (let i = 0; i < 3; i++) {
      const metric = {
        id: `metric-${i}`,
        tripId: testTrip.id,
        speed: 60 + Math.random() * 20,
        acceleration: Math.random() * 5,
        braking: Math.random() * 5,
        fuelConsumption: 5 + Math.random() * 10,
        latitude: 40 + Math.random(),
        longitude: -74 + Math.random(),
        createdAt: new Date()
      } as TripMetric;

      testTripMetrics.push(metric);
    }

    // Create mock Prisma client
    mockPrisma = {
      trip: {
        findUnique: jest.fn(),
        update: jest.fn()
      },
      tripMetric: {
        findMany: jest.fn()
      }
    };

    // Create mock Prisma service
    mockPrismaService = {
      getClient: jest.fn().mockReturnValue(mockPrisma)
    };

    // Register the mock Prisma service in the container
    container.register("db", { useValue: mockPrismaService });

    // Create the repository with the mock Prisma service
    tripMetricsRepository = new TripMetricsRepository(mockPrismaService as unknown as PrismaService);
  });

  describe("getMetricsByTrip", () => {
    it("should return metrics for a valid trip ID", async () => {
      // Arrange
      mockPrisma.trip.findUnique.mockResolvedValue(testTrip);
      mockPrisma.tripMetric.findMany.mockResolvedValue(testTripMetrics);

      // Act
      const metrics = await tripMetricsRepository.getMetricsByTrip(testTrip.id);

      // Assert
      expect(mockPrisma.trip.findUnique).toHaveBeenCalledWith({
        where: { id: testTrip.id }
      });
      expect(mockPrisma.tripMetric.findMany).toHaveBeenCalledWith({
        where: { tripId: testTrip.id },
        orderBy: { createdAt: 'asc' }
      });
      expect(metrics).toEqual(testTripMetrics);
    });

    it("should throw NotFoundError for non-existent trip ID", async () => {
      // Arrange
      mockPrisma.trip.findUnique.mockResolvedValue(null);

      // Act & Assert
      await expect(tripMetricsRepository.getMetricsByTrip("non-existent-id"))
        .rejects.toThrow(NotFoundError);

      expect(mockPrisma.trip.findUnique).toHaveBeenCalledWith({
        where: { id: "non-existent-id" }
      });
    });
  });

  describe("calculateFuelConsumption", () => {
    it("should calculate fuel consumption for a valid trip ID", async () => {
      // Arrange
      mockPrisma.trip.findUnique.mockResolvedValue({ ...testTrip, fuelConsumed: null });
      mockPrisma.tripMetric.findMany.mockResolvedValue(testTripMetrics);
      mockPrisma.trip.update.mockResolvedValue({ ...testTrip, fuelConsumed: 25.5 });

      // Calculate expected fuel consumption
      const expectedFuelConsumption = testTripMetrics.reduce((total, metric) => {
        return total + (metric.fuelConsumption || 0);
      }, 0);

      // Act
      const fuelConsumption = await tripMetricsRepository.calculateFuelConsumption(testTrip.id);

      // Assert
      expect(mockPrisma.trip.findUnique).toHaveBeenCalledWith({
        where: { id: testTrip.id }
      });
      expect(mockPrisma.tripMetric.findMany).toHaveBeenCalledWith({
        where: { tripId: testTrip.id },
        select: { fuelConsumption: true }
      });
      expect(mockPrisma.trip.update).toHaveBeenCalledWith({
        where: { id: testTrip.id },
        data: { fuelConsumed: expectedFuelConsumption }
      });
      expect(fuelConsumption).toBe(expectedFuelConsumption);
    });

    it("should throw NotFoundError for non-existent trip ID", async () => {
      // Arrange
      mockPrisma.trip.findUnique.mockResolvedValue(null);

      // Act & Assert
      await expect(tripMetricsRepository.calculateFuelConsumption("non-existent-id"))
        .rejects.toThrow(NotFoundError);

      expect(mockPrisma.trip.findUnique).toHaveBeenCalledWith({
        where: { id: "non-existent-id" }
      });
    });

    it("should return existing fuel consumption if already calculated", async () => {
      // Arrange
      const existingFuelConsumption = 15.5;
      mockPrisma.trip.findUnique.mockResolvedValue({
        ...testTrip,
        fuelConsumed: existingFuelConsumption
      });

      // Act
      const fuelConsumption = await tripMetricsRepository.calculateFuelConsumption(testTrip.id);

      // Assert
      expect(mockPrisma.trip.findUnique).toHaveBeenCalledWith({
        where: { id: testTrip.id }
      });
      expect(fuelConsumption).toBe(existingFuelConsumption);
    });
  });
});
