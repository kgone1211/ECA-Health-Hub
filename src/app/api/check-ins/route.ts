import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/lib/database';

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const userId = searchParams.get('userId');

    if (!userId) {
      return NextResponse.json(
        { error: 'User ID is required' },
        { status: 400 }
      );
    }

    // Get recent check-ins for the user
    const checkIns = await db.getHealthMetricsByDateRange(
      parseInt(userId),
      new Date(Date.now() - 30 * 24 * 60 * 60 * 1000), // Last 30 days
      new Date()
    );

    // Group by date to create daily check-ins
    const checkInsByDate = new Map();
    
    checkIns?.forEach(metric => {
      const date = new Date(metric.recorded_at).toDateString();
      if (!checkInsByDate.has(date)) {
        checkInsByDate.set(date, {
          id: metric.id,
          user_id: metric.user_id,
          check_in_date: metric.recorded_at,
          created_at: metric.recorded_at
        });
      }
      
      const checkIn = checkInsByDate.get(date);
      switch(metric.metric_type) {
        case 'weight':
          checkIn.weight = metric.value;
          break;
        case 'energy':
          checkIn.energy_level = metric.value;
          break;
        case 'sleep':
          checkIn.sleep_quality = metric.value;
          break;
        case 'mood':
          checkIn.mood = metric.value;
          break;
      }
      if (metric.notes) {
        checkIn.notes = metric.notes;
      }
    });

    const checkInsArray = Array.from(checkInsByDate.values()).sort((a, b) => 
      new Date(b.check_in_date).getTime() - new Date(a.check_in_date).getTime()
    );

    return NextResponse.json({
      success: true,
      checkIns: checkInsArray
    });

  } catch (error) {
    console.error('Error fetching check-ins:', error);
    return NextResponse.json(
      { error: 'Failed to fetch check-ins', details: error instanceof Error ? error.message : 'Unknown error' },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { userId, weight, energyLevel, sleepQuality, mood, notes } = body;

    if (!userId) {
      return NextResponse.json(
        { error: 'User ID is required' },
        { status: 400 }
      );
    }

    const checkInDate = new Date();
    const metrics = [];

    // Add weight if provided
    if (weight) {
      const weightMetric = await db.addHealthMetric(
        parseInt(userId),
        'weight',
        parseFloat(weight),
        'lbs',
        notes
      );
      if (weightMetric) metrics.push(weightMetric);
    }

    // Add energy level
    if (energyLevel) {
      const energyMetric = await db.addHealthMetric(
        parseInt(userId),
        'energy',
        parseInt(energyLevel),
        '1-10',
        weight ? undefined : notes // Only add notes once
      );
      if (energyMetric) metrics.push(energyMetric);
    }

    // Add sleep quality
    if (sleepQuality) {
      const sleepMetric = await db.addHealthMetric(
        parseInt(userId),
        'sleep',
        parseInt(sleepQuality),
        '1-10'
      );
      if (sleepMetric) metrics.push(sleepMetric);
    }

    // Add mood
    if (mood) {
      const moodMetric = await db.addHealthMetric(
        parseInt(userId),
        'mood',
        parseInt(mood),
        '1-10'
      );
      if (moodMetric) metrics.push(moodMetric);
    }

    if (metrics.length === 0) {
      return NextResponse.json(
        { error: 'No metrics provided' },
        { status: 400 }
      );
    }

    // Return a combined check-in object
    const checkIn = {
      id: metrics[0].id,
      user_id: parseInt(userId),
      check_in_date: checkInDate.toISOString(),
      weight: weight ? parseFloat(weight) : undefined,
      energy_level: energyLevel ? parseInt(energyLevel) : undefined,
      sleep_quality: sleepQuality ? parseInt(sleepQuality) : undefined,
      mood: mood ? parseInt(mood) : undefined,
      notes: notes || undefined,
      created_at: checkInDate.toISOString()
    };

    return NextResponse.json({
      success: true,
      checkIn,
      message: 'Check-in saved successfully'
    });

  } catch (error) {
    console.error('Error saving check-in:', error);
    return NextResponse.json(
      { error: 'Failed to save check-in', details: error instanceof Error ? error.message : 'Unknown error' },
      { status: 500 }
    );
  }
}

