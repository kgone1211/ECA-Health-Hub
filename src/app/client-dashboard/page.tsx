'use client';

import React, { useState } from 'react';
import { 
  Award, 
  Target,
  TrendingUp,
  Heart,
  Activity,
  BarChart3,
  Users,
  Calendar,
  Construction,
} from 'lucide-react';

export default function ClientDashboard() {
  const [activeTab, setActiveTab] = useState<'overview' | 'health' | 'progress'>('overview');

  // Temporary placeholder data until features are migrated to Supabase
  const stats = [
    {
      title: 'Current Streak',
      value: '0 days',
      icon: Target,
      color: 'text-orange-600',
      bgColor: 'bg-orange-100'
    },
    {
      title: 'Points Earned',
      value: '0',
      icon: Award,
      color: 'text-purple-600',
      bgColor: 'bg-purple-100'
    },
    {
      title: 'Sessions',
      value: '0',
      icon: Calendar,
      color: 'text-green-600',
      bgColor: 'bg-green-100'
    },
    {
      title: 'Health Score',
      value: '--',
      icon: TrendingUp,
      color: 'text-blue-600',
      bgColor: 'bg-blue-100'
    }
  ];

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white shadow-sm border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div>
              <h1 className="text-2xl font-bold text-gray-900">Client Dashboard</h1>
              <p className="text-sm text-gray-600">Your personal health tracking</p>
            </div>
            <div className="flex items-center space-x-4">
              <div className="flex items-center space-x-2 bg-yellow-50 px-3 py-1 rounded-lg">
                <Award className="h-4 w-4 text-yellow-600" />
                <span className="text-sm font-medium text-yellow-800">0 points</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Tab Navigation */}
        <div className="mb-8">
          <div className="border-b border-gray-200">
            <nav className="-mb-px flex space-x-8">
              {[
                { id: 'overview', name: 'Overview', icon: BarChart3 },
                { id: 'health', name: 'Health Metrics', icon: Heart },
                { id: 'progress', name: 'Progress', icon: TrendingUp },
              ].map((tab) => (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id as 'overview' | 'health' | 'progress')}
                  className={`flex items-center py-2 px-1 border-b-2 font-medium text-sm ${
                    activeTab === tab.id
                      ? 'border-blue-500 text-blue-600'
                      : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                  }`}
                >
                  <tab.icon className="h-5 w-5 mr-2" />
                  {tab.name}
                </button>
              ))}
            </nav>
          </div>
        </div>

        {/* Tab Content */}
        {activeTab === 'overview' && (
          <div className="space-y-8">
            {/* Stats Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              {stats.map((stat, index) => (
                <div key={index} className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
                  <div className="flex items-center">
                    <div className={`p-3 rounded-lg ${stat.bgColor}`}>
                      <stat.icon className={`h-6 w-6 ${stat.color}`} />
                    </div>
                    <div className="ml-4">
                      <p className="text-sm font-medium text-gray-600">{stat.title}</p>
                      <p className="text-2xl font-bold text-gray-900">{stat.value}</p>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {/* Under Construction Notice */}
            <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-12 text-center">
              <Construction className="h-16 w-16 text-blue-600 mx-auto mb-4" />
              <h3 className="text-2xl font-bold text-gray-900 mb-2">Client Dashboard - Coming Soon</h3>
              <p className="text-gray-600 max-w-2xl mx-auto">
                The client dashboard is being migrated to the new database system. 
                Features like check-ins, journal entries, habit tracking, and health metrics 
                will be available soon.
              </p>
            </div>
          </div>
        )}

        {activeTab === 'health' && (
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-12 text-center">
            <Heart className="h-16 w-16 text-red-600 mx-auto mb-4" />
            <h3 className="text-2xl font-bold text-gray-900 mb-2">Health Metrics</h3>
            <p className="text-gray-600 max-w-2xl mx-auto">
              Track your weight, body measurements, and other health metrics. Coming soon!
            </p>
          </div>
        )}

        {activeTab === 'progress' && (
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-12 text-center">
            <TrendingUp className="h-16 w-16 text-green-600 mx-auto mb-4" />
            <h3 className="text-2xl font-bold text-gray-900 mb-2">Progress Tracking</h3>
            <p className="text-gray-600 max-w-2xl mx-auto">
              View your progress over time with charts and insights. Coming soon!
            </p>
          </div>
        )}
      </main>
    </div>
  );
}
