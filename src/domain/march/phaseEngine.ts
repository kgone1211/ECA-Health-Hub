import { 
  MarchPhase, 
  WeeklyAggregate, 
  BaselineStats, 
  MarchPhaseAssessment,
  MarchConfig 
} from '@/types/march';
import { marchConfig } from '@/config/march';

export class MarchPhaseEngine {
  private config: MarchConfig;

  constructor(config: MarchConfig = marchConfig) {
    this.config = config;
  }

  /**
   * Compute M.A.R.C.H. phase assessment for a given week
   */
  computePhaseAssessment(
    aggregate: WeeklyAggregate, 
    baseline: BaselineStats,
    previousPhase?: MarchPhase
  ): MarchPhaseAssessment {
    const phaseScores = this.computeAllPhaseScores(aggregate, baseline);
    const { decidedPhase, confidence } = this.decidePhase(phaseScores, aggregate, previousPhase);
    const rationale = this.generateRationale(aggregate, baseline, phaseScores, decidedPhase);

    return {
      id: `march_${aggregate.clientId}_${aggregate.weekStartISO}`,
      clientId: aggregate.clientId,
      weekStartISO: aggregate.weekStartISO,
      decidedPhase,
      confidence,
      phaseScores,
      rationale,
      createdAt: new Date().toISOString()
    };
  }

  /**
   * Compute scores for all five M.A.R.C.H. phases
   */
  private computeAllPhaseScores(aggregate: WeeklyAggregate, baseline: BaselineStats): Record<MarchPhase, number> {
    return {
      MITOCHONDRIA: this.scoreMitochondria(aggregate, baseline),
      ABSORPTION_DETOX: this.scoreAbsorptionDetox(aggregate),
      RESILIENCE: this.scoreResilience(aggregate, baseline),
      CYCLICAL: this.scoreCyclical(aggregate),
      HYPERTROPHY_HEALTHSPAN: this.scoreHypertrophyHealthspan(aggregate, baseline)
    };
  }

  /**
   * Score MITOCHONDRIA phase (energy foundation)
   */
  private scoreMitochondria(aggregate: WeeklyAggregate, baseline: BaselineStats): number {
    let score = 0;
    const { thresholds, weights } = this.config;

    // HRV indicators
    if (aggregate.hrvAvg && this.isLowHRV(aggregate.hrvAvg, baseline)) {
      score += weights.hrv;
    }

    // RHR indicators
    if (aggregate.rhrAvg && this.isHighRHR(aggregate.rhrAvg, baseline)) {
      score += weights.rhr;
    }

    // Sleep quality
    if (aggregate.sleepAvg && aggregate.sleepAvg < thresholds.poorSleep) {
      score += weights.sleep;
    }

    // Energy levels
    if (aggregate.energyAvg && aggregate.energyAvg <= 2) {
      score += weights.energy;
    }

    // Activity levels
    if (aggregate.stepsAvg && aggregate.stepsAvg < 6000) {
      score += weights.steps;
    }

    return this.clamp(score, 0, 100);
  }

  /**
   * Score ABSORPTION_DETOX phase (digestive health)
   */
  private scoreAbsorptionDetox(aggregate: WeeklyAggregate): number {
    let score = 0;
    const { thresholds, weights } = this.config;

    // GI symptoms
    if (aggregate.gi.bloatingAvg && aggregate.gi.bloatingAvg >= thresholds.giBloating) {
      score += weights.gi;
    }

    if (aggregate.gi.stoolFormAvg && 
        (aggregate.gi.stoolFormAvg < thresholds.stoolFormMin || 
         aggregate.gi.stoolFormAvg > thresholds.stoolFormMax)) {
      score += weights.gi;
    }

    if (aggregate.gi.bowelFreqAvg && 
        (aggregate.gi.bowelFreqAvg < thresholds.bowelFreqMin || 
         aggregate.gi.bowelFreqAvg > thresholds.bowelFreqMax)) {
      score += weights.gi * 0.6;
    }

    if (aggregate.gi.foodReactivityAvg && aggregate.gi.foodReactivityAvg >= thresholds.foodReactivity) {
      score += weights.gi * 0.8;
    }

    // Energy impact
    if ((aggregate.energyAvg ?? 3) <= 2) {
      score += weights.energy * 0.5;
    }

    return this.clamp(score, 0, 100);
  }

