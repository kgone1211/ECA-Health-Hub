# M.A.R.C.H. Phase Detection System

## Overview

The M.A.R.C.H. Phase Detection system is an intelligent health optimization engine that analyzes client data to determine which phase of health optimization they should focus on. The system uses a rules-based scoring approach with transparent rationale generation.

## The Five M.A.R.C.H. Phases

### 1. MITOCHONDRIA (Energy Foundation)
**Focus**: Energy foundation and recovery
**When**: Low HRV, high RHR, poor sleep, low energy
**Key Indicators**:
- HRV < 45ms or >15% below baseline
- RHR > 72 bpm or >8% above baseline
- Sleep < 6.5 hours or efficiency < 85%
- Energy score ≤ 2/5
- Steps < 6000/day

### 2. ABSORPTION_DETOX (Digestive Health)
**Focus**: Digestive health and nutrient absorption
**When**: Severe GI issues affecting overall health
**Key Indicators**:
- Bloating ≥ 1.5/3
- Stool form outside 3-5 (Bristol scale)
- Bowel frequency < 1 or > 3/day
- Food reactivity ≥ 0.5/day
- Low energy due to GI issues

### 3. RESILIENCE (Stress Management)
**Focus**: Stress management and recovery optimization
**When**: High stress, HRV decline, poor recovery
**Key Indicators**:
- HRV trending downward
- Stress score ≥ 3.5/5
- Sleep < 7h with non-GI causes
- High RPE (≥7) with poor recovery
- Training stress without adaptation

### 4. CYCLICAL (Hormonal Balance)
**Focus**: Hormonal balance and cycle optimization
**When**: Menstrual cycle affecting performance
**Key Indicators**:
- Menstrual days > 0
- PMS severity ≥ 1.5/3
- Stable base with cycle symptoms
- Hormonal fluctuations affecting training

### 5. HYPERTROPHY_HEALTHSPAN (Strength Building)
**Focus**: Strength building and long-term health
**When**: Stable base, ready for progression
**Key Indicators**:
- Stable sleep ≥ 7h
- Low stress ≤ 3/5
- No severe GI issues
- Energy ≥ 3/5
- 3+ strength sessions/week
- Volume load increasing ≥10%
- Strength trending upward

## System Architecture

### Core Components

1. **Domain Models** (`src/types/march.ts`)
   - TypeScript interfaces for all data structures
   - BiometricsSample, CheckInSample, TrainingLog, BodyMetrics
   - WeeklyAggregate, MarchPhaseAssessment, BaselineStats

2. **Rules Engine** (`src/domain/march/phaseEngine.ts`)
   - Transparent scoring algorithm
   - Guardrails and fallback logic
   - Rationale generation
   - Confidence calculation

3. **Aggregation Service** (`src/services/marchAggregationService.ts`)
   - Weekly data aggregation
   - Baseline computation
   - Data quality assessment
   - Trend analysis

4. **Main Service** (`src/services/marchService.ts`)
   - Orchestrates phase computation
   - Manages data flow
   - Provides API interface
   - Handles phase transitions

5. **API Endpoints** (`src/app/api/march-phase/`)
   - GET `/api/march-phase?clientId=xxx` - Current phase
   - GET `/api/march-phase/history?clientId=xxx&limit=12` - Phase history
   - POST `/api/march-phase` - Compute new phase

6. **UI Components**
   - `MarchPhaseCard` - Dashboard phase display
   - `/march-phase` - Phase history page
   - Integrated into main dashboard

### Database Schema

The system uses the following data tables:
- `biometrics_samples` - HRV, RHR, sleep, steps
- `checkin_samples` - Energy, stress, GI, cycle data
- `training_logs` - Workout sessions, volume, RPE
- `body_metrics` - Weight, body fat, measurements
- `weekly_aggregates` - Computed weekly statistics
- `march_phase_assessments` - Phase decisions and rationale

## Configuration

### Thresholds (`src/config/march.ts`)

```typescript
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
}
```

### Scoring Weights

Each phase uses weighted scoring based on different health indicators:
- HRV: 30 points
- RHR: 20 points
- Sleep: 15 points
- Energy: 15 points
- Steps: 10 points
- GI: 25 points
- Stress: 25 points
- Training: 25 points
- Cycle: 30 points

## Usage

### Computing a Phase Assessment

```typescript
import { MarchService } from '@/services/marchService';

const marchService = new MarchService();

// Compute phase for current week
const assessment = await marchService.computeWeeklyAssessment('client-id', new Date());

// Get current phase
const currentPhase = await marchService.getCurrentPhase('client-id');

// Get phase history
const history = await marchService.getPhaseHistory('client-id', 12);
```

