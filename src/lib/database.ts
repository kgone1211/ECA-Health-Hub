import { 
  User, 
  HealthMetric, 
  CheckInForm, 
  CheckInSubmission, 
  JournalEntry, 
  Points, 
  Achievement, 
  Streak, 
  Leaderboard,
  Challenge,
  BrandingConfig,
  ClientInsight,
  Notification,
  WearableData,
  MacrosTarget,
  MacrosLog,
  WorkoutTemplate,
  WorkoutSession
} from '@/types';
import { 
  BiometricsSample, 
  CheckInSample, 
  TrainingLog, 
  BodyMetrics, 
  WeeklyAggregate, 
  MarchPhaseAssessment,
  MarchPhase 
} from '@/types/march';

// Mock database - in production, this would connect to a real database
class Database {
  private users: User[] = [];
  private healthMetrics: HealthMetric[] = [];
  private checkInForms: CheckInForm[] = [];
  private checkInSubmissions: CheckInSubmission[] = [];
  private journalEntries: JournalEntry[] = [];
  private points: Points[] = [];
  private achievements: Achievement[] = [];
  private streaks: Streak[] = [];
  private leaderboards: Leaderboard[] = [];
  private challenges: Challenge[] = [];
  private brandingConfigs: BrandingConfig[] = [];
  private clientInsights: ClientInsight[] = [];
  private notifications: Notification[] = [];
  private wearableData: WearableData[] = [];
  
  // M.A.R.C.H. Phase Detection tables
  private biometricsSamples: BiometricsSample[] = [];
  private checkInSamples: CheckInSample[] = [];
  private trainingLogs: TrainingLog[] = [];
  private bodyMetrics: BodyMetrics[] = [];
  private weeklyAggregates: WeeklyAggregate[] = [];
  private marchPhaseAssessments: MarchPhaseAssessment[] = [];
  
  // Macros tables
  private macrosTargets: MacrosTarget[] = [];
  private macrosLogs: MacrosLog[] = [];
  
  // Workout tables
  private workoutTemplates: WorkoutTemplate[] = [];
  private workoutSessions: WorkoutSession[] = [];

  // Initialize with sample data
  constructor() {
    this.initializeSampleData();
    this.initializeMarchSampleData();
  }

