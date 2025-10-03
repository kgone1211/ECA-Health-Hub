# EFH Health Hub - Database Setup Guide

## ✅ Completed Steps

1. **Environment Variables** - `.env.local` created with Supabase credentials
2. **Supabase Client** - Installed `@supabase/supabase-js`
3. **Database Schema** - `supabase-schema.sql` ready to run
4. **Helper Functions** - `src/lib/database.ts` with full CRUD operations

## 🚀 Next Steps

### Step 1: Create Database Tables

1. Go to your Supabase Dashboard: https://supabase.com/dashboard/project/fauwxrubxlihqjsrxrxu
2. Click on "SQL Editor" in the left sidebar
3. Click "New Query"
4. Copy the contents of `supabase-schema.sql` and paste into the editor
5. Click "Run" to create all tables

This will create:
- ✅ 9 tables (users, coaches, sessions, health_metrics, goals, etc.)
- ✅ Row Level Security (RLS) policies
- ✅ Indexes for performance
- ✅ Auto-update triggers

### Step 2: Test the Database

Run the development server:
```bash
npm run dev
```

### Step 3: Use the Database in Your App

Import and use the database helper:

```typescript
import { db } from '@/lib/database';

// Create or update user
const user = await db.upsertUser('whop_user_123', 'user@example.com', 'John', 'John Doe');

// Add health metric
await db.addHealthMetric(user.id, 'weight', 180, 'lbs');

// Get user's metrics
const metrics = await db.getHealthMetrics(user.id);

// Create a goal
await db.createGoal(user.id, 'weight_loss', 'Lose 10 lbs', 'Track weight daily', 170, 'lbs', new Date('2025-12-31'));

// Get dashboard stats
const stats = await db.getUserDashboardStats(user.id);
```

##  Database Schema

### Tables Created:

1. **users** - User profiles (linked to Whop)
2. **coaches** - Coach profiles and credentials
3. **coach_clients** - Coach-client relationships
4. **sessions** - Coaching session records
5. **health_metrics** - All tracked health data
6. **goals** - User health goals
7. **session_notes** - Session notes from coaches
8. **user_settings** - User preferences
9. **activity_log** - User activity tracking

### Supported Health Metrics:

- Weight (lbs/kg)
- Blood Pressure (mmHg)
- Heart Rate (bpm)
- Steps (count)
- Sleep (hours)
- Mood (1-10 scale)
- Water Intake (oz/ml)
- Calories (kcal)
- Macros (protein, carbs, fat in grams)
- Exercise Minutes

## 🔐 Security Features

- **Row Level Security (RLS)** enabled on all tables
- Users can only access their own data
- Coaches can access their clients' data
- Service role key for admin operations

## 📊 Key Features

1. **Multi-user Support** - Each coach can have multiple clients
2. **Data Isolation** - RLS ensures data privacy
3. **Flexible Metrics** - Track any health metric with custom types
4. **Goal Tracking** - Set and monitor progress
5. **Activity Logging** - Track user engagement
6. **Settings** - Customizable user preferences

## 🔧 Helper Functions Available

**Users:**
- `upsertUser()` - Create or update user
- `getUserByWhopId()` - Get user by Whop ID

**Health Metrics:**
- `addHealthMetric()` - Add new metric
- `getHealthMetrics()` - Get metrics (with optional filtering)
- `getHealthMetricsByDateRange()` - Get metrics for date range

**Goals:**
- `createGoal()` - Create new goal
- `getGoals()` - Get user's goals
- `updateGoalProgress()` - Update goal progress

**Sessions:**
- `getSessions()` - Get coaching sessions

**Settings:**
- `getUserSettings()` - Get user preferences
- `createUserSettings()` - Create default settings

**Dashboard:**
- `getUserDashboardStats()` - Get overview stats

## 🎯 Production Ready

This database setup is production-ready with:
- ✅ Proper indexing
- ✅ Row Level Security
- ✅ Type safety with TypeScript
- ✅ Error handling
- ✅ Activity logging
- ✅ Scalable architecture

## 📝 Notes

- All timestamps use `TIMESTAMP WITH TIME ZONE`
- Automatic `updated_at` triggers
- Cascading deletes for data integrity
- JSONB for flexible metadata storage