### API Usage

```bash
# Get current phase
curl "http://localhost:3000/api/march-phase?clientId=2"

# Get phase history
curl "http://localhost:3000/api/march-phase/history?clientId=2&limit=12"

# Compute new phase
curl -X POST "http://localhost:3000/api/march-phase" \
  -H "Content-Type: application/json" \
  -d '{"clientId": "2", "weekStart": "2024-01-15"}'
```

## Phase Guidance

Each phase includes specific guidance:

### MITOCHONDRIA
- **Focus**: Energy Foundation & Recovery
- **Key Actions**: Prioritize sleep, manage stress, gentle movement
- **Training**: Reduce volume 30-50%, low-intensity cardio
- **Nutrition**: B-vitamins, complex carbs, magnesium
- **Duration**: 2-4 weeks

### ABSORPTION_DETOX
- **Focus**: Digestive Health & Nutrient Absorption
- **Key Actions**: Identify triggers, support microbiome, manage meal stress
- **Training**: Avoid high-intensity, gentle movement
- **Nutrition**: Eliminate allergens, fermented foods, digestive enzymes
- **Duration**: 3-6 weeks

### RESILIENCE
- **Focus**: Stress Management & Recovery
- **Key Actions**: Stress reduction techniques, optimize recovery
- **Training**: Reduce intensity, increase recovery time
- **Nutrition**: Anti-inflammatory foods, adaptogens
- **Duration**: 2-4 weeks

### CYCLICAL
- **Focus**: Hormonal Balance & Cycle Optimization
- **Key Actions**: Track cycle, adjust training, manage PMS
- **Training**: Cycle-based adjustments, reduce intensity during PMS
- **Nutrition**: Iron-rich foods, magnesium for PMS
- **Duration**: 1-3 cycles

### HYPERTROPHY_HEALTHSPAN
- **Focus**: Strength Building & Long-term Health
- **Key Actions**: Progressive overload, optimize protein
- **Training**: Increase volume gradually, focus on strength
- **Nutrition**: 1.6-2.2g/kg protein, creatine
- **Duration**: 4-8 weeks

## Data Requirements

### Minimum Data for Phase Computation
- At least 3 days of data per week
- HRV, RHR, sleep, energy, stress, or GI data
- Training logs for strength-focused phases

### Data Quality Levels
- **High**: 10+ data points per week
- **Medium**: 5-9 data points per week
- **Low**: <5 data points per week

## Confidence Scoring

Confidence is calculated based on:
1. **Data Quality**: More data = higher confidence
2. **Score Separation**: Larger gaps between phases = higher confidence
3. **Guardrails**: Applied rules increase confidence
4. **Range**: 50-95% confidence

## Rationale Generation

The system generates human-readable explanations for phase decisions:
- "HRV 38ms vs baseline 55ms → energy foundation focus"
- "Bloating avg 2.5/3 → digestive health priority"
- "Stress 4.2/5 → stress management focus"
- "4 strength sessions → hypertrophy readiness"

## Testing

The system includes comprehensive tests:
- Unit tests for scoring functions
- Integration tests for data flow
- Edge case testing (low data, extreme values)
- Rationale validation

Run tests with:
```bash
npm test src/tests/marchPhase.test.ts
```

## Future Enhancements

### Planned Features
1. **Machine Learning Layer**: Learn client-specific weights
2. **Coach Overrides**: Manual phase setting with reasoning
3. **Predictive Analytics**: Forecast phase transitions
4. **Integration**: Connect with wearables and health apps
5. **Notifications**: Alert on phase changes
6. **Reporting**: Detailed phase transition reports

### Configuration Management
- Web-based threshold adjustment
- Client-specific baselines
- A/B testing for scoring algorithms
- Phase transition analytics

## Troubleshooting

### Common Issues

1. **No Phase Data**: Ensure client has sufficient data points
2. **Low Confidence**: Check data quality and completeness
3. **Unexpected Phase**: Review rationale and thresholds
4. **API Errors**: Verify client ID and data format

### Debug Mode

Enable debug logging by setting:
```typescript
const phaseEngine = new MarchPhaseEngine(config, { debug: true });
```

## Support

For technical support or feature requests:
1. Check the test cases for expected behavior
2. Review the rationale for phase decisions
3. Verify data quality and completeness
4. Adjust thresholds in configuration if needed

---

**Version**: 2.0.0  
**Last Updated**: January 2024  
**Maintainer**: ECA Health Development Team


