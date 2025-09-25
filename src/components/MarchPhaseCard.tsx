'use client';

import React, { useState, useEffect } from 'react';
import { 
  Activity, 
  Heart, 
  Shield, 
  RefreshCw, 
  TrendingUp, 
  AlertCircle,
  CheckCircle,
  Clock,
  BarChart3,
  ChevronRight
} from 'lucide-react';
import { useRouter } from 'next/navigation';
import { MarchPhaseAssessment, MarchPhase } from '@/types/march';

interface MarchPhaseCardProps {
  clientId: string;
  clientName?: string;
  className?: string;
}

interface PhaseData {
  assessment: MarchPhaseAssessment;
  guidance: any;
  recommendations: string[];
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


export default function MarchPhaseCard({ clientId, clientName, className = '' }: MarchPhaseCardProps) {
  const router = useRouter();
  const [phaseData, setPhaseData] = useState<PhaseData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetchPhaseData();
  }, [clientId]);

  const fetchPhaseData = async () => {
    try {
      setLoading(true);
      const response = await fetch(`/api/march-phase?clientId=${clientId}`);
      
      if (!response.ok) {
        throw new Error('Failed to fetch phase data');
      }

      const data = await response.json();
      setPhaseData(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Unknown error');
    } finally {
      setLoading(false);
    }
  };

  const computePhase = async () => {
    try {
      setLoading(true);
      const response = await fetch('/api/march-phase', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ clientId }),
      });

      if (!response.ok) {
        throw new Error('Failed to compute phase');
      }

      const data = await response.json();
      setPhaseData(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Unknown error');
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className={`bg-white rounded-lg shadow-sm border border-gray-200 p-6 ${className}`}>
        <div className="animate-pulse">
          <div className="h-4 bg-gray-200 rounded w-1/4 mb-4"></div>
          <div className="h-8 bg-gray-200 rounded w-1/2 mb-4"></div>
          <div className="space-y-2">
            <div className="h-3 bg-gray-200 rounded"></div>
            <div className="h-3 bg-gray-200 rounded w-3/4"></div>
            <div className="h-3 bg-gray-200 rounded w-1/2"></div>
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className={`bg-white rounded-lg shadow-sm border border-gray-200 p-6 ${className}`}>
        <div className="flex items-center space-x-2 text-red-600 mb-4">
          <AlertCircle className="h-5 w-5" />
          <h3 className="text-lg font-semibold">M.A.R.C.H. Phase Error</h3>
        </div>
        <p className="text-gray-600 mb-4">{error}</p>
        <button
          onClick={fetchPhaseData}
          className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
        >
          Retry
        </button>
      </div>
    );
  }

  if (!phaseData) {
    return (
      <div className={`bg-white rounded-lg shadow-sm border border-gray-200 p-6 ${className}`}>
        <h3 className="text-lg font-semibold text-gray-900 mb-4">M.A.R.C.H. Phase</h3>
        <p className="text-gray-600 mb-4">No phase data available</p>
        <button
          onClick={computePhase}
          className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
        >
          Compute Phase
        </button>
      </div>
    );
  }

  const { assessment, guidance, recommendations } = phaseData;
  const PhaseIcon = phaseIcons[assessment.decidedPhase];
  const phaseColor = phaseColors[assessment.decidedPhase];
  const confidencePercentage = Math.round(assessment.confidence * 100);

  return (
    <div className={`bg-white rounded-lg shadow-sm border border-gray-200 p-6 ${className}`}>
      {/* Header */}
      <div className="flex items-center justify-between mb-4">
        <div>
          <h3 className="text-lg font-semibold text-gray-900">M.A.R.C.H. Phase</h3>
          {clientName && (
            <p className="text-sm text-gray-600 mt-1">{clientName}</p>
          )}
        </div>
        <button
          onClick={computePhase}
          disabled={loading}
          className="p-2 text-gray-400 hover:text-blue-600 rounded-lg hover:bg-gray-100 transition-colors"
        >
          <RefreshCw className={`h-4 w-4 ${loading ? 'animate-spin' : ''}`} />
        </button>
      </div>

      {/* Current Phase */}
      <div className="mb-6">
        <div className="flex items-center space-x-3 mb-2">
          <div className={`p-2 rounded-lg ${phaseColor}`}>
            <PhaseIcon className="h-6 w-6" />
          </div>
          <div>
            <h4 className="text-xl font-bold text-gray-900">
              {assessment.decidedPhase.replace('_', ' ')}
            </h4>
            <div className="flex items-center space-x-2">
              <span className="text-sm text-gray-600">Confidence:</span>
              <span className={`text-sm font-medium ${
                confidencePercentage >= 80 ? 'text-green-600' :
                confidencePercentage >= 60 ? 'text-yellow-600' : 'text-red-600'
              }`}>
                {confidencePercentage}%
              </span>
            </div>
          </div>
        </div>

        {/* Data Quality Indicator */}
        <div className="flex items-center space-x-2 mb-4">
          <div className="px-2 py-1 rounded text-xs font-medium bg-green-100 text-green-800">
            HIGH DATA
          </div>
          <div className="flex items-center space-x-1 text-xs text-gray-500">
            <Clock className="h-3 w-3" />
            <span>Last computed: {new Date().toLocaleDateString()}</span>
          </div>
        </div>
      </div>

      {/* Rationale */}
      <div className="mb-6">
        <h5 className="text-sm font-medium text-gray-900 mb-2">Why this phase?</h5>
        <ul className="space-y-1">
          {assessment.rationale.slice(0, 3).map((reason, index) => (
            <li key={index} className="text-sm text-gray-600 flex items-start space-x-2">
              <span className="text-blue-600 mt-1">•</span>
              <span>{reason}</span>
            </li>
          ))}
        </ul>
      </div>

      {/* Phase Focus */}
      {guidance && (
        <div className="mb-6">
          <h5 className="text-sm font-medium text-gray-900 mb-2">This week's focus</h5>
          <p className="text-sm text-gray-600 mb-3">{guidance.focus}</p>
          <div className="space-y-1">
            {guidance.keyActions.slice(0, 2).map((action: string, index: number) => (
              <div key={index} className="text-sm text-gray-600 flex items-start space-x-2">
                <CheckCircle className="h-4 w-4 text-green-600 mt-0.5 flex-shrink-0" />
                <span>{action}</span>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Recommendations */}
      {recommendations.length > 0 && (
        <div className="mb-6">
          <h5 className="text-sm font-medium text-gray-900 mb-2">Recommendations</h5>
          <div className="space-y-1">
            {recommendations.slice(0, 2).map((rec, index) => (
              <div key={index} className="text-sm text-blue-600 flex items-start space-x-2">
                <ChevronRight className="h-4 w-4 mt-0.5 flex-shrink-0" />
                <span>{rec}</span>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Phase Scores */}
      <div className="mb-4">
        <h5 className="text-sm font-medium text-gray-900 mb-2">Phase Scores</h5>
        <div className="space-y-2">
          {Object.entries(assessment.phaseScores).map(([phase, score]) => {
            const isCurrentPhase = phase === assessment.decidedPhase;
            const PhaseIcon = phaseIcons[phase as MarchPhase];
            const phaseColor = phaseColors[phase as MarchPhase];
            
            return (
              <div key={phase} className={`flex items-center justify-between p-2 rounded ${
                isCurrentPhase ? 'bg-blue-50 border border-blue-200' : 'bg-gray-50'
              }`}>
                <div className="flex items-center space-x-2">
                  <PhaseIcon className={`h-4 w-4 ${phaseColor.split(' ')[0]}`} />
                  <span className="text-sm font-medium text-gray-700">
                    {phase.replace('_', ' ')}
                  </span>
                </div>
                <div className="flex items-center space-x-2">
                  <div className="w-16 bg-gray-200 rounded-full h-2">
                    <div 
                      className={`h-2 rounded-full ${
                        isCurrentPhase ? 'bg-blue-600' : 'bg-gray-400'
                      }`}
                      style={{ width: `${score}%` }}
                    ></div>
                  </div>
                  <span className="text-sm font-medium text-gray-600 w-8">
                    {Math.round(score)}
                  </span>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Footer */}
      <div className="flex items-center justify-between pt-4 border-t border-gray-200">
        <div className="flex items-center space-x-2 text-xs text-gray-500">
          <BarChart3 className="h-3 w-3" />
          <span>Week of {new Date(assessment.weekStartISO).toLocaleDateString()}</span>
        </div>
        <button 
          onClick={() => router.push('/march-phase')}
          className="text-xs text-blue-600 hover:text-blue-800 font-medium"
        >
          View History
        </button>
      </div>
    </div>
  );
}
