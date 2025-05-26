# Trip Coordinates Implementation

## Overview
This document outlines the implementation of latitude and longitude fields for both start and end locations in the trip module of the Drivety application.

## Changes Made

### 1. Database Schema (Prisma)
**File:** `backend/prisma/schema.prisma`

Added four new optional Float fields to the Trip model:
- `startLatitude` - Start location latitude (-90 to 90)
- `startLongitude` - Start location longitude (-180 to 180)
- `endLatitude` - End location latitude (-90 to 90)
- `endLongitude` - End location longitude (-180 to 180)

```prisma
model Trip {
  // ... existing fields
  startLatitude     Float?             @map("start_latitude")
  startLongitude    Float?             @map("start_longitude")
  endLatitude       Float?             @map("end_latitude")
  endLongitude      Float?             @map("end_longitude")
  // ... rest of fields
}
```

### 2. Interface Updates
**Files:**
- `backend/src/modules/trip/interfaces/ITripRepository.ts`
- `backend/src/modules/trip/interfaces/ITripService.ts`

Updated method signatures to include optional latitude and longitude parameters:
```typescript
startTrip(driverId: string, vehicleId: string, startLocation: string, startLatitude?: number, startLongitude?: number): Promise<ITrip>;
endTrip(tripId: string, endLocation: string, endLatitude?: number, endLongitude?: number): Promise<ITrip>;
```

### 3. Repository Implementation
**File:** `backend/src/modules/trip/trip.repository.ts`

Updated both `startTrip` and `endTrip` methods to:
- Accept optional latitude and longitude parameters
- Store coordinates in the database when provided
- Include coordinates in logging for debugging

### 4. Service Layer
**File:** `backend/src/modules/trip/trip.service.ts`

Updated service methods to pass through the coordinate parameters to the repository layer.

### 5. Controller Layer
**File:** `backend/src/modules/trip/trip.controller.ts`

Updated controllers to:
- Extract latitude and longitude from request body
- Pass coordinates to service methods
- Include coordinates in logging

### 6. Validation
**File:** `backend/src/modules/trip/validation/trip.validation.ts`

Added validation for coordinate fields:
- Latitude: Optional number between -90 and 90
- Longitude: Optional number between -180 and 180

```typescript
export const startTripSchema = z.object({
  // ... existing fields
  startLatitude: z.number().min(-90).max(90).optional(),
  startLongitude: z.number().min(-180).max(180).optional()
});

export const endTripSchema = z.object({
  // ... existing fields
  endLatitude: z.number().min(-90).max(90).optional(),
  endLongitude: z.number().min(-180).max(180).optional()
});
```

### 7. Database Migration
Generated and applied Prisma migration: `20250524200800_add_trip_coordinates`

The migration adds the four new coordinate columns to the trips table:
```sql
ALTER TABLE `trips` ADD COLUMN `end_latitude` DOUBLE NULL,
    ADD COLUMN `end_longitude` DOUBLE NULL,
    ADD COLUMN `start_latitude` DOUBLE NULL,
    ADD COLUMN `start_longitude` DOUBLE NULL;
```

### 8. Tests
**File:** `backend/src/modules/trip/__tests__/trip.repository.test.ts`

Updated existing tests and added new test cases to verify:
- Starting trips with and without coordinates
- Ending trips with and without coordinates
- Proper parameter passing to Prisma client

## API Usage

### Start Trip with Coordinates
```http
POST /api/trips/start
Content-Type: application/json

{
  "driverId": "uuid",
  "vehicleId": "uuid", 
  "startLocation": "New York City, NY",
  "startLatitude": 40.7128,
  "startLongitude": -74.0060
}
```

### End Trip with Coordinates
```http
PUT /api/trips/{tripId}/end
Content-Type: application/json

{
  "endLocation": "Times Square, NY",
  "endLatitude": 40.7589,
  "endLongitude": -73.9851
}
```

### Response Format
Both endpoints now return trip objects that include the coordinate fields:
```json
{
  "success": true,
  "data": {
    "id": "trip-uuid",
    "driverId": "driver-uuid",
    "vehicleId": "vehicle-uuid",
    "startLocation": "New York City, NY",
    "startLatitude": 40.7128,
    "startLongitude": -74.0060,
    "endLocation": "Times Square, NY",
    "endLatitude": 40.7589,
    "endLongitude": -73.9851,
    "startTime": "2024-05-24T20:08:00.000Z",
    "endTime": "2024-05-24T21:08:00.000Z",
    "status": "COMPLETED"
  }
}
```

## Backward Compatibility
- All coordinate fields are optional, ensuring backward compatibility
- Existing API calls without coordinates will continue to work
- The `getTripMetrics` and `getDriverTrips` methods automatically include coordinate data when available

## Testing
- All existing unit tests pass
- New test cases added for coordinate functionality
- Integration test script provided: `backend/test-trip-coordinates.js`

## Notes
- Coordinates are stored as nullable Float values in the database
- Validation ensures latitude is between -90 and 90 degrees
- Validation ensures longitude is between -180 and 180 degrees
- All coordinate fields are optional to maintain backward compatibility
- The implementation follows the existing codebase patterns and architecture
