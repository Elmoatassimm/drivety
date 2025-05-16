import { ComponentRepositoryImpl } from "../component.repository";
import { PrismaClient } from "@prisma/client";
import PrismaService from "../../../config/db";
import { NotFoundError } from "../../../core/errors/AppError";

// Mock the PrismaService
jest.mock("../../../config/db");

describe("ComponentRepository", () => {
  let componentRepository: ComponentRepositoryImpl;
  let mockPrismaService: jest.Mocked<PrismaService>;
  let mockPrismaClient: any;

  beforeEach(() => {
    // Create mock implementations
    mockPrismaClient = {
      component: {
        findUnique: jest.fn(),
        findMany: jest.fn(),
        create: jest.fn(),
        update: jest.fn(),
        delete: jest.fn(),
      },
      maintenance: {
        findMany: jest.fn(),
      },
      alert: {
        create: jest.fn(),
      },
    };

    // Setup the mock PrismaService
    mockPrismaService = {
      getClient: jest.fn().mockReturnValue(mockPrismaClient),
    } as unknown as jest.Mocked<PrismaService>;

    // Create the repository with the mock service
    componentRepository = new ComponentRepositoryImpl(mockPrismaService);
  });

  describe("getHealthScore", () => {
    it("should return health score for a valid component ID", async () => {
      // Arrange
      const componentId = "valid-id";
      const mockComponent = { id: componentId, name: "Test Component", healthScore: 85 };

      mockPrismaClient.component.findUnique.mockResolvedValue(mockComponent);

      // Act
      const result = await componentRepository.getHealthScore(componentId);

      // Assert
      expect(mockPrismaClient.component.findUnique).toHaveBeenCalledWith({
        where: { id: componentId },
      });
      expect(result).toEqual(85);
    });

    it("should throw NotFoundError for an invalid component ID", async () => {
      // Arrange
      const componentId = "invalid-id";
      mockPrismaClient.component.findUnique.mockResolvedValue(null);

      // Act & Assert
      await expect(componentRepository.getHealthScore(componentId)).rejects.toThrow(
        NotFoundError
      );
      expect(mockPrismaClient.component.findUnique).toHaveBeenCalledWith({
        where: { id: componentId },
      });
    });
  });

  describe("getMaintenanceRecords", () => {
    it("should return maintenance records for a valid component ID", async () => {
      // Arrange
      const componentId = "valid-id";
      const mockComponent = { id: componentId, name: "Test Component" };
      const mockMaintenanceRecords = [
        { id: "maint1", description: "Repair", componentId },
        { id: "maint2", description: "Inspection", componentId },
      ];

      mockPrismaClient.component.findUnique.mockResolvedValue(mockComponent);
      mockPrismaClient.maintenance.findMany.mockResolvedValue(mockMaintenanceRecords);

      // Act
      const result = await componentRepository.getMaintenanceRecords(componentId);

      // Assert
      expect(mockPrismaClient.component.findUnique).toHaveBeenCalledWith({
        where: { id: componentId },
      });
      expect(mockPrismaClient.maintenance.findMany).toHaveBeenCalledWith({
        where: { componentId },
        orderBy: { createdAt: 'desc' },
      });
      expect(result).toEqual(mockMaintenanceRecords);
    });

    it("should throw NotFoundError for an invalid component ID", async () => {
      // Arrange
      const componentId = "invalid-id";
      mockPrismaClient.component.findUnique.mockResolvedValue(null);

      // Act & Assert
      await expect(componentRepository.getMaintenanceRecords(componentId)).rejects.toThrow(
        NotFoundError
      );
      expect(mockPrismaClient.component.findUnique).toHaveBeenCalledWith({
        where: { id: componentId },
      });
      expect(mockPrismaClient.maintenance.findMany).not.toHaveBeenCalled();
    });
  });

  describe("triggerAlert", () => {
    it("should create an alert for a valid component ID", async () => {
      // Arrange
      const componentId = "valid-id";
      const message = "Component needs attention";
      const mockComponent = { id: componentId, name: "Test Component", vehicleId: "vehicle-1" };
      const mockAlert = { id: "alert-1", componentId, message };

      mockPrismaClient.component.findUnique.mockResolvedValue(mockComponent);
      mockPrismaClient.alert.create.mockResolvedValue(mockAlert);

      // Act
      const result = await componentRepository.triggerAlert(componentId, message);

      // Assert
      expect(mockPrismaClient.component.findUnique).toHaveBeenCalledWith({
        where: { id: componentId },
      });
      expect(mockPrismaClient.alert.create).toHaveBeenCalledWith({
        data: {
          type: "COMPONENT_ISSUE",
          vehicleId: mockComponent.vehicleId,
          componentId,
          message,
          actionRequired: true
        }
      });
      expect(result).toEqual(mockAlert);
    });

    it("should throw NotFoundError for an invalid component ID", async () => {
      // Arrange
      const componentId = "invalid-id";
      const message = "Component needs attention";
      mockPrismaClient.component.findUnique.mockResolvedValue(null);

      // Act & Assert
      await expect(componentRepository.triggerAlert(componentId, message)).rejects.toThrow(
        NotFoundError
      );
      expect(mockPrismaClient.component.findUnique).toHaveBeenCalledWith({
        where: { id: componentId },
      });
      expect(mockPrismaClient.alert.create).not.toHaveBeenCalled();
    });
  });
});