  private initializeSampleData() {
    // Sample users
    this.users = [
      {
        id: '1',
        email: 'coach@example.com',
        name: 'Dr. Sarah Johnson',
        role: 'coach',
        createdAt: new Date('2024-01-01'),
        isActive: true,
        branding: {
          id: '1',
          userId: '1',
          primaryColor: '#3B82F6',
          secondaryColor: '#8B5CF6',
          companyName: 'Health Hub v2.0',
          customCss: ''
        }
      },
      {
        id: '2',
        email: 'client@example.com',
        name: 'John Smith',
        role: 'client',
        coachId: '1',
        createdAt: new Date('2024-01-15'),
        isActive: true
      },
      {
        id: '3',
        email: 'emma@example.com',
        name: 'Emma Davis',
        role: 'client',
        coachId: '1',
        createdAt: new Date('2024-02-01'),
        isActive: true
      }
    ];

    // Sample health metrics - comprehensive data for both clients
    this.healthMetrics = [
      // John Smith (client ID '2') - Good performer
      {
        id: '1',
        userId: '2',
        date: new Date('2024-01-20'),
        type: 'energy',
        value: 8,
        score: 'green'
      },
      {
        id: '2',
        userId: '2',
        date: new Date('2024-01-20'),
        type: 'sleep',
        value: 7.5,
        score: 'green'
      },
      {
        id: '3',
        userId: '2',
        date: new Date('2024-01-20'),
        type: 'fatigue',
        value: 3,
        score: 'green'
      },
      {
        id: '4',
        userId: '2',
        date: new Date('2024-01-20'),
        type: 'recovery',
        value: 8,
        score: 'green'
      },
      {
        id: '5',
        userId: '2',
        date: new Date('2024-01-20'),
        type: 'water_intake',
        value: 2.5,
        score: 'green'
      },
      {
        id: '6',
        userId: '2',
        date: new Date('2024-01-19'),
        type: 'energy',
        value: 7,
        score: 'yellow'
      },
      {
        id: '7',
        userId: '2',
        date: new Date('2024-01-19'),
        type: 'sleep',
        value: 6.5,
        score: 'yellow'
      },
      {
        id: '8',
        userId: '2',
        date: new Date('2024-01-19'),
        type: 'fatigue',
        value: 4,
        score: 'yellow'
      },
      {
        id: '9',
        userId: '2',
        date: new Date('2024-01-19'),
        type: 'recovery',
        value: 6,
        score: 'yellow'
      },
      {
        id: '10',
        userId: '2',
        date: new Date('2024-01-19'),
        type: 'water_intake',
        value: 2.0,
        score: 'yellow'
      },
      {
        id: '11',
        userId: '2',
        date: new Date('2024-01-18'),
        type: 'energy',
        value: 9,
        score: 'green'
      },
      {
        id: '12',
        userId: '2',
        date: new Date('2024-01-18'),
        type: 'sleep',
        value: 8,
        score: 'green'
      },
      {
        id: '13',
        userId: '2',
        date: new Date('2024-01-18'),
        type: 'fatigue',
        value: 2,
        score: 'green'
      },
      {
        id: '14',
        userId: '2',
        date: new Date('2024-01-18'),
        type: 'recovery',
        value: 9,
        score: 'green'
      },
      {
        id: '15',
        userId: '2',
        date: new Date('2024-01-18'),
        type: 'water_intake',
        value: 3.0,
        score: 'green'
      },
      {
        id: '16',
        userId: '2',
        date: new Date('2024-01-17'),
        type: 'energy',
        value: 6,
        score: 'yellow'
      },
      {
        id: '17',
        userId: '2',
        date: new Date('2024-01-17'),
        type: 'sleep',
        value: 5.5,
        score: 'red'
      },
      {
        id: '18',
        userId: '2',
        date: new Date('2024-01-17'),
        type: 'fatigue',
        value: 6,
        score: 'red'
      },
      {
        id: '19',
        userId: '2',
        date: new Date('2024-01-17'),
        type: 'recovery',
        value: 4,
        score: 'red'
      },
      {
        id: '20',
        userId: '2',
        date: new Date('2024-01-17'),
        type: 'water_intake',
        value: 1.5,
        score: 'red'
      },
      {
        id: '21',
        userId: '2',
        date: new Date('2024-01-16'),
        type: 'energy',
        value: 8,
        score: 'green'
      },
      {
        id: '22',
        userId: '2',
        date: new Date('2024-01-16'),
        type: 'sleep',
        value: 7.5,
        score: 'green'
      },
      {
        id: '23',
        userId: '2',
        date: new Date('2024-01-16'),
        type: 'fatigue',
        value: 3,
        score: 'green'
      },
      {
        id: '24',
        userId: '2',
        date: new Date('2024-01-16'),
        type: 'recovery',
        value: 8,
        score: 'green'
      },
      {
        id: '25',
        userId: '2',
        date: new Date('2024-01-16'),
        type: 'water_intake',
        value: 2.8,
        score: 'green'
      },
      // Emma Davis (client ID '3') - Struggling client
      {
        id: '26',
        userId: '3',
        date: new Date('2024-01-20'),
        type: 'energy',
        value: 4,
        score: 'red'
      },
      {
        id: '27',
        userId: '3',
        date: new Date('2024-01-20'),
        type: 'sleep',
        value: 4.5,
        score: 'red'
      },
      {
        id: '28',
        userId: '3',
        date: new Date('2024-01-20'),
        type: 'fatigue',
        value: 8,
        score: 'red'
      },
      {
        id: '29',
        userId: '3',
        date: new Date('2024-01-20'),
        type: 'recovery',
        value: 3,
        score: 'red'
      },
      {
        id: '30',
        userId: '3',
        date: new Date('2024-01-20'),
        type: 'water_intake',
        value: 1.2,
        score: 'red'
      },
      {
        id: '31',
        userId: '3',
        date: new Date('2024-01-19'),
        type: 'energy',
        value: 5,
        score: 'red'
      },
      {
        id: '32',
        userId: '3',
        date: new Date('2024-01-19'),
        type: 'sleep',
        value: 5.0,
        score: 'red'
      },
      {
        id: '33',
        userId: '3',
        date: new Date('2024-01-19'),
        type: 'fatigue',
        value: 7,
        score: 'red'
      },
      {
        id: '34',
        userId: '3',
        date: new Date('2024-01-19'),
        type: 'recovery',
        value: 4,
        score: 'red'
      },
      {
        id: '35',
        userId: '3',
        date: new Date('2024-01-19'),
        type: 'water_intake',
        value: 1.0,
        score: 'red'
      },
      {
        id: '36',
        userId: '3',
        date: new Date('2024-01-18'),
        type: 'energy',
        value: 6,
        score: 'yellow'
      },
      {
        id: '37',
        userId: '3',
        date: new Date('2024-01-18'),
        type: 'sleep',
        value: 6.0,
        score: 'yellow'
      },
      {
        id: '38',
        userId: '3',
        date: new Date('2024-01-18'),
        type: 'fatigue',
        value: 6,
        score: 'yellow'
      },
      {
        id: '39',
        userId: '3',
        date: new Date('2024-01-18'),
        type: 'recovery',
        value: 5,
        score: 'yellow'
      },
      {
        id: '40',
        userId: '3',
        date: new Date('2024-01-18'),
        type: 'water_intake',
        value: 1.8,
        score: 'yellow'
      },
      {
        id: '41',
        userId: '3',
        date: new Date('2024-01-17'),
        type: 'energy',
        value: 3,
        score: 'red'
      },
      {
        id: '42',
        userId: '3',
        date: new Date('2024-01-17'),
        type: 'sleep',
        value: 3.5,
        score: 'red'
      },
      {
        id: '43',
        userId: '3',
        date: new Date('2024-01-17'),
        type: 'fatigue',
        value: 9,
        score: 'red'
      },
      {
        id: '44',
        userId: '3',
        date: new Date('2024-01-17'),
        type: 'recovery',
        value: 2,
        score: 'red'
      },
      {
        id: '45',
        userId: '3',
        date: new Date('2024-01-17'),
        type: 'water_intake',
        value: 0.8,
        score: 'red'
      },
      {
        id: '46',
        userId: '3',
        date: new Date('2024-01-16'),
        type: 'energy',
        value: 7,
        score: 'yellow'
      },
      {
        id: '47',
        userId: '3',
        date: new Date('2024-01-16'),
        type: 'sleep',
        value: 6.5,
        score: 'yellow'
      },
      {
        id: '48',
        userId: '3',
        date: new Date('2024-01-16'),
        type: 'fatigue',
        value: 5,
        score: 'yellow'
      },
      {
        id: '49',
        userId: '3',
        date: new Date('2024-01-16'),
        type: 'recovery',
        value: 6,
        score: 'yellow'
      },
      {
        id: '50',
        userId: '3',
        date: new Date('2024-01-16'),
        type: 'water_intake',
        value: 2.2,
        score: 'yellow'
      }
    ];

    // Sample check-in forms
    this.checkInForms = [
      {
        id: '1',
        coachId: '1',
        name: 'Weekly Health Check-in v2.0',
        frequency: 'bi-weekly',
        isActive: true,
        createdAt: new Date('2024-01-01'),
        fields: [
          {
            id: '1',
            type: 'text',
            label: 'How are you feeling today?',
            required: true
          },
          {
            id: '2',
            type: 'number',
            label: 'Energy level (1-10)',
            required: true,
            min: 1,
            max: 10
          }
        ]
      }
    ];

    // Sample points
    this.points = [
      {
        id: '1',
        userId: '1',
        points: 1250,
        source: 'journal_entry',
        description: 'Daily journal entry',
        earnedAt: new Date('2024-01-20')
      }
    ];

    // Sample streaks
    this.streaks = [
      {
        id: '1',
        userId: '1',
        type: 'journal',
        current: 15,
        longest: 30,
        lastActivity: new Date('2024-01-20')
      }
    ];

    // Sample achievements
    this.achievements = [
      {
        id: '1',
        name: 'Consistency King',
        description: 'Complete 7 days of journal entries',
        icon: '👑',
        points: 100,
        requirements: [{ type: 'journal_entry', value: 7 }]
      }
    ];

    // Sample training data - using current month dates
    const now = new Date();
    const currentMonth = now.getMonth();
    const currentYear = now.getFullYear();
    
    const trainingData: TrainingLog[] = [
      {
        clientId: '2',
        timestamp: new Date(currentYear, currentMonth, 15).toISOString(),
        sessionType: 'STRENGTH',
        volumeLoad: 2500,
        rpe: 8,
        durationMin: 45
      },
      {
        clientId: '2',
        timestamp: new Date(currentYear, currentMonth, 17).toISOString(),
        sessionType: 'CARDIO',
        volumeLoad: 0,
        rpe: 6,
        durationMin: 30
      },
      {
        clientId: '2',
        timestamp: new Date(currentYear, currentMonth, 18).toISOString(),
        sessionType: 'STRENGTH',
        volumeLoad: 2800,
        rpe: 7,
        durationMin: 50
      },
      {
        clientId: '2',
        timestamp: new Date(currentYear, currentMonth, 19).toISOString(),
        sessionType: 'CARDIO',
        volumeLoad: 0,
        rpe: 8,
        durationMin: 40
      },
      {
        clientId: '2',
        timestamp: new Date(currentYear, currentMonth, 20).toISOString(),
        sessionType: 'STRENGTH',
        volumeLoad: 3000,
        rpe: 9,
        durationMin: 55
      },
      {
        clientId: '2',
        timestamp: new Date(currentYear, currentMonth, 21).toISOString(),
        sessionType: 'CARDIO',
        volumeLoad: 0,
        rpe: 7,
        durationMin: 35
      },
      {
        clientId: '2',
        timestamp: new Date(currentYear, currentMonth, 23).toISOString(),
        sessionType: 'STRENGTH',
        volumeLoad: 3200,
        rpe: 8,
        durationMin: 60
      }
    ];

    // Sample body metrics - using current month dates (converted to pounds)
    const bodyData: BodyMetrics[] = [
      {
        clientId: '2',
        timestamp: new Date(currentYear, currentMonth, 15).toISOString(),
        weightKg: 165.8, // 75.2 kg = 165.8 lbs
        bodyFatPct: 18.5,
        waistCm: 85
      },
      {
        clientId: '2',
        timestamp: new Date(currentYear, currentMonth, 16).toISOString(),
        weightKg: 165.3, // 75.0 kg = 165.3 lbs
        bodyFatPct: 18.4,
        waistCm: 84.5
      },
      {
        clientId: '2',
        timestamp: new Date(currentYear, currentMonth, 17).toISOString(),
        weightKg: 164.9, // 74.8 kg = 164.9 lbs
        bodyFatPct: 18.3,
        waistCm: 84.2
      },
      {
        clientId: '2',
        timestamp: new Date(currentYear, currentMonth, 18).toISOString(),
        weightKg: 165.1, // 74.9 kg = 165.1 lbs
        bodyFatPct: 18.2,
        waistCm: 84.0
      },
      {
        clientId: '2',
        timestamp: new Date(currentYear, currentMonth, 19).toISOString(),
        weightKg: 164.7, // 74.7 kg = 164.7 lbs
        bodyFatPct: 18.1,
        waistCm: 83.8
      },
      {
        clientId: '2',
        timestamp: new Date(currentYear, currentMonth, 20).toISOString(),
        weightKg: 164.2, // 74.5 kg = 164.2 lbs
        bodyFatPct: 18.0,
        waistCm: 83.5
      },
      {
        clientId: '2',
        timestamp: new Date(currentYear, currentMonth, 21).toISOString(),
        weightKg: 164.5, // 74.6 kg = 164.5 lbs
        bodyFatPct: 17.9,
        waistCm: 83.5
      },
      {
        clientId: '2',
        timestamp: new Date(currentYear, currentMonth, 22).toISOString(),
        weightKg: 164.9, // 74.8 kg = 164.9 lbs
        bodyFatPct: 18.2,
        waistCm: 84
      },
      {
        clientId: '2',
        timestamp: new Date(currentYear, currentMonth, 23).toISOString(),
        weightKg: 164.0, // 74.4 kg = 164.0 lbs
        bodyFatPct: 17.8,
        waistCm: 83.2
      }
    ];

    // Add sample data
    trainingData.forEach(data => this.trainingLogs.push(data));
    bodyData.forEach(data => this.bodyMetrics.push(data));

    // Sample journal entries - using current month dates
    this.journalEntries = [
      {
        id: '1',
        userId: '2',
        date: new Date(currentYear, currentMonth, 20),
        gratitude: 'Grateful for the beautiful weather and my morning workout',
        priorities: ['Complete project proposal', 'Call mom', 'Prep healthy meals'],
        habits: [
          { id: '1', name: 'Morning meditation', completed: true, notes: '10 minutes' },
          { id: '2', name: 'Drink 8 glasses of water', completed: true },
          { id: '3', name: 'No phone before bed', completed: false }
        ],
        mood: 8,
        energy: 7,
        sleep: 6,
        notes: 'Feeling motivated today. Had a great workout session.'
      },
      {
        id: '2',
        userId: '2',
        date: new Date(currentYear, currentMonth, 19),
        gratitude: 'Thankful for my supportive coach and progress made',
        priorities: ['Grocery shopping', 'Review training plan', 'Read for 30 min'],
        habits: [
          { id: '1', name: 'Morning meditation', completed: true, notes: '15 minutes' },
          { id: '2', name: 'Drink 8 glasses of water', completed: true },
          { id: '3', name: 'No phone before bed', completed: true }
        ],
        mood: 9,
        energy: 8,
        sleep: 7,
        notes: 'Great day! Hit all my goals and felt strong in the gym.'
      },
      {
        id: '3',
        userId: '2',
        date: new Date(currentYear, currentMonth, 18),
        gratitude: 'Grateful for rest days and recovery time',
        priorities: ['Laundry', 'Meal prep', 'Relax'],
        habits: [
          { id: '1', name: 'Morning meditation', completed: false },
          { id: '2', name: 'Drink 8 glasses of water', completed: true },
          { id: '3', name: 'No phone before bed', completed: true }
        ],
        mood: 6,
        energy: 5,
        sleep: 8,
        notes: 'Rest day. Body needed the break after intense week.'
      },
      {
        id: '4',
        userId: '2',
        date: new Date(currentYear, currentMonth, 17),
        gratitude: 'Grateful for the progress I\'m making and my coach\'s support',
        priorities: ['Workout session', 'Meal prep', 'Read for 30 min'],
        habits: [
          { id: '1', name: 'Morning meditation', completed: true, notes: '20 minutes' },
          { id: '2', name: 'Drink 8 glasses of water', completed: true },
          { id: '3', name: 'No phone before bed', completed: true }
        ],
        mood: 7,
        energy: 6,
        sleep: 7,
        notes: 'Good workout today. Feeling stronger each week.'
      },
      {
        id: '5',
        userId: '2',
        date: new Date(currentYear, currentMonth, 16),
        gratitude: 'Thankful for my health and ability to exercise',
        priorities: ['Cardio session', 'Grocery shopping', 'Call family'],
        habits: [
          { id: '1', name: 'Morning meditation', completed: false },
          { id: '2', name: 'Drink 8 glasses of water', completed: true },
          { id: '3', name: 'No phone before bed', completed: false }
        ],
        mood: 6,
        energy: 5,
        sleep: 6,
        notes: 'Tough day but pushed through the workout.'
      },
      {
        id: '6',
        userId: '2',
        date: new Date(currentYear, currentMonth, 15),
        gratitude: 'Grateful for the new week and fresh start',
        priorities: ['Plan week ahead', 'Strength training', 'Update coach'],
        habits: [
          { id: '1', name: 'Morning meditation', completed: true, notes: '15 minutes' },
          { id: '2', name: 'Drink 8 glasses of water', completed: true },
          { id: '3', name: 'No phone before bed', completed: true }
        ],
        mood: 8,
        energy: 7,
        sleep: 7,
        notes: 'Great start to the week. Feeling motivated and ready to crush my goals.'
      }
    ];

    // Sample check-in submissions
    this.checkInSubmissions = [
      {
        id: '1',
        userId: '2',
        formId: '1',
        responses: [
          { fieldId: '1', value: 'Feeling great and motivated!' },
          { fieldId: '2', value: 8 }
        ],
        photos: [],
        measurements: [
          { id: '1', type: 'weight', value: 165.8, unit: 'lbs', date: new Date('2024-01-20') }
        ],
        submittedAt: new Date('2024-01-20')
      },
      {
        id: '2',
        userId: '2',
        formId: '1',
        responses: [
          { fieldId: '1', value: 'Had some challenges but pushed through' },
          { fieldId: '2', value: 6 }
        ],
        photos: [],
        measurements: [
          { id: '2', type: 'weight', value: 165.3, unit: 'lbs', date: new Date('2024-01-13') }
        ],
        submittedAt: new Date('2024-01-13')
      }
    ];

    // Sample macros targets
    this.macrosTargets = [
      {
        id: '1',
        clientId: '2',
        coachId: '1',
        protein: 150,
        carbs: 200,
        fats: 70,
        calories: 2000,
        isActive: true,
        createdAt: new Date('2024-01-01'),
        updatedAt: new Date('2024-01-15'),
        notes: 'Weight loss phase - moderate deficit'
      },
      {
        id: '2',
        clientId: '3',
        coachId: '1',
        protein: 120,
        carbs: 150,
        fats: 60,
        calories: 1600,
        isActive: true,
        createdAt: new Date('2024-01-01'),
        updatedAt: new Date('2024-01-10'),
        notes: 'Aggressive deficit for faster results'
      }
    ];

    // Sample macros logs
    this.macrosLogs = [
      {
        id: '1',
        clientId: '2',
        date: new Date(currentYear, currentMonth, 20),
        protein: 145,
        carbs: 195,
        fats: 68,
        calories: 1980,
        notes: 'Hit all targets today!'
      },
      {
        id: '2',
        clientId: '2',
        date: new Date(currentYear, currentMonth, 19),
        protein: 140,
        carbs: 210,
        fats: 72,
        calories: 2020,
        notes: 'Slightly over on carbs but good day overall'
      },
      {
        id: '3',
        clientId: '2',
        date: new Date(currentYear, currentMonth, 18),
        protein: 155,
        carbs: 185,
        fats: 65,
        calories: 1950,
        notes: 'Perfect macros day'
      },
      {
        id: '4',
        clientId: '3',
        date: new Date(currentYear, currentMonth, 20),
        protein: 110,
        carbs: 140,
        fats: 55,
        calories: 1520,
        notes: 'Struggled with protein today'
      },
      {
        id: '5',
        clientId: '3',
        date: new Date(currentYear, currentMonth, 19),
        protein: 125,
        carbs: 160,
        fats: 62,
        calories: 1640,
        notes: 'Good progress on hitting targets'
      }
    ];

    // Sample workout templates
    this.workoutTemplates = [
      {
        id: '1',
        coachId: '1',
        clientId: '2',
        name: 'Upper Body Strength',
        description: 'Focus on chest, shoulders, and arms with progressive overload',
        category: 'strength',
        difficulty: 'intermediate',
        estimatedDuration: 60,
        exercises: [
          {
            id: '1',
            name: 'Bench Press',
            description: 'Flat bench press for chest development',
            category: 'strength',
            muscleGroups: ['chest', 'shoulders', 'triceps'],
            equipment: ['barbell', 'bench'],
            sets: 4,
            reps: 8,
            weight: 135,
            restTime: 120,
            notes: 'Focus on controlled movement',
            order: 1
          },
          {
            id: '2',
            name: 'Overhead Press',
            description: 'Standing overhead press for shoulder strength',
            category: 'strength',
            muscleGroups: ['shoulders', 'core'],
            equipment: ['barbell'],
            sets: 3,
            reps: 10,
            weight: 95,
            restTime: 90,
            notes: 'Keep core tight',
            order: 2
          },
          {
            id: '3',
            name: 'Pull-ups',
            description: 'Bodyweight pull-ups for back strength',
            category: 'strength',
            muscleGroups: ['lats', 'biceps', 'rhomboids'],
            equipment: ['pull-up bar'],
            sets: 3,
            reps: 8,
            restTime: 90,
            notes: 'Full range of motion',
            order: 3
          },
          {
            id: '4',
            name: 'Dumbbell Rows',
            description: 'Single-arm dumbbell rows',
            category: 'strength',
            muscleGroups: ['lats', 'rhomboids', 'biceps'],
            equipment: ['dumbbells', 'bench'],
            sets: 3,
            reps: 12,
            weight: 50,
            restTime: 60,
            notes: 'Squeeze shoulder blades',
            order: 4
          }
        ],
        isActive: true,
        createdAt: new Date('2024-01-01'),
        updatedAt: new Date('2024-01-15'),
        notes: 'Progressive overload focus - increase weight when 8 reps become easy'
      },
      {
        id: '2',
        coachId: '1',
        clientId: '2',
        name: 'Lower Body Power',
        description: 'Explosive lower body movements for power development',
        category: 'strength',
        difficulty: 'intermediate',
        estimatedDuration: 45,
        exercises: [
          {
            id: '5',
            name: 'Squats',
            description: 'Back squats for leg strength',
            category: 'strength',
            muscleGroups: ['quads', 'glutes', 'hamstrings'],
            equipment: ['barbell', 'squat rack'],
            sets: 4,
            reps: 10,
            weight: 185,
            restTime: 120,
            notes: 'Deep squat, drive through heels',
            order: 1
          },
          {
            id: '6',
            name: 'Deadlifts',
            description: 'Conventional deadlifts',
            category: 'strength',
            muscleGroups: ['hamstrings', 'glutes', 'back'],
            equipment: ['barbell'],
            sets: 3,
            reps: 8,
            weight: 225,
            restTime: 150,
            notes: 'Keep bar close to body',
            order: 2
          },
          {
            id: '7',
            name: 'Jump Squats',
            description: 'Explosive bodyweight squats',
            category: 'plyometric',
            muscleGroups: ['quads', 'glutes', 'calves'],
            equipment: [],
            sets: 3,
            reps: 15,
            duration: 30,
            restTime: 60,
            notes: 'Maximum height on each jump',
            order: 3
          }
        ],
        isActive: true,
        createdAt: new Date('2024-01-01'),
        updatedAt: new Date('2024-01-10'),
        notes: 'Focus on explosive movements and proper form'
      },
      {
        id: '3',
        coachId: '1',
        clientId: '3',
        name: 'Beginner Full Body',
        description: 'Complete full body workout for beginners',
        category: 'strength',
        difficulty: 'beginner',
        estimatedDuration: 40,
        exercises: [
          {
            id: '8',
            name: 'Bodyweight Squats',
            description: 'Basic bodyweight squats',
            category: 'strength',
            muscleGroups: ['quads', 'glutes'],
            equipment: [],
            sets: 3,
            reps: 15,
            restTime: 60,
            notes: 'Focus on form over speed',
            order: 1
          },
          {
            id: '9',
            name: 'Push-ups',
            description: 'Modified or standard push-ups',
            category: 'strength',
            muscleGroups: ['chest', 'shoulders', 'triceps'],
            equipment: [],
            sets: 3,
            reps: 10,
            restTime: 60,
            notes: 'Can do knee push-ups if needed',
            order: 2
          },
          {
            id: '10',
            name: 'Plank',
            description: 'Core strengthening plank hold',
            category: 'strength',
            muscleGroups: ['core', 'shoulders'],
            equipment: [],
            sets: 3,
            duration: 30,
            restTime: 60,
            notes: 'Keep body straight',
            order: 3
          }
        ],
        isActive: true,
        createdAt: new Date('2024-01-01'),
        updatedAt: new Date('2024-01-05'),
        notes: 'Perfect for building foundational strength'
      }
    ];

    // Sample workout sessions
    this.workoutSessions = [
      {
        id: '1',
        clientId: '2',
        templateId: '1',
        templateName: 'Upper Body Strength',
        date: new Date(currentYear, currentMonth, 20),
        startTime: new Date(currentYear, currentMonth, 20, 9, 0),
        endTime: new Date(currentYear, currentMonth, 20, 10, 0),
        duration: 60,
        status: 'completed',
        exercises: [
          {
            id: '1',
            exerciseId: '1',
            exerciseName: 'Bench Press',
            sets: [
              { id: '1', setNumber: 1, reps: 8, weight: 135, completed: true },
              { id: '2', setNumber: 2, reps: 8, weight: 135, completed: true },
              { id: '3', setNumber: 3, reps: 7, weight: 135, completed: true },
              { id: '4', setNumber: 4, reps: 6, weight: 135, completed: true }
            ],
            notes: 'Felt strong today'
          },
          {
            id: '2',
            exerciseId: '2',
            exerciseName: 'Overhead Press',
            sets: [
              { id: '5', setNumber: 1, reps: 10, weight: 95, completed: true },
              { id: '6', setNumber: 2, reps: 10, weight: 95, completed: true },
              { id: '7', setNumber: 3, reps: 9, weight: 95, completed: true }
            ]
          }
        ],
        notes: 'Great workout, felt strong throughout',
        rating: 5,
        difficulty: 'just_right',
        createdAt: new Date(currentYear, currentMonth, 20)
      },
      {
        id: '2',
        clientId: '2',
        templateId: '2',
        templateName: 'Lower Body Power',
        date: new Date(currentYear, currentMonth, 18),
        startTime: new Date(currentYear, currentMonth, 18, 10, 30),
        endTime: new Date(currentYear, currentMonth, 18, 11, 15),
        duration: 45,
        status: 'completed',
        exercises: [
          {
            id: '3',
            exerciseId: '5',
            exerciseName: 'Squats',
            sets: [
              { id: '8', setNumber: 1, reps: 10, weight: 185, completed: true },
              { id: '9', setNumber: 2, reps: 10, weight: 185, completed: true },
              { id: '10', setNumber: 3, reps: 9, weight: 185, completed: true },
              { id: '11', setNumber: 4, reps: 8, weight: 185, completed: true }
            ]
          }
        ],
        notes: 'Legs felt heavy but pushed through',
        rating: 4,
        difficulty: 'just_right',
        createdAt: new Date(currentYear, currentMonth, 18)
      },
      {
        id: '3',
        clientId: '3',
        templateId: '3',
        templateName: 'Beginner Full Body',
        date: new Date(currentYear, currentMonth, 19),
        startTime: new Date(currentYear, currentMonth, 19, 8, 0),
        endTime: new Date(currentYear, currentMonth, 19, 8, 40),
        duration: 40,
        status: 'completed',
        exercises: [
          {
            id: '4',
            exerciseId: '8',
            exerciseName: 'Bodyweight Squats',
            sets: [
              { id: '12', setNumber: 1, reps: 15, completed: true },
              { id: '13', setNumber: 2, reps: 15, completed: true },
              { id: '14', setNumber: 3, reps: 12, completed: true }
            ]
          }
        ],
        notes: 'First workout went well!',
        rating: 5,
        difficulty: 'just_right',
        createdAt: new Date(currentYear, currentMonth, 19)
      }
    ];

    // Sample challenges
    this.challenges = [
      {
        id: '1',
        name: '30-Day Journal Challenge',
        description: 'Complete daily journal entries for 30 consecutive days to build mindfulness and self-reflection habits.',
        type: 'daily',
        requirements: [
          {
            type: 'journal_entries',
            value: 30,
            timeframe: 'daily'
          }
        ],
        rewards: [
          {
            type: 'points',
            value: 500
          },
          {
            type: 'badge',
            value: 'Mindfulness Master'
          }
        ],
        startDate: new Date(currentYear, currentMonth, 1),
        endDate: new Date(currentYear, currentMonth + 1, 1),
        isActive: true,
        participants: ['2', '3']
      },
      {
        id: '2',
        name: 'Weekly Workout Warrior',
        description: 'Complete at least 4 workouts per week for the entire month. Build consistency and strength!',
        type: 'weekly',
        requirements: [
          {
            type: 'habits',
            value: 4,
            timeframe: 'weekly'
          }
        ],
        rewards: [
          {
            type: 'points',
            value: 300
          },
          {
            type: 'badge',
            value: 'Workout Warrior'
          }
        ],
        startDate: new Date(currentYear, currentMonth, 1),
        endDate: new Date(currentYear, currentMonth + 1, 1),
        isActive: true,
        participants: ['2', '3']
      },
      {
        id: '3',
        name: 'Monthly Check-in Champion',
        description: 'Submit all monthly check-in forms on time and maintain perfect attendance.',
        type: 'monthly',
        requirements: [
          {
            type: 'check_ins',
            value: 1,
            timeframe: 'monthly'
          }
        ],
        rewards: [
          {
            type: 'points',
            value: 200
          },
          {
            type: 'achievement',
            value: 'Perfect Attendance'
          }
        ],
        startDate: new Date(currentYear, currentMonth, 1),
        endDate: new Date(currentYear, currentMonth + 1, 1),
        isActive: true,
        participants: ['2', '3']
      },
      {
        id: '4',
        name: 'Hydration Hero',
        description: 'Drink at least 8 glasses of water daily for 2 weeks straight.',
        type: 'daily',
        requirements: [
          {
            type: 'habits',
            value: 14,
            timeframe: 'daily'
          }
        ],
        rewards: [
          {
            type: 'points',
            value: 150
          },
          {
            type: 'badge',
            value: 'Hydration Hero'
          }
        ],
        startDate: new Date(currentYear, currentMonth, 15),
        endDate: new Date(currentYear, currentMonth, 29),
        isActive: true,
        participants: ['2']
      }
    ];
  }

