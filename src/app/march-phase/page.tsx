'use client';

import React, { useState, useEffect } from 'react';
import { 
  ArrowLeft, 
  Calendar, 
  TrendingUp, 
  Activity, 
  Heart, 
  Shield, 
  RefreshCw,
  BarChart3,
  Clock,
  AlertCircle
} from 'lucide-react';
import { useRouter } from 'next/navigation';
import { MarchPhaseAssessment, MarchPhase } from '@/types/march';

interface PhaseHistoryData {
  history: (MarchPhaseAssessment & { guidance: any })[];
  count: number;
}

const phaseIcons: Record<MarchPhase, any> = {
  MITOCHONDRIA: Activity,
  ABSORPTION_DETOX: Heart,
  RESILIENCE: Shield,
  CYCLICAL: RefreshCw,
  HYPERTROPHY_HEALTHSPAN: TrendingUp
};

const phaseColors: Record<MarchPhase, string> = {
  MITOCHONDRIA: 'text-orange-600 bg-orange-100',
  ABSORPTION_DETOX: 'text-red-600 bg-red-100',
  RESILIENCE: 'text-blue-600 bg-blue-100',
  CYCLICAL: 'text-purple-600 bg-purple-100',
  HYPERTROPHY_HEALTHSPAN: 'text-green-600 bg-green-100'
};