  /**
   * Score RESILIENCE phase (stress management)
   */
  private scoreResilience(aggregate: WeeklyAggregate, baseline: BaselineStats): number {
    let score = 0;
    const { thresholds, weights } = this.config;

    // HRV trend
    if (this.trendHRVDown(aggregate, baseline)) {
      score += weights.hrv;
    }

    // Stress levels
    if ((aggregate.stressAvg ?? 0) >= thresholds.highStress) {
      score += weights.stress;
    }

    // Sleep quality with stress context
    if ((aggregate.sleepAvg ?? 8) < thresholds.stableSleep && !this.hasSevereGI(aggregate)) {
      score += weights.sleep;
    }

    // Training stress
    if ((aggregate.training.rpeAvg ?? 0) >= 7 && this.recoveryLow(aggregate, baseline)) {
      score += weights.training;
    }

    return this.clamp(score, 0, 100);
  }

  /**
   * Score CYCLICAL phase (hormonal balance)
   */
  private scoreCyclical(aggregate: WeeklyAggregate): number {
    let score = 0;
    const { weights } = this.config;

    // Menstrual indicators
    if ((aggregate.cycle.menstrualDays ?? 0) > 0) {
      score += weights.cycle;
    }

    // PMS symptoms
    if ((aggregate.cycle.pmsSeverityAvg ?? 0) >= 1.5) {
      score += weights.cycle * 0.67;
    }

    // Base stability with cycle symptoms
    if (this.baseStable(aggregate) && (aggregate.cycle.pmsSeverityAvg ?? 0) >= 1) {
      score += weights.cycle * 0.67;
    }

    return this.clamp(score, 0, 100);
  }

  /**
   * Score HYPERTROPHY_HEALTHSPAN phase (strength building)
   */
  private scoreHypertrophyHealthspan(aggregate: WeeklyAggregate, baseline: BaselineStats): number {
    let score = 0;
    const { thresholds, weights } = this.config;

    // Base stability check
    const ready = this.baseStable(aggregate) && 
                  !this.hasSevereGI(aggregate) && 
                  (aggregate.stressAvg ?? 0) <= 3 && 
                  (aggregate.sleepAvg ?? 0) >= thresholds.stableSleep;

    if (ready) {
      score += weights.training;

      // Training volume
      if (aggregate.training.strengthSessions >= thresholds.strengthSessions) {
        score += weights.training * 0.83;
      }

      // Volume progression
      if (aggregate.training.volumeLoadSum >= baseline.volumeLoadBaseline * (1 + thresholds.volumeIncrease)) {
        score += weights.training * 0.8;
      }

      // Strength progression
      if ((aggregate.body.strengthTrendPct ?? 0) > thresholds.strengthTrend) {
        score += weights.training * 0.6;
      }
    }

    return this.clamp(score, 0, 100);
  }

  /**
   * Decide final phase based on scores and guardrails
   */
  private decidePhase(
    phaseScores: Record<MarchPhase, number>, 
    aggregate: WeeklyAggregate,
    previousPhase?: MarchPhase
  ): { decidedPhase: MarchPhase; confidence: number } {
    const { confidence: confConfig } = this.config;

    // Check for low data
    if (this.isLowData(aggregate)) {
      return {
        decidedPhase: previousPhase || 'MITOCHONDRIA',
        confidence: confConfig.minConfidence
      };
    }

    // Apply guardrails
    const adjustedScores = this.applyGuardrails(phaseScores, aggregate);

    // Find highest score
    const sortedPhases = Object.entries(adjustedScores)
      .sort(([,a], [,b]) => b - a) as [MarchPhase, number][];

    const [decidedPhase, maxScore] = sortedPhases[0];
    const secondBest = sortedPhases[1]?.[1] || 0;

    // Calculate confidence based on separation
    const separation = maxScore - secondBest;
    let confidence = confConfig.minConfidence;

    if (separation >= confConfig.minSeparation) {
      const totalScore = Object.values(adjustedScores).reduce((sum, score) => sum + score, 0);
      confidence = Math.min(maxScore / totalScore, confConfig.maxConfidence);
    }

    return { decidedPhase, confidence };
  }

