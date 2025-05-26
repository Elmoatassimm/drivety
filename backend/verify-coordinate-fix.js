// Simple verification of coordinate type handling
const { z } = require('zod');

// Test the schema with the fix
const startTripSchema = z.object({
  driverId: z.string().uuid({ message: "Driver ID must be a valid UUID" }),
  vehicleId: z.string().uuid({ message: "Vehicle ID must be a valid UUID" }),
  startLocation: z.string().min(1, { message: "Start location is required" }),
  startLatitude: z.coerce.number().min(-90).max(90, { message: "Start latitude must be between -90 and 90" }).optional(),
  startLongitude: z.coerce.number().min(-180).max(180, { message: "Start longitude must be between -180 and 180" }).optional()
});

const endTripSchema = z.object({
  endLocation: z.string().min(1, { message: "End location is required" }),
  endLatitude: z.coerce.number().min(-90).max(90, { message: "End latitude must be between -90 and 90" }).optional(),
  endLongitude: z.coerce.number().min(-180).max(180, { message: "End longitude must be between -180 and 180" }).optional()
});

console.log('🧪 Testing coordinate validation with z.coerce.number()...\n');

// Test 1: Valid numbers passed as numbers
console.log('--- Test 1: Numbers as numbers ---');
const test1Data = {
  driverId: "123e4567-e89b-12d3-a456-426614174000",
  vehicleId: "123e4567-e89b-12d3-a456-426614174001",
  startLocation: "Test Location",
  startLatitude: 40.7128,
  startLongitude: -74.0060
};

const result1 = startTripSchema.safeParse(test1Data);
console.log('Valid numbers result:', result1.success);
if (result1.success) {
  console.log('Parsed data types:', {
    startLatitude: `${result1.data.startLatitude} (${typeof result1.data.startLatitude})`,
    startLongitude: `${result1.data.startLongitude} (${typeof result1.data.startLongitude})`
  });
} else {
  console.log('Errors:', result1.error.errors);
}

// Test 2: Valid numbers passed as strings (common from JSON/HTTP)
console.log('\n--- Test 2: Numbers as strings ---');
const test2Data = {
  driverId: "123e4567-e89b-12d3-a456-426614174000",
  vehicleId: "123e4567-e89b-12d3-a456-426614174001",
  startLocation: "Test Location",
  startLatitude: "40.7128",    // String representation
  startLongitude: "-74.0060"   // String representation
};

const result2 = startTripSchema.safeParse(test2Data);
console.log('String numbers result:', result2.success);
if (result2.success) {
  console.log('Parsed data types:', {
    startLatitude: `${result2.data.startLatitude} (${typeof result2.data.startLatitude})`,
    startLongitude: `${result2.data.startLongitude} (${typeof result2.data.startLongitude})`
  });
} else {
  console.log('Errors:', result2.error.errors);
}

// Test 3: Invalid coordinate values
console.log('\n--- Test 3: Invalid coordinates ---');
const test3Data = {
  driverId: "123e4567-e89b-12d3-a456-426614174000",
  vehicleId: "123e4567-e89b-12d3-a456-426614174001",
  startLocation: "Test Location",
  startLatitude: "95",    // Invalid: > 90
  startLongitude: "-74.0060"
};

const result3 = startTripSchema.safeParse(test3Data);
console.log('Invalid coordinates result:', result3.success);
if (!result3.success) {
  console.log('Expected validation errors:', result3.error.errors.map(e => e.message));
}

// Test 4: End trip schema
console.log('\n--- Test 4: End trip schema ---');
const test4Data = {
  endLocation: "End Location",
  endLatitude: "40.7589",
  endLongitude: "-73.9851"
};

const result4 = endTripSchema.safeParse(test4Data);
console.log('End trip result:', result4.success);
if (result4.success) {
  console.log('Parsed data types:', {
    endLatitude: `${result4.data.endLatitude} (${typeof result4.data.endLatitude})`,
    endLongitude: `${result4.data.endLongitude} (${typeof result4.data.endLongitude})`
  });
}

// Test 5: Optional coordinates (should work without coordinates)
console.log('\n--- Test 5: Optional coordinates ---');
const test5Data = {
  driverId: "123e4567-e89b-12d3-a456-426614174000",
  vehicleId: "123e4567-e89b-12d3-a456-426614174001",
  startLocation: "Test Location"
  // No coordinates provided
};

const result5 = startTripSchema.safeParse(test5Data);
console.log('No coordinates result:', result5.success);
if (result5.success) {
  console.log('Coordinates are undefined:', {
    startLatitude: result5.data.startLatitude,
    startLongitude: result5.data.startLongitude
  });
}

console.log('\n✅ Coordinate validation tests completed!');