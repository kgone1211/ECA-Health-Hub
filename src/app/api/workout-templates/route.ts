import { NextRequest, NextResponse } from 'next/server';
import { supabaseAdmin } from '@/lib/supabase';

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

    const { data, error } = await supabaseAdmin
      .from('workout_templates')
      .select('*')
      .eq('coach_id', parseInt(coachId))
      .order('created_at', { ascending: false });

    if (error) {
      console.error('Error fetching workout templates:', error);
      return NextResponse.json(
        { error: 'Failed to fetch workout templates' },
        { status: 500 }
      );
    }

    return NextResponse.json({
      success: true,
      templates: data || []
    });

  } catch (error) {
    console.error('Error fetching workout templates:', error);
    return NextResponse.json(
      { error: 'Failed to fetch workout templates', details: error instanceof Error ? error.message : 'Unknown error' },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { coachId, name, description, exercises, assignedTo } = body;

    if (!coachId || !name || !exercises || exercises.length === 0) {
      return NextResponse.json(
        { error: 'Missing required fields' },
        { status: 400 }
      );
    }

    const { data, error } = await supabaseAdmin
      .from('workout_templates')
      .insert({
        coach_id: parseInt(coachId),
        name: name,
        description: description || null,
        exercises: exercises,
        assigned_to: assignedTo || null
      })
      .select()
      .single();

    if (error) {
      console.error('Error creating workout template:', error);
      return NextResponse.json(
        { error: 'Failed to create workout template', details: error.message },
        { status: 500 }
      );
    }

    return NextResponse.json({
      success: true,
      template: data,
      message: 'Workout template created successfully'
    });

  } catch (error) {
    console.error('Error creating workout template:', error);
    return NextResponse.json(
      { error: 'Failed to create workout template', details: error instanceof Error ? error.message : 'Unknown error' },
      { status: 500 }
    );
  }
}

export async function PUT(request: NextRequest) {
  try {
    const body = await request.json();
    const { id, name, description, exercises, assignedTo } = body;

    if (!id || !name || !exercises) {
      return NextResponse.json(
        { error: 'Missing required fields' },
        { status: 400 }
      );
    }

    const { data, error } = await supabaseAdmin
      .from('workout_templates')
      .update({
        name,
        description: description || null,
        exercises,
        assigned_to: assignedTo || null,
        updated_at: new Date().toISOString()
      })
      .eq('id', parseInt(id))
      .select()
      .single();

    if (error) {
      console.error('Error updating workout template:', error);
      return NextResponse.json(
        { error: 'Failed to update workout template', details: error.message },
        { status: 500 }
      );
    }

    return NextResponse.json({
      success: true,
      template: data,
      message: 'Workout template updated successfully'
    });

  } catch (error) {
    console.error('Error updating workout template:', error);
    return NextResponse.json(
      { error: 'Failed to update workout template', details: error instanceof Error ? error.message : 'Unknown error' },
      { status: 500 }
    );
  }
}

export async function DELETE(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const id = searchParams.get('id');

    if (!id) {
      return NextResponse.json(
        { error: 'Template ID is required' },
        { status: 400 }
      );
    }

    const { error } = await supabaseAdmin
      .from('workout_templates')
      .delete()
      .eq('id', parseInt(id));

    if (error) {
      console.error('Error deleting workout template:', error);
      return NextResponse.json(
        { error: 'Failed to delete workout template', details: error.message },
        { status: 500 }
      );
    }

    return NextResponse.json({
      success: true,
      message: 'Workout template deleted successfully'
    });

  } catch (error) {
    console.error('Error deleting workout template:', error);
    return NextResponse.json(
      { error: 'Failed to delete workout template', details: error instanceof Error ? error.message : 'Unknown error' },
      { status: 500 }
    );
  }
}

