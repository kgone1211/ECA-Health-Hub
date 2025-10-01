// Database helper functions for EFH Health Hub
import { supabase, supabaseAdmin, User, HealthMetric, Goal, Session, UserSettings, Achievement, UserAchievement, UserPoints, PointsTransaction, Challenge, UserChallenge, Streak } from './supabase';

// Use admin client for server-side operations to bypass RLS
const db_client = supabaseAdmin;

export class Database {
  // USER OPERATIONS
  async upsertUser(whopUserId: string, email: string, username?: string, fullName?: string, isCoach: boolean = false): Promise<User | null> {
    try {
      const { data: existingUser } = await db_client.from('users').select('*').eq('whop_user_id', whopUserId).single();
      if (existingUser) {
        const { data, error } = await db_client.from('users').update({ email, username, full_name: fullName, is_coach: isCoach, updated_at: new Date().toISOString() }).eq('whop_user_id', whopUserId).select().single();
        if (error) throw error;
        return data;
      } else {
        const { data, error } = await db_client.from('users').insert({ whop_user_id: whopUserId, email, username, full_name: fullName, role: isCoach ? 'coach' : 'client', is_coach: isCoach }).select().single();
        if (error) throw error;
        if (data) await this.createUserSettings(data.id);
        return data;
      }
    } catch (error) {
      console.error('Error upserting user:', error);
      return null;
    }
  }

  async getUserByWhopId(whopUserId: string): Promise<User | null> {
    try {
      const { data, error } = await db_client.from('users').select('*').eq('whop_user_id', whopUserId).single();
      if (error) throw error;
      return data;
    } catch (error) {
      console.error('Error getting user:', error);
      return null;
    }
  }

  // HEALTH METRICS
  async addHealthMetric(userId: number, metricType: string, value: number, unit: string, notes?: string, recordedAt?: Date): Promise<HealthMetric | null> {
    try {
      const { data, error } = await db_client.from('health_metrics').insert({ user_id: userId, metric_type: metricType, value, unit, notes, recorded_at: recordedAt ? recordedAt.toISOString() : new Date().toISOString() }).select().single();
      if (error) throw error;
      await this.logActivity(userId, 'metric_added', { metric_type: metricType, value, unit });
      return data;
    } catch (error) {
      console.error('Error adding health metric:', error);
      return null;
    }
  }

  async getHealthMetrics(userId: number, metricType?: string, limit: number = 100): Promise<HealthMetric[]> {
    try {
      let query = db_client.from('health_metrics').select('*').eq('user_id', userId).order('recorded_at', { ascending: false }).limit(limit);
      if (metricType) query = query.eq('metric_type', metricType);
      const { data, error } = await query;
      if (error) throw error;
      return data || [];
    } catch (error) {
      console.error('Error getting health metrics:', error);
      return [];
    }
  }

  async getHealthMetricsByDateRange(userId: number, metricType: string, startDate: Date, endDate: Date): Promise<HealthMetric[]> {
    try {
      const { data, error } = await db_client.from('health_metrics').select('*').eq('user_id', userId).eq('metric_type', metricType).gte('recorded_at', startDate.toISOString()).lte('recorded_at', endDate.toISOString()).order('recorded_at', { ascending: true });
      if (error) throw error;
      return data || [];
    } catch (error) {
      console.error('Error getting health metrics by date range:', error);
      return [];
    }
  }

  // GOALS
  async createGoal(userId: number, goalType: string, title: string, description?: string, targetValue?: number, targetUnit?: string, targetDate?: Date): Promise<Goal | null> {
    try {
      const { data, error } = await db_client.from('goals').insert({ user_id: userId, goal_type: goalType, title, description, target_value: targetValue, target_unit: targetUnit, target_date: targetDate ? targetDate.toISOString() : null, status: 'active' }).select().single();
      if (error) throw error;
      await this.logActivity(userId, 'goal_created', { goal_type: goalType, title });
      return data;
    } catch (error) {
      console.error('Error creating goal:', error);
      return null;
    }
  }

  async getGoals(userId: number, status?: 'active' | 'completed' | 'abandoned'): Promise<Goal[]> {
    try {
      let query = db_client.from('goals').select('*').eq('user_id', userId).order('created_at', { ascending: false });
      if (status) query = query.eq('status', status);
      const { data, error } = await query;
      if (error) throw error;
      return data || [];
    } catch (error) {
      console.error('Error getting goals:', error);
      return [];
    }
  }

