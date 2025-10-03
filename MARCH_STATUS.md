# M.A.R.C.H. Phase Detection - Status

## ✅ FULLY FUNCTIONAL

The M.A.R.C.H. (Mitochondria, Absorption/Detox, Resilience, Cyclical, Hypertrophy/Healthspan) phase detection system is **fully operational** and was never removed during simplification.

## 📁 Components

### Services (`src/services/`)
- ✅ **marchService.ts** - Main service for phase computation
- ✅ **marchAggregationService.ts** - Aggregates weekly health data

### API Endpoints (`src/app/api/march-phase/`)
- ✅ **GET /api/march-phase?clientId=X** - Get current phase
- ✅ **POST /api/march-phase** - Compute new phase assessment
- ✅ **GET /api/march-phase/history?clientId=X&limit=12** - Get phase history

### UI (`src/app/march-phase/`)
- ✅ **page.tsx** - Full phase history visualization with:
  - Phase history cards
  - Confidence scores
  - Key indicators/rationale
  - Phase score breakdown
  - Summary statistics
  - Client selector

## 🎯 Features

### Phase Detection
- Analyzes weekly health data (biometrics, check-ins, training, body metrics)
- Computes scores for all 5 M.A.R.C.H. phases
- Selects optimal phase with confidence score
- Provides rationale and recommendations

### Phase Types
1. **MITOCHONDRIA** - Energy foundation and recovery
2. **ABSORPTION_DETOX** - Digestive health and nutrient absorption
3. **RESILIENCE** - Stress management and recovery optimization
4. **CYCLICAL** - Hormonal balance and cycle optimization
5. **HYPERTROPHY_HEALTHSPAN** - Strength building and long-term health

### Data Aggregation
- Weekly aggregates of all health metrics
- Baseline stats computation
- Trend analysis
- Historical tracking

## 🔗 Integration Points

The M.A.R.C.H. system integrates with:
- Health metrics tracking
- Check-in forms
- Training/workout logs
- Body metrics (weight, body fat, etc.)
- Coach-client relationships

## 📊 Usage

### For Coaches
1. Select a client from the dropdown
2. View current phase and confidence
3. See historical phase transitions
4. Understand phase-specific recommendations

### For Clients
- Automatically computed weekly based on data input
- Personalized guidance for each phase
- Track progress through different phases

## 🚀 Next Steps (Optional Enhancements)

- [ ] Add phase transition notifications
- [ ] Create phase-specific workout templates
- [ ] Add phase-specific macro recommendations
- [ ] Implement automated phase computation scheduler
- [ ] Add coach override capability for phase selection

## 🔧 Technical Notes

- Uses database aggregation for performance
- Confidence scoring based on data completeness
- Phase engine uses weighted scoring algorithm
- History limited to last 12 assessments by default

