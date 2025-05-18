import { TripMetricsService } from "../tripMetrics.service";
import { TripMetricsRepository } from "../tripMetrics.repository";
import ITripMetricsRepository from "../tripMetrics.interface";
import { ITripMetric } from "../tripMetrics.interface";
import { BadRequestError, NotFoundError } from "../../errors/AppError";

describe("TripMetricsService", () => {
  let tripMetricsService: TripMetricsService;
  let mockTripMetricsRepository: jest.Mocked<ITripMetricsRepository>;

  beforeEach(() => {
    // Create mock repository
    mockTripMetricsRepository = {
      findById: jest.fn(),
      findAll: jest.fn(),
      create: jest.fn(),
      update: jest.fn(),
      delete: jest.fn(),
      count: jest.fn(),
      getMetricsByTrip: jest.fn(),
      calculateFuelConsumption: jest.fn(),
    } as unknown as jest.Mocked<ITripMetricsRepository>;

    // Create the service with the mock repository
    tripMetricsService = new TripMetricsService(
      mockTripMetricsRepository,
      mockTripMetricsRepository as unknown as TripMetricsRepository
    );
  });

  describe("getMetricsByTrip", () => {
    it("should get metrics for a valid trip ID", async () => {
      // Arrange
      const tripId = "test-trip-id";
      const mockMetrics: ITripMetric[] = [
        {
          id: "metric-1",
          tripId,
          speed: 65.5,
          acceleration: 2.3,
          braking: 1.5,
          fuelConsumption: 8.7,
          latitude: 40.7128,
          longitude: -74.006,
          createdAt: new Date()
        },
        {
          id: "metric-2",
          tripId,
          speed: 70.2,
          acceleration: 1.8,
          braking: 2.1,
          fuelConsumption: 9.2,
          latitude: 40.7129,
          longitude: -74.007,
          createdAt: new Date()
        }
      ];

      mockTripMetricsRepository.getMetricsByTrip.mockResolvedValue(mockMetrics);

      // Act
      const result = await tripMetricsService.getMetricsByTrip(tripId);

      // Assert
      expect(mockTripMetricsRepository.getMetricsByTrip).toHaveBeenCalledWith(tripId);
      expect(result).toEqual(mockMetrics);
    });

    it("should throw BadRequestError if trip ID is not provided", async () => {
      // Act & Assert
      await expect(tripMetricsService.getMetricsByTrip(""))
        .rejects.toThrow(BadRequestError);
      
      expect(mockTripMetricsRepository.getMetricsByTrip).not.toHaveBeenCalled();
    });

    it("should propagate NotFoundError from repository", async () => {
      // Arrange
      const tripId = "non-existent-id";
      mockTripMetricsRepository.getMetricsByTrip.mockRejectedValue(
        new NotFoundError("Trip", tripId)
      );

      // Act & Assert
      await expect(tripMetricsService.getMetricsByTrip(tripId))
        .rejects.toThrow(NotFoundError);
      
      expect(mockTripMetricsRepository.getMetricsByTrip).toHaveBeenCalledWith(tripId);
    });
  });

  describe("calculateFuelConsumption", () => {
    it("should calculate fuel consumption for a valid trip ID", async () => {
      // Arrange
      const tripId = "test-trip-id";
      const expectedFuelConsumption = 15.5;

      mockTripMetricsRepository.calculateFuelConsumption.mockResolvedValue(expectedFuelConsumption);

      // Act
      const result = await tripMetricsService.calculateFuelConsumption(tripId);

      // Assert
      expect(mockTripMetricsRepository.calculateFuelConsumption).toHaveBeenCalledWith(tripId);
      expect(result).toEqual(expectedFuelConsumption);
    });

    it("should throw BadRequestError if trip ID is not provided", async () => {
      // Act & Assert
      await expect(tripMetricsService.calculateFuelConsumption(""))
        .rejects.toThrow(BadRequestError);
      
      expect(mockTripMetricsRepository.calculateFuelConsumption).not.toHaveBeenCalled();
    });

    it("should propagate NotFoundError from repository", async () => {
      // Arrange
      const tripId = "non-existent-id";
      mockTripMetricsRepository.calculateFuelConsumption.mockRejectedValue(
        new NotFoundError("Trip", tripId)
      );

      // Act & Assert
      await expect(tripMetricsService.calculateFuelConsumption(tripId))
        .rejects.toThrow(NotFoundError);
      
      expect(mockTripMetricsRepository.calculateFuelConsumption).toHaveBeenCalledWith(tripId);
    });
  });
});
