'use client';

import React, { useState, useEffect } from 'react';
import { Activity, TrendingUp, Scale, Zap, Moon, Smile, Plus, X } from 'lucide-react';

interface HealthMetric {
  id: number;
  user_id: number;
  metric_type: string;
  value: number;
  unit: string;
  recorded_at: string;
  notes?: string;
}

export default function HealthMetricsPage() {
  const [metrics, setMetrics] = useState<HealthMetric[]>([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [saving, setSaving] = useState(false);
  
  // Form state
  const [formData, setFormData] = useState({
    userId: 1, // TODO: Get from auth context
    metricType: 'weight',
    value: '',
    unit: 'lbs',
    notes: ''
  });

  // Metric types configuration
  const metricTypes = [
    { value: 'weight', label: 'Weight', icon: Scale, unit: 'lbs', color: 'blue' },
    { value: 'energy', label: 'Energy Level', icon: Zap, unit: '1-10', color: 'yellow' },
    { value: 'sleep', label: 'Sleep Quality', icon: Moon, unit: '1-10', color: 'indigo' },
    { value: 'mood', label: 'Mood', icon: Smile, unit: '1-10', color: 'green' },
    { value: 'body_fat', label: 'Body Fat %', icon: Activity, unit: '%', color: 'purple' },
  ];

  useEffect(() => {
    loadMetrics();
  }, []);

  const loadMetrics = async () => {
    try {
      setLoading(true);
      const response = await fetch('/api/health-metrics?userId=1'); // TODO: Dynamic user
      if (response.ok) {
        const data = await response.json();
        setMetrics(data.metrics || []);
      }
    } catch (error) {
      console.error('Error loading metrics:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.value) {
      alert('Please enter a value');
      return;
    }

    setSaving(true);
    try {
      const response = await fetch('/api/health-metrics', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          userId: formData.userId,
          metricType: formData.metricType,
          value: parseFloat(formData.value),
          unit: formData.unit,
          notes: formData.notes
        })
      });

      if (response.ok) {
        const data = await response.json();
        setMetrics([data.metric, ...metrics]);
        setFormData({
          userId: 1,
          metricType: 'weight',
          value: '',
          unit: 'lbs',
          notes: ''
        });
        setShowForm(false);
        alert('Metric saved successfully!');
      } else {
        const error = await response.json();
        alert(`Error: ${error.error}`);
      }
    } catch (error) {
      console.error('Error saving metric:', error);
      alert('Failed to save metric');
    } finally {
      setSaving(false);
    }
  };

  const getMetricConfig = (type: string) => {
    return metricTypes.find(m => m.value === type) || metricTypes[0];
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="bg-white shadow-sm border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div>
              <h1 className="text-2xl font-bold text-gray-900">Health Metrics</h1>
              <p className="text-sm text-gray-600">Track and monitor health data over time</p>
            </div>
            <button
              onClick={() => setShowForm(!showForm)}
              className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors flex items-center gap-2"
            >
              {showForm ? <X className="h-4 w-4" /> : <Plus className="h-4 w-4" />}
              {showForm ? 'Cancel' : 'Add Metric'}
            </button>
          </div>
        </div>
      </div>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Add Metric Form */}
        {showForm && (
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 mb-6">
            <h2 className="text-lg font-semibold text-gray-900 mb-4">Add Health Metric</h2>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Metric Type
                  </label>
                  <select
                    value={formData.metricType}
                    onChange={(e) => {
                      const type = e.target.value;
                      const config = getMetricConfig(type);
                      setFormData({ ...formData, metricType: type, unit: config.unit });
                    }}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent"
                  >
                    {metricTypes.map(type => (
                      <option key={type.value} value={type.value}>
                        {type.label}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Value
                  </label>
                  <input
                    type="number"
                    step="0.1"
                    value={formData.value}
                    onChange={(e) => setFormData({ ...formData, value: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent"
                    placeholder="Enter value"
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Unit
                  </label>
                  <input
                    type="text"
                    value={formData.unit}
                    onChange={(e) => setFormData({ ...formData, unit: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent"
                    placeholder="Unit"
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Notes (Optional)
                </label>
                <textarea
                  value={formData.notes}
                  onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent"
                  rows={3}
                  placeholder="Add any notes about this metric..."
                />
              </div>

              <div className="flex justify-end gap-3">
                <button
                  type="button"
                  onClick={() => setShowForm(false)}
                  className="px-4 py-2 text-gray-700 bg-gray-100 rounded-lg hover:bg-gray-200 transition-colors"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={saving}
                  className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors disabled:opacity-50"
                >
                  {saving ? 'Saving...' : 'Save Metric'}
                </button>
              </div>
            </form>
          </div>
        )}

        {/* Metrics Display */}
        {loading ? (
          <div className="text-center py-12">
            <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-red-600"></div>
            <p className="mt-2 text-gray-600">Loading metrics...</p>
          </div>
        ) : metrics.length === 0 ? (
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-12 text-center">
            <Activity className="h-16 w-16 text-gray-400 mx-auto mb-4" />
            <h3 className="text-xl font-semibold text-gray-900 mb-2">No Metrics Yet</h3>
            <p className="text-gray-600 mb-4">Start tracking your health metrics by adding your first entry</p>
            <button
              onClick={() => setShowForm(true)}
              className="px-6 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors"
            >
              Add First Metric
            </button>
          </div>
        ) : (
          <div className="space-y-4">
            {/* Group by metric type */}
            {metricTypes.map(metricConfig => {
              const typeMetrics = metrics.filter(m => m.metric_type === metricConfig.value);
              if (typeMetrics.length === 0) return null;

              const Icon = metricConfig.icon;
              
              return (
                <div key={metricConfig.value} className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
                  <div className="flex items-center gap-3 mb-4">
                    <div className={`p-2 bg-${metricConfig.color}-100 rounded-lg`}>
                      <Icon className={`h-5 w-5 text-${metricConfig.color}-600`} />
                    </div>
                    <h3 className="text-lg font-semibold text-gray-900">{metricConfig.label}</h3>
                    <span className="ml-auto text-sm text-gray-500">{typeMetrics.length} entries</span>
                  </div>

                  <div className="space-y-3">
                    {typeMetrics.slice(0, 5).map(metric => (
                      <div key={metric.id} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                        <div className="flex items-center gap-4">
                          <div>
                            <p className="text-2xl font-bold text-gray-900">
                              {metric.value} <span className="text-sm font-normal text-gray-500">{metric.unit}</span>
                            </p>
                            {metric.notes && (
                              <p className="text-sm text-gray-600 mt-1">{metric.notes}</p>
                            )}
                          </div>
                        </div>
                        <div className="text-right">
                          <p className="text-sm text-gray-500">
                            {new Date(metric.recorded_at).toLocaleDateString()}
                          </p>
                          <p className="text-xs text-gray-400">
                            {new Date(metric.recorded_at).toLocaleTimeString()}
                          </p>
                        </div>
                      </div>
                    ))}
                  </div>
                  
                  {typeMetrics.length > 5 && (
                    <button className="mt-3 text-sm text-red-600 hover:text-red-700 font-medium">
                      View all {typeMetrics.length} entries →
                    </button>
                  )}
                </div>
              );
            })}
          </div>
        )}
      </main>
    </div>
  );
}