  // User methods
  getUserById(id: string): User | undefined {
    return this.users.find(user => user.id === id);
  }

  getUsersByCoachId(coachId: string): User[] {
    return this.users.filter(user => user.coachId === coachId);
  }

  // Health metrics methods
  getHealthMetrics(userId: string): HealthMetric[] {
    return this.healthMetrics.filter(metric => metric.userId === userId);
  }

  // Check-in forms methods
  getCheckInForms(coachId: string): CheckInForm[] {
    return this.checkInForms.filter(form => form.coachId === coachId);
  }

  createCheckInForm(form: Omit<CheckInForm, 'id' | 'createdAt'>): CheckInForm {
    const newForm: CheckInForm = {
      ...form,
      id: Date.now().toString(),
      createdAt: new Date()
    };
    this.checkInForms.push(newForm);
    return newForm;
  }

  // Journal methods
  getJournalEntries(userId: string): JournalEntry[] {
    return this.journalEntries.filter(entry => entry.userId === userId);
  }

  // Check-in submission methods
  getCheckInSubmissions(userId: string): CheckInSubmission[] {
    return this.checkInSubmissions.filter(submission => submission.userId === userId);
  }

  // Points methods
  getUserPoints(userId: string): number {
    return this.points
      .filter(point => point.userId === userId)
      .reduce((total, point) => total + point.points, 0);
  }

