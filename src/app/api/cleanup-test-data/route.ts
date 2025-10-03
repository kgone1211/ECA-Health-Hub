import { NextResponse } from 'next/server';
import { supabaseAdmin } from '@/lib/supabase';

export async function POST() {
  try {
    console.log('🧹 Cleaning up test data...');

    // Delete test users and all related data (cascading deletes will handle the rest)
    const testUserIds = [
      'test_whop_user_123',
      'coach1_whop_id',
      'coach2_whop_id',
      'client1_whop_id',
      'client2_whop_id',
      'client3_whop_id'
    ];

    let deletedCount = 0;

    for (const whopUserId of testUserIds) {
      const { error, count } = await supabaseAdmin
        .from('users')
        .delete()
        .eq('whop_user_id', whopUserId);

      if (!error && count) {
        deletedCount += count;
      }
    }

    // Also delete any users with test emails
    const { error: emailError } = await supabaseAdmin
      .from('users')
      .delete()
      .or('email.like.%test%,email.like.%coach%,email.like.%client%');

    return NextResponse.json({
      success: true,
      message: '✅ Test data cleaned up successfully!',
      deletedUsers: deletedCount,
      note: 'All related data (metrics, goals, sessions, etc.) was automatically deleted via cascading deletes'
    });

  } catch (error) {
    console.error('❌ Cleanup failed:', error);
    return NextResponse.json({
      error: 'Cleanup failed',
      details: error instanceof Error ? error.message : String(error)
    }, { status: 500 });
  }
}

export async function GET() {
  return NextResponse.json({
    message: 'Cleanup test data endpoint',
    usage: 'Send POST request to delete all test data',
    warning: 'This will delete all users with test/coach/client in their email or specific test whop_user_ids'
  });
}

