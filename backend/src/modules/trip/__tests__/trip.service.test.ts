import { TripService } from "../trip.service";
import { TripRepository } from "../trip.repository";
import ITripRepository from "../interfaces/ITripRepository";
import { BadRequestError } from "../../../core/errors/AppError";
import { ITrip } from "../interfaces/ITripRepository";

describe("TripService", () => {
  let tripService: TripService;
  let mockTripRepository: jest.Mocked<ITripRepository>;

  beforeEach(() => {
    // Create mock repository
    mockTripRepository = {
      findById: jest.fn(),
      findAll: jest.fn(),
      create: jest.fn(),
      update: jest.fn(),
      delete: jest.fn(),
      startTrip: jest.fn(),
      endTrip: jest.fn(),
      getTripMetrics: jest.fn(),
      getDriverTrips: jest.fn(),
    } as unknown as jest.Mocked<ITripRepository>;

    // Create the service with the mock repository
    tripService = new TripService(mockTripRepository, mockTripRepository as unknown as TripRepository);
  });

  describe("startTrip", () => {
    it("should start a trip with valid parameters", async () => {
      // Arrange
      const driverId = "driver-id";
      const vehicleId = "vehicle-id";
      const startLocation = "Test Start Location";

      const mockTrip: ITrip = {
        id: "trip-id",
        driverId,
        vehicleId,
        startLocation,
        startLatitude: null,
        startLongitude: null,
        endLatitude: null,
        endLongitude: null,
        startTime: new Date(),
        endLocation: null,
        endTime: null,
        distance: null,
        fuelConsumed: null,
        status: "IN_PROGRESS",
        updatedAt: new Date()
      };

      mockTripRepository.startTrip.mockResolvedValue(mockTrip);

      // Act
      const result = await tripService.startTrip(driverId, vehicleId, startLocation);

      // Assert
      expect(mockTripRepository.startTrip).toHaveBeenCalledWith(driverId, vehicleId, startLocation, undefined, undefined);
      expect(result).toEqual(mockTrip);
    });

    it("should start a trip with coordinates", async () => {
      // Arrange
      const driverId = "driver-id";
      const vehicleId = "vehicle-id";
      const startLocation = "Test Start Location";
      const startLatitude = 40.7128;
      const startLongitude = -74.0060;

      const mockTrip: ITrip = {
        id: "trip-id",
        driverId,
        vehicleId,
        startLocation,
        startLatitude,
        startLongitude,
        endLatitude: null,
        endLongitude: null,
        startTime: new Date(),
        endLocation: null,
        endTime: null,
        distance: null,
        fuelConsumed: null,
        status: "IN_PROGRESS",
        updatedAt: new Date()
      };

      mockTripRepository.startTrip.mockResolvedValue(mockTrip);

      // Act
      const result = await tripService.startTrip(driverId, vehicleId, startLocation, startLatitude, startLongitude);

      // Assert
      expect(mockTripRepository.startTrip).toHaveBeenCalledWith(driverId, vehicleId, startLocation, startLatitude, startLongitude);
      expect(result).toEqual(mockTrip);
      expect(result.startLatitude).toBe(startLatitude);
      expect(result.startLongitude).toBe(startLongitude);
    });

    it("should throw BadRequestError for invalid coordinates", async () => {
      // Arrange
      const driverId = "driver-id";
      const vehicleId = "vehicle-id";
      const startLocation = "Test Start Location";
      const invalidLatitude = 95; // > 90
      const validLongitude = -74.0060;

      // Act & Assert
      await expect(tripService.startTrip(driverId, vehicleId, startLocation, invalidLatitude, validLongitude))
        .rejects.toThrow(BadRequestError);
      expect(mockTripRepository.startTrip).not.toHaveBeenCalled();
    });

    it("should throw BadRequestError if driverId is missing", async () => {
      // Arrange
      const driverId = "";
      const vehicleId = "vehicle-id";
      const startLocation = "Test Start Location";

      // Act & Assert
      await expect(tripService.startTrip(driverId, vehicleId, startLocation))
        .rejects.toThrow(BadRequestError);
      expect(mockTripRepository.startTrip).not.toHaveBeenCalled();
    });

    it("should throw BadRequestError if vehicleId is missing", async () => {
      // Arrange
      const driverId = "driver-id";
      const vehicleId = "";
      const startLocation = "Test Start Location";

      // Act & Assert
      await expect(tripService.startTrip(driverId, vehicleId, startLocation))
        .rejects.toThrow(BadRequestError);
      expect(mockTripRepository.startTrip).not.toHaveBeenCalled();
    });

    it("should throw BadRequestError if startLocation is missing", async () => {
      // Arrange
      const driverId = "driver-id";
      const vehicleId = "vehicle-id";
      const startLocation = "";

      // Act & Assert
      await expect(tripService.startTrip(driverId, vehicleId, startLocation))
        .rejects.toThrow(BadRequestError);
      expect(mockTripRepository.startTrip).not.toHaveBeenCalled();
    });
  });

  describe("endTrip", () => {
    it("should end a trip with valid parameters", async () => {
      // Arrange
      const tripId = "trip-id";
      const endLocation = "Test End Location";

      const mockTrip: ITrip = {
        id: tripId,
        driverId: "driver-id",
        vehicleId: "vehicle-id",
        startLocation: "Test Start Location",
        startLatitude: null,
        startLongitude: null,
        endLatitude: null,
        endLongitude: null,
        startTime: new Date(Date.now() - 3600000), // 1 hour ago
        endLocation,
        endTime: new Date(),
        distance: 50.5,
        fuelConsumed: 5.2,
        status: "COMPLETED",
        updatedAt: new Date()
      };

      mockTripRepository.endTrip.mockResolvedValue(mockTrip);

      // Act
      const result = await tripService.endTrip(tripId, endLocation);

      // Assert
      expect(mockTripRepository.endTrip).toHaveBeenCalledWith(tripId, endLocation, undefined, undefined);
      expect(result).toEqual(mockTrip);
    });

    it("should end a trip with coordinates", async () => {
      // Arrange
      const tripId = "trip-id";
      const endLocation = "Test End Location";
      const endLatitude = 40.7589;
      const endLongitude = -73.9851;

      const mockTrip: ITrip = {
        id: tripId,
        driverId: "driver-id",
        vehicleId: "vehicle-id",
        startLocation: "Test Start Location",
        startLatitude: 40.7128,
        startLongitude: -74.0060,
        endLatitude,
        endLongitude,
        startTime: new Date(Date.now() - 3600000), // 1 hour ago
        endLocation,
        endTime: new Date(),
        distance: 50.5,
        fuelConsumed: 5.2,
        status: "COMPLETED",
        updatedAt: new Date()
      };

      mockTripRepository.endTrip.mockResolvedValue(mockTrip);

      // Act
      const result = await tripService.endTrip(tripId, endLocation, endLatitude, endLongitude);

      // Assert
      expect(mockTripRepository.endTrip).toHaveBeenCalledWith(tripId, endLocation, endLatitude, endLongitude);
      expect(result).toEqual(mockTrip);
      expect(result.endLatitude).toBe(endLatitude);
      expect(result.endLongitude).toBe(endLongitude);
    });

    it("should throw BadRequestError for invalid end coordinates", async () => {
      // Arrange
      const tripId = "trip-id";
      const endLocation = "Test End Location";
      const invalidLatitude = -95; // < -90
      const validLongitude = -73.9851;

      // Act & Assert
      await expect(tripService.endTrip(tripId, endLocation, invalidLatitude, validLongitude))
        .rejects.toThrow(BadRequestError);
      expect(mockTripRepository.endTrip).not.toHaveBeenCalled();
    });

    it("should throw BadRequestError if tripId is missing", async () => {
      // Arrange
      const tripId = "";
      const endLocation = "Test End Location";

      // Act & Assert
      await expect(tripService.endTrip(tripId, endLocation))
        .rejects.toThrow(BadRequestError);
      expect(mockTripRepository.endTrip).not.toHaveBeenCalled();
    });

    it("should throw BadRequestError if endLocation is missing", async () => {
      // Arrange
      const tripId = "trip-id";
      const endLocation = "";

      // Act & Assert
      await expect(tripService.endTrip(tripId, endLocation))
        .rejects.toThrow(BadRequestError);
      expect(mockTripRepository.endTrip).not.toHaveBeenCalled();
    });
  });

  describe("getTripMetrics", () => {
    it("should get trip metrics with valid tripId", async () => {
      // Arrange
      const tripId = "trip-id";
      const mockMetrics = [
        { id: "metric1", tripId, speed: 60, createdAt: new Date() },
        { id: "metric2", tripId, speed: 65, createdAt: new Date() },
      ];

      mockTripRepository.getTripMetrics.mockResolvedValue(mockMetrics);

      // Act
      const result = await tripService.getTripMetrics(tripId);

      // Assert
      expect(mockTripRepository.getTripMetrics).toHaveBeenCalledWith(tripId);
      expect(result).toEqual(mockMetrics);
    });

    it("should throw BadRequestError if tripId is missing", async () => {
      // Arrange
      const tripId = "";

      // Act & Assert
      await expect(tripService.getTripMetrics(tripId))
        .rejects.toThrow(BadRequestError);
      expect(mockTripRepository.getTripMetrics).not.toHaveBeenCalled();
    });
  });

  describe("getDriverTrips", () => {
    it("should get driver trips with valid driverId", async () => {
      // Arrange
      const driverId = "driver-id";
      const mockTrips: ITrip[] = [
        {
          id: "trip1",
          driverId,
          vehicleId: "vehicle-1",
          startLocation: "Start 1",
          startLatitude: null,
          startLongitude: null,
          endLatitude: null,
          endLongitude: null,
          endLocation: "End 1",
          startTime: new Date(),
          endTime: new Date(),
          distance: 45.2,
          fuelConsumed: 4.5,
          status: "COMPLETED",
          updatedAt: new Date()
        },
        {
          id: "trip2",
          driverId,
          vehicleId: "vehicle-2",
          startLocation: "Start 2",
          startLatitude: null,
          startLongitude: null,
          endLatitude: null,
          endLongitude: null,
          endLocation: null,
          startTime: new Date(),
          endTime: null,
          distance: null,
          fuelConsumed: null,
          status: "IN_PROGRESS",
          updatedAt: new Date()
        }
      ];

      mockTripRepository.getDriverTrips.mockResolvedValue(mockTrips);

      // Act
      const result = await tripService.getDriverTrips(driverId);

      // Assert
      expect(mockTripRepository.getDriverTrips).toHaveBeenCalledWith(driverId);
      expect(result).toEqual(mockTrips);
    });

    it("should throw BadRequestError if driverId is missing", async () => {
      // Arrange
      const driverId = "";

      // Act & Assert
      await expect(tripService.getDriverTrips(driverId))
        .rejects.toThrow(BadRequestError);
      expect(mockTripRepository.getDriverTrips).not.toHaveBeenCalled();
    });
  });
});
