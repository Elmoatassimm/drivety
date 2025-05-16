import { z } from 'zod';

export const createDriverSchema = z.object({
  userId: z.string().uuid('Invalid user ID format'),
  name: z.string().min(2, 'Name must be at least 2 characters'),
  licenseNumber: z.string().min(5, 'License number must be at least 5 characters'),
  licenseExpiry: z.string().refine((val) => !isNaN(Date.parse(val)), {
    message: 'License expiry must be a valid date'
  }),
  phoneNumber: z.string().min(10, 'Phone number must be at least 10 characters')
});

export const updateDriverSchema = z.object({
  name: z.string().min(2, 'Name must be at least 2 characters').optional(),
  licenseNumber: z.string().min(5, 'License number must be at least 5 characters').optional(),
  licenseExpiry: z.string().refine((val) => !isNaN(Date.parse(val)), {
    message: 'License expiry must be a valid date'
  }).optional(),
  phoneNumber: z.string().min(10, 'Phone number must be at least 10 characters').optional(),
  driverScore: z.number().min(0).max(100).optional()
});

export const updateDriverScoreSchema = z.object({
  score: z.number().min(0, 'Score must be at least 0').max(100, 'Score must be at most 100')
});
