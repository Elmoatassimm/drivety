import { TripController } from "../trip.controller";
import { TripService } from "../trip.service";
import ResponseUtils from "../../../core/utils/response.utils";
import { Request, Response, NextFunction } from "express";
import { NotFoundError } from "../../../core/errors/AppError";
import { ITrip } from "../interfaces/ITripRepository";

describe("TripController", () => {
  let tripController: TripController;
  let mockTripService: jest.Mocked<TripService>;
  let mockResponseUtils: jest.Mocked<ResponseUtils>;
  let mockRequest: Partial<Request>;
  let mockResponse: Partial<Response>;
  let mockNext: jest.MockedFunction<NextFunction>;

  beforeEach(() => {
    // Create mock service
    mockTripService = {
      findById: jest.fn(),
      findAll: jest.fn(),
      create: jest.fn(),
      update: jest.fn(),
      delete: jest.fn(),
      startTrip: jest.fn(),
      endTrip: jest.fn(),
      getTripMetrics: jest.fn(),
      getDriverTrips: jest.fn(),
    } as unknown as jest.Mocked<TripService>;

    // Create mock response utils
    mockResponseUtils = {
      sendSuccessResponse: jest.fn(),
      sendCreatedResponse: jest.fn(),
      sendNoContentResponse: jest.fn(),
      sendNotFoundResponse: jest.fn(),
      sendErrorResponse: jest.fn(),
    } as unknown as jest.Mocked<ResponseUtils>;

    // Create the controller with the mock service and response utils
    tripController = new TripController(mockTripService, mockResponseUtils);

    // Create mock request, response, and next function
    mockRequest = {};
    mockResponse = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn(),
    };
    mockNext = jest.fn();
  });

  describe("startTrip", () => {
    it("should start a trip with valid request body", async () => {
      // Arrange
      const driverId = "driver-id";
      const vehicleId = "vehicle-id";
      const startLocation = "Test Start Location";

      mockRequest.body = { driverId, vehicleId, startLocation };

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

      mockTripService.startTrip.mockResolvedValue(mockTrip);

      // Act
      await tripController.startTrip(
        mockRequest as Request,
        mockResponse as Response,
        mockNext
      );

      // Assert
      expect(mockTripService.startTrip).toHaveBeenCalledWith(driverId, vehicleId, startLocation, undefined, undefined);
      expect(mockResponseUtils.sendSuccessResponse).toHaveBeenCalledWith(
        mockResponse,
        mockTrip,
        201
      );
      expect(mockNext).not.toHaveBeenCalled();
    });

    it("should call next with error if service throws an error", async () => {
      // Arrange
      const driverId = "driver-id";
      const vehicleId = "vehicle-id";
      const startLocation = "Test Start Location";

      mockRequest.body = { driverId, vehicleId, startLocation };

      const error = new Error("Test error");
      mockTripService.startTrip.mockRejectedValue(error);

      // Act
      await tripController.startTrip(
        mockRequest as Request,
        mockResponse as Response,
        mockNext
      );

      // Assert
      expect(mockTripService.startTrip).toHaveBeenCalledWith(driverId, vehicleId, startLocation, undefined, undefined);
      expect(mockResponseUtils.sendSuccessResponse).not.toHaveBeenCalled();
      expect(mockNext).toHaveBeenCalledWith(error);
    });
  });

  describe("endTrip", () => {
    it("should end a trip with valid request parameters and body", async () => {
      // Arrange
      const tripId = "trip-id";
      const endLocation = "Test End Location";

      mockRequest.params = { tripId };
      mockRequest.body = { endLocation };

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

      mockTripService.endTrip.mockResolvedValue(mockTrip);

      // Act
      await tripController.endTrip(
        mockRequest as Request,
        mockResponse as Response,
        mockNext
      );

      // Assert
      expect(mockTripService.endTrip).toHaveBeenCalledWith(tripId, endLocation, undefined, undefined);
      expect(mockResponseUtils.sendSuccessResponse).toHaveBeenCalledWith(
        mockResponse,
        mockTrip
      );
      expect(mockNext).not.toHaveBeenCalled();
    });

    it("should call next with error if service throws an error", async () => {
      // Arrange
      const tripId = "trip-id";
      const endLocation = "Test End Location";

      mockRequest.params = { tripId };
      mockRequest.body = { endLocation };

      const error = new Error("Test error");
      mockTripService.endTrip.mockRejectedValue(error);

      // Act
      await tripController.endTrip(
        mockRequest as Request,
        mockResponse as Response,
        mockNext
      );

      // Assert
      expect(mockTripService.endTrip).toHaveBeenCalledWith(tripId, endLocation, undefined, undefined);
      expect(mockResponseUtils.sendSuccessResponse).not.toHaveBeenCalled();
      expect(mockNext).toHaveBeenCalledWith(error);
    });
  });

  describe("getTripMetrics", () => {
    it("should get trip metrics with valid tripId", async () => {
      // Arrange
      const tripId = "trip-id";
      mockRequest.params = { tripId };

      const mockMetrics = [
        { id: "metric1", tripId, speed: 60, createdAt: new Date() },
        { id: "metric2", tripId, speed: 65, createdAt: new Date() }
      ];

      mockTripService.getTripMetrics.mockResolvedValue(mockMetrics);

      // Act
      await tripController.getTripMetrics(
        mockRequest as Request,
        mockResponse as Response,
        mockNext
      );

      // Assert
      expect(mockTripService.getTripMetrics).toHaveBeenCalledWith(tripId);
      expect(mockResponseUtils.sendSuccessResponse).toHaveBeenCalledWith(
        mockResponse,
        mockMetrics
      );
      expect(mockNext).not.toHaveBeenCalled();
    });
  });

  describe("getDriverTrips", () => {
    it("should get driver trips with valid driverId", async () => {
      // Arrange
      const driverId = "driver-id";
      mockRequest.params = { driverId };

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
        }
      ];

      mockTripService.getDriverTrips.mockResolvedValue(mockTrips);

      // Act
      await tripController.getDriverTrips(
        mockRequest as Request,
        mockResponse as Response,
        mockNext
      );

      // Assert
      expect(mockTripService.getDriverTrips).toHaveBeenCalledWith(driverId);
      expect(mockResponseUtils.sendSuccessResponse).toHaveBeenCalledWith(
        mockResponse,
        mockTrips
      );
      expect(mockNext).not.toHaveBeenCalled();
    });
  });
});
