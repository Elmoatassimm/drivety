"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.DashboardController = void 0;
const common_1 = require("@nestjs/common");
let DashboardController = class DashboardController {
    getDashboardData() {
        const now = new Date().toISOString();
        return {
            summary_metrics: {
                active_vehicles: {
                    count: 42,
                    change_percentage: 5.2,
                    period: 'last_7_days'
                },
                fuel_efficiency: {
                    value: 12.5,
                    unit: 'km/l',
                    change_percentage: -1.3,
                    period: 'last_7_days'
                },
                active_alerts: {
                    count: 8,
                    change_percentage: -15.0,
                    period: 'last_7_days'
                },
                driver_score: {
                    average: 87,
                    unit: 'points',
                    change_percentage: 2.1,
                    period: 'last_7_days'
                }
            },
            fleet_overview: {
                total_vehicles: 50,
                active_vehicles: 42,
                in_maintenance: 5,
                inactive: 3,
                fleet_utilization: 84
            },
            driver_performance: [
                {
                    driver_id: 'DRV-001',
                    name: 'John Smith',
                    score: 92,
                    trips_completed: 18,
                    distance_km: 1250,
                    efficiency: 8.7
                },
                {
                    driver_id: 'DRV-002',
                    name: 'Sarah Johnson',
                    score: 89,
                    trips_completed: 15,
                    distance_km: 980,
                    efficiency: 9.2
                }
            ],
            alerts: [
                {
                    id: 'ALRT-001',
                    type: 'maintenance',
                    severity: 'medium',
                    vehicle_id: 'VH-001',
                    message: 'Oil change due in 500km',
                    timestamp: now
                },
                {
                    id: 'ALRT-002',
                    type: 'safety',
                    severity: 'high',
                    vehicle_id: 'VH-003',
                    message: 'Hard braking detected',
                    timestamp: now
                }
            ],
            trip_insights: [
                {
                    id: 'TRP-001',
                    vehicle_id: 'VH-001',
                    driver_id: 'DRV-001',
                    distance_km: 120,
                    duration_minutes: 95,
                    start_time: now,
                    end_time: now,
                    efficiency: 10.2
                }
            ],
            quick_actions: [
                {
                    id: 'ACT-001',
                    title: 'Schedule Maintenance',
                    description: 'Schedule routine maintenance for vehicles',
                    action: '/vehicles/maintenance',
                    icon: 'wrench'
                }
            ],
            ai_recommendations: [
                {
                    id: 'REC-001',
                    title: 'Optimize Routes',
                    description: 'AI suggests optimizing routes for 5 vehicles',
                    priority: 'high'
                }
            ],
            metadata: {
                last_updated: now,
                timezone: 'UTC',
                refresh_interval: 300,
                total_records: {
                    vehicles: 50,
                    drivers: 25
                }
            }
        };
    }
};
exports.DashboardController = DashboardController;
__decorate([
    (0, common_1.Get)(),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", Object)
], DashboardController.prototype, "getDashboardData", null);
exports.DashboardController = DashboardController = __decorate([
    (0, common_1.Controller)('dashboard')
], DashboardController);
