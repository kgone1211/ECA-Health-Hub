import { NextRequest, NextResponse } from 'next/server';
import { supabaseAdmin } from '@/lib/supabase';

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

    const { data, error } = await supabaseAdmin
      .from('macro_targets')
      .select('*')
      .eq('user_id', parseInt(userId))
      .single();

    if (error && error.code !== 'PGRST116') {
      console.error('Error fetching macro targets:', error);
      return NextResponse.json(
        { error: 'Failed to fetch macro targets' },
        { status: 500 }
      );
    }

    return NextResponse.json({
      success: true,
      target: data || null
    });

  } catch (error) {
    console.error('Error fetching macro targets:', error);
    return NextResponse.json(
      { error: 'Failed to fetch macro targets', details: error instanceof Error ? error.message : 'Unknown error' },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { userId, calories, protein, carbs, fats, notes } = body;

    if (!userId || !calories || !protein || !carbs || !fats) {
      return NextResponse.json(
        { error: 'Missing required fields' },
        { status: 400 }
      );
    }

    // Upsert (update if exists, insert if not)
    const { data, error } = await supabaseAdmin
      .from('macro_targets')
      .upsert({
        user_id: parseInt(userId),
        calories: parseInt(calories),
        protein: parseFloat(protein),
        carbs: parseFloat(carbs),
        fats: parseFloat(fats),
        notes: notes || null,
        updated_at: new Date().toISOString()
      }, {
        onConflict: 'user_id'
      })
      .select()
      .single();

    if (error) {
      console.error('Error setting macro targets:', error);
      return NextResponse.json(
        { error: 'Failed to set macro targets', details: error.message },
        { status: 500 }
      );
    }

    return NextResponse.json({
      success: true,
      target: data,
      message: 'Macro targets set successfully'
    });

  } catch (error) {
    console.error('Error setting macro targets:', error);
    return NextResponse.json(
      { error: 'Failed to set macro targets', details: error instanceof Error ? error.message : 'Unknown error' },
      { status: 500 }
    );
  }
}

