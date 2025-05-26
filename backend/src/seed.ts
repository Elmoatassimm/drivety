import { PrismaClient, UserRole } from "@prisma/client";
import * as bcrypt from "bcryptjs";
import * as fs from 'fs';

const prisma = new PrismaClient();

// Helper function to generate a future date
const getFutureDate = (months: number): Date => {
  const date = new Date();
  date.setMonth(date.getMonth() + months);
  return date;
};

// Helper function to generate a random number between min and max
const getRandomNumber = (min: number, max: number): number => {
  return Math.floor(Math.random() * (max - min + 1)) + min;
};

async function main() {
  try {
    console.log("Starting database seeding...");

    // Create users with different roles
    console.log("Creating users...");
    const adminPassword = await bcrypt.hash("admin123", 10);
    const userPassword = await bcrypt.hash("password123", 10);
    const techPassword = await bcrypt.hash("tech123", 10);
    const managerPassword = await bcrypt.hash("manager123", 10);

    const admin = await prisma.user.upsert({
      where: { email: "admin@drivety.com" },
      update: {},
      create: {
        email: "admin@drivety.com",
        password: adminPassword,
        role: UserRole.ADMIN,
      },
    });

    const user1 = await prisma.user.upsert({
      where: { email: "driver1@drivety.com" },
      update: {},
      create: {
        email: "driver1@drivety.com",
        password: userPassword,
        role: UserRole.USER,
      },
    });

    const user2 = await prisma.user.upsert({
      where: { email: "driver2@drivety.com" },
      update: {},
      create: {
        email: "driver2@drivety.com",
        password: userPassword,
        role: UserRole.USER,
      },
    });

    const technician = await prisma.user.upsert({
      where: { email: "tech@drivety.com" },
      update: {},
      create: {
        email: "tech@drivety.com",
        password: techPassword,
        role: UserRole.TECHNICIAN,
      },
    });

    const manager = await prisma.user.upsert({
      where: { email: "manager@drivety.com" },
      update: {},
      create: {
        email: "manager@drivety.com",
        password: managerPassword,
        role: UserRole.MANAGER,
      },
    });

    console.log("Users created successfully");

    // Create drivers for regular users
    console.log("Creating drivers...");
    const driver1 = await prisma.driver.upsert({
      where: { userId: user1.id },
      update: {},
      create: {
        userId: user1.id,
        name: "John Driver",
        licenseNumber: "DL12345678",
        licenseExpiry: getFutureDate(24), // 2 years in the future
        phoneNumber: "+1234567890",
        driverScore: 85.5,
      },
    });

    const driver2 = await prisma.driver.upsert({
      where: { userId: user2.id },
      update: {},
      create: {
        userId: user2.id,
        name: "Jane Driver",
        licenseNumber: "DL87654321",
        licenseExpiry: getFutureDate(18), // 1.5 years in the future
        phoneNumber: "+9876543210",
        driverScore: 92.0,
      },
    });

    console.log("Drivers created successfully");

    // Create vehicles
    console.log("Creating vehicles...");
    const vehicle1 = await prisma.vehicle.upsert({
      where: { plateNumber: "ABC123" },
      update: {},
      create: {
        model: "Toyota Camry",
        year: 2022,
        plateNumber: "ABC123",
        status: "ACTIVE",
        fuelType: "GASOLINE",
        fuelLevel: 75.5,
        insuranceExpiry: getFutureDate(12), // 1 year in the future
      },
    });

    const vehicle2 = await prisma.vehicle.upsert({
      where: { plateNumber: "XYZ789" },
      update: {},
      create: {
        model: "Honda Civic",
        year: 2021,
        plateNumber: "XYZ789",
        status: "MAINTENANCE",
        fuelType: "GASOLINE",
        fuelLevel: 45.0,
        insuranceExpiry: getFutureDate(9), // 9 months in the future
      },
    });

    const vehicle3 = await prisma.vehicle.upsert({
      where: { plateNumber: "DEF456" },
      update: {},
      create: {
        model: "Tesla Model 3",
        year: 2023,
        plateNumber: "DEF456",
        status: "ACTIVE",
        fuelType: "ELECTRIC",
        fuelLevel: 90.0,
        insuranceExpiry: getFutureDate(15), // 15 months in the future
      },
    });

    console.log("Vehicles created successfully");

    // Assign drivers to vehicles
    console.log("Assigning drivers to vehicles...");
    await prisma.driverVehicleAssignment.deleteMany({
      where: {
        OR: [
          { driverId: driver1.id },
          { driverId: driver2.id }
        ]
      }
    });

    await prisma.driverVehicleAssignment.create({
      data: {
        driverId: driver1.id,
        vehicleId: vehicle1.id,
      },
    });

    await prisma.driverVehicleAssignment.create({
      data: {
        driverId: driver2.id,
        vehicleId: vehicle3.id,
      },
    });

    console.log("Driver-vehicle assignments created successfully");

    // Create components for vehicles
    console.log("Creating components...");

    // Components for Vehicle 1 (Toyota Camry)
    const vehicle1Engine = await prisma.component.create({
      data: {
        vehicleId: vehicle1.id,
        componentType: "ENGINE",
        name: "2.5L 4-Cylinder Engine",
        status: "GOOD",
        healthScore: 92.5,
        expectedLifespan: 150000,
        metadata: JSON.stringify({
          manufacturer: "Toyota",
          serialNumber: "ENG-TOY-12345",
          installationDate: "2022-01-15"
        }),
      },
    });

    const vehicle1Transmission = await prisma.component.create({
      data: {
        vehicleId: vehicle1.id,
        componentType: "TRANSMISSION",
        name: "8-Speed Automatic Transmission",
        status: "GOOD",
        healthScore: 95.0,
        expectedLifespan: 120000,
        metadata: JSON.stringify({
          manufacturer: "Toyota",
          serialNumber: "TRANS-TOY-67890",
          installationDate: "2022-01-15"
        }),
      },
    });

    const vehicle1Brakes = await prisma.component.create({
      data: {
        vehicleId: vehicle1.id,
        componentType: "BRAKES",
        name: "Disc Brakes",
        status: "FAIR",
        healthScore: 78.5,
        expectedLifespan: 50000,
        metadata: JSON.stringify({
          manufacturer: "Brembo",
          serialNumber: "BRK-BRM-54321",
          installationDate: "2022-01-15"
        }),
      },
    });

    // Components for Vehicle 2 (Honda Civic)
    const vehicle2Engine = await prisma.component.create({
      data: {
        vehicleId: vehicle2.id,
        componentType: "ENGINE",
        name: "1.5L Turbo Engine",
        status: "NEEDS_ATTENTION",
        healthScore: 65.0,
        expectedLifespan: 130000,
        metadata: JSON.stringify({
          manufacturer: "Honda",
          serialNumber: "ENG-HON-54321",
          installationDate: "2021-05-20"
        }),
      },
    });

    const vehicle2Transmission = await prisma.component.create({
      data: {
        vehicleId: vehicle2.id,
        componentType: "TRANSMISSION",
        name: "CVT Transmission",
        status: "GOOD",
        healthScore: 88.0,
        expectedLifespan: 100000,
        metadata: JSON.stringify({
          manufacturer: "Honda",
          serialNumber: "TRANS-HON-98765",
          installationDate: "2021-05-20"
        }),
      },
    });

    // Components for Vehicle 3 (Tesla Model 3)
    const vehicle3Motor = await prisma.component.create({
      data: {
        vehicleId: vehicle3.id,
        componentType: "MOTOR",
        name: "Electric Motor",
        status: "EXCELLENT",
        healthScore: 98.0,
        expectedLifespan: 200000,
        metadata: JSON.stringify({
          manufacturer: "Tesla",
          serialNumber: "MOT-TES-12345",
          installationDate: "2023-03-10"
        }),
      },
    });

    const vehicle3Battery = await prisma.component.create({
      data: {
        vehicleId: vehicle3.id,
        componentType: "BATTERY",
        name: "75kWh Lithium-Ion Battery",
        status: "GOOD",
        healthScore: 94.0,
        expectedLifespan: 160000,
        metadata: JSON.stringify({
          manufacturer: "Tesla",
          serialNumber: "BAT-TES-67890",
          installationDate: "2023-03-10"
        }),
      },
    });

    console.log("Components created successfully");

    // Create maintenance records
    console.log("Creating maintenance records...");

    await prisma.maintenance.create({
      data: {
        vehicleId: vehicle1.id,
        componentId: vehicle1Engine.id,
        maintenanceType: "OIL_CHANGE",
        description: "Regular oil change and filter replacement",
        metadata: JSON.stringify({
          technician: "Mike Smith",
          oilType: "5W-30 Synthetic",
          cost: 49.99
        }),
      },
    });

    await prisma.maintenance.create({
      data: {
        vehicleId: vehicle1.id,
        componentId: vehicle1Brakes.id,
        maintenanceType: "REPAIR",
        description: "Brake pad replacement",
        metadata: JSON.stringify({
          technician: "Mike Smith",
          parts: "Brembo Ceramic Pads",
          cost: 199.99
        }),
      },
    });

    await prisma.maintenance.create({
      data: {
        vehicleId: vehicle2.id,
        componentId: vehicle2Engine.id,
        maintenanceType: "INSPECTION",
        description: "Engine diagnostic due to check engine light",
        metadata: JSON.stringify({
          technician: "Sarah Johnson",
          findings: "Faulty oxygen sensor",
          recommendation: "Replace sensor"
        }),
      },
    });

    console.log("Maintenance records created successfully");

    // Create alerts
    console.log("Creating alerts...");

    await prisma.alert.create({
      data: {
        type: "COMPONENT_ISSUE",
        vehicleId: vehicle2.id,
        componentId: vehicle2Engine.id,
        message: "Engine performance degraded. Maintenance required.",
        actionRequired: true,
      },
    });

    await prisma.alert.create({
      data: {
        type: "MAINTENANCE_DUE",
        vehicleId: vehicle1.id,
        componentId: vehicle1Brakes.id,
        message: "Brake pads at 30% life. Schedule replacement soon.",
        actionRequired: false,
      },
    });

    console.log("Alerts created successfully");

    // Save the IDs to a file for Postman
    const postmanData = {
      userId: user1.id,
      adminId: admin.id,
      driverId: driver1.id,
      vehicleId: vehicle1.id,
      componentId: vehicle1Engine.id,
    };

    fs.writeFileSync('seeded_ids.json', JSON.stringify(postmanData, null, 2));

    console.log("Seed data created successfully:");
    console.log("Admin User:", admin.email);
    console.log("Regular User:", user1.email);
    console.log("Driver:", driver1.name);
    console.log("Vehicle:", vehicle1.model);
    console.log("Component:", vehicle1Engine.name);
    console.log("IDs saved to seeded_ids.json for Postman update");

  } catch (error) {
    console.error("Error seeding database:", error);
  } finally {
    await prisma.$disconnect();
  }
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
