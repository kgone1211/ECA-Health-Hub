import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/lib/database';

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const userId = searchParams.get('userId');
    const metricType = searchParams.get('metricType');
    const startDate = searchParams.get('startDate');
    const endDate = searchParams.get('endDate');

    if (!userId) {
      return NextResponse.json(
        { error: 'User ID is required' },
        { status: 400 }
      );
    }

    let metrics;
    
    if (startDate && endDate) {
      metrics = await db.getHealthMetricsByDateRange(
        parseInt(userId),
        new Date(startDate),
        new Date(endDate),
        metricType || undefined
      );
    } else {
      metrics = await db.getHealthMetrics(
        parseInt(userId),
        metricType || undefined
      );
    }

    return NextResponse.json({
      success: true,
      metrics: metrics || []
    });

  } catch (error) {
    console.error('Error fetching health metrics:', error);
    return NextResponse.json(
      { error: 'Failed to fetch health metrics', details: error instanceof Error ? error.message : 'Unknown error' },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { userId, metricType, value, unit, notes } = body;

    if (!userId || !metricType || value === undefined) {
      return NextResponse.json(
        { error: 'Missing required fields: userId, metricType, and value are required' },
        { status: 400 }
      );
    }

    const metric = await db.addHealthMetric(
      parseInt(userId),
      metricType,
      parseFloat(value),
      unit || '',
      notes
    );

    if (!metric) {
      return NextResponse.json(
        { error: 'Failed to create health metric' },
        { status: 500 }
      );
    }

    return NextResponse.json({
      success: true,
      metric,
      message: 'Health metric added successfully'
    });

  } catch (error) {
    console.error('Error adding health metric:', error);
    return NextResponse.json(
      { error: 'Failed to add health metric', details: error instanceof Error ? error.message : 'Unknown error' },
      { status: 500 }
    );
  }
}