  // Streaks methods
  getUserStreaks(userId: string): Streak[] {
    return this.streaks.filter(streak => streak.userId === userId);
  }

  // Achievements methods
  getAchievements(): Achievement[] {
    return this.achievements;
  }

  // Notifications methods
  getNotifications(userId: string): Notification[] {
    return this.notifications
      .filter(notification => notification.userId === userId)
      .sort((a, b) => b.createdAt.getTime() - a.createdAt.getTime());
  }

  createNotification(notification: Omit<Notification, 'id' | 'createdAt'>): Notification {
    const newNotification: Notification = {
      ...notification,
      id: Date.now().toString(),
      createdAt: new Date()
    };
    this.notifications.push(newNotification);
    return newNotification;
  }

  // M.A.R.C.H. Phase Detection methods
  
  // Biometrics samples
  addBiometricsSample(sample: BiometricsSample): void {
    this.biometricsSamples.push(sample);
  }

  getBiometricsSamples(clientId: string, startDate?: Date, endDate?: Date): BiometricsSample[] {
    let samples = this.biometricsSamples.filter(s => s.clientId === clientId);
    
    if (startDate && endDate) {
      samples = samples.filter(s => {
        const sampleDate = new Date(s.timestamp);
        return sampleDate >= startDate && sampleDate <= endDate;
      });
    }
    
    return samples.sort((a, b) => new Date(a.timestamp).getTime() - new Date(b.timestamp).getTime());
  }

