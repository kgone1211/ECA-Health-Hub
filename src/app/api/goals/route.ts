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

    const goals = await db.getGoals(parseInt(userId));

    return NextResponse.json({
      success: true,
      goals: goals || []
    });

  } catch (error) {
    console.error('Error fetching goals:', error);
    return NextResponse.json(
      { error: 'Failed to fetch goals', details: error instanceof Error ? error.message : 'Unknown error' },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { userId, goalType, description, targetValue, targetDate, notes } = body;

    if (!userId || !description) {
      return NextResponse.json(
        { error: 'Missing required fields: userId and description are required' },
        { status: 400 }
      );
    }

    const goal = await db.createGoal(
      parseInt(userId),
      goalType || 'general',
      description,
      targetValue ? parseFloat(targetValue) : undefined,
      targetDate ? new Date(targetDate) : undefined,
      notes
    );

    if (!goal) {
      return NextResponse.json(
        { error: 'Failed to create goal' },
        { status: 500 }
      );
    }

    return NextResponse.json({
      success: true,
      goal,
      message: 'Goal created successfully'
    });

  } catch (error) {
    console.error('Error creating goal:', error);
    return NextResponse.json(
      { error: 'Failed to create goal', details: error instanceof Error ? error.message : 'Unknown error' },
      { status: 500 }
    );
  }
}

export async function PATCH(request: NextRequest) {
  try {
    const body = await request.json();
    const { goalId, currentValue, progress } = body;

    if (!goalId) {
      return NextResponse.json(
        { error: 'Goal ID is required' },
        { status: 400 }
      );
    }

    await db.updateGoalProgress(
      parseInt(goalId),
      currentValue !== undefined ? parseFloat(currentValue) : undefined,
      progress !== undefined ? parseInt(progress) : undefined
    );

    return NextResponse.json({
      success: true,
      message: 'Goal updated successfully'
    });

  } catch (error) {
    console.error('Error updating goal:', error);
    return NextResponse.json(
      { error: 'Failed to update goal', details: error instanceof Error ? error.message : 'Unknown error' },
      { status: 500 }
    );
  }
}

