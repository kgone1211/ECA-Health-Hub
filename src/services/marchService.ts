import { 
  MarchPhaseAssessment, 
  WeeklyAggregate, 
  BaselineStats,
  MarchPhase 
} from '@/types/march';
import { MarchPhaseEngine } from '@/domain/march/phaseEngine';
import { MarchAggregationService } from './marchAggregationService';
import { db } from '@/lib/database';

export class MarchService {
  private phaseEngine: MarchPhaseEngine;
  private aggregationService: MarchAggregationService;

  constructor() {
    this.phaseEngine = new MarchPhaseEngine();
    this.aggregationService = new MarchAggregationService();
  }

  /**
   * Compute M.A.R.C.H. phase assessment for a client for a specific week
   */
  async computeWeeklyAssessment(
    clientId: string, 
    weekStart: Date
  ): Promise<MarchPhaseAssessment> {
    // Get raw data for the week
    const weekEnd = new Date(weekStart);
    weekEnd.setDate(weekEnd.getDate() + 6);
    weekEnd.setHours(23, 59, 59, 999);

    const biometrics = db.getBiometricsSamples(clientId, weekStart, weekEnd);
    const checkIns = db.getCheckInSamples(clientId, weekStart, weekEnd);
    const training = db.getTrainingLogs(clientId, weekStart, weekEnd);
    const bodyMetrics = db.getBodyMetrics(clientId, weekStart, weekEnd);

    // Aggregate weekly data
    const aggregate = await this.aggregationService.aggregateWeekly(
      clientId,
      weekStart,
      biometrics,
      checkIns,
      training,
      bodyMetrics
    );

    // Store the aggregate
    db.addWeeklyAggregate(aggregate);

    // Compute baseline stats
    const baseline = await this.aggregationService.computeBaselineStats(
      clientId,
      db.getBiometricsSamples(clientId),
      db.getTrainingLogs(clientId)
    );

    // Get previous phase for context
    const previousAssessment = db.getCurrentMarchPhase(clientId);
    const previousPhase = previousAssessment?.decidedPhase;

    // Compute phase assessment
    const assessment = this.phaseEngine.computePhaseAssessment(
      aggregate,
      baseline,
      previousPhase
    );

    // Store the assessment
    db.addMarchPhaseAssessment(assessment);

    return assessment;
  }

  /**
   * Get current M.A.R.C.H. phase for a client
   */
  async getCurrentPhase(clientId: string): Promise<MarchPhaseAssessment | null> {
    const currentPhase = db.getCurrentMarchPhase(clientId);
    
    if (!currentPhase) {
      // If no current phase, compute one for the current week
      const currentWeek = this.getCurrentWeekStart();
      return await this.computeWeeklyAssessment(clientId, currentWeek);
    }

    return currentPhase;
  }

  /**
   * Get M.A.R.C.H. phase history for a client
   */
  async getPhaseHistory(clientId: string, limit: number = 12): Promise<MarchPhaseAssessment[]> {
    return db.getMarchPhaseAssessments(clientId, limit);
  }

  /**
   * Recompute phase for a specific week (admin function)
   */
  async recomputePhase(
    clientId: string, 
    weekStart: Date
  ): Promise<MarchPhaseAssessment> {
    // Remove existing assessment for this week
    const existingAssessments = db.getMarchPhaseAssessments(clientId);
    const weekStartISO = weekStart.toISOString().split('T')[0];
    
    // In a real database, you'd delete the existing record
    // For now, we'll just compute a new one
    
    return await this.computeWeeklyAssessment(clientId, weekStart);
  }

  /**
   * Get phase guidance for a specific phase
   */
  getPhaseGuidance(phase: MarchPhase): any {
    const { phaseGuidance } = require('@/config/march');
    return phaseGuidance[phase] || null;
  }

  /**
   * Check if client has sufficient data for phase computation
   */
  async hasSufficientData(clientId: string): Promise<boolean> {
    const currentWeek = this.getCurrentWeekStart();
    const weekEnd = new Date(currentWeek);
    weekEnd.setDate(weekEnd.getDate() + 6);
    weekEnd.setHours(23, 59, 59, 999);

    const biometrics = db.getBiometricsSamples(clientId, currentWeek, weekEnd);
    const checkIns = db.getCheckInSamples(clientId, currentWeek, weekEnd);
    const training = db.getTrainingLogs(clientId, currentWeek, weekEnd);
    const bodyMetrics = db.getBodyMetrics(clientId, currentWeek, weekEnd);

    const aggregate = await this.aggregationService.aggregateWeekly(
      clientId,
      currentWeek,
      biometrics,
      checkIns,
      training,
      bodyMetrics
    );

    return this.aggregationService.hasSufficientData(aggregate);
  }