  // Check-in samples
  addCheckInSample(sample: CheckInSample): void {
    this.checkInSamples.push(sample);
  }

  getCheckInSamples(clientId: string, startDate?: Date, endDate?: Date): CheckInSample[] {
    let samples = this.checkInSamples.filter(s => s.clientId === clientId);
    
    if (startDate && endDate) {
      samples = samples.filter(s => {
        const sampleDate = new Date(s.timestamp);
        return sampleDate >= startDate && sampleDate <= endDate;
      });
    }
    
    return samples.sort((a, b) => new Date(a.timestamp).getTime() - new Date(b.timestamp).getTime());
  }

  // Training logs
  addTrainingLog(log: TrainingLog): void {
    this.trainingLogs.push(log);
  }

  getTrainingLogs(clientId: string, startDate?: Date, endDate?: Date): TrainingLog[] {
    let logs = this.trainingLogs.filter(t => t.clientId === clientId);
    
    if (startDate && endDate) {
      logs = logs.filter(t => {
        const logDate = new Date(t.timestamp);
        return logDate >= startDate && logDate <= endDate;
      });
    }
    
    return logs.sort((a, b) => new Date(a.timestamp).getTime() - new Date(b.timestamp).getTime());
  }

  // Body metrics
  addBodyMetrics(metrics: BodyMetrics): void {
    this.bodyMetrics.push(metrics);
  }

