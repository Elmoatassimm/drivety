import { TripRepository } from "../trip.repository";
import PrismaService from "../../../config/db";
import { NotFoundError, BadRequestError } from "../../../core/errors/AppError";

describe("TripRepository", () => {
  let tripRepository: TripRepository;
  let mockPrismaService: jest.Mocked<PrismaService>;
  let mockPrismaClient: any;

  beforeEach(() => {
    // Create mock implementations
    mockPrismaClient = {
      trip: {
        findUnique: jest.fn(),
        findMany: jest.fn(),
        create: jest.fn(),
        update: jest.fn(),
        delete: jest.fn(),
      },
      driver: {
        findUnique: jest.fn(),
      },
      vehicle: {
        findUnique: jest.fn(),
      },
      tripMetric: {
        findMany: jest.fn(),
      },
    };

    // Setup the mock PrismaService
    mockPrismaService = {
      getClient: jest.fn().mockReturnValue(mockPrismaClient),
    } as unknown as jest.Mocked<PrismaService>;

    // Create the repository with the mock service
    tripRepository = new TripRepository(mockPrismaService);
  });

  describe("startTrip", () => {
    it("should start a trip with valid driver and vehicle IDs", async () => {
      // Arrange
      const driverId = "driver-id";
      const vehicleId = "vehicle-id";
      const startLocation = "Test Start Location";

      const mockDriver = { id: driverId, name: "Test Driver" };
      const mockVehicle = { id: vehicleId, model: "Test Vehicle" };
      const mockTrip = {
        id: "trip-id",
        driverId,
        vehicleId,
        startLocation,
        startTime: new Date(),
        status: "IN_PROGRESS"
      };

      mockPrismaClient.driver.findUnique.mockResolvedValue(mockDriver);
      mockPrismaClient.vehicle.findUnique.mockResolvedValue(mockVehicle);
      mockPrismaClient.trip.create.mockResolvedValue(mockTrip);

      // Act
      const result = await tripRepository.startTrip(driverId, vehicleId, startLocation);

      // Assert
      expect(mockPrismaClient.driver.findUnique).toHaveBeenCalledWith({
        where: { id: driverId },
      });
      expect(mockPrismaClient.vehicle.findUnique).toHaveBeenCalledWith({
        where: { id: vehicleId },
      });
      expect(mockPrismaClient.trip.create).toHaveBeenCalledWith({
        data: {
          driverId,
          vehicleId,
          startLocation,
          startLatitude: undefined,
          startLongitude: undefined,
          startTime: expect.any(Date),
          status: "IN_PROGRESS",
        },
      });
      expect(result).toEqual(mockTrip);
    });

    it("should start a trip with coordinates", async () => {
      // Arrange
      const driverId = "driver-id";
      const vehicleId = "vehicle-id";
      const startLocation = "Test Start Location";
      const startLatitude = 40.7128;
      const startLongitude = -74.0060;

      const mockDriver = { id: driverId, name: "Test Driver" };
      const mockVehicle = { id: vehicleId, model: "Test Vehicle" };
      const mockTrip = {
        id: "trip-id",
        driverId,
        vehicleId,
        startLocation,
        startLatitude,
        startLongitude,
        startTime: new Date(),
        status: "IN_PROGRESS"
      };

      mockPrismaClient.driver.findUnique.mockResolvedValue(mockDriver);
      mockPrismaClient.vehicle.findUnique.mockResolvedValue(mockVehicle);
      mockPrismaClient.trip.create.mockResolvedValue(mockTrip);

      // Act
      const result = await tripRepository.startTrip(driverId, vehicleId, startLocation, startLatitude, startLongitude);

      // Assert
      expect(mockPrismaClient.trip.create).toHaveBeenCalledWith({
        data: {
          driverId,
          vehicleId,
          startLocation,
          startLatitude,
          startLongitude,
          startTime: expect.any(Date),
          status: "IN_PROGRESS",
        },
      });
      expect(result).toEqual(mockTrip);
    });

    it("should throw NotFoundError if driver is not found", async () => {
      // Arrange
      const driverId = "invalid-driver-id";
      const vehicleId = "vehicle-id";
      const startLocation = "Test Start Location";

      mockPrismaClient.driver.findUnique.mockResolvedValue(null);

      // Act & Assert
      await expect(tripRepository.startTrip(driverId, vehicleId, startLocation))
        .rejects.toThrow(NotFoundError);
    });

    it("should throw NotFoundError if vehicle is not found", async () => {
      // Arrange
      const driverId = "driver-id";
      const vehicleId = "invalid-vehicle-id";
      const startLocation = "Test Start Location";

      const mockDriver = { id: driverId, name: "Test Driver" };

      mockPrismaClient.driver.findUnique.mockResolvedValue(mockDriver);
      mockPrismaClient.vehicle.findUnique.mockResolvedValue(null);

      // Act & Assert
      await expect(tripRepository.startTrip(driverId, vehicleId, startLocation))
        .rejects.toThrow(NotFoundError);
    });
  });

  describe("endTrip", () => {
    it("should end a trip with valid trip ID", async () => {
      // Arrange
      const tripId = "trip-id";
      const endLocation = "Test End Location";

      const mockTrip = {
        id: tripId,
        driverId: "driver-id",
        vehicleId: "vehicle-id",
        startLocation: "Test Start Location",
        startTime: new Date(Date.now() - 3600000), // 1 hour ago
        status: "IN_PROGRESS"
      };

      const mockUpdatedTrip = {
        ...mockTrip,
        endLocation,
        endTime: expect.any(Date),
        status: "COMPLETED"
      };

      mockPrismaClient.trip.findUnique.mockResolvedValue(mockTrip);
      mockPrismaClient.trip.update.mockResolvedValue(mockUpdatedTrip);

      // Act
      const result = await tripRepository.endTrip(tripId, endLocation);

      // Assert
      expect(mockPrismaClient.trip.findUnique).toHaveBeenCalledWith({
        where: { id: tripId },
      });
      expect(mockPrismaClient.trip.update).toHaveBeenCalledWith({
        where: { id: tripId },
        data: {
          endLocation,
          endLatitude: undefined,
          endLongitude: undefined,
          endTime: expect.any(Date),
          status: "COMPLETED",
        },
      });
      expect(result).toEqual(mockUpdatedTrip);
    });

    it("should end a trip with coordinates", async () => {
      // Arrange
      const tripId = "trip-id";
      const endLocation = "Test End Location";
      const endLatitude = 40.7589;
      const endLongitude = -73.9851;

      const mockTrip = {
        id: tripId,
        driverId: "driver-id",
        vehicleId: "vehicle-id",
        startLocation: "Test Start Location",
        startTime: new Date(Date.now() - 3600000), // 1 hour ago
        status: "IN_PROGRESS"
      };

      const mockUpdatedTrip = {
        ...mockTrip,
        endLocation,
        endLatitude,
        endLongitude,
        endTime: expect.any(Date),
        status: "COMPLETED"
      };

      mockPrismaClient.trip.findUnique.mockResolvedValue(mockTrip);
      mockPrismaClient.trip.update.mockResolvedValue(mockUpdatedTrip);

      // Act
      const result = await tripRepository.endTrip(tripId, endLocation, endLatitude, endLongitude);

      // Assert
      expect(mockPrismaClient.trip.update).toHaveBeenCalledWith({
        where: { id: tripId },
        data: {
          endLocation,
          endLatitude,
          endLongitude,
          endTime: expect.any(Date),
          status: "COMPLETED",
        },
      });
      expect(result).toEqual(mockUpdatedTrip);
    });

    it("should throw NotFoundError if trip is not found", async () => {
      // Arrange
      const tripId = "invalid-trip-id";
      const endLocation = "Test End Location";

      mockPrismaClient.trip.findUnique.mockResolvedValue(null);

      // Act & Assert
      await expect(tripRepository.endTrip(tripId, endLocation))
        .rejects.toThrow(NotFoundError);
    });

    it("should throw BadRequestError if trip is not in progress", async () => {
      // Arrange
      const tripId = "trip-id";
      const endLocation = "Test End Location";

      const mockTrip = {
        id: tripId,
        driverId: "driver-id",
        vehicleId: "vehicle-id",
        startLocation: "Test Start Location",
        startTime: new Date(Date.now() - 3600000), // 1 hour ago
        endLocation: "Already Ended",
        endTime: new Date(),
        status: "COMPLETED"
      };

      mockPrismaClient.trip.findUnique.mockResolvedValue(mockTrip);

      // Act & Assert
      await expect(tripRepository.endTrip(tripId, endLocation))
        .rejects.toThrow(BadRequestError);
    });
  });

  // Add more tests for getTripMetrics and getDriverTrips methods
});