  async updateGoalProgress(goalId: number, currentValue: number): Promise<Goal | null> {
    try {
      const { data, error } = await db_client.from('goals').update({ current_value: currentValue }).eq('id', goalId).select().single();
      if (error) throw error;
      return data;
    } catch (error) {
      console.error('Error updating goal progress:', error);
      return null;
    }
  }

  // SESSIONS
  async getSessions(userId: number, role: 'coach' | 'client'): Promise<Session[]> {
    try {
      const column = role === 'coach' ? 'coach_id' : 'client_id';
      const { data, error } = await db_client.from('sessions').select('*').eq(column, userId).order('session_date', { ascending: false });
      if (error) throw error;
      return data || [];
    } catch (error) {
      console.error('Error getting sessions:', error);
      return [];
    }
  }

  async createSession(coachId: number, clientId: number, sessionDate: Date, durationMinutes: number = 60, sessionType?: string): Promise<Session | null> {
    try {
      const { data, error } = await db_client.from('sessions').insert({ coach_id: coachId, client_id: clientId, session_date: sessionDate.toISOString(), duration_minutes: durationMinutes, session_type: sessionType, status: 'scheduled' }).select().single();
      if (error) throw error;
      return data;
    } catch (error) {
      console.error('Error creating session:', error);
      return null;
    }
  }

  // USER SETTINGS
  async createUserSettings(userId: number): Promise<UserSettings | null> {
    try {
      const { data, error } = await db_client.from('user_settings').insert({ user_id: userId, preferred_units: 'imperial', notifications_enabled: true, theme: 'system' }).select().single();
      if (error) throw error;
      return data;
    } catch (error) {
      console.error('Error creating user settings:', error);
      return null;
    }
  }

  async getUserSettings(userId: number): Promise<UserSettings | null> {
    try {
      const { data, error} = await db_client.from('user_settings').select('*').eq('user_id', userId).single();
      if (error) {
        if (error.code === 'PGRST116') return await this.createUserSettings(userId);
        throw error;
      }
      return data;
    } catch (error) {
      console.error('Error getting user settings:', error);
      return null;
    }
  }

  // ACTIVITY LOG
  async logActivity(userId: number, activityType: string, metadata?: any): Promise<boolean> {
    try {
      const { error } = await db_client.from('activity_log').insert({ user_id: userId, activity_type: activityType, metadata });
      if (error) throw error;
      return true;
    } catch (error) {
      console.error('Error logging activity:', error);
      return false;
    }
  }

  // DASHBOARD STATS
  async getUserDashboardStats(userId: number): Promise<any> {
    try {
      const { count: metricsCount } = await db_client.from('health_metrics').select('*', { count: 'exact', head: true }).eq('user_id', userId);
      const { count: activeGoalsCount } = await db_client.from('goals').select('*', { count: 'exact', head: true }).eq('user_id', userId).eq('status', 'active');
      const { count: sessionsCount } = await db_client.from('sessions').select('*', { count: 'exact', head: true }).eq('client_id', userId);
      const { data: latestWeight } = await db_client.from('health_metrics').select('*').eq('user_id', userId).eq('metric_type', 'weight').order('recorded_at', { ascending: false }).limit(1).single();
      return { totalMetrics: metricsCount || 0, activeGoals: activeGoalsCount || 0, totalSessions: sessionsCount || 0, latestWeight: latestWeight?.value || null, weightUnit: latestWeight?.unit || 'lbs' };
    } catch (error) {
      console.error('Error getting dashboard stats:', error);
      return { totalMetrics: 0, activeGoals: 0, totalSessions: 0, latestWeight: null, weightUnit: 'lbs' };
    }
  }
  // ============= COACH-SPECIFIC OPERATIONS =============
  
  // Get all clients for a specific coach
  async getCoachClients(coachId: number, status: string = 'active'): Promise<any[]> {
    try {
      const { data, error } = await db_client
        .from('coach_clients')
        .select('*, client:client_id(id, email, username, full_name)')
        .eq('coach_id', coachId)
        .eq('status', status);
      
      if (error) throw error;
      return data || [];
    } catch (error) {
      console.error('Error getting coach clients:', error);
      return [];
    }
  }

  // Add a client to a coach
  async addClientToCoach(coachId: number, clientId: number): Promise<boolean> {
    try {
      const { error } = await db_client
        .from('coach_clients')
        .insert({
          coach_id: coachId,
          client_id: clientId,
          status: 'active',
          start_date: new Date().toISOString()
        });
      
      if (error) throw error;
      return true;
    } catch (error) {
      console.error('Error adding client to coach:', error);
      return false;
    }
  }