  getBodyMetrics(clientId: string, startDate?: Date, endDate?: Date): BodyMetrics[] {
    let metrics = this.bodyMetrics.filter(m => m.clientId === clientId);
    
    if (startDate && endDate) {
      metrics = metrics.filter(m => {
        const metricDate = new Date(m.timestamp);
        return metricDate >= startDate && metricDate <= endDate;
      });
    }
    
    return metrics.sort((a, b) => new Date(a.timestamp).getTime() - new Date(b.timestamp).getTime());
  }

  // Weekly aggregates
  addWeeklyAggregate(aggregate: WeeklyAggregate): void {
    this.weeklyAggregates.push(aggregate);
  }

  getWeeklyAggregates(clientId: string, limit?: number): WeeklyAggregate[] {
    let aggregates = this.weeklyAggregates.filter(a => a.clientId === clientId);
    aggregates = aggregates.sort((a, b) => new Date(b.weekStartISO).getTime() - new Date(a.weekStartISO).getTime());
    
    if (limit) {
      aggregates = aggregates.slice(0, limit);
    }
    
    return aggregates;
  }

  // M.A.R.C.H. phase assessments
  addMarchPhaseAssessment(assessment: MarchPhaseAssessment): void {
    this.marchPhaseAssessments.push(assessment);
  }

