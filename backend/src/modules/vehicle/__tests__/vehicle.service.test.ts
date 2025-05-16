import { VehicleService } from "../vehicle.service";
import { VehicleRepositoryImpl } from "../vehicle.repository";
import { BadRequestError, NotFoundError } from "../../../core/errors/AppError";
import Logger from "../../../utils/logger";

// Mock the repository and logger
jest.mock("../vehicle.repository");
jest.mock("../../../utils/logger");

describe("VehicleService", () => {
  let vehicleService: VehicleService;
  let mockVehicleRepository: jest.Mocked<VehicleRepositoryImpl>;
  let mockLogger: jest.Mocked<Logger>;

  beforeEach(() => {
    // Create mock implementations
    mockVehicleRepository = {
      findById: jest.fn(),
      findAll: jest.fn(),
      create: jest.fn(),
      update: jest.fn(),
      delete: jest.fn(),
      getComponents: jest.fn(),
      updateHealthStatus: jest.fn(),
      getMaintenanceHistory: jest.fn(),
      prisma: {
        vehicle: {
          findUnique: jest.fn(),
        },
      } as any,
    } as unknown as jest.Mocked<VehicleRepositoryImpl>;

    mockLogger = {
      info: jest.fn(),
      error: jest.fn(),
      warn: jest.fn(),
      debug: jest.fn(),
    } as unknown as jest.Mocked<Logger>;

    // Create the service with the mock repository
    vehicleService = new VehicleService(
      mockVehicleRepository,
      mockVehicleRepository
    );
    
    // Set the logger
    (vehicleService as any).logger = mockLogger;
  });

  describe("getComponents", () => {
    it("should return components for a valid vehicle ID", async () => {
      // Arrange
      const vehicleId = "valid-id";
      const mockComponents = [
        { id: "comp1", name: "Component 1", vehicleId },
        { id: "comp2", name: "Component 2", vehicleId },
      ];

      mockVehicleRepository.getComponents.mockResolvedValue(mockComponents);

      // Act
      const result = await vehicleService.getComponents(vehicleId);

      // Assert
      expect(mockVehicleRepository.getComponents).toHaveBeenCalledWith(vehicleId);
      expect(result).toEqual(mockComponents);
    });

    it("should throw BadRequestError if vehicle ID is not provided", async () => {
      // Act & Assert
      await expect(vehicleService.getComponents("")).rejects.toThrow(
        BadRequestError
      );
      expect(mockVehicleRepository.getComponents).not.toHaveBeenCalled();
    });

    it("should handle repository errors", async () => {
      // Arrange
      const vehicleId = "valid-id";
      const error = new Error("Repository error");
      mockVehicleRepository.getComponents.mockRejectedValue(error);

      // Act & Assert
      await expect(vehicleService.getComponents(vehicleId)).rejects.toThrow();
      expect(mockVehicleRepository.getComponents).toHaveBeenCalledWith(vehicleId);
      expect(mockLogger.error).toHaveBeenCalled();
    });
  });

  describe("updateHealthStatus", () => {
    it("should update and return vehicle health status for valid inputs", async () => {
      // Arrange
      const vehicleId = "valid-id";
      const healthStatus = "GOOD";
      const mockResult = { id: vehicleId, healthStatus };

      mockVehicleRepository.updateHealthStatus.mockResolvedValue(mockResult);

      // Act
      const result = await vehicleService.updateHealthStatus(vehicleId, healthStatus);

      // Assert
      expect(mockVehicleRepository.updateHealthStatus).toHaveBeenCalledWith(
        vehicleId,
        healthStatus
      );
      expect(result).toEqual(mockResult);
    });

    it("should throw BadRequestError if vehicle ID is not provided", async () => {
      // Act & Assert
      await expect(vehicleService.updateHealthStatus("", "GOOD")).rejects.toThrow(
        BadRequestError
      );
      expect(mockVehicleRepository.updateHealthStatus).not.toHaveBeenCalled();
    });

    it("should throw BadRequestError if health status is not provided", async () => {
      // Act & Assert
      await expect(vehicleService.updateHealthStatus("valid-id", "")).rejects.toThrow(
        BadRequestError
      );
      expect(mockVehicleRepository.updateHealthStatus).not.toHaveBeenCalled();
    });

    it("should throw BadRequestError if health status is invalid", async () => {
      // Act & Assert
      await expect(
        vehicleService.updateHealthStatus("valid-id", "INVALID_STATUS")
      ).rejects.toThrow(BadRequestError);
      expect(mockVehicleRepository.updateHealthStatus).not.toHaveBeenCalled();
    });

    it("should handle repository errors", async () => {
      // Arrange
      const vehicleId = "valid-id";
      const healthStatus = "GOOD";
      const error = new Error("Repository error");
      mockVehicleRepository.updateHealthStatus.mockRejectedValue(error);

      // Act & Assert
      await expect(
        vehicleService.updateHealthStatus(vehicleId, healthStatus)
      ).rejects.toThrow();
      expect(mockVehicleRepository.updateHealthStatus).toHaveBeenCalledWith(
        vehicleId,
        healthStatus
      );
      expect(mockLogger.error).toHaveBeenCalled();
    });
  });

  describe("getMaintenanceHistory", () => {
    it("should return maintenance history for a valid vehicle ID", async () => {
      // Arrange
      const vehicleId = "valid-id";
      const mockMaintenanceHistory = [
        { id: "maint1", description: "Oil Change", vehicleId },
        { id: "maint2", description: "Tire Rotation", vehicleId },
      ];

      mockVehicleRepository.getMaintenanceHistory.mockResolvedValue(mockMaintenanceHistory);

      // Act
      const result = await vehicleService.getMaintenanceHistory(vehicleId);

      // Assert
      expect(mockVehicleRepository.getMaintenanceHistory).toHaveBeenCalledWith(vehicleId);
      expect(result).toEqual(mockMaintenanceHistory);
    });

    it("should throw BadRequestError if vehicle ID is not provided", async () => {
      // Act & Assert
      await expect(vehicleService.getMaintenanceHistory("")).rejects.toThrow(
        BadRequestError
      );
      expect(mockVehicleRepository.getMaintenanceHistory).not.toHaveBeenCalled();
    });

    it("should handle repository errors", async () => {
      // Arrange
      const vehicleId = "valid-id";
      const error = new Error("Repository error");
      mockVehicleRepository.getMaintenanceHistory.mockRejectedValue(error);

      // Act & Assert
      await expect(vehicleService.getMaintenanceHistory(vehicleId)).rejects.toThrow();
      expect(mockVehicleRepository.getMaintenanceHistory).toHaveBeenCalledWith(vehicleId);
      expect(mockLogger.error).toHaveBeenCalled();
    });
  });
});