  // Get client's health metrics (coach view)
  async getClientHealthMetrics(coachId: number, clientId: number, metricType?: string): Promise<HealthMetric[]> {
    try {
      // First verify this client belongs to this coach
      const { data: relationship } = await db_client
        .from('coach_clients')
        .select('id')
        .eq('coach_id', coachId)
        .eq('client_id', clientId)
        .eq('status', 'active')
        .single();

      if (!relationship) {
        console.error('Client does not belong to this coach');
        return [];
      }

      // Get the client's metrics
      return await this.getHealthMetrics(clientId, metricType);
    } catch (error) {
      console.error('Error getting client health metrics:', error);
      return [];
    }
  }

  // Get client's goals (coach view)
  async getClientGoals(coachId: number, clientId: number): Promise<Goal[]> {
    try {
      // First verify this client belongs to this coach
      const { data: relationship } = await db_client
        .from('coach_clients')
        .select('id')
        .eq('coach_id', coachId)
        .eq('client_id', clientId)
        .eq('status', 'active')
        .single();

      if (!relationship) {
        console.error('Client does not belong to this coach');
        return [];
      }

      // Get the client's goals
      return await this.getGoals(clientId);
    } catch (error) {
      console.error('Error getting client goals:', error);
      return [];
    }
  }

  // Get all sessions for a coach with client details
  async getCoachSessionsWithClients(coachId: number): Promise<any[]> {
    try {
      const { data, error } = await db_client
        .from('sessions')
        .select('*, client:client_id(id, email, username, full_name)')
        .eq('coach_id', coachId)
        .order('session_date', { ascending: false });
      
      if (error) throw error;
      return data || [];
    } catch (error) {
      console.error('Error getting coach sessions:', error);
      return [];
    }
  }

  // Check if user is a coach
  async isCoach(userId: number): Promise<boolean> {
    try {
      const { data, error } = await db_client
        .from('users')
        .select('is_coach')
        .eq('id', userId)
        .single();
      
      if (error) throw error;
      return data?.is_coach || false;
    } catch (error) {
      console.error('Error checking if user is coach:', error);
      return false;
    }
  }

  // Create coach profile
  async createCoachProfile(userId: number, specialization?: string, bio?: string): Promise<boolean> {
    try {
      // First, update user to be a coach
      await db_client
        .from('users')
        .update({ is_coach: true, role: 'coach' })
        .eq('id', userId);

      // Create coach profile
      const { error } = await db_client
        .from('coaches')
        .insert({
          user_id: userId,
          specialization,
          bio,
          is_active: true
        });
      
      if (error) throw error;
      return true;
    } catch (error) {
      console.error('Error creating coach profile:', error);
      return false;
    }
  }

  // ============= GAMIFICATION OPERATIONS =============
  
  // POINTS & LEVELS
  async getUserPoints(userId: number): Promise<UserPoints | null> {
    try {
      const { data, error } = await db_client
        .from('user_points')
        .select('*')
        .eq('user_id', userId)
        .single();
      
      if (error && error.code === 'PGRST116') {
        // Create initial points record
        return await this.initializeUserPoints(userId);
      }
      if (error) throw error;
      return data;
    } catch (error) {
      console.error('Error getting user points:', error);
      return null;
    }
  }

  async initializeUserPoints(userId: number): Promise<UserPoints | null> {
    try {
      const { data, error } = await db_client
        .from('user_points')
        .insert({
          user_id: userId,
          total_points: 0,
          current_level: 1,
          points_to_next_level: 50,
          lifetime_points: 0
        })
        .select()
        .single();
      
      if (error) throw error;
      return data;
    } catch (error) {
      console.error('Error initializing user points:', error);
      return null;
    }
  }