  getMarchPhaseAssessments(clientId: string, limit?: number): MarchPhaseAssessment[] {
    let assessments = this.marchPhaseAssessments.filter(a => a.clientId === clientId);
    assessments = assessments.sort((a, b) => new Date(b.weekStartISO).getTime() - new Date(a.weekStartISO).getTime());
    
    if (limit) {
      assessments = assessments.slice(0, limit);
    }
    
    return assessments;
  }

  getCurrentMarchPhase(clientId: string): MarchPhaseAssessment | undefined {
    const assessments = this.getMarchPhaseAssessments(clientId, 1);
    return assessments[0];
  }

  // Initialize sample M.A.R.C.H. data
  private initializeMarchSampleData() {
    const clientId = '2'; // John Smith
    
    // Sample biometrics data
    const biometricsData: BiometricsSample[] = [
      {
        clientId,
        timestamp: new Date('2024-01-15').toISOString(),
        hrv: 38,
        rhr: 76,
        sleepHours: 6.2,
        sleepEfficiency: 0.82,
        steps: 4500
      },
      {
        clientId,
        timestamp: new Date('2024-01-16').toISOString(),
        hrv: 42,
        rhr: 74,
        sleepHours: 5.8,
        sleepEfficiency: 0.79,
        steps: 5200
      },
      {
        clientId,
        timestamp: new Date('2024-01-17').toISOString(),
        hrv: 35,
        rhr: 78,
        sleepHours: 6.5,
        sleepEfficiency: 0.85,
        steps: 4800
      }
    ];

    // Sample check-in data
    const checkInData: CheckInSample[] = [
      {
        clientId,
        timestamp: new Date('2024-01-15').toISOString(),
        energyScore: 2,
        stressScore: 4,
        sorenessScore: 3,
        digestion: {
          bloating: 2.2,
          stoolForm: 2.5,
          bowelFreqPerDay: 0.8,
          nausea: true,
          foodReactivityCount: 1.2
        }
      },
      {
        clientId,
        timestamp: new Date('2024-01-16').toISOString(),
        energyScore: 1,
        stressScore: 4.5,
        sorenessScore: 4,
        digestion: {
          bloating: 2.5,
          stoolForm: 2,
          bowelFreqPerDay: 0.5,
          nausea: true,
          foodReactivityCount: 1.8
        }
      }
    ];

    // Add sample data
    biometricsData.forEach(data => this.biometricsSamples.push(data));
    checkInData.forEach(data => this.checkInSamples.push(data));
  }

  // Macros methods
  getMacrosTargetsByCoach(coachId: string): MacrosTarget[] {
    return this.macrosTargets.filter(target => target.coachId === coachId);
  }

  getMacrosTargetByClient(clientId: string): MacrosTarget | undefined {
    return this.macrosTargets.find(target => target.clientId === clientId && target.isActive);
  }