  /**
   * Apply guardrails to phase scores
   */
  private applyGuardrails(
    scores: Record<MarchPhase, number>, 
    aggregate: WeeklyAggregate
  ): Record<MarchPhase, number> {
    const adjusted = { ...scores };

    // Force ABSORPTION_DETOX if severe GI issues
    if (this.hasSevereGI(aggregate) && scores.ABSORPTION_DETOX < 40) {
      const nextBest = Math.max(...Object.values(scores).filter(s => s !== scores.ABSORPTION_DETOX));
      if (nextBest > 65) {
        adjusted.ABSORPTION_DETOX = Math.max(adjusted.ABSORPTION_DETOX, 70);
      }
    }

    // Prefer MITOCHONDRIA for very low HRV or high RHR
    if (this.hasVeryLowHRV(aggregate) || this.hasVeryHighRHR(aggregate)) {
      adjusted.MITOCHONDRIA = Math.max(adjusted.MITOCHONDRIA, 80);
    }

    // Allow HYPERTROPHY_HEALTHSPAN if base is stable and training signals are strong
    if (this.baseStable(aggregate) && this.hasStrongTrainingSignals(aggregate)) {
      const hypertrophyScore = adjusted.HYPERTROPHY_HEALTHSPAN;
      const nextBest = Math.max(...Object.values(adjusted).filter(s => s !== hypertrophyScore));
      if (hypertrophyScore >= nextBest - 5) {
        adjusted.HYPERTROPHY_HEALTHSPAN = hypertrophyScore + 5;
      }
    }

    return adjusted;
  }

  /**
   * Generate human-readable rationale
   */
  private generateRationale(
    aggregate: WeeklyAggregate, 
    baseline: BaselineStats, 
    scores: Record<MarchPhase, number>,
    decidedPhase: MarchPhase
  ): string[] {
    const rationale: string[] = [];
    const { thresholds } = this.config;

    // HRV indicators
    if (aggregate.hrvAvg && this.isLowHRV(aggregate.hrvAvg, baseline)) {
      rationale.push(`HRV ${aggregate.hrvAvg}ms vs baseline ${baseline.hrvMedian}ms → energy foundation focus`);
    }

    // RHR indicators
    if (aggregate.rhrAvg && this.isHighRHR(aggregate.rhrAvg, baseline)) {
      rationale.push(`RHR ${aggregate.rhrAvg} bpm vs baseline ${baseline.rhrBaseline} bpm → recovery priority`);
    }

    // Sleep indicators
    if (aggregate.sleepAvg && aggregate.sleepAvg < thresholds.poorSleep) {
      rationale.push(`Sleep ${aggregate.sleepAvg.toFixed(1)}h < ${thresholds.poorSleep}h → sleep optimization needed`);
    }

    // GI indicators
    if (aggregate.gi.bloatingAvg && aggregate.gi.bloatingAvg >= thresholds.giBloating) {
      rationale.push(`Bloating avg ${aggregate.gi.bloatingAvg.toFixed(1)}/3 → digestive health focus`);
    }

    if (aggregate.gi.stoolFormAvg && 
        (aggregate.gi.stoolFormAvg < thresholds.stoolFormMin || 
         aggregate.gi.stoolFormAvg > thresholds.stoolFormMax)) {
      rationale.push(`Stool form ${aggregate.gi.stoolFormAvg.toFixed(1)} outside normal range → gut health priority`);
    }

    // Stress indicators
    if ((aggregate.stressAvg ?? 0) >= thresholds.highStress) {
      rationale.push(`Stress ${(aggregate.stressAvg ?? 0).toFixed(1)}/5 → stress management focus`);
    }

    // Training indicators
    if (aggregate.training.strengthSessions >= thresholds.strengthSessions) {
      rationale.push(`${aggregate.training.strengthSessions} strength sessions → hypertrophy readiness`);
    }

    // Cycle indicators
    if ((aggregate.cycle.menstrualDays ?? 0) > 0) {
      rationale.push(`${aggregate.cycle.menstrualDays} menstrual days → cyclical optimization`);
    }

    if ((aggregate.cycle.pmsSeverityAvg ?? 0) >= 1.5) {
      rationale.push(`PMS severity ${(aggregate.cycle.pmsSeverityAvg ?? 0).toFixed(1)}/3 → hormonal balance focus`);
    }

    return rationale;
  }