  async addPoints(userId: number, points: number, reason: string, referenceType?: string, referenceId?: number): Promise<boolean> {
    try {
      // Add transaction record
      await db_client.from('points_transactions').insert({
        user_id: userId,
        points,
        reason,
        reference_type: referenceType,
        reference_id: referenceId
      });

      // Get current points
      const userPoints = await this.getUserPoints(userId);
      if (!userPoints) return false;

      const newTotalPoints = userPoints.total_points + points;
      const newLifetimePoints = userPoints.lifetime_points + points;
      const newLevel = this.calculateLevel(newTotalPoints);
      const pointsToNext = this.pointsToNextLevel(newTotalPoints);

      // Update points
      const { error } = await db_client
        .from('user_points')
        .update({
          total_points: newTotalPoints,
          lifetime_points: newLifetimePoints,
          current_level: newLevel,
          points_to_next_level: pointsToNext,
          updated_at: new Date().toISOString()
        })
        .eq('user_id', userId);

      if (error) throw error;

      // Check for achievements
      await this.checkAchievements(userId);

      return true;
    } catch (error) {
      console.error('Error adding points:', error);
      return false;
    }
  }

  calculateLevel(totalPoints: number): number {
    return Math.floor(Math.sqrt(totalPoints / 50)) + 1;
  }

  pointsToNextLevel(currentPoints: number): number {
    const currentLevel = this.calculateLevel(currentPoints);
    const nextLevel = currentLevel + 1;
    const pointsForNextLevel = Math.pow(nextLevel - 1, 2) * 50;
    return pointsForNextLevel - currentPoints;
  }

  async getPointsTransactions(userId: number, limit: number = 20): Promise<PointsTransaction[]> {
    try {
      const { data, error } = await db_client
        .from('points_transactions')
        .select('*')
        .eq('user_id', userId)
        .order('created_at', { ascending: false })
        .limit(limit);
      
      if (error) throw error;
      return data || [];
    } catch (error) {
      console.error('Error getting points transactions:', error);
      return [];
    }
  }

  async getLeaderboard(limit: number = 10): Promise<any[]> {
    try {
      const { data, error } = await db_client
        .from('user_points')
        .select('*, user:user_id(id, username, full_name)')
        .order('total_points', { ascending: false })
        .limit(limit);
      
      if (error) throw error;
      return data || [];
    } catch (error) {
      console.error('Error getting leaderboard:', error);
      return [];
    }
  }

  // ACHIEVEMENTS
  async getAllAchievements(): Promise<Achievement[]> {
    try {
      const { data, error } = await db_client
        .from('achievements')
        .select('*')
        .eq('is_active', true)
        .order('points', { ascending: true });
      
      if (error) throw error;
      return data || [];
    } catch (error) {
      console.error('Error getting achievements:', error);
      return [];
    }
  }

  async getUserAchievements(userId: number): Promise<UserAchievement[]> {
    try {
      const { data, error } = await db_client
        .from('user_achievements')
        .select('*, achievement:achievement_id(*)')
        .eq('user_id', userId)
        .order('earned_at', { ascending: false });
      
      if (error) throw error;
      return data || [];
    } catch (error) {
      console.error('Error getting user achievements:', error);
      return [];
    }
  }

  async checkAchievements(userId: number): Promise<void> {
    try {
      // Get all achievements
      const achievements = await this.getAllAchievements();
      
      // Get user's current achievements
      const userAchievements = await this.getUserAchievements(userId);
      const earnedIds = userAchievements.map(ua => ua.achievement_id);

      for (const achievement of achievements) {
        // Skip if already earned
        if (earnedIds.includes(achievement.id)) continue;

        // Check if requirement is met
        let requirementMet = false;
        
        switch (achievement.requirement_type) {
          case 'sessions_count':
            const { count: sessionsCount } = await db_client
              .from('sessions')
              .select('*', { count: 'exact', head: true })
              .or(`coach_id.eq.${userId},client_id.eq.${userId}`)
              .eq('status', 'completed');
            requirementMet = (sessionsCount || 0) >= achievement.requirement_value;
            break;

          case 'goals_completed':
            const { count: goalsCount } = await db_client
              .from('goals')
              .select('*', { count: 'exact', head: true })
              .eq('user_id', userId)
              .eq('status', 'completed');
            requirementMet = (goalsCount || 0) >= achievement.requirement_value;
            break;

          case 'metrics_logged':
            const { count: metricsCount } = await db_client
              .from('health_metrics')
              .select('*', { count: 'exact', head: true })
              .eq('user_id', userId);
            requirementMet = (metricsCount || 0) >= achievement.requirement_value;
            break;

          case 'streak_days':
            const streak = await this.getStreak(userId, 'metrics_logging');
            requirementMet = streak ? streak.current_streak >= achievement.requirement_value : false;
            break;
        }

        // Award achievement if requirement met
        if (requirementMet) {
          await this.awardAchievement(userId, achievement.id, achievement.points);
        }
      }
    } catch (error) {
      console.error('Error checking achievements:', error);
    }
  }

