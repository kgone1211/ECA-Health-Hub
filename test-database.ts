// Test script to verify database setup
import dotenv from 'dotenv';
dotenv.config({ path: '.env.local' });

import { db } from './src/lib/database';

async function testDatabase() {
  console.log('🧪 Testing EFH Health Hub Database...\n');

  try {
    // Test 1: Create a test user
    console.log('1️⃣ Creating test user...');
    const user = await db.upsertUser(
      'test_whop_user_123',
      'test@example.com',
      'testuser',
      'Test User',
      false
    );
    
    if (!user) {
      throw new Error('Failed to create user');
    }
    console.log('✅ User created:', user.id, user.email);

    // Test 2: Add health metrics
    console.log('\n2️⃣ Adding health metrics...');
    const weightMetric = await db.addHealthMetric(user.id, 'weight', 180, 'lbs', 'Starting weight');
    const stepsMetric = await db.addHealthMetric(user.id, 'steps', 10000, 'count', 'Daily steps');
    
    if (!weightMetric || !stepsMetric) {
      throw new Error('Failed to add health metrics');
    }
    console.log('✅ Weight metric added:', weightMetric.value, weightMetric.unit);
    console.log('✅ Steps metric added:', stepsMetric.value, stepsMetric.unit);

    // Test 3: Create a goal
    console.log('\n3️⃣ Creating goal...');
    const goal = await db.createGoal(
      user.id,
      'weight_loss',
      'Lose 10 pounds',
      'Track weight daily and exercise regularly',
      170,
      'lbs',
      new Date('2025-12-31')
    );
    
    if (!goal) {
      throw new Error('Failed to create goal');
    }
    console.log('✅ Goal created:', goal.title);

    // Test 4: Get health metrics
    console.log('\n4️⃣ Fetching health metrics...');
    const metrics = await db.getHealthMetrics(user.id);
    console.log('✅ Found', metrics.length, 'metrics');

    // Test 5: Get goals
    console.log('\n5️⃣ Fetching goals...');
    const goals = await db.getGoals(user.id);
    console.log('✅ Found', goals.length, 'active goals');

    // Test 6: Get dashboard stats
    console.log('\n6️⃣ Fetching dashboard stats...');
    const stats = await db.getUserDashboardStats(user.id);
    console.log('✅ Dashboard stats:');
    console.log('   - Total Metrics:', stats.totalMetrics);
    console.log('   - Active Goals:', stats.activeGoals);
    console.log('   - Latest Weight:', stats.latestWeight, stats.weightUnit);

    // Test 7: Get user settings
    console.log('\n7️⃣ Fetching user settings...');
    const settings = await db.getUserSettings(user.id);
    if (!settings) {
      throw new Error('Failed to get user settings');
    }
    console.log('✅ User settings:');
    console.log('   - Preferred Units:', settings.preferred_units);
    console.log('   - Theme:', settings.theme);

    console.log('\n🎉 All tests passed! Database is working perfectly!\n');

  } catch (error) {
    console.error('\n❌ Test failed:', error);
    process.exit(1);
  }
}

// Run the test
testDatabase();

