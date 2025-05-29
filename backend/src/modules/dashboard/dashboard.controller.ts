import { Request, Response } from 'express';
import { Controller, Get } from '@nestjs/common';

interface DashboardResponse {
  summary_metrics: {
    active_vehicles: {
      count: number;
      change_percentage: number;
      period: string;
    };
    fuel_efficiency: {
      value: number;
      unit: string;
      change_percentage: number;
      period: string;
    };
    active_alerts: {
      count: number;
      change_percentage: number;
      period: string;
    };
    driver_score: {
      average: number;
      unit: string;
      change_percentage: number;
      period: string;
    };
  };
  fleet_overview: {
    total_vehicles: number;
    active_vehicles: number;
    in_maintenance: number;
    inactive: number;
    fleet_utilization: number;
  };
  driver_performance: Array<{
    driver_id: string;
    name: string;
    score: number;
    trips_completed: number;
    distance_km: number;
    efficiency: number;
  }>;
  alerts: Array<{
    id: string;
    type: string;
    severity: 'low' | 'medium' | 'high';
    vehicle_id: string;
    message: string;
    timestamp: string;
  }>;
  trip_insights: Array<{
    id: string;
    vehicle_id: string;
    driver_id: string;
    distance_km: number;
    duration_minutes: number;
    start_time: string;
    end_time: string;
    efficiency: number;
  }>;
  quick_actions: Array<{
    id: string;
    title: string;
    description: string;
    action: string;
    icon: string;
  }>;
  ai_recommendations: Array<{
    id: string;
    title: string;
    description: string;
    priority: 'low' | 'medium' | 'high';
  }>;
  metadata: {
    last_updated: string;
    timezone: string;
    refresh_interval: number;
    total_records: {
      vehicles: number;
      drivers: number;
    };
  };
}

@Controller('dashboard')
export class DashboardController {
  @Get()
  getDashboardData(): DashboardResponse {
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
}