  createMacrosTarget(target: Omit<MacrosTarget, 'id' | 'createdAt' | 'updatedAt'>): MacrosTarget {
    const newTarget: MacrosTarget = {
      ...target,
      id: Date.now().toString(),
      createdAt: new Date(),
      updatedAt: new Date()
    };
    this.macrosTargets.push(newTarget);
    return newTarget;
  }

  updateMacrosTarget(id: string, updates: Partial<Omit<MacrosTarget, 'id' | 'createdAt' | 'clientId' | 'coachId'>>): MacrosTarget | undefined {
    const target = this.macrosTargets.find(t => t.id === id);
    if (target) {
      Object.assign(target, updates, { updatedAt: new Date() });
    }
    return target;
  }

  getMacrosLogsByClient(clientId: string, startDate?: Date, endDate?: Date): MacrosLog[] {
    let logs = this.macrosLogs.filter(log => log.clientId === clientId);
    
    if (startDate && endDate) {
      logs = logs.filter(log => {
        const logDate = new Date(log.date);
        return logDate >= startDate && logDate <= endDate;
      });
    }
    
    return logs.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
  }

  createMacrosLog(log: Omit<MacrosLog, 'id'>): MacrosLog {
    const newLog: MacrosLog = {
      ...log,
      id: Date.now().toString()
    };
    this.macrosLogs.push(newLog);
    return newLog;
  }

  // Workout methods
  getWorkoutTemplatesByCoach(coachId: string): WorkoutTemplate[] {
    return this.workoutTemplates.filter(template => template.coachId === coachId);
  }

  getWorkoutTemplatesByClient(clientId: string): WorkoutTemplate[] {
    return this.workoutTemplates.filter(template => template.clientId === clientId && template.isActive);
  }

  getWorkoutTemplateById(id: string): WorkoutTemplate | undefined {
    return this.workoutTemplates.find(template => template.id === id);
  }

  createWorkoutTemplate(template: Omit<WorkoutTemplate, 'id' | 'createdAt' | 'updatedAt'>): WorkoutTemplate {
    const newTemplate: WorkoutTemplate = {
      ...template,
      id: Date.now().toString(),
      createdAt: new Date(),
      updatedAt: new Date()
    };
    this.workoutTemplates.push(newTemplate);
    return newTemplate;
  }

  updateWorkoutTemplate(id: string, updates: Partial<Omit<WorkoutTemplate, 'id' | 'createdAt' | 'coachId' | 'clientId'>>): WorkoutTemplate | undefined {
    const template = this.workoutTemplates.find(t => t.id === id);
    if (template) {
      Object.assign(template, updates, { updatedAt: new Date() });
    }
    return template;
  }

  deleteWorkoutTemplate(id: string): boolean {
    const index = this.workoutTemplates.findIndex(t => t.id === id);
    if (index > -1) {
      this.workoutTemplates.splice(index, 1);
      return true;
    }
    return false;
  }

  getWorkoutSessionsByClient(clientId: string, startDate?: Date, endDate?: Date): WorkoutSession[] {
    let sessions = this.workoutSessions.filter(session => session.clientId === clientId);
    
    if (startDate && endDate) {
      sessions = sessions.filter(session => {
        const sessionDate = new Date(session.date);
        return sessionDate >= startDate && sessionDate <= endDate;
      });
    }
    
    return sessions.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
  }

  getWorkoutSessionById(id: string): WorkoutSession | undefined {
    return this.workoutSessions.find(session => session.id === id);
  }

  createWorkoutSession(session: Omit<WorkoutSession, 'id' | 'createdAt'>): WorkoutSession {
    const newSession: WorkoutSession = {
      ...session,
      id: Date.now().toString(),
      createdAt: new Date()
    };
    this.workoutSessions.push(newSession);
    return newSession;
  }

  updateWorkoutSession(id: string, updates: Partial<Omit<WorkoutSession, 'id' | 'createdAt' | 'clientId' | 'templateId'>>): WorkoutSession | undefined {
    const session = this.workoutSessions.find(s => s.id === id);
    if (session) {
      Object.assign(session, updates);
    }
    return session;
  }

  deleteWorkoutSession(id: string): boolean {
    const index = this.workoutSessions.findIndex(s => s.id === id);
    if (index > -1) {
      this.workoutSessions.splice(index, 1);
      return true;
    }
    return false;
  }

  // Challenge methods
  getAllChallenges(): Challenge[] {
    return this.challenges.filter(challenge => challenge.isActive);
  }

  getChallengesByClient(clientId: string): Challenge[] {
    return this.challenges.filter(challenge => 
      challenge.isActive && challenge.participants.includes(clientId)
    );
  }

  getChallengeById(id: string): Challenge | undefined {
    return this.challenges.find(challenge => challenge.id === id);
  }

  createChallenge(challenge: Omit<Challenge, 'id'>): Challenge {
    const newChallenge: Challenge = {
      ...challenge,
      id: Date.now().toString()
    };
    this.challenges.push(newChallenge);
    return newChallenge;
  }

  updateChallenge(id: string, updates: Partial<Omit<Challenge, 'id'>>): Challenge | undefined {
    const challenge = this.challenges.find(c => c.id === id);
    if (challenge) {
      Object.assign(challenge, updates);
    }
    return challenge;
  }

  deleteChallenge(id: string): boolean {
    const index = this.challenges.findIndex(c => c.id === id);
    if (index > -1) {
      this.challenges.splice(index, 1);
      return true;
    }
    return false;
  }

  addParticipantToChallenge(challengeId: string, clientId: string): boolean {
    const challenge = this.challenges.find(c => c.id === challengeId);
    if (challenge && !challenge.participants.includes(clientId)) {
      challenge.participants.push(clientId);
      return true;
    }
    return false;
  }

  removeParticipantFromChallenge(challengeId: string, clientId: string): boolean {
    const challenge = this.challenges.find(c => c.id === challengeId);
    if (challenge) {
      const index = challenge.participants.indexOf(clientId);
      if (index > -1) {
        challenge.participants.splice(index, 1);
        return true;
      }
    }
    return false;
  }
}

// Export singleton instance
export const db = new Database();
