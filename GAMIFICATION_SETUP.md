# Gamification System Setup - EFH Health Hub

## ✅ What's Been Built

A complete gamification system with:
- **Points & Levels**: Users earn points and level up
- **Achievements**: Auto-awarded badges for milestones
- **Challenges**: Time-based goals users can join
- **Streaks**: Track daily consistency
- **Leaderboard**: Competitive rankings

## 📋 Setup Instructions

### Step 1: Run the Database Schema
Execute the gamification schema in your Supabase SQL Editor:

```bash
# Open this file and copy contents:
/Users/zekegonzalez/eca-health-app-v2/supabase-gamification-schema.sql
```

1. Go to your [Supabase Dashboard](https://supabase.com/dashboard/project/fauwxrubxlihqjsrxrxu/sql/new)
2. Paste the SQL from `supabase-gamification-schema.sql`
3. Click "Run" to create all tables and seed default achievements

### Step 2: Verify Tables Created
Check that these tables exist in your database:
- ✅ `achievements` - Available achievements
- ✅ `user_achievements` - User's earned achievements
- ✅ `user_points` - User points and levels
- ✅ `points_transactions` - Points history
- ✅ `challenges` - Available challenges
- ✅ `user_challenges` - User's active challenges
- ✅ `streaks` - User streak data

### Step 3: Test the API
Test the gamification API endpoints:

```bash
# Get user gamification data
curl http://localhost:3001/api/gamification?userId=1

# Get leaderboard
curl http://localhost:3001/api/gamification?userId=1&action=leaderboard

# Add points (POST)
curl -X POST http://localhost:3001/api/gamification \
  -H "Content-Type: application/json" \
  -d '{"action":"add_points","userId":1,"points":50,"reason":"test_points"}'
```

### Step 4: Access the UI
Navigate to: `http://localhost:3001/gamification`

You should see:
- User's level and total points
- Recent activity/transactions
- Achievements earned
- Active challenges
- Leaderboard

## 🎮 How It Works

### Points System
- **Level Calculation**: `Level = floor(sqrt(total_points / 50)) + 1`
- **Points for Next Level**: `(next_level - 1)² × 50 - current_points`

**Level Requirements:**
- Level 1: 0-49 points
- Level 2: 50-199 points
- Level 3: 200-449 points
- Level 4: 450-799 points
- Level 5: 800-1249 points

### Default Achievements

#### Milestones
- **First Steps** (10 pts): Complete 1 session
- **Getting Started** (25 pts): Complete 5 sessions
- **Dedicated Client** (50 pts): Complete 10 sessions
- **Health Champion** (100 pts): Complete 25 sessions

#### Consistency
- **3-Day Streak** (15 pts): Log metrics for 3 days straight
- **Week Warrior** (30 pts): Log metrics for 7 days straight
- **Consistency King** (100 pts): Log metrics for 30 days straight

#### Performance
- **Goal Getter** (20 pts): Complete 1 goal
- **Goal Crusher** (50 pts): Complete 5 goals
- **Overachiever** (100 pts): Complete 10 goals

#### Data Tracking
- **Data Tracker** (15 pts): Log 10 health metrics
- **Health Analyst** (40 pts): Log 50 health metrics
- **Metrics Master** (80 pts): Log 100 health metrics

### Earning Points

Points are automatically awarded for:
- Completing sessions
- Achieving goals
- Logging health metrics
- Earning achievements
- Daily check-ins
- Completing challenges

### Achievement Auto-Award Logic

The system automatically checks and awards achievements when:
1. User earns points (triggers `checkAchievements`)
2. Achievement requirements are met:
   - `sessions_count`: Completed sessions
   - `goals_completed`: Completed goals
   - `metrics_logged`: Health metrics logged
   - `streak_days`: Current streak length

## 🔧 Integration Points

### Award Points in Your App

```typescript
import { db } from '@/lib/database';

// Award points for completing a session
await db.addPoints(
  userId, 
  20, 
  'session_completed', 
  'session', 
  sessionId
);

// Award points for logging a health metric
await db.addPoints(
  userId, 
  5, 
  'metric_logged', 
  'metric', 
  metricId
);

// Award points for completing a goal
await db.addPoints(
  userId, 
  50, 
  'goal_achieved', 
  'goal', 
  goalId
);
```

### Update Streaks

```typescript
// Update daily check-in streak
await db.updateStreak(userId, 'daily_checkin');

// Update metrics logging streak
await db.updateStreak(userId, 'metrics_logging');

// Update session attendance streak
await db.updateStreak(userId, 'session_attendance');
```

### Create Custom Challenges

```typescript
// Insert custom challenge (use Supabase admin)
await db_client.from('challenges').insert({
  title: '30-Day Health Challenge',
  description: 'Log health metrics every day for 30 days',
  challenge_type: 'monthly',
  goal_type: 'metrics',
  goal_value: 30,
  points_reward: 200,
  start_date: '2025-10-01T00:00:00Z',
  end_date: '2025-10-31T23:59:59Z',
  is_active: true
});
```

## 📊 Database Helper Functions

All available in `db` instance from `/lib/database`:

### Points
- `getUserPoints(userId)` - Get user's points data
- `addPoints(userId, points, reason, refType?, refId?)` - Add points
- `getPointsTransactions(userId, limit?)` - Get transaction history
- `getLeaderboard(limit?)` - Get top users

### Achievements
- `getAllAchievements()` - Get all achievements
- `getUserAchievements(userId)` - Get user's achievements
- `checkAchievements(userId)` - Check and award achievements
- `awardAchievement(userId, achievementId, points)` - Manually award

### Challenges
- `getActiveChallenges()` - Get active challenges
- `getUserChallenges(userId)` - Get user's challenges
- `joinChallenge(userId, challengeId)` - Join a challenge
- `updateChallengeProgress(userId, challengeId, progress)` - Update progress

### Streaks
- `getStreak(userId, type)` - Get user's streak
- `updateStreak(userId, type)` - Update streak

## 🎨 UI Components

The gamification page includes:
- **Overview Tab**: Recent activity and points earned
- **Achievements Tab**: Earned badges and achievements
- **Challenges Tab**: Active challenges with progress bars
- **Leaderboard Tab**: Top 10 users ranked by points

## 🚀 Next Steps

1. ✅ Run the SQL schema in Supabase
2. ✅ Test API endpoints
3. ✅ View the gamification page
4. 🔄 Integrate point awards throughout your app
5. 🔄 Create custom challenges for users
6. 🔄 Add gamification widgets to dashboard

## 💡 Customization Ideas

- Add custom achievement categories
- Create seasonal challenges
- Implement team-based competitions
- Add reward redemption system
- Create achievement notifications
- Build gamification dashboard widget

## 📝 Notes

- All tables have Row Level Security (RLS) enabled
- Use `supabaseAdmin` client for server-side operations
- Points are awarded automatically when achievements are earned
- Streaks break if a day is missed
- Achievements can only be earned once per user

Your gamification system is ready to use! 🎉