  async awardAchievement(userId: number, achievementId: number, points: number): Promise<boolean> {
    try {
      // Add achievement
      await db_client.from('user_achievements').insert({
        user_id: userId,
        achievement_id: achievementId
      });

      // Award points
      await this.addPoints(userId, points, 'achievement_earned', 'achievement', achievementId);

      return true;
    } catch (error) {
      console.error('Error awarding achievement:', error);
      return false;
    }
  }

  // CHALLENGES
  async getActiveChallenges(): Promise<Challenge[]> {
    try {
      const now = new Date().toISOString();
      const { data, error } = await db_client
        .from('challenges')
        .select('*')
        .eq('is_active', true)
        .lte('start_date', now)
        .gte('end_date', now)
        .order('end_date', { ascending: true });
      
      if (error) throw error;
      return data || [];
    } catch (error) {
      console.error('Error getting active challenges:', error);
      return [];
    }
  }

  async getUserChallenges(userId: number): Promise<UserChallenge[]> {
    try {
      const { data, error } = await db_client
        .from('user_challenges')
        .select('*, challenge:challenge_id(*)')
        .eq('user_id', userId)
        .order('joined_at', { ascending: false });
      
      if (error) throw error;
      return data || [];
    } catch (error) {
      console.error('Error getting user challenges:', error);
      return [];
    }
  }

  async joinChallenge(userId: number, challengeId: number): Promise<boolean> {
    try {
      const { error } = await db_client
        .from('user_challenges')
        .insert({
          user_id: userId,
          challenge_id: challengeId,
          current_progress: 0,
          is_completed: false
        });
      
      if (error) throw error;
      return true;
    } catch (error) {
      console.error('Error joining challenge:', error);
      return false;
    }
  }

  async updateChallengeProgress(userId: number, challengeId: number, progress: number): Promise<boolean> {
    try {
      const { error } = await db_client
        .from('user_challenges')
        .update({
          current_progress: progress
        })
        .eq('user_id', userId)
        .eq('challenge_id', challengeId);
      
      if (error) throw error;
      return true;
    } catch (error) {
      console.error('Error updating challenge progress:', error);
      return false;
    }
  }

  // STREAKS
  async getStreak(userId: number, streakType: 'daily_checkin' | 'metrics_logging' | 'session_attendance'): Promise<Streak | null> {
    try {
      const { data, error } = await db_client
        .from('streaks')
        .select('*')
        .eq('user_id', userId)
        .eq('streak_type', streakType)
        .single();
      
      if (error && error.code === 'PGRST116') {
        // Create initial streak
        return await this.initializeStreak(userId, streakType);
      }
      if (error) throw error;
      return data;
    } catch (error) {
      console.error('Error getting streak:', error);
      return null;
    }
  }

  async initializeStreak(userId: number, streakType: string): Promise<Streak | null> {
    try {
      const { data, error } = await db_client
        .from('streaks')
        .insert({
          user_id: userId,
          streak_type: streakType,
          current_streak: 0,
          longest_streak: 0
        })
        .select()
        .single();
      
      if (error) throw error;
      return data;
    } catch (error) {
      console.error('Error initializing streak:', error);
      return null;
    }
  }

  async updateStreak(userId: number, streakType: string): Promise<boolean> {
    try {
      const streak = await this.getStreak(userId, streakType as any);
      if (!streak) return false;

      const today = new Date().toISOString().split('T')[0];
      const lastActivity = streak.last_activity_date;

      let newStreak = streak.current_streak;
      
      if (lastActivity === today) {
        // Already updated today
        return true;
      } else if (lastActivity === this.getYesterday()) {
        // Continuing streak
        newStreak = streak.current_streak + 1;
      } else {
        // Streak broken
        newStreak = 1;
      }

      const { error } = await db_client
        .from('streaks')
        .update({
          current_streak: newStreak,
          longest_streak: Math.max(newStreak, streak.longest_streak),
          last_activity_date: today,
          updated_at: new Date().toISOString()
        })
        .eq('user_id', userId)
        .eq('streak_type', streakType);

      if (error) throw error;
      return true;
    } catch (error) {
      console.error('Error updating streak:', error);
      return false;
    }
  }

  private getYesterday(): string {
    const yesterday = new Date();
    yesterday.setDate(yesterday.getDate() - 1);
    return yesterday.toISOString().split('T')[0];
  }
}

export const db = new Database();
