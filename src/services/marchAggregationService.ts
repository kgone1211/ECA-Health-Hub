import { 
  WeeklyAggregate, 
  BiometricsSample, 
  CheckInSample, 
  TrainingLog, 
  BodyMetrics,
  BaselineStats 
} from '@/types/march';

export class MarchAggregationService {
  /**
   * Aggregate weekly data for M.A.R.C.H. phase computation
   */
  async aggregateWeekly(
    clientId: string, 
    weekStart: Date,
    biometrics: BiometricsSample[],
    checkIns: CheckInSample[],
    training: TrainingLog[],
    bodyMetrics: BodyMetrics[]
  ): Promise<WeeklyAggregate> {
    const weekEnd = new Date(weekStart);
    weekEnd.setDate(weekEnd.getDate() + 6);
    weekEnd.setHours(23, 59, 59, 999);

    const weekStartISO = weekStart.toISOString().split('T')[0];
    const weekEndISO = weekEnd.toISOString().split('T')[0];

    // Filter data for the week
    const weekBiometrics = this.filterByWeek(biometrics, weekStart, weekEnd);
    const weekCheckIns = this.filterByWeek(checkIns, weekStart, weekEnd);
    const weekTraining = this.filterByWeek(training, weekStart, weekEnd);
    const weekBodyMetrics = this.filterByWeek(bodyMetrics, weekStart, weekEnd);

    // Compute averages and trends
    const hrvAvg = this.computeAverage(weekBiometrics.map(b => b.hrv));
    const rhrAvg = this.computeAverage(weekBiometrics.map(b => b.rhr));
    const sleepAvg = this.computeAverage(weekBiometrics.map(b => b.sleepHours));
    const stepsAvg = this.computeAverage(weekBiometrics.map(b => b.steps));
    const energyAvg = this.computeAverage(weekCheckIns.map(c => c.energyScore));
    const stressAvg = this.computeAverage(weekCheckIns.map(c => c.stressScore));

    // GI metrics
    const gi = {
      bloatingAvg: this.computeAverage(weekCheckIns.map(c => c.digestion.bloating)),
      stoolFormAvg: this.computeAverage(weekCheckIns.map(c => c.digestion.stoolForm)),
      bowelFreqAvg: this.computeAverage(weekCheckIns.map(c => c.digestion.bowelFreqPerDay)),
      foodReactivityAvg: this.computeAverage(weekCheckIns.map(c => c.digestion.foodReactivityCount))
    };

    // Cycle metrics
    const cycle = {
      cycleDayMode: this.computeMode(weekCheckIns.map(c => c.cycle?.cycleDay)),
      pmsSeverityAvg: this.computeAverage(weekCheckIns.map(c => c.cycle?.pmsSeverity)),
      menstrualDays: weekCheckIns.filter(c => c.cycle?.menstrual).length
    };

    // Training metrics
    const strengthSessions = weekTraining.filter(t => t.sessionType === 'STRENGTH').length;
    const cardioSessions = weekTraining.filter(t => t.sessionType === 'CARDIO').length;
    const volumeLoadSum = weekTraining.reduce((sum, t) => sum + (t.volumeLoad || 0), 0);
    const rpeAvg = this.computeAverage(weekTraining.map(t => t.rpe));

    // Body metrics
    const weightDelta = this.computeWeightDelta(weekBodyMetrics);
    const strengthTrend = this.computeStrengthTrend(weekTraining);

    return {
      clientId,
      weekStartISO,
      weekEndISO,
      hrvAvg,
      rhrAvg,
      sleepAvg,
      stepsAvg,
      energyAvg,
      stressAvg,
      gi,
      cycle,
      training: {
        strengthSessions,
        cardioSessions,
        volumeLoadSum,
        rpeAvg
      },
      body: {
        weightDeltaKg: weightDelta,
        strengthTrendPct: strengthTrend
      }
    };
  }