  // Helper methods
  private isLowHRV(hrv: number, baseline: BaselineStats): boolean {
    return hrv < this.config.thresholds.lowHrv || hrv < baseline.hrvMedian * 0.85;
  }

  private isHighRHR(rhr: number, baseline: BaselineStats): boolean {
    return rhr > this.config.thresholds.highRhr || rhr > baseline.rhrBaseline * 1.08;
  }

  private hasVeryLowHRV(aggregate: WeeklyAggregate): boolean {
    return (aggregate.hrvAvg ?? 100) < 35;
  }

  private hasVeryHighRHR(aggregate: WeeklyAggregate): boolean {
    return (aggregate.rhrAvg ?? 60) > 85;
  }

  private hasSevereGI(aggregate: WeeklyAggregate): boolean {
    const { thresholds } = this.config;
    return (aggregate.gi.bloatingAvg ?? 0) >= 2.5 ||
           (aggregate.gi.stoolFormAvg ?? 4) < 2 ||
           (aggregate.gi.stoolFormAvg ?? 4) > 6 ||
           (aggregate.gi.foodReactivityAvg ?? 0) >= 1.5;
  }

  private baseStable(aggregate: WeeklyAggregate): boolean {
    const { thresholds } = this.config;
    return (aggregate.sleepAvg ?? 0) >= thresholds.stableSleep &&
           (aggregate.stressAvg ?? 0) <= 3 &&
           !this.hasSevereGI(aggregate) &&
           (aggregate.energyAvg ?? 0) >= 3;
  }

  private hasStrongTrainingSignals(aggregate: WeeklyAggregate): boolean {
    return aggregate.training.strengthSessions >= this.config.thresholds.strengthSessions &&
           aggregate.training.volumeLoadSum > 0 &&
           (aggregate.body.strengthTrendPct ?? 0) > 0;
  }

  private trendHRVDown(aggregate: WeeklyAggregate, baseline: BaselineStats): boolean {
    // Simplified: compare current to baseline
    return (aggregate.hrvAvg ?? baseline.hrvMedian) < baseline.hrvMedian * 0.9;
  }

  private recoveryLow(aggregate: WeeklyAggregate, baseline: BaselineStats): boolean {
    return this.trendHRVDown(aggregate, baseline) || 
           (aggregate.sleepAvg ?? 8) < 7 ||
           (aggregate.stressAvg ?? 0) >= 4;
  }

  private isLowData(aggregate: WeeklyAggregate): boolean {
    const dataPoints = [
      aggregate.hrvAvg,
      aggregate.rhrAvg,
      aggregate.sleepAvg,
      aggregate.energyAvg,
      aggregate.stressAvg,
      aggregate.gi.bloatingAvg,
      aggregate.training.strengthSessions
    ].filter(val => val !== undefined).length;

    return dataPoints < this.config.confidence.lowDataThreshold;
  }

  private clamp(value: number, min: number, max: number): number {
    return Math.min(Math.max(value, min), max);
  }
}