export default function MarchPhasePage() {
  const router = useRouter();
  const [historyData, setHistoryData] = useState<PhaseHistoryData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [selectedClient, setSelectedClient] = useState('2'); // Default to John Smith

  useEffect(() => {
    fetchHistoryData();
  }, [selectedClient]);

  const fetchHistoryData = async () => {
    try {
      setLoading(true);
      const response = await fetch(`/api/march-phase/history?clientId=${selectedClient}&limit=12`);
      
      if (!response.ok) {
        throw new Error('Failed to fetch phase history');
      }

      const data = await response.json();
      setHistoryData(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Unknown error');
    } finally {
      setLoading(false);
    }
  };

  const formatPhaseName = (phase: MarchPhase): string => {
    return phase.replace('_', ' ').replace(/\b\w/g, l => l.toUpperCase());
  };

  const getPhaseDescription = (phase: MarchPhase): string => {
    const descriptions: Record<MarchPhase, string> = {
      MITOCHONDRIA: 'Energy foundation and recovery focus',
      ABSORPTION_DETOX: 'Digestive health and nutrient absorption',
      RESILIENCE: 'Stress management and recovery optimization',
      CYCLICAL: 'Hormonal balance and cycle optimization',
      HYPERTROPHY_HEALTHSPAN: 'Strength building and long-term health'
    };
    return descriptions[phase];
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 p-6">
        <div className="max-w-6xl mx-auto">
          <div className="animate-pulse">
            <div className="h-8 bg-gray-200 rounded w-1/4 mb-6"></div>
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {[1, 2, 3, 4].map(i => (
                <div key={i} className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
                  <div className="h-4 bg-gray-200 rounded w-1/3 mb-4"></div>
                  <div className="h-6 bg-gray-200 rounded w-1/2 mb-4"></div>
                  <div className="space-y-2">
                    <div className="h-3 bg-gray-200 rounded"></div>
                    <div className="h-3 bg-gray-200 rounded w-3/4"></div>
                    <div className="h-3 bg-gray-200 rounded w-1/2"></div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gray-50 p-6">
        <div className="max-w-6xl mx-auto">
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
            <div className="flex items-center space-x-2 text-red-600 mb-4">
              <AlertCircle className="h-5 w-5" />
              <h1 className="text-xl font-semibold">Error Loading Phase History</h1>
            </div>
            <p className="text-gray-600 mb-4">{error}</p>
            <button
              onClick={fetchHistoryData}
              className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
            >
              Retry
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center space-x-4 mb-4">
            <button 
              onClick={() => router.push('/')}
              className="p-2 text-gray-400 hover:text-gray-600 rounded-lg hover:bg-gray-100 transition-colors"
            >
              <ArrowLeft className="h-5 w-5" />
            </button>
            <div>
              <h1 className="text-3xl font-bold text-gray-900">M.A.R.C.H. Phase History</h1>
              <p className="text-gray-600">Track your health optimization journey through different phases</p>
            </div>
          </div>

          {/* Client Selector */}
          <div className="flex items-center space-x-4">
            <label className="text-sm font-medium text-gray-700">Client:</label>
            <select
              value={selectedClient}
              onChange={(e) => setSelectedClient(e.target.value)}
              className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            >
              <option value="2">John Smith</option>
              <option value="3">Jane Doe</option>
            </select>
          </div>
        </div>

        {/* Phase History Grid */}
        {historyData && historyData.history.length > 0 ? (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {historyData.history.map((assessment, index) => {
              const PhaseIcon = phaseIcons[assessment.decidedPhase];
              const phaseColor = phaseColors[assessment.decidedPhase];
              const confidencePercentage = Math.round(assessment.confidence * 100);
              const isLatest = index === 0;

              return (
                <div 
                  key={assessment.id} 
                  className={`bg-white rounded-lg shadow-sm border p-6 ${
                    isLatest ? 'border-blue-200 bg-blue-50' : 'border-gray-200'
                  }`}
                >
                  {/* Phase Header */}
                  <div className="flex items-center justify-between mb-4">
                    <div className="flex items-center space-x-3">
                      <div className={`p-2 rounded-lg ${phaseColor}`}>
                        <PhaseIcon className="h-6 w-6" />
                      </div>
                      <div>
                        <h3 className="text-lg font-bold text-gray-900">
                          {formatPhaseName(assessment.decidedPhase)}
                        </h3>
                        <p className="text-sm text-gray-600">
                          {getPhaseDescription(assessment.decidedPhase)}
                        </p>
                      </div>
                    </div>
                    {isLatest && (
                      <span className="px-2 py-1 bg-blue-100 text-blue-800 text-xs font-medium rounded">
                        Current
                      </span>
                    )}
                  </div>

                  {/* Week Info */}
                  <div className="flex items-center space-x-4 mb-4 text-sm text-gray-600">
                    <div className="flex items-center space-x-1">
                      <Calendar className="h-4 w-4" />
                      <span>Week of {new Date(assessment.weekStartISO).toLocaleDateString()}</span>
                    </div>
                    <div className="flex items-center space-x-1">
                      <Clock className="h-4 w-4" />
                      <span>Computed {new Date(assessment.createdAt).toLocaleDateString()}</span>
                    </div>
                  </div>

                  {/* Confidence Score */}
                  <div className="mb-4">
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-sm font-medium text-gray-700">Confidence</span>
                      <span className={`text-sm font-bold ${
                        confidencePercentage >= 80 ? 'text-green-600' :
                        confidencePercentage >= 60 ? 'text-yellow-600' : 'text-red-600'
                      }`}>
                        {confidencePercentage}%
                      </span>
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-2">
                      <div 
                        className={`h-2 rounded-full ${
                          confidencePercentage >= 80 ? 'bg-green-600' :
                          confidencePercentage >= 60 ? 'bg-yellow-600' : 'bg-red-600'
                        }`}
                        style={{ width: `${confidencePercentage}%` }}
                      ></div>
                    </div>
                  </div>

                  {/* Rationale */}
                  <div className="mb-4">
                    <h4 className="text-sm font-medium text-gray-900 mb-2">Key Indicators</h4>
                    <ul className="space-y-1">
                      {assessment.rationale.slice(0, 3).map((reason, reasonIndex) => (
                        <li key={reasonIndex} className="text-sm text-gray-600 flex items-start space-x-2">
                          <span className="text-blue-600 mt-1">•</span>
                          <span>{reason}</span>
                        </li>
                      ))}
                    </ul>
                  </div>

                  {/* Phase Scores */}
                  <div>
                    <h4 className="text-sm font-medium text-gray-900 mb-2">Phase Scores</h4>
                    <div className="space-y-1">
                      {Object.entries(assessment.phaseScores)
                        .sort(([,a], [,b]) => b - a)
                        .slice(0, 3)
                        .map(([phase, score]) => {
                          const PhaseIcon = phaseIcons[phase as MarchPhase];
                          const phaseColor = phaseColors[phase as MarchPhase];
                          const isCurrentPhase = phase === assessment.decidedPhase;
                          
                          return (
                            <div key={phase} className="flex items-center justify-between text-xs">
                              <div className="flex items-center space-x-2">
                                <PhaseIcon className={`h-3 w-3 ${phaseColor.split(' ')[0]}`} />
                                <span className={`font-medium ${
                                  isCurrentPhase ? 'text-blue-600' : 'text-gray-600'
                                }`}>
                                  {formatPhaseName(phase as MarchPhase)}
                                </span>
                              </div>
                              <span className={`font-bold ${
                                isCurrentPhase ? 'text-blue-600' : 'text-gray-600'
                              }`}>
                                {Math.round(score)}
                              </span>
                            </div>
                          );
                        })}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        ) : (
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-12 text-center">
            <BarChart3 className="h-12 w-12 text-gray-400 mx-auto mb-4" />
            <h3 className="text-lg font-semibold text-gray-900 mb-2">No Phase History</h3>
            <p className="text-gray-600 mb-6">
              No M.A.R.C.H. phase assessments have been computed yet. 
              Start tracking your health data to see phase transitions.
            </p>
            <button
              onClick={fetchHistoryData}
              className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
            >
              Compute First Phase
            </button>
          </div>
        )}

        {/* Summary Stats */}
        {historyData && historyData.history.length > 0 && (
          <div className="mt-8 bg-white rounded-lg shadow-sm border border-gray-200 p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Phase Summary</h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="text-center">
                <div className="text-2xl font-bold text-blue-600">
                  {historyData.history.length}
                </div>
                <div className="text-sm text-gray-600">Total Assessments</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-green-600">
                  {new Set(historyData.history.map(h => h.decidedPhase)).size}
                </div>
                <div className="text-sm text-gray-600">Different Phases</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-purple-600">
                  {Math.round(
                    historyData.history.reduce((sum, h) => sum + h.confidence, 0) / 
                    historyData.history.length * 100
                  )}%
                </div>
                <div className="text-sm text-gray-600">Avg Confidence</div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
