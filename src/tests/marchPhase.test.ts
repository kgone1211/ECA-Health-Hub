import { MarchPhaseEngine } from '@/domain/march/phaseEngine';
import { MarchAggregationService } from '@/services/marchAggregationService';
import { WeeklyAggregate, BaselineStats, MarchPhase } from '@/types/march';

describe('M.A.R.C.H. Phase Detection', () => {
  let phaseEngine: MarchPhaseEngine;
  let aggregationService: MarchAggregationService;

  beforeEach(() => {
    phaseEngine = new MarchPhaseEngine();
    aggregationService = new MarchAggregationService();
  });

  describe('Phase Engine', () => {
    const mockBaseline: BaselineStats = {
      hrvMedian: 55,
      rhrBaseline: 65,
      volumeLoadBaseline: 2000,
      strengthBaseline: 2000
    };

    it('should detect MITOCHONDRIA phase for low HRV and poor sleep', () => {
      const aggregate: WeeklyAggregate = {
        clientId: 'test-client',
        weekStartISO: '2024-01-15',
        weekEndISO: '2024-01-21',
        hrvAvg: 38,
        rhrAvg: 76,
        sleepAvg: 6.2,
        energyAvg: 2,
        stressAvg: 3,
        gi: { bloatingAvg: 1.2, stoolFormAvg: 4, bowelFreqAvg: 1.5, foodReactivityAvg: 0.3 },
        cycle: { cycleDayMode: 5, pmsSeverityAvg: 0.5, menstrualDays: 0 },
        training: { strengthSessions: 2, cardioSessions: 1, volumeLoadSum: 1500, rpeAvg: 6 },
        body: { weightDeltaKg: -0.2, strengthTrendPct: 0.5 }
      };

      const assessment = phaseEngine.computePhaseAssessment(aggregate, mockBaseline);
      
      expect(assessment.decidedPhase).toBe('MITOCHONDRIA');
      expect(assessment.confidence).toBeGreaterThan(0.5);
      expect(assessment.rationale).toContain('HRV 38ms vs baseline 55ms');
    });

    it('should detect ABSORPTION_DETOX phase for severe GI issues', () => {
      const aggregate: WeeklyAggregate = {
        clientId: 'test-client',
        weekStartISO: '2024-01-15',
        weekEndISO: '2024-01-21',
        hrvAvg: 50,
        rhrAvg: 68,
        sleepAvg: 7.5,
        energyAvg: 3,
        stressAvg: 2.5,
        gi: { 
          bloatingAvg: 2.5, 
          stoolFormAvg: 2, 
          bowelFreqAvg: 0.5, 
          foodReactivityAvg: 1.2 
        },
        cycle: { cycleDayMode: 10, pmsSeverityAvg: 0.5, menstrualDays: 0 },
        training: { strengthSessions: 3, cardioSessions: 2, volumeLoadSum: 2200, rpeAvg: 5 },
        body: { weightDeltaKg: 0.1, strengthTrendPct: 1.0 }
      };

      const assessment = phaseEngine.computePhaseAssessment(aggregate, mockBaseline);
      
      expect(assessment.decidedPhase).toBe('ABSORPTION_DETOX');
      expect(assessment.confidence).toBeGreaterThan(0.5);
      expect(assessment.rationale).toContain('Bloating avg 2.5/3');
    });

    it('should detect RESILIENCE phase for high stress and HRV decline', () => {
      const aggregate: WeeklyAggregate = {
        clientId: 'test-client',
        weekStartISO: '2024-01-15',
        weekEndISO: '2024-01-21',
        hrvAvg: 45,
        rhrAvg: 70,
        sleepAvg: 6.8,
        energyAvg: 2.5,
        stressAvg: 4.2,
        gi: { bloatingAvg: 1.0, stoolFormAvg: 4, bowelFreqAvg: 1.8, foodReactivityAvg: 0.2 },
        cycle: { cycleDayMode: 12, pmsSeverityAvg: 0.8, menstrualDays: 0 },
        training: { strengthSessions: 4, cardioSessions: 1, volumeLoadSum: 2800, rpeAvg: 8 },
        body: { weightDeltaKg: 0.0, strengthTrendPct: -0.5 }
      };

      const assessment = phaseEngine.computePhaseAssessment(aggregate, mockBaseline);
      
      expect(assessment.decidedPhase).toBe('RESILIENCE');
      expect(assessment.confidence).toBeGreaterThan(0.5);
      expect(assessment.rationale).toContain('Stress 4.2/5');
    });

    it('should detect CYCLICAL phase during menstrual week', () => {
      const aggregate: WeeklyAggregate = {
        clientId: 'test-client',
        weekStartISO: '2024-01-15',
        weekEndISO: '2024-01-21',
        hrvAvg: 52,
        rhrAvg: 66,
        sleepAvg: 7.2,
        energyAvg: 3.5,
        stressAvg: 2.8,
        gi: { bloatingAvg: 1.5, stoolFormAvg: 3.5, bowelFreqAvg: 2.0, foodReactivityAvg: 0.4 },
        cycle: { cycleDayMode: 3, pmsSeverityAvg: 2.0, menstrualDays: 3 },
        training: { strengthSessions: 2, cardioSessions: 3, volumeLoadSum: 1800, rpeAvg: 6 },
        body: { weightDeltaKg: 0.3, strengthTrendPct: 0.8 }
      };

      const assessment = phaseEngine.computePhaseAssessment(aggregate, mockBaseline);
      
      expect(assessment.decidedPhase).toBe('CYCLICAL');
      expect(assessment.confidence).toBeGreaterThan(0.5);
      expect(assessment.rationale).toContain('3 menstrual days');
    });

    it('should detect HYPERTROPHY_HEALTHSPAN phase for stable base and strong training', () => {
      const aggregate: WeeklyAggregate = {
        clientId: 'test-client',
        weekStartISO: '2024-01-15',
        weekEndISO: '2024-01-21',
        hrvAvg: 58,
        rhrAvg: 62,
        sleepAvg: 7.8,
        energyAvg: 4.2,
        stressAvg: 2.0,
        gi: { bloatingAvg: 0.8, stoolFormAvg: 4.2, bowelFreqAvg: 2.2, foodReactivityAvg: 0.1 },
        cycle: { cycleDayMode: 8, pmsSeverityAvg: 0.3, menstrualDays: 0 },
        training: { strengthSessions: 4, cardioSessions: 2, volumeLoadSum: 2500, rpeAvg: 6.5 },
        body: { weightDeltaKg: 0.1, strengthTrendPct: 2.5 }
      };

      const assessment = phaseEngine.computePhaseAssessment(aggregate, mockBaseline);
      
      expect(assessment.decidedPhase).toBe('HYPERTROPHY_HEALTHSPAN');
      expect(assessment.confidence).toBeGreaterThan(0.5);
      expect(assessment.rationale).toContain('4 strength sessions');
    });
  });

  describe('Aggregation Service', () => {
    it('should aggregate weekly data correctly', async () => {
      const clientId = 'test-client';
      const weekStart = new Date('2024-01-15');
      
      const biometrics = [
        {
          clientId,
          timestamp: '2024-01-15T08:00:00Z',
          hrv: 45,
          rhr: 70,
          sleepHours: 7.5,
          sleepEfficiency: 0.85,
          steps: 8000
        },
        {
          clientId,
          timestamp: '2024-01-16T08:00:00Z',
          hrv: 48,
          rhr: 68,
          sleepHours: 8.0,
          sleepEfficiency: 0.90,
          steps: 7500
        }
      ];

      const checkIns = [
        {
          clientId,
          timestamp: '2024-01-15T09:00:00Z',
          energyScore: 4,
          stressScore: 2,
          sorenessScore: 3,
          digestion: {
            bloating: 1.0,
            stoolForm: 4,
            bowelFreqPerDay: 2.0,
            nausea: false,
            foodReactivityCount: 0.2
          }
        }
      ];

      const training = [
        {
          clientId,
          timestamp: '2024-01-15T18:00:00Z',
          sessionType: 'STRENGTH' as const,
          volumeLoad: 2000,
          rpe: 7,
          durationMin: 60
        }
      ];

      const bodyMetrics = [
        {
          clientId,
          timestamp: '2024-01-15T07:00:00Z',
          weightKg: 75.0,
          bodyFatPct: 18.0,
          waistCm: 85
        }
      ];

      const aggregate = await aggregationService.aggregateWeekly(
        clientId,
        weekStart,
        biometrics,
        checkIns,
        training,
        bodyMetrics
      );

      expect(aggregate.clientId).toBe(clientId);
      expect(aggregate.hrvAvg).toBe(46.5);
      expect(aggregate.rhrAvg).toBe(69);
      expect(aggregate.sleepAvg).toBe(7.75);
      expect(aggregate.energyAvg).toBe(4);
      expect(aggregate.training.strengthSessions).toBe(1);
      expect(aggregate.training.volumeLoadSum).toBe(2000);
    });

    it('should detect insufficient data', async () => {
      const aggregate: WeeklyAggregate = {
        clientId: 'test-client',
        weekStartISO: '2024-01-15',
        weekEndISO: '2024-01-21',
        hrvAvg: undefined,
        rhrAvg: undefined,
        sleepAvg: undefined,
        energyAvg: undefined,
        stressAvg: undefined,
        gi: { bloatingAvg: undefined, stoolFormAvg: undefined, bowelFreqAvg: undefined, foodReactivityAvg: undefined },
        cycle: { cycleDayMode: undefined, pmsSeverityAvg: undefined, menstrualDays: 0 },
        training: { strengthSessions: 0, cardioSessions: 0, volumeLoadSum: 0, rpeAvg: undefined },
        body: { weightDeltaKg: undefined, strengthTrendPct: undefined }
      };

      const hasData = aggregationService.hasSufficientData(aggregate);
      expect(hasData).toBe(false);
    });
  });
});


