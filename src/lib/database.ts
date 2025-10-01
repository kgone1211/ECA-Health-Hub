// Database helper functions for ECA Health Hub
import { supabase, supabaseAdmin, User, HealthMetric, Goal, Session, UserSettings } from './supabase';

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
}

export const db = new Database();
