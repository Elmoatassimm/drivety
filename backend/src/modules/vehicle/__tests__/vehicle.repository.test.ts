import { VehicleRepositoryImpl } from "../vehicle.repository";
import { PrismaClient } from "@prisma/client";
import PrismaService from "../../../config/db";
import { NotFoundError } from "../../../core/errors/AppError";

// Mock the PrismaService
jest.mock("../../../config/db");

describe("VehicleRepository", () => {
  let vehicleRepository: VehicleRepositoryImpl;
  let mockPrismaService: jest.Mocked<PrismaService>;
  let mockPrismaClient: any;

  beforeEach(() => {
    // Create mock implementations
    mockPrismaClient = {
      vehicle: {
        findUnique: jest.fn(),
        findMany: jest.fn(),
        create: jest.fn(),
        update: jest.fn(),
        delete: jest.fn(),
      },
      component: {
        findMany: jest.fn(),
      },
      maintenance: {
        findMany: jest.fn(),
      },
    };

    // Setup the mock PrismaService
    mockPrismaService = {
      getClient: jest.fn().mockReturnValue(mockPrismaClient),
    } as unknown as jest.Mocked<PrismaService>;

    // Create the repository with the mock service
    vehicleRepository = new VehicleRepositoryImpl(mockPrismaService);
  });

  describe("getComponents", () => {
    it("should return components for a valid vehicle ID", async () => {
      // Arrange
      const vehicleId = "valid-id";
      const mockVehicle = { id: vehicleId, model: "Test Model" };
      const mockComponents = [
        { id: "comp1", name: "Component 1", vehicleId },
        { id: "comp2", name: "Component 2", vehicleId },
      ];

      mockPrismaClient.vehicle.findUnique.mockResolvedValue(mockVehicle);
      mockPrismaClient.component.findMany.mockResolvedValue(mockComponents);

      // Act
      const result = await vehicleRepository.getComponents(vehicleId);

      // Assert
      expect(mockPrismaClient.vehicle.findUnique).toHaveBeenCalledWith({
        where: { id: vehicleId },
      });
      expect(mockPrismaClient.component.findMany).toHaveBeenCalledWith({
        where: { vehicleId },
      });
      expect(result).toEqual(mockComponents);
    });

    it("should throw NotFoundError for an invalid vehicle ID", async () => {
      // Arrange
      const vehicleId = "invalid-id";
      mockPrismaClient.vehicle.findUnique.mockResolvedValue(null);

      // Act & Assert
      await expect(vehicleRepository.getComponents(vehicleId)).rejects.toThrow(
        NotFoundError
      );
      expect(mockPrismaClient.vehicle.findUnique).toHaveBeenCalledWith({
        where: { id: vehicleId },
      });
      expect(mockPrismaClient.component.findMany).not.toHaveBeenCalled();
    });
  });

  describe("updateHealthStatus", () => {
    it("should update and return vehicle health status for a valid ID", async () => {
      // Arrange
      const vehicleId = "valid-id";
      const healthStatus = "GOOD";
      const mockVehicle = { id: vehicleId, status: "FAIR" };
      const mockUpdatedVehicle = { id: vehicleId, status: healthStatus };

      mockPrismaClient.vehicle.findUnique.mockResolvedValue(mockVehicle);
      mockPrismaClient.vehicle.update.mockResolvedValue(mockUpdatedVehicle);

      // Act
      const result = await vehicleRepository.updateHealthStatus(vehicleId, healthStatus);

      // Assert
      expect(mockPrismaClient.vehicle.findUnique).toHaveBeenCalledWith({
        where: { id: vehicleId },
      });
      expect(mockPrismaClient.vehicle.update).toHaveBeenCalledWith({
        where: { id: vehicleId },
        data: { status: healthStatus },
        select: {
          id: true,
          status: true,
        },
      });
      expect(result).toEqual({
        id: vehicleId,
        healthStatus: healthStatus,
      });
    });

    it("should throw NotFoundError for an invalid vehicle ID", async () => {
      // Arrange
      const vehicleId = "invalid-id";
      const healthStatus = "GOOD";
      mockPrismaClient.vehicle.findUnique.mockResolvedValue(null);

      // Act & Assert
      await expect(
        vehicleRepository.updateHealthStatus(vehicleId, healthStatus)
      ).rejects.toThrow(NotFoundError);
      expect(mockPrismaClient.vehicle.findUnique).toHaveBeenCalledWith({
        where: { id: vehicleId },
      });
      expect(mockPrismaClient.vehicle.update).not.toHaveBeenCalled();
    });
  });

  describe("getMaintenanceHistory", () => {
    it("should return maintenance history for a valid vehicle ID", async () => {
      // Arrange
      const vehicleId = "valid-id";
      const mockVehicle = { id: vehicleId, model: "Test Model" };
      const mockMaintenanceHistory = [
        { id: "maint1", description: "Oil Change", vehicleId },
        { id: "maint2", description: "Tire Rotation", vehicleId },
      ];

      mockPrismaClient.vehicle.findUnique.mockResolvedValue(mockVehicle);
      mockPrismaClient.maintenance.findMany.mockResolvedValue(mockMaintenanceHistory);

      // Act
      const result = await vehicleRepository.getMaintenanceHistory(vehicleId);

      // Assert
      expect(mockPrismaClient.vehicle.findUnique).toHaveBeenCalledWith({
        where: { id: vehicleId },
      });
      expect(mockPrismaClient.maintenance.findMany).toHaveBeenCalledWith({
        where: { vehicleId },
        orderBy: { createdAt: 'desc' },
      });
      expect(result).toEqual(mockMaintenanceHistory);
    });

    it("should throw NotFoundError for an invalid vehicle ID", async () => {
      // Arrange
      const vehicleId = "invalid-id";
      mockPrismaClient.vehicle.findUnique.mockResolvedValue(null);

      // Act & Assert
      await expect(vehicleRepository.getMaintenanceHistory(vehicleId)).rejects.toThrow(
        NotFoundError
      );
      expect(mockPrismaClient.vehicle.findUnique).toHaveBeenCalledWith({
        where: { id: vehicleId },
      });
      expect(mockPrismaClient.maintenance.findMany).not.toHaveBeenCalled();
    });
  });
});
