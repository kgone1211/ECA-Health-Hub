import { MarchConfig } from '@/types/march';

export const marchConfig: MarchConfig = {
  thresholds: {
    lowHrv: 45,                    // ms
    highRhr: 72,                   // bpm
    poorSleep: 6.5,                // hours
    sleepEfficiency: 0.85,         // 0-1
    giBloating: 1.5,               // 0-3 scale
    stoolFormMin: 3,               // Bristol scale
    stoolFormMax: 5,               // Bristol scale
    bowelFreqMin: 1,               // per day
    bowelFreqMax: 3,               // per day
    foodReactivity: 0.5,           // per day
    highStress: 3.5,               // 1-5 scale
    stableSleep: 7,                // hours
    strengthSessions: 3,           // per week
    volumeIncrease: 0.10,          // 10% increase
    strengthTrend: 1.5,            // % increase
  },
  weights: {
    hrv: 30,
    rhr: 20,
    sleep: 15,
    energy: 15,
    steps: 10,
    gi: 25,
    stress: 25,
    training: 25,
    cycle: 30,
  },
  confidence: {
    minSeparation: 8,              // points between phases
    lowDataThreshold: 3,           // minimum days of data
    minConfidence: 0.5,
    maxConfidence: 0.95,
  },
};

export const phaseGuidance: Record<string, any> = {
  MITOCHONDRIA: {
    phase: 'MITOCHONDRIA',
    focus: 'Energy Foundation & Recovery',
    keyActions: [
      'Prioritize sleep quality and duration',
      'Manage stress through meditation/breathing',
      'Focus on gentle movement and recovery',
      'Optimize nutrition for energy production'
    ],
    trainingAdjustments: [
      'Reduce training volume by 30-50%',
      'Focus on low-intensity cardio',
      'Include more mobility work',
      'Take extra rest days'
    ],
    nutritionTips: [
      'Increase B-vitamin rich foods',
      'Focus on complex carbohydrates',
      'Ensure adequate protein for recovery',
      'Consider magnesium supplementation'
    ],
    redFlags: [
      'HRV continues to decline',
      'Sleep quality worsens',
      'Energy levels drop further',
      'Increased illness frequency'
    ],
    duration: '2-4 weeks'
  },
  ABSORPTION_DETOX: {
    phase: 'ABSORPTION_DETOX',
    focus: 'Digestive Health & Nutrient Absorption',
    keyActions: [
      'Identify and eliminate food triggers',
      'Support gut microbiome health',
      'Manage stress around meal times',
      'Focus on easily digestible foods'
    ],
    trainingAdjustments: [
      'Avoid high-intensity training',
      'Focus on gentle movement',
      'Include gut-friendly exercises',
      'Listen to body signals'
    ],
    nutritionTips: [
      'Eliminate common allergens',
      'Include fermented foods',
      'Focus on cooked vegetables',
      'Consider digestive enzymes'
    ],
    redFlags: [
      'Digestive symptoms worsen',
      'New food intolerances develop',
      'Weight loss or gain',
      'Nutrient deficiencies'
    ],
    duration: '3-6 weeks'
  },
  RESILIENCE: {
    phase: 'RESILIENCE',
    focus: 'Stress Management & Recovery',
    keyActions: [
      'Implement stress reduction techniques',
      'Optimize recovery protocols',
      'Manage training load carefully',
      'Focus on sleep and nutrition'
    ],
    trainingAdjustments: [
      'Reduce training intensity',
      'Increase recovery time',
      'Focus on technique over load',
      'Include stress-reducing activities'
    ],
    nutritionTips: [
      'Focus on anti-inflammatory foods',
      'Ensure adequate protein',
      'Include adaptogenic herbs',
      'Manage caffeine intake'
    ],
    redFlags: [
      'Stress levels continue to rise',
      'Recovery time increases',
      'Performance declines',
      'Mood disturbances'
    ],
    duration: '2-4 weeks'
  },
  CYCLICAL: {
    phase: 'CYCLICAL',
    focus: 'Hormonal Balance & Cycle Optimization',
    keyActions: [
      'Track menstrual cycle patterns',
      'Adjust training to cycle phases',
      'Manage PMS symptoms',
      'Support hormonal balance'
    ],
    trainingAdjustments: [
      'Reduce intensity during PMS',
      'Focus on strength during follicular phase',
      'Include more cardio during luteal phase',
      'Take rest during menstruation'
    ],
    nutritionTips: [
      'Increase iron-rich foods during menstruation',
      'Focus on magnesium for PMS',
      'Include phytoestrogens',
      'Manage blood sugar stability'
    ],
    redFlags: [
      'Irregular cycles',
      'Severe PMS symptoms',
      'Hormonal imbalances',
      'Fertility concerns'
    ],
    duration: '1-3 cycles'
  },
  HYPERTROPHY_HEALTHSPAN: {
    phase: 'HYPERTROPHY_HEALTHSPAN',
    focus: 'Strength Building & Long-term Health',
    keyActions: [
      'Progressive overload training',
      'Optimize protein intake',
      'Focus on compound movements',
      'Monitor recovery markers'
    ],
    trainingAdjustments: [
      'Increase training volume gradually',
      'Focus on strength progression',
      'Include variety in training',
      'Monitor for overtraining'
    ],
    nutritionTips: [
      'Increase protein to 1.6-2.2g/kg',
      'Time protein around workouts',
      'Focus on nutrient density',
      'Consider creatine supplementation'
    ],
    redFlags: [
      'Performance plateaus',
      'Increased injury risk',
      'Recovery markers decline',
      'Overtraining symptoms'
    ],
    duration: '4-8 weeks'
  }
};


