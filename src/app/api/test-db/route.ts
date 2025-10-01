import { NextResponse } from 'next/server';
import { db } from '@/lib/database';

export async function GET() {
  try {
    console.log('🧪 Testing database connection...');

    // Test 1: Create a test user
    const user = await db.upsertUser(
      'test_whop_user_123',
      'test@example.com',
      'testuser',
      'Test User',
      false
    );

    if (!user) {
      return NextResponse.json({ 
        error: 'Failed to create user',
        details: 'User creation returned null - check Supabase connection and RLS policies'
      }, { status: 500 });
    }

    console.log('✅ User created successfully:', user);

    // Test 2: Add health metrics
    const weightMetric = await db.addHealthMetric(user.id, 'weight', 180, 'lbs', 'Starting weight');
    const stepsMetric = await db.addHealthMetric(user.id, 'steps', 10000, 'count', 'Daily steps');

    // Test 3: Create a goal
    const goal = await db.createGoal(
      user.id,
      'weight_loss',
      'Lose 10 pounds',
      'Track weight daily and exercise regularly',
      170,
      'lbs',
      new Date('2025-12-31')
    );

    // Test 4: Get dashboard stats
    const stats = await db.getUserDashboardStats(user.id);

    return NextResponse.json({
      success: true,
      message: '✅ Database is working perfectly!',
      testResults: {
        user: {
          id: user.id,
          email: user.email,
          username: user.username
        },
        metrics: {
          weight: weightMetric ? { value: weightMetric.value, unit: weightMetric.unit } : null,
          steps: stepsMetric ? { value: stepsMetric.value, unit: stepsMetric.unit } : null
        },
        goal: goal ? { title: goal.title, target: `${goal.target_value} ${goal.target_unit}` } : null,
        stats
      }
    });

  } catch (error) {
    console.error('❌ Database test failed:', error);
    return NextResponse.json({
      error: 'Database test failed',
      details: error instanceof Error ? error.message : String(error)
    }, { status: 500 });
  }
}

