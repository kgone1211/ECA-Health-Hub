'use client';

import React from 'react';
import { Activity, Heart, TrendingUp, BarChart3, Construction } from 'lucide-react';

export default function HealthMetricsPage() {
  return (
    <div className="min-h-screen bg-gray-50">
      <div className="bg-white shadow-sm border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div>
              <h1 className="text-2xl font-bold text-gray-900">Health Metrics</h1>
              <p className="text-sm text-gray-600">Track client health data and progress</p>
            </div>
          </div>
        </div>
      </div>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-12 text-center">
          <Construction className="h-16 w-16 text-red-600 mx-auto mb-4" />
          <h3 className="text-2xl font-bold text-gray-900 mb-2">Health Metrics - Coming Soon</h3>
          <p className="text-gray-600 max-w-2xl mx-auto">
            Health metrics tracking is being migrated to the new database system. 
            The new system will support weight, energy, sleep, mood, and custom metrics.
          </p>
        </div>
      </main>
    </div>
  );
}
