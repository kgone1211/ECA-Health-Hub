import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/lib/database';

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const userId = searchParams.get('userId');
    const action = searchParams.get('action');

    if (!userId) {
      return NextResponse.json({ error: 'User ID is required' }, { status: 400 });
    }

    const userIdNum = parseInt(userId);

    switch (action) {
      case 'points':
        const points = await db.getUserPoints(userIdNum);
        return NextResponse.json({ points });

      case 'achievements':
        const userAchievements = await db.getUserAchievements(userIdNum);
        const allAchievements = await db.getAllAchievements();
        return NextResponse.json({ userAchievements, allAchievements });

      case 'leaderboard':
        const leaderboard = await db.getLeaderboard(10);
        return NextResponse.json({ leaderboard });

      case 'challenges':
        const userChallenges = await db.getUserChallenges(userIdNum);
        const activeChallenges = await db.getActiveChallenges();
        return NextResponse.json({ userChallenges, activeChallenges });

      case 'streaks':
        const dailyStreak = await db.getStreak(userIdNum, 'daily_checkin');
        const metricsStreak = await db.getStreak(userIdNum, 'metrics_logging');
        const sessionStreak = await db.getStreak(userIdNum, 'session_attendance');
        return NextResponse.json({ 
          streaks: {
            daily_checkin: dailyStreak,
            metrics_logging: metricsStreak,
            session_attendance: sessionStreak
          }
        });

      case 'transactions':
        const transactions = await db.getPointsTransactions(userIdNum, 20);
        return NextResponse.json({ transactions });

      default:
        // Return all gamification data
        const data = {
          points: await db.getUserPoints(userIdNum),
          achievements: await db.getUserAchievements(userIdNum),
          challenges: await db.getUserChallenges(userIdNum),
          transactions: await db.getPointsTransactions(userIdNum, 10)
        };
        return NextResponse.json(data);
    }
  } catch (error) {
    console.error('Gamification API error:', error);
    return NextResponse.json(
      { error: 'Failed to fetch gamification data' },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { action, userId, ...params } = body;

    if (!userId) {
      return NextResponse.json({ error: 'User ID is required' }, { status: 400 });
    }

    switch (action) {
      case 'add_points':
        const { points, reason, referenceType, referenceId } = params;
        const success = await db.addPoints(userId, points, reason, referenceType, referenceId);
        return NextResponse.json({ success });

      case 'join_challenge':
        const { challengeId } = params;
        const joined = await db.joinChallenge(userId, challengeId);
        return NextResponse.json({ success: joined });

      case 'update_streak':
        const { streakType } = params;
        const updated = await db.updateStreak(userId, streakType);
        return NextResponse.json({ success: updated });

      default:
        return NextResponse.json({ error: 'Invalid action' }, { status: 400 });
    }
  } catch (error) {
    console.error('Gamification API error:', error);
    return NextResponse.json(
      { error: 'Failed to process gamification action' },
      { status: 500 }
    );
  }
}

