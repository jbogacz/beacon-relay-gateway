// app/api/health/route.ts
import { NextRequest, NextResponse } from 'next/server';

interface HealthStatus {
  status: 'healthy' | 'unhealthy';
  timestamp: string;
  uptime: number;
  environment: string;
  nodeVersion: string;
  memory: {
    used: number;
    total: number;
    percentage: number;
    unit: string;
  };
  cloudRun?: {
    service: string;
    revision: string;
    region: string;
  };
  checks: {
    database?: 'healthy' | 'unhealthy';
    externalApi?: 'healthy' | 'unhealthy';
    dependencies?: 'healthy' | 'unhealthy';
  };
}

export async function GET(request: NextRequest): Promise<NextResponse<HealthStatus>> {
  try {
    const memoryUsage = process.memoryUsage();
    const memoryUsedMB = Math.round(memoryUsage.heapUsed / 1024 / 1024);
    const memoryTotalMB = Math.round(memoryUsage.heapTotal / 1024 / 1024);

    // Perform additional health checks
    const checks = await performHealthChecks();

    // Determine overall health status
    const isHealthy = Object.values(checks).every(status => status === 'healthy');

    const healthStatus: HealthStatus = {
      status: isHealthy ? 'healthy' : 'unhealthy',
      timestamp: new Date().toISOString(),
      uptime: Math.round(process.uptime()),
      environment: process.env.NODE_ENV || 'development',
      nodeVersion: process.version,
      memory: {
        used: memoryUsedMB,
        total: memoryTotalMB,
        percentage: Math.round((memoryUsedMB / memoryTotalMB) * 100),
        unit: 'MB'
      },
      cloudRun: {
        service: process.env.K_SERVICE || 'local',
        revision: process.env.K_REVISION || 'local',
        region: process.env.K_REGION || 'local'
      },
      checks
    };

    // Return appropriate HTTP status code
    const httpStatus = isHealthy ? 200 : 503;

    return NextResponse.json(healthStatus, { status: httpStatus });

  } catch (error) {
    console.error('Health check failed:', error);

    const errorResponse: HealthStatus = {
      status: 'unhealthy',
      timestamp: new Date().toISOString(),
      uptime: 0,
      environment: process.env.NODE_ENV || 'development',
      nodeVersion: process.version,
      memory: { used: 0, total: 0, percentage: 0, unit: 'MB' },
      checks: {}
    };

    return NextResponse.json(errorResponse, { status: 503 });
  }
}

// Perform additional health checks
async function performHealthChecks(): Promise<{
  database?: 'healthy' | 'unhealthy';
  externalApi?: 'healthy' | 'unhealthy';
  dependencies?: 'healthy' | 'unhealthy';
}> {
  const checks: {
    database?: 'healthy' | 'unhealthy';
    externalApi?: 'healthy' | 'unhealthy';
    dependencies?: 'healthy' | 'unhealthy';
  } = {};

  try {
    // Example: Database health check
    // if (database) {
    //   await database.query('SELECT 1');
    //   checks.database = 'healthy';
    // }

    // Example: External API health check
    // const apiResponse = await fetch('https://api.example.com/health', {
    //   timeout: 5000
    // });
    // checks.externalApi = apiResponse.ok ? 'healthy' : 'unhealthy';

    // Example: Basic dependency check
    checks.dependencies = 'healthy';

    return checks;
  } catch (error) {
    console.error('Health check dependency failed:', error);
    return {
      database: 'unhealthy',
      externalApi: 'unhealthy',
      dependencies: 'unhealthy'
    };
  }
}
