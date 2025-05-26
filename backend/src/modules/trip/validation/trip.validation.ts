import { z } from "zod";

export const startTripSchema = z.object({
  driverId: z.string().uuid({ message: "Driver ID must be a valid UUID" }),
  vehicleId: z.string().uuid({ message: "Vehicle ID must be a valid UUID" }),
  startLocation: z.string().optional(),
  startLatitude: z.coerce.number().min(-90).max(90, { message: "Start latitude must be between -90 and 90" }).optional(),
  startLongitude: z.coerce.number().min(-180).max(180, { message: "Start longitude must be between -180 and 180" }).optional()
});

export const endTripSchema = z.object({
  endLocation: z.string().optional(),
  endLatitude: z.coerce.number().min(-90).max(90, { message: "End latitude must be between -90 and 90" }).optional(),
  endLongitude: z.coerce.number().min(-180).max(180, { message: "End longitude must be between -180 and 180" }).optional(),
  distance: z.coerce.number().min(0, { message: "Distance must be a positive number" }).optional(),
  fuelConsumed: z.coerce.number().min(0, { message: "Fuel consumed must be a positive number" }).optional()
});

export type StartTripInput = z.infer<typeof startTripSchema>;
export type EndTripInput = z.infer<typeof endTripSchema>;
