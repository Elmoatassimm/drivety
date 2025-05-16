"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __generator = (this && this.__generator) || function (thisArg, body) {
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g = Object.create((typeof Iterator === "function" ? Iterator : Object).prototype);
    return g.next = verb(0), g["throw"] = verb(1), g["return"] = verb(2), typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (g && (g = 0, op[0] && (_ = 0)), _) try {
            if (f = 1, y && (t = op[0] & 2 ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [op[0] & 2, t.value];
            switch (op[0]) {
                case 0: case 1: t = op; break;
                case 4: _.label++; return { value: op[1], done: false };
                case 5: _.label++; y = op[1]; op = [0]; continue;
                case 7: op = _.ops.pop(); _.trys.pop(); continue;
                default:
                    if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                    if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                    if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                    if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                    if (t[2]) _.ops.pop();
                    _.trys.pop(); continue;
            }
            op = body.call(thisArg, _);
        } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
        if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
    }
};
Object.defineProperty(exports, "__esModule", { value: true });
var client_1 = require("@prisma/client");
var bcrypt = require("bcryptjs");
var fs = require("fs");
var prisma = new client_1.PrismaClient();
// Helper function to generate a future date
var getFutureDate = function (months) {
    var date = new Date();
    date.setMonth(date.getMonth() + months);
    return date;
};
// Helper function to generate a random number between min and max
var getRandomNumber = function (min, max) {
    return Math.floor(Math.random() * (max - min + 1)) + min;
};
function main() {
    return __awaiter(this, void 0, void 0, function () {
        var adminPassword, userPassword, techPassword, managerPassword, admin, user1, user2, technician, manager, driver1, driver2, vehicle1, vehicle2, vehicle3, vehicle1Engine, vehicle1Transmission, vehicle1Brakes, vehicle2Engine, vehicle2Transmission, vehicle3Motor, vehicle3Battery, postmanData, error_1;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    _a.trys.push([0, 30, 31, 33]);
                    console.log("Starting database seeding...");
                    // Create users with different roles
                    console.log("Creating users...");
                    return [4 /*yield*/, bcrypt.hash("admin123", 10)];
                case 1:
                    adminPassword = _a.sent();
                    return [4 /*yield*/, bcrypt.hash("password123", 10)];
                case 2:
                    userPassword = _a.sent();
                    return [4 /*yield*/, bcrypt.hash("tech123", 10)];
                case 3:
                    techPassword = _a.sent();
                    return [4 /*yield*/, bcrypt.hash("manager123", 10)];
                case 4:
                    managerPassword = _a.sent();
                    return [4 /*yield*/, prisma.user.upsert({
                            where: { email: "admin@drivety.com" },
                            update: {},
                            create: {
                                email: "admin@drivety.com",
                                password: adminPassword,
                                role: "ADMIN",
                            },
                        })];
                case 5:
                    admin = _a.sent();
                    return [4 /*yield*/, prisma.user.upsert({
                            where: { email: "driver1@drivety.com" },
                            update: {},
                            create: {
                                email: "driver1@drivety.com",
                                password: userPassword,
                                role: "USER",
                            },
                        })];
                case 6:
                    user1 = _a.sent();
                    return [4 /*yield*/, prisma.user.upsert({
                            where: { email: "driver2@drivety.com" },
                            update: {},
                            create: {
                                email: "driver2@drivety.com",
                                password: userPassword,
                                role: "USER",
                            },
                        })];
                case 7:
                    user2 = _a.sent();
                    return [4 /*yield*/, prisma.user.upsert({
                            where: { email: "tech@drivety.com" },
                            update: {},
                            create: {
                                email: "tech@drivety.com",
                                password: techPassword,
                                role: "TECHNICIAN",
                            },
                        })];
                case 8:
                    technician = _a.sent();
                    return [4 /*yield*/, prisma.user.upsert({
                            where: { email: "manager@drivety.com" },
                            update: {},
                            create: {
                                email: "manager@drivety.com",
                                password: managerPassword,
                                role: "MANAGER",
                            },
                        })];
                case 9:
                    manager = _a.sent();
                    console.log("Users created successfully");
                    // Create drivers for regular users
                    console.log("Creating drivers...");
                    return [4 /*yield*/, prisma.driver.upsert({
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
                        })];
                case 10:
                    driver1 = _a.sent();
                    return [4 /*yield*/, prisma.driver.upsert({
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
                        })];
                case 11:
                    driver2 = _a.sent();
                    console.log("Drivers created successfully");
                    // Create vehicles
                    console.log("Creating vehicles...");
                    return [4 /*yield*/, prisma.vehicle.upsert({
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
                        })];
                case 12:
                    vehicle1 = _a.sent();
                    return [4 /*yield*/, prisma.vehicle.upsert({
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
                        })];
                case 13:
                    vehicle2 = _a.sent();
                    return [4 /*yield*/, prisma.vehicle.upsert({
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
                        })];
                case 14:
                    vehicle3 = _a.sent();
                    console.log("Vehicles created successfully");
                    // Assign drivers to vehicles
                    console.log("Assigning drivers to vehicles...");
                    return [4 /*yield*/, prisma.driverVehicleAssignment.deleteMany({
                            where: {
                                OR: [
                                    { driverId: driver1.id },
                                    { driverId: driver2.id }
                                ]
                            }
                        })];
                case 15:
                    _a.sent();
                    return [4 /*yield*/, prisma.driverVehicleAssignment.create({
                            data: {
                                driverId: driver1.id,
                                vehicleId: vehicle1.id,
                            },
                        })];
                case 16:
                    _a.sent();
                    return [4 /*yield*/, prisma.driverVehicleAssignment.create({
                            data: {
                                driverId: driver2.id,
                                vehicleId: vehicle3.id,
                            },
                        })];
                case 17:
                    _a.sent();
                    console.log("Driver-vehicle assignments created successfully");
                    // Create components for vehicles
                    console.log("Creating components...");
                    return [4 /*yield*/, prisma.component.create({
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
                        })];
                case 18:
                    vehicle1Engine = _a.sent();
                    return [4 /*yield*/, prisma.component.create({
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
                        })];
                case 19:
                    vehicle1Transmission = _a.sent();
                    return [4 /*yield*/, prisma.component.create({
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
                        })];
                case 20:
                    vehicle1Brakes = _a.sent();
                    return [4 /*yield*/, prisma.component.create({
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
                        })];
                case 21:
                    vehicle2Engine = _a.sent();
                    return [4 /*yield*/, prisma.component.create({
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
                        })];
                case 22:
                    vehicle2Transmission = _a.sent();
                    return [4 /*yield*/, prisma.component.create({
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
                        })];
                case 23:
                    vehicle3Motor = _a.sent();
                    return [4 /*yield*/, prisma.component.create({
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
                        })];
                case 24:
                    vehicle3Battery = _a.sent();
                    console.log("Components created successfully");
                    // Create maintenance records
                    console.log("Creating maintenance records...");
                    return [4 /*yield*/, prisma.maintenance.create({
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
                        })];
                case 25:
                    _a.sent();
                    return [4 /*yield*/, prisma.maintenance.create({
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
                        })];
                case 26:
                    _a.sent();
                    return [4 /*yield*/, prisma.maintenance.create({
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
                        })];
                case 27:
                    _a.sent();
                    console.log("Maintenance records created successfully");
                    // Create alerts
                    console.log("Creating alerts...");
                    return [4 /*yield*/, prisma.alert.create({
                            data: {
                                type: "COMPONENT_ISSUE",
                                vehicleId: vehicle2.id,
                                componentId: vehicle2Engine.id,
                                message: "Engine performance degraded. Maintenance required.",
                                actionRequired: true,
                            },
                        })];
                case 28:
                    _a.sent();
                    return [4 /*yield*/, prisma.alert.create({
                            data: {
                                type: "MAINTENANCE_DUE",
                                vehicleId: vehicle1.id,
                                componentId: vehicle1Brakes.id,
                                message: "Brake pads at 30% life. Schedule replacement soon.",
                                actionRequired: false,
                            },
                        })];
                case 29:
                    _a.sent();
                    console.log("Alerts created successfully");
                    postmanData = {
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
                    return [3 /*break*/, 33];
                case 30:
                    error_1 = _a.sent();
                    console.error("Error seeding database:", error_1);
                    return [3 /*break*/, 33];
                case 31: return [4 /*yield*/, prisma.$disconnect()];
                case 32:
                    _a.sent();
                    return [7 /*endfinally*/];
                case 33: return [2 /*return*/];
            }
        });
    });
}
main()
    .catch(function (e) {
    console.error(e);
    process.exit(1);
})
    .finally(function () { return __awaiter(void 0, void 0, void 0, function () {
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0: return [4 /*yield*/, prisma.$disconnect()];
            case 1:
                _a.sent();
                return [2 /*return*/];
        }
    });
}); });
