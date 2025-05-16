import 'reflect-metadata';
import { container } from 'tsyringe';
import { DriverService } from '../../modules/driver/driver.service';
import { DriverRepository } from '../../modules/driver/driver.repository';
import { ConflictError, NotFoundError } from '../../core/errors/AppError';

// Mock the driver repository
jest.mock('../../modules/driver/driver.repository');

describe('DriverService', () => {
  let driverService: DriverService;
  let mockDriverRepository: jest.Mocked<DriverRepository>;

  beforeEach(() => {
    // Clear mocks
    jest.clearAllMocks();

    // Setup mock repository
    mockDriverRepository = {
      findById: jest.fn(),
      findByUserId: jest.fn(),
      create: jest.fn(),
      update: jest.fn(),
      delete: jest.fn(),
      findAll: jest.fn(),
      updateDriverScore: jest.fn(),
      count: jest.fn(),
      modelName: 'driver',
      prisma: {} as any,
      prismaService: {} as any
    } as unknown as jest.Mocked<DriverRepository>;

    // Register mocks in the container
    container.registerInstance('IDriverRepository', mockDriverRepository);
    container.registerInstance(DriverRepository, mockDriverRepository);

    // Create service instance
    driverService = new DriverService(mockDriverRepository, mockDriverRepository);
  });

  describe('findById', () => {
    it('should return a driver when found', async () => {
      const mockDriver = { id: '1', name: 'Test Driver', userId: 'user1' };
      mockDriverRepository.findById.mockResolvedValue(mockDriver as any);

      const result = await driverService.findById('1');

      expect(result).toEqual(mockDriver);
      expect(mockDriverRepository.findById).toHaveBeenCalledWith('1');
    });

    it('should throw NotFoundError when driver not found', async () => {
      mockDriverRepository.findById.mockResolvedValue(null);

      await expect(driverService.findById('1')).rejects.toThrow(NotFoundError);
      expect(mockDriverRepository.findById).toHaveBeenCalledWith('1');
    });
  });

  describe('findByUserId', () => {
    it('should return a driver when found by user ID', async () => {
      const mockDriver = { id: '1', name: 'Test Driver', userId: 'user1' };
      mockDriverRepository.findByUserId.mockResolvedValue(mockDriver as any);

      const result = await driverService.findByUserId('user1');

      expect(result).toEqual(mockDriver);
      expect(mockDriverRepository.findByUserId).toHaveBeenCalledWith('user1');
    });
  });

  describe('create', () => {
    it('should create a driver successfully', async () => {
      const driverData = {
        userId: 'user1',
        name: 'New Driver',
        licenseNumber: 'DL12345',
        licenseExpiry: new Date(),
        phoneNumber: '1234567890'
      };

      const mockCreatedDriver = { id: '1', ...driverData, driverScore: 0 };

      mockDriverRepository.findByUserId.mockResolvedValue(null);
      mockDriverRepository.create.mockResolvedValue(mockCreatedDriver as any);

      const result = await driverService.create(driverData);

      expect(result).toEqual(mockCreatedDriver);
      expect(mockDriverRepository.findByUserId).toHaveBeenCalledWith(driverData.userId);
      expect(mockDriverRepository.create).toHaveBeenCalledWith(driverData);
    });

    it('should throw ConflictError if driver already exists for user', async () => {
      const driverData = {
        userId: 'user1',
        name: 'New Driver',
        licenseNumber: 'DL12345',
        licenseExpiry: new Date(),
        phoneNumber: '1234567890'
      };

      mockDriverRepository.findByUserId.mockResolvedValue({ id: 'existing' } as any);

      await expect(driverService.create(driverData)).rejects.toThrow(ConflictError);
      expect(mockDriverRepository.findByUserId).toHaveBeenCalledWith(driverData.userId);
      expect(mockDriverRepository.create).not.toHaveBeenCalled();
    });
  });

  describe('update', () => {
    it('should update a driver successfully', async () => {
      const driverId = '1';
      const updateData = {
        name: 'Updated Driver',
        phoneNumber: '9876543210'
      };

      const mockDriver = { id: driverId, name: 'Old Name', phoneNumber: '1234567890' };
      const mockUpdatedDriver = { ...mockDriver, ...updateData };

      mockDriverRepository.findById.mockResolvedValue(mockDriver as any);
      mockDriverRepository.update.mockResolvedValue(mockUpdatedDriver as any);

      const result = await driverService.update(driverId, updateData);

      expect(result).toEqual(mockUpdatedDriver);
      expect(mockDriverRepository.findById).toHaveBeenCalledWith(driverId);
      expect(mockDriverRepository.update).toHaveBeenCalledWith(driverId, updateData);
    });

    it('should throw NotFoundError if driver not found', async () => {
      const driverId = '1';
      const updateData = { name: 'Updated Driver' };

      mockDriverRepository.findById.mockResolvedValue(null);

      await expect(driverService.update(driverId, updateData)).rejects.toThrow(NotFoundError);
      expect(mockDriverRepository.findById).toHaveBeenCalledWith(driverId);
      expect(mockDriverRepository.update).not.toHaveBeenCalled();
    });
  });

  describe('updateDriverScore', () => {
    it('should update driver score successfully', async () => {
      const driverId = '1';
      const newScore = 85;

      const mockUpdatedDriver = { id: driverId, driverScore: newScore };

      mockDriverRepository.updateDriverScore.mockResolvedValue(mockUpdatedDriver as any);

      const result = await driverService.updateDriverScore(driverId, newScore);

      expect(result).toEqual(mockUpdatedDriver);
      expect(mockDriverRepository.updateDriverScore).toHaveBeenCalledWith(driverId, newScore);
    });

    it('should throw error if score is out of range', async () => {
      const driverId = '1';

      // Test with score too high
      await expect(driverService.updateDriverScore(driverId, 101)).rejects.toThrow();

      // Test with score too low
      await expect(driverService.updateDriverScore(driverId, -1)).rejects.toThrow();

      expect(mockDriverRepository.updateDriverScore).not.toHaveBeenCalled();
    });
  });
});
