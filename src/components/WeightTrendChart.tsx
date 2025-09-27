'use client';

import React from 'react';
import { TrendingDown, TrendingUp, Minus } from 'lucide-react';
import { BodyMetrics } from '@/types';

interface WeightTrendChartProps {
  bodyMetrics: BodyMetrics[];
  className?: string;
}

export default function WeightTrendChart({ bodyMetrics, className = '' }: WeightTrendChartProps) {
  // Sort metrics by date
  const sortedMetrics = bodyMetrics
    .filter(metric => metric.weightKg !== undefined)
    .sort((a, b) => new Date(a.timestamp).getTime() - new Date(b.timestamp).getTime());

  if (sortedMetrics.length === 0) {
    return (
      <div className={`bg-white rounded-lg shadow-sm border border-gray-200 p-6 ${className}`}>
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Weight Trend</h3>
        <div className="text-center text-gray-500 py-8">
          No weight data available
        </div>
      </div>
    );
  }

  // Calculate weight changes
  const dataPoints = sortedMetrics.map((metric, index) => {
    const previousWeight = index > 0 ? sortedMetrics[index - 1].weightKg : undefined;
    const change = previousWeight ? metric.weightKg! - previousWeight : 0;
    
    return {
      date: new Date(metric.timestamp),
      weight: metric.weightKg!,
      change,
      isIncrease: change > 0,
      isDecrease: change < 0,
      isSame: change === 0
    };
  });

  // Get the latest weight change
  const latestChange = dataPoints[dataPoints.length - 1]?.change || 0;
  const totalChange = dataPoints.length > 1 ? 
    dataPoints[dataPoints.length - 1].weight - dataPoints[0].weight : 0;

  // Calculate trend direction
  const getTrendIcon = (change: number) => {
    if (change > 0) return <TrendingUp className="h-4 w-4 text-red-500" />;
    if (change < 0) return <TrendingDown className="h-4 w-4 text-green-500" />;
    return <Minus className="h-4 w-4 text-gray-400" />;
  };

  const getTrendColor = (change: number) => {
    if (change > 0) return 'text-red-600';
    if (change < 0) return 'text-green-600';
    return 'text-gray-600';
  };

  // Simple line chart using SVG
  const maxWeight = Math.max(...dataPoints.map(d => d.weight));
  const minWeight = Math.min(...dataPoints.map(d => d.weight));
  const weightRange = maxWeight - minWeight;
  const padding = 20;
  const chartWidth = 400;
  const chartHeight = 200;

  const getX = (index: number) => padding + (index * (chartWidth - 2 * padding) / (dataPoints.length - 1));
  const getY = (weight: number) => padding + ((maxWeight - weight) / weightRange) * (chartHeight - 2 * padding);

  const pathData = dataPoints.map((point, index) => {
    const x = getX(index);
    const y = getY(point.weight);
    return `${index === 0 ? 'M' : 'L'} ${x} ${y}`;
  }).join(' ');

  return (
    <div className={`bg-white rounded-lg shadow-sm border border-gray-200 p-6 ${className}`}>
      <div className="flex items-center justify-between mb-6">
        <h3 className="text-lg font-semibold text-gray-900">Weight Trend</h3>
        <div className="flex items-center space-x-4">
          <div className="text-sm text-gray-600">
            Latest: {dataPoints[dataPoints.length - 1]?.weight.toFixed(1)} lbs
          </div>
          <div className={`flex items-center space-x-1 ${getTrendColor(latestChange)}`}>
            {getTrendIcon(latestChange)}
            <span className="text-sm font-medium">
              {Math.abs(latestChange).toFixed(1)} lbs
            </span>
          </div>
        </div>
      </div>

      {/* Chart */}
      <div className="mb-4">
        <svg width="100%" height={chartHeight} viewBox={`0 0 ${chartWidth} ${chartHeight}`}>
          {/* Grid lines */}
          <defs>
            <pattern id="grid" width="40" height="40" patternUnits="userSpaceOnUse">
              <path d="M 40 0 L 0 0 0 40" fill="none" stroke="#f3f4f6" strokeWidth="1"/>
            </pattern>
          </defs>
          <rect width="100%" height="100%" fill="url(#grid)" />
          
          {/* Weight line */}
          <path
            d={pathData}
            fill="none"
            stroke="#3b82f6"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
          
          {/* Data points */}
          {dataPoints.map((point, index) => (
            <circle
              key={index}
              cx={getX(index)}
              cy={getY(point.weight)}
              r="4"
              fill="#3b82f6"
              className="hover:r-6 transition-all"
            />
          ))}
          
          {/* Y-axis labels */}
          <text x="5" y={padding + 5} className="text-xs fill-gray-500">
            {maxWeight.toFixed(0)}
          </text>
          <text x="5" y={chartHeight - padding + 5} className="text-xs fill-gray-500">
            {minWeight.toFixed(0)}
          </text>
        </svg>
      </div>

      {/* Summary Stats */}
      <div className="grid grid-cols-3 gap-4 text-center">
        <div>
          <div className="text-2xl font-bold text-gray-900">
            {dataPoints[0]?.weight.toFixed(1)}
          </div>
          <div className="text-sm text-gray-600">Starting Weight</div>
        </div>
        <div>
          <div className="text-2xl font-bold text-gray-900">
            {dataPoints[dataPoints.length - 1]?.weight.toFixed(1)}
          </div>
          <div className="text-sm text-gray-600">Current Weight</div>
        </div>
        <div>
          <div className={`text-2xl font-bold ${getTrendColor(totalChange)}`}>
            {totalChange > 0 ? '+' : ''}{totalChange.toFixed(1)}
          </div>
          <div className="text-sm text-gray-600">Total Change</div>
        </div>
      </div>

      {/* Recent Changes */}
      <div className="mt-4 pt-4 border-t border-gray-200">
        <h4 className="text-sm font-medium text-gray-900 mb-2">Recent Changes</h4>
        <div className="space-y-1">
          {dataPoints.slice(-5).map((point, index) => (
            <div key={index} className="flex items-center justify-between text-sm">
              <span className="text-gray-600">
                {point.date.toLocaleDateString()}
              </span>
              <div className="flex items-center space-x-2">
                <span className="font-medium">{point.weight.toFixed(1)} lbs</span>
                {index > 0 && (
                  <div className={`flex items-center space-x-1 ${getTrendColor(point.change)}`}>
                    {getTrendIcon(point.change)}
                    <span className="text-xs">
                      {Math.abs(point.change).toFixed(1)}
                    </span>
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}


