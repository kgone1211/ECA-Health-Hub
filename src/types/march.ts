// M.A.R.C.H. Phase Detection Types

export type MarchPhase =
  | 'MITOCHONDRIA'
  | 'ABSORPTION_DETOX'
  | 'RESILIENCE'
  | 'CYCLICAL'
  | 'HYPERTROPHY_HEALTHSPAN';

export interface BiometricsSample {
  clientId: string;
  timestamp: string;
  hrv?: number;           // ms
  rhr?: number;           // bpm
  sleepHours?: number;
  sleepEfficiency?: number; // 0-1
  steps?: number;
}

export interface CheckInSample {
  clientId: string;
  timestamp: string;
  energyScore?: number;       // 1-5 (low→high)
  stressScore?: number;       // 1-5 (low→high)
  sorenessScore?: number;     // 1-5
  digestion: {
    bloating?: number;        // 0-3
    stoolForm?: number;       // Bristol 1-7
    bowelFreqPerDay?: number;
    nausea?: boolean;
    foodReactivityCount?: number; // # meals with symptoms
  };
  cycle?: {
    cycleDay?: number;        // 1..n
    pmsSeverity?: number;     // 0-3
    menstrual?: boolean;
  };
}

export interface TrainingLog {
  clientId: string;
  timestamp: string;
  sessionType: 'STRENGTH' | 'CARDIO' | 'MOBILITY' | 'REST';
  volumeLoad?: number; // sum(weight*reps)
  rpe?: number;        // 1-10
  durationMin?: number;
}

export interface BodyMetrics {
  clientId: string;
  timestamp: string;
  weightKg?: number;
  bodyFatPct?: number;
  waistCm?: number;
  // Optional labs if available
  labs?: { 
    crp?: number; 
    alt?: number; 
    ast?: number; 
    tsh?: number; 
    cortisolAm?: number 
  };
}

export interface WeeklyAggregate {
  clientId: string;
  weekStartISO: string;
  weekEndISO: string;
  // Derived stats (mean/median/trend deltas)
  hrvAvg?: number; 
  rhrAvg?: number; 
  sleepAvg?: number; 
  stepsAvg?: number;
  energyAvg?: number; 
  stressAvg?: number;
  gi: { 
    bloatingAvg?: number; 
    stoolFormAvg?: number; 
    bowelFreqAvg?: number; 
    foodReactivityAvg?: number 
  };
  cycle: { 
    cycleDayMode?: number; 
    pmsSeverityAvg?: number; 
    menstrualDays?: number 
  };
  training: { 
    strengthSessions: number; 
    cardioSessions: number; 
    volumeLoadSum: number; 
    rpeAvg?: number 
  };
  body: { 
    weightDeltaKg?: number; 
    strengthTrendPct?: number 
  }; // strengthTrend from e.g., 5RM or est. 1RM logs if available
}

export interface MarchPhaseAssessment {
  id: string;
  clientId: string;
  weekStartISO: string;
  decidedPhase: MarchPhase;
  confidence: number;      // 0-1
  phaseScores: Record<MarchPhase, number>; // 0-100 per phase
  rationale: string[];     // bullet points explaining why
  createdAt: string;
}

export interface BaselineStats {
  hrvMedian: number;
  rhrBaseline: number;
  volumeLoadBaseline: number;
  strengthBaseline: number;
}

export interface MarchPhaseGuidance {
  phase: MarchPhase;
  focus: string;
  keyActions: string[];
  trainingAdjustments: string[];
  nutritionTips: string[];
  redFlags: string[];
  duration: string;
}

export interface MarchConfig {
  thresholds: {
    lowHrv: number;
    highRhr: number;
    poorSleep: number;
    sleepEfficiency: number;
    giBloating: number;
    stoolFormMin: number;
    stoolFormMax: number;
    bowelFreqMin: number;
    bowelFreqMax: number;
    foodReactivity: number;
    highStress: number;
    stableSleep: number;
    strengthSessions: number;
    volumeIncrease: number;
    strengthTrend: number;
  };
  weights: {
    hrv: number;
    rhr: number;
    sleep: number;
    energy: number;
    steps: number;
    gi: number;
    stress: number;
    training: number;
    cycle: number;
  };
  confidence: {
    minSeparation: number;
    lowDataThreshold: number;
    minConfidence: number;
    maxConfidence: number;
  };
}


