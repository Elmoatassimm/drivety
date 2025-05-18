import { z } from "zod";

export const startTripSchema = z.object({
  driverId: z.string().uuid({ message: "Driver ID must be a valid UUID" }),
  vehicleId: z.string().uuid({ message: "Vehicle ID must be a valid UUID" }),
  startLocation: z.string().min(1, { message: "Start location is required" })
});

export const endTripSchema = z.object({
  endLocation: z.string().min(1, { message: "End location is required" })
});

export type StartTripInput = z.infer<typeof startTripSchema>;
export type EndTripInput = z.infer<typeof endTripSchema>;