  /**
   * Compute baseline stats for a client (last 6 weeks)
   */
  async computeBaselineStats(
    clientId: string,
    biometrics: BiometricsSample[],
    training: TrainingLog[]
  ): Promise<BaselineStats> {
    const sixWeeksAgo = new Date();
    sixWeeksAgo.setDate(sixWeeksAgo.getDate() - 42);

    const recentBiometrics = biometrics.filter(b => 
      new Date(b.timestamp) >= sixWeeksAgo
    );

    const recentTraining = training.filter(t => 
      new Date(t.timestamp) >= sixWeeksAgo
    );

    const hrvValues = recentBiometrics
      .map(b => b.hrv)
      .filter((h): h is number => h !== undefined)
      .sort((a, b) => a - b);

    const rhrValues = recentBiometrics
      .map(b => b.rhr)
      .filter((r): r is number => r !== undefined);

    const volumeLoadValues = recentTraining
      .map(t => t.volumeLoad)
      .filter((v): v is number => v !== undefined);

    return {
      hrvMedian: this.computeMedian(hrvValues) || 50,
      rhrBaseline: this.computeAverage(rhrValues) || 65,
      volumeLoadBaseline: this.computeAverage(volumeLoadValues) || 0,
      strengthBaseline: this.computeAverage(volumeLoadValues) || 0
    };
  }

  /**
   * Check if client has sufficient data for phase computation
   */
  hasSufficientData(aggregate: WeeklyAggregate): boolean {
    const dataPoints = [
      aggregate.hrvAvg,
      aggregate.rhrAvg,
      aggregate.sleepAvg,
      aggregate.energyAvg,
      aggregate.stressAvg,
      aggregate.gi.bloatingAvg,
      aggregate.training.strengthSessions
    ].filter(val => val !== undefined).length;

    return dataPoints >= 3;
  }

  // Helper methods
  private filterByWeek<T extends { timestamp: string }>(
    data: T[], 
    weekStart: Date, 
    weekEnd: Date
  ): T[] {
    return data.filter(item => {
      const itemDate = new Date(item.timestamp);
      return itemDate >= weekStart && itemDate <= weekEnd;
    });
  }

  private computeAverage(values: (number | undefined)[]): number | undefined {
    const validValues = values.filter((v): v is number => v !== undefined);
    if (validValues.length === 0) return undefined;
    
    const sum = validValues.reduce((acc, val) => acc + val, 0);
    return sum / validValues.length;
  }

  private computeMedian(values: number[]): number | undefined {
    if (values.length === 0) return undefined;
    
    const sorted = [...values].sort((a, b) => a - b);
    const mid = Math.floor(sorted.length / 2);
    
    return sorted.length % 2 === 0
      ? (sorted[mid - 1] + sorted[mid]) / 2
      : sorted[mid];
  }

  private computeMode(values: (number | undefined)[]): number | undefined {
    const validValues = values.filter((v): v is number => v !== undefined);
    if (validValues.length === 0) return undefined;

    const frequency: Record<number, number> = {};
    validValues.forEach(val => {
      frequency[val] = (frequency[val] || 0) + 1;
    });

    let maxFreq = 0;
    let mode = validValues[0];
    
    Object.entries(frequency).forEach(([val, freq]) => {
      if (freq > maxFreq) {
        maxFreq = freq;
        mode = Number(val);
      }
    });

    return mode;
  }

  private computeWeightDelta(bodyMetrics: BodyMetrics[]): number | undefined {
    if (bodyMetrics.length < 2) return undefined;
    
    const sorted = bodyMetrics
      .sort((a, b) => new Date(a.timestamp).getTime() - new Date(b.timestamp).getTime());
    
    const first = sorted[0].weightKg;
    const last = sorted[sorted.length - 1].weightKg;
    
    if (first === undefined || last === undefined) return undefined;
    
    return last - first;
  }

  private computeStrengthTrend(training: TrainingLog[]): number | undefined {
    const strengthSessions = training
      .filter(t => t.sessionType === 'STRENGTH' && t.volumeLoad)
      .sort((a, b) => new Date(a.timestamp).getTime() - new Date(b.timestamp).getTime());

    if (strengthSessions.length < 2) return undefined;

    // Simple linear trend calculation
    const volumes = strengthSessions.map(s => s.volumeLoad!);
    const n = volumes.length;
    const sumX = (n * (n - 1)) / 2;
    const sumY = volumes.reduce((acc, vol) => acc + vol, 0);
    const sumXY = volumes.reduce((acc, vol, i) => acc + vol * i, 0);
    const sumX2 = (n * (n - 1) * (2 * n - 1)) / 6;

    const slope = (n * sumXY - sumX * sumY) / (n * sumX2 - sumX * sumX);
    const avgVolume = sumY / n;
    
    return avgVolume > 0 ? (slope / avgVolume) * 100 : 0;
  }
}


