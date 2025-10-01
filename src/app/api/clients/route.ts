import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/lib/database';

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const coachId = searchParams.get('coachId');

    if (!coachId) {
      return NextResponse.json(
        { error: 'Coach ID is required' },
        { status: 400 }
      );
    }

    const clients = await db.getCoachClients(parseInt(coachId));

    return NextResponse.json({
      success: true,
      clients: clients || []
    });

  } catch (error) {
    console.error('Error fetching clients:', error);
    return NextResponse.json(
      { error: 'Failed to fetch clients', details: error instanceof Error ? error.message : 'Unknown error' },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { coachId, name, email, phone, initialGoals, notes } = body;

    if (!coachId || !name || !email) {
      return NextResponse.json(
        { error: 'Missing required fields: coachId, name, and email are required' },
        { status: 400 }
      );
    }

    // Create user first
    const userId = await db.upsertUser(email, undefined, undefined, name);

    // Add client to coach
    await db.addClientToCoach(parseInt(coachId), userId);

    // If initial goals provided, create a goal
    if (initialGoals) {
      await db.createGoal(
        userId,
        'general',
        initialGoals,
        undefined,
        undefined,
        notes
      );
    }

    return NextResponse.json({
      success: true,
      userId,
      message: 'Client added successfully'
    });

  } catch (error) {
    console.error('Error adding client:', error);
    return NextResponse.json(
      { error: 'Failed to add client', details: error instanceof Error ? error.message : 'Unknown error' },
      { status: 500 }
    );
  }
}