  /**
   * Get phase transition recommendations
   */
  getPhaseTransitionRecommendations(
    currentPhase: MarchPhase, 
    assessment: MarchPhaseAssessment
  ): string[] {
    const recommendations: string[] = [];
    const { phaseScores } = assessment;

    // Find the next highest scoring phase
    const sortedPhases = Object.entries(phaseScores)
      .sort(([,a], [,b]) => b - a) as [MarchPhase, number][];

    const currentScore = phaseScores[currentPhase];
    const nextPhase = sortedPhases.find(([phase]) => phase !== currentPhase);

    if (nextPhase && nextPhase[1] > currentScore + 10) {
      recommendations.push(`Consider transitioning to ${nextPhase[0]} phase (score: ${nextPhase[1]})`);
    }

    // Add specific recommendations based on current phase
    switch (currentPhase) {
      case 'MITOCHONDRIA':
        if (assessment.phaseScores.ABSORPTION_DETOX > 60) {
          recommendations.push('Address digestive issues before progressing');
        }
        if (assessment.phaseScores.RESILIENCE > 50) {
          recommendations.push('Focus on stress management techniques');
        }
        break;
      
      case 'ABSORPTION_DETOX':
        if (assessment.phaseScores.MITOCHONDRIA > 40) {
          recommendations.push('Continue energy foundation work');
        }
        if (assessment.phaseScores.RESILIENCE > 60) {
          recommendations.push('Address stress factors affecting digestion');
        }
        break;
      
      case 'RESILIENCE':
        if (assessment.phaseScores.HYPERTROPHY_HEALTHSPAN > 70) {
          recommendations.push('Ready for strength training progression');
        }
        if (assessment.phaseScores.CYCLICAL > 60) {
          recommendations.push('Consider hormonal optimization');
        }
        break;
      
      case 'CYCLICAL':
        if (assessment.phaseScores.HYPERTROPHY_HEALTHSPAN > 80) {
          recommendations.push('Ready for hypertrophy phase');
        }
        break;
      
      case 'HYPERTROPHY_HEALTHSPAN':
        if (assessment.phaseScores.MITOCHONDRIA > 50) {
          recommendations.push('Monitor recovery markers closely');
        }
        break;
    }

    return recommendations;
  }

  /**
   * Get weekly phase computation status
   */
  async getWeeklyStatus(clientId: string): Promise<{
    hasData: boolean;
    lastComputed?: Date;
    nextComputation?: Date;
    dataQuality: 'low' | 'medium' | 'high';
  }> {
    const hasData = await this.hasSufficientData(clientId);
    const lastAssessment = db.getCurrentMarchPhase(clientId);
    const lastComputed = lastAssessment ? new Date(lastAssessment.createdAt) : undefined;
    
    // Next computation is every Sunday at 11 PM
    const nextComputation = this.getNextComputationDate();
    
    // Determine data quality
    let dataQuality: 'low' | 'medium' | 'high' = 'low';
    if (hasData) {
      const currentWeek = this.getCurrentWeekStart();
      const weekEnd = new Date(currentWeek);
      weekEnd.setDate(weekEnd.getDate() + 6);
      
      const dataPoints = [
        db.getBiometricsSamples(clientId, currentWeek, weekEnd).length,
        db.getCheckInSamples(clientId, currentWeek, weekEnd).length,
        db.getTrainingLogs(clientId, currentWeek, weekEnd).length
      ].reduce((sum, count) => sum + count, 0);
      
      if (dataPoints >= 10) dataQuality = 'high';
      else if (dataPoints >= 5) dataQuality = 'medium';
    }

    return {
      hasData,
      lastComputed,
      nextComputation,
      dataQuality
    };
  }

  // Helper methods
  private getCurrentWeekStart(): Date {
    const now = new Date();
    const dayOfWeek = now.getDay();
    const daysToSubtract = dayOfWeek === 0 ? 6 : dayOfWeek - 1; // Monday = 0
    const weekStart = new Date(now);
    weekStart.setDate(weekStart.getDate() - daysToSubtract);
    weekStart.setHours(0, 0, 0, 0);
    return weekStart;
  }

  private getNextComputationDate(): Date {
    const now = new Date();
    const nextSunday = new Date(now);
    const daysUntilSunday = (7 - now.getDay()) % 7;
    nextSunday.setDate(now.getDate() + (daysUntilSunday === 0 ? 7 : daysUntilSunday));
    nextSunday.setHours(23, 0, 0, 0);
    return nextSunday;
  }
}


