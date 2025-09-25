'use client';

import React, { useState, useEffect, useRef } from 'react';
import { 
  Activity, 
  Heart, 
  Moon, 
  Droplets, 
  Weight, 
  Thermometer,
  TrendingUp,
  TrendingDown,
  Minus,
  Plus,
  Calendar,
  Filter,
  Download,
  ChevronDown,
  User
} from 'lucide-react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, BarChart, Bar } from 'recharts';
import { db } from '@/lib/database';
import { HealthMetric } from '@/types';

export default function HealthMetricsPage() {
  const [selectedMetric, setSelectedMetric] = useState<string>('energy');
  const [timeRange, setTimeRange] = useState<'7d' | '30d' | '90d'>('30d');
  const [selectedClientId, setSelectedClientId] = useState<string>('2'); // Default to John Smith
  const [isClientDropdownOpen, setIsClientDropdownOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  // Get all clients for the coach
  const clients = db.getUsersByCoachId('1'); // Coach ID is '1'
  const metrics = db.getHealthMetrics(selectedClientId);
  const filteredMetrics = metrics.filter(metric => metric.type === selectedMetric);
  
  // Get all metrics for the selected client (for overview)
  const allClientMetrics = metrics;

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsClientDropdownOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  const metricTypes = [
    { id: 'energy', name: 'Energy Level', icon: Activity, color: 'text-yellow-600', bgColor: 'bg-yellow-100' },
    { id: 'fatigue', name: 'Fatigue Level', icon: TrendingDown, color: 'text-red-600', bgColor: 'bg-red-100' },
    { id: 'recovery', name: 'Recovery Score', icon: Heart, color: 'text-green-600', bgColor: 'bg-green-100' },
    { id: 'sleep', name: 'Sleep Hours', icon: Moon, color: 'text-blue-600', bgColor: 'bg-blue-100' },
    { id: 'weight', name: 'Weight', icon: Weight, color: 'text-purple-600', bgColor: 'bg-purple-100' },
    { id: 'water_intake', name: 'Water Intake', icon: Droplets, color: 'text-cyan-600', bgColor: 'bg-cyan-100' }
  ];

  const getScoreColor = (score?: string) => {
    switch (score) {
      case 'green': return 'text-green-600 bg-green-100';
      case 'yellow': return 'text-yellow-600 bg-yellow-100';
      case 'red': return 'text-red-600 bg-red-100';
      default: return 'text-gray-600 bg-gray-100';
    }
  };

  const getScoreIcon = (score?: string) => {
    switch (score) {
      case 'green': return <TrendingUp className="h-4 w-4" />;
      case 'yellow': return <Minus className="h-4 w-4" />;
      case 'red': return <TrendingDown className="h-4 w-4" />;
      default: return <Minus className="h-4 w-4" />;
    }
  };

  const exportData = () => {
    const clientName = clients.find(c => c.id === selectedClientId)?.name || 'Unknown Client';
    
    // Prepare CSV data
    const csvHeaders = ['Date', 'Metric Type', 'Value', 'Score', 'Unit'];
    const csvData = allClientMetrics.map(metric => [
      new Date(metric.date).toLocaleDateString(),
      metricTypes.find(m => m.id === metric.type)?.name || metric.type,
      metric.value,
      metric.score || 'N/A',
      metricTypes.find(m => m.id === metric.type)?.id === 'water_intake' ? 'L' : 
      metricTypes.find(m => m.id === metric.type)?.id === 'sleep' ? 'h' : ''
    ]);
    
    const csvContent = [csvHeaders, ...csvData]
      .map(row => row.map(field => `"${field}"`).join(','))
      .join('\n');
    
    // Create and download file
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement('a');
    const url = URL.createObjectURL(blob);
    link.setAttribute('href', url);
    link.setAttribute('download', `${clientName}_health_metrics_${new Date().toISOString().split('T')[0]}.csv`);
    link.style.visibility = 'hidden';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  // Prepare chart data
  const chartData = filteredMetrics.map(metric => ({
    date: new Date(metric.date).toLocaleDateString('en-US', { month: 'short', day: 'numeric' }),
    value: typeof metric.value === 'number' ? metric.value : parseFloat(metric.value as string) || 0,
    score: metric.score
  }));

  const currentMetric = metricTypes.find(m => m.id === selectedMetric);
  const latestMetric = filteredMetrics[0];
  const averageValue = chartData.length > 0 
    ? chartData.reduce((sum, item) => sum + item.value, 0) / chartData.length 
    : 0;

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white shadow-sm border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div>
              <h1 className="text-2xl font-bold text-gray-900">Health Metrics</h1>
              <p className="text-sm text-gray-600">Track and monitor your health progress</p>
            </div>
            <div className="flex items-center space-x-4">
              <button 
                onClick={exportData}
                className="flex items-center px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
              >
                <Download className="h-4 w-4 mr-2" />
                Export Data
              </button>
            </div>
          </div>
        </div>
      </div>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Client Filter */}
        <div className="mb-8">
          <h2 className="text-lg font-semibold text-gray-900 mb-4">Select Client</h2>
          <div className="relative" ref={dropdownRef}>
            <button
              onClick={() => setIsClientDropdownOpen(!isClientDropdownOpen)}
              className="flex items-center justify-between w-full max-w-xs px-4 py-3 text-left bg-white border border-gray-300 rounded-lg shadow-sm hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            >
              <div className="flex items-center space-x-3">
                <User className="h-5 w-5 text-gray-400" />
                <span className="font-medium text-gray-900">
                  {clients.find(c => c.id === selectedClientId)?.name || 'Select Client'}
                </span>
              </div>
              <ChevronDown className={`h-5 w-5 text-gray-400 transition-transform ${
                isClientDropdownOpen ? 'rotate-180' : ''
              }`} />
            </button>
            
            {isClientDropdownOpen && (
              <div className="absolute z-10 w-full max-w-xs mt-1 bg-white border border-gray-300 rounded-lg shadow-lg">
                {clients.map((client) => (
                  <button
                    key={client.id}
                    onClick={() => {
                      setSelectedClientId(client.id);
                      setIsClientDropdownOpen(false);
                    }}
                    className={`w-full px-4 py-3 text-left hover:bg-gray-50 first:rounded-t-lg last:rounded-b-lg ${
                      selectedClientId === client.id ? 'bg-blue-50 text-blue-700' : 'text-gray-900'
                    }`}
                  >
                    <div className="flex items-center space-x-3">
                      <div className={`h-3 w-3 rounded-full ${
                        selectedClientId === client.id ? 'bg-blue-500' : 'bg-gray-300'
                      }`} />
                      <span className="font-medium">{client.name}</span>
                    </div>
                  </button>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Metric Type Selector */}
        <div className="mb-8">
          <h2 className="text-lg font-semibold text-gray-900 mb-4">Select Metric to View</h2>
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
            {metricTypes.map((metric) => (
              <button
                key={metric.id}
                onClick={() => setSelectedMetric(metric.id)}
                className={`p-4 rounded-lg border-2 transition-all ${
                  selectedMetric === metric.id
                    ? 'border-blue-500 bg-blue-50'
                    : 'border-gray-200 bg-white hover:border-gray-300'
                }`}
              >
                <div className={`p-3 rounded-lg ${metric.bgColor} mb-3`}>
                  <metric.icon className={`h-6 w-6 ${metric.color}`} />
                </div>
                <p className="text-sm font-medium text-gray-900">{metric.name}</p>
              </button>
            ))}
          </div>
        </div>

        {/* All Metrics Overview */}
        <div className="mb-8">
          <h2 className="text-lg font-semibold text-gray-900 mb-4">All Health Metrics</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {metricTypes.map((metricType) => {
              const metricData = allClientMetrics.filter(m => m.type === metricType.id);
              const latestMetric = metricData[0]; // Most recent
              const averageValue = metricData.length > 0 
                ? metricData.reduce((sum, m) => sum + (typeof m.value === 'number' ? m.value : parseFloat(m.value as string) || 0), 0) / metricData.length 
                : 0;
              
              return (
                <div key={metricType.id} className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
                  <div className="flex items-center justify-between mb-4">
                    <div className={`p-3 rounded-lg ${metricType.bgColor}`}>
                      <metricType.icon className={`h-6 w-6 ${metricType.color}`} />
                    </div>
                    <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${getScoreColor(latestMetric?.score)}`}>
                      {getScoreIcon(latestMetric?.score)}
                      <span className="ml-1 capitalize">{latestMetric?.score || 'No Data'}</span>
                    </span>
                  </div>
                  
                  <div className="mb-2">
                    <p className="text-sm font-medium text-gray-600">{metricType.name}</p>
                    <p className="text-2xl font-bold text-gray-900">
                      {latestMetric ? `${latestMetric.value}${metricType.id === 'water_intake' ? 'L' : metricType.id === 'sleep' ? 'h' : ''}` : 'No Data'}
                    </p>
                  </div>
                  
                  <div className="flex items-center justify-between text-sm text-gray-600">
                    <span>Avg: {averageValue.toFixed(1)}{metricType.id === 'water_intake' ? 'L' : metricType.id === 'sleep' ? 'h' : ''}</span>
                    <span>{metricData.length} entries</span>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Chart */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 mb-8">
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-lg font-semibold text-gray-900">
              {currentMetric?.name} Trend
            </h3>
            <div className="flex items-center space-x-4">
              <div className="flex items-center space-x-2">
                <label className="text-sm font-medium text-gray-700">Metric:</label>
                <select
                  value={selectedMetric}
                  onChange={(e) => setSelectedMetric(e.target.value)}
                  className="px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                >
                  {metricTypes.map((metric) => (
                    <option key={metric.id} value={metric.id}>
                      {metric.name}
                    </option>
                  ))}
                </select>
              </div>
              <div className="flex items-center space-x-2">
                <label className="text-sm font-medium text-gray-700">Time Range:</label>
                <select
                  value={timeRange}
                  onChange={(e) => setTimeRange(e.target.value as '7d' | '30d' | '90d')}
                  className="px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                >
                  <option value="7d">Last 7 days</option>
                  <option value="30d">Last 30 days</option>
                  <option value="90d">Last 90 days</option>
                </select>
              </div>
            </div>
          </div>
          
          <div className="h-80">
            {chartData.length > 0 ? (
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={chartData}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="date" />
                  <YAxis />
                  <Tooltip 
                      formatter={(value: number) => [value, currentMetric?.name]}
                    labelFormatter={(label) => `Date: ${label}`}
                  />
                  <Line 
                    type="monotone" 
                    dataKey="value" 
                    stroke="#3B82F6" 
                    strokeWidth={2}
                    dot={{ fill: '#3B82F6', strokeWidth: 2, r: 4 }}
                  />
                </LineChart>
              </ResponsiveContainer>
            ) : (
              <div className="flex items-center justify-center h-full">
                <div className="text-center">
                  <div className={`p-4 rounded-full ${currentMetric?.bgColor} mx-auto mb-4 w-16 h-16 flex items-center justify-center`}>
                    {currentMetric?.icon && <currentMetric.icon className={`h-8 w-8 ${currentMetric.color}`} />}
                  </div>
                  <h3 className="text-lg font-medium text-gray-900 mb-2">No Data Available</h3>
                  <p className="text-gray-600">
                    No {currentMetric?.name.toLowerCase()} data found for the selected time range.
                  </p>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Recent Entries */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200">
          <div className="px-6 py-4 border-b border-gray-200">
            <h3 className="text-lg font-semibold text-gray-900">Recent Entries</h3>
          </div>
          <div className="divide-y divide-gray-200">
            {filteredMetrics.slice(0, 10).map((metric) => (
              <div key={metric.id} className="px-6 py-4 flex items-center justify-between">
                <div className="flex items-center space-x-4">
                  <div className={`p-2 rounded-lg ${currentMetric?.bgColor}`}>
                    {currentMetric && <currentMetric.icon className={`h-5 w-5 ${currentMetric.color}`} />}
                  </div>
                  <div>
                    <p className="text-sm font-medium text-gray-900">
                      {new Date(metric.date).toLocaleDateString('en-US', {
                        weekday: 'short',
                        month: 'short',
                        day: 'numeric'
                      })}
                    </p>
                    <p className="text-sm text-gray-600">
                      {metric.value} {metric.unit || ''}
                    </p>
                  </div>
                </div>
                <div className="flex items-center space-x-4">
                  {metric.notes && (
                    <p className="text-sm text-gray-600 max-w-xs truncate">
                      {metric.notes}
                    </p>
                  )}
                  <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${getScoreColor(metric.score)}`}>
                    {getScoreIcon(metric.score)}
                    <span className="ml-1 capitalize">{metric.score || 'No Score'}</span>
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </main>
    </div>
  );
}
