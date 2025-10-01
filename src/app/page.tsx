'use client';

import React from 'react';
import { 
  Activity, 
  Users, 
  Calendar, 
  Target,
  Award,
  Bell,
  Heart,
  TrendingUp,
} from 'lucide-react';

export default function Dashboard() {
  const stats = [
    {
      title: 'Active Clients',
      value: 0,
      icon: Users,
      color: 'text-blue-600',
      bgColor: 'bg-blue-100'
    },
    {
      title: 'Total Sessions',
      value: 0,
      icon: Calendar,
      color: 'text-green-600',
      bgColor: 'bg-green-100'
    },
    {
      title: 'Health Metrics',
      value: 0,
      icon: Heart,
      color: 'text-purple-600',
      bgColor: 'bg-purple-100'
    },
    {
      title: 'Active Goals',
      value: 0,
      icon: Target,
      color: 'text-orange-600',
      bgColor: 'bg-orange-100'
    }
  ];

  const recentActivities = [
    {
      id: '1',
      type: 'session',
      message: 'No recent activity',
      time: '',
      icon: Activity,
      color: 'text-gray-400'
    }
  ];

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow-sm border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center">
              <div className="flex-shrink-0">
                <h1 className="text-2xl font-bold text-gray-900">
                  EFH Health Hub
                </h1>
              </div>
            </div>
            <div className="flex items-center space-x-4">
              <button className="p-2 text-gray-400 hover:text-gray-600 rounded-lg hover:bg-gray-100">
                <Bell className="h-6 w-6" />
              </button>
              <div className="flex items-center space-x-3">
                <div className="h-8 w-8 bg-blue-600 rounded-full flex items-center justify-center">
                  <span className="text-white text-sm font-medium">
                    CH
                  </span>
                </div>
                <span className="text-sm font-medium text-gray-700">
                  Coach
                </span>
              </div>
            </div>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Welcome Section */}
        <div className="mb-8">
          <h2 className="text-3xl font-bold text-gray-900 mb-2">
            Welcome back, Coach!
          </h2>
          <p className="text-lg text-gray-600">
            Here&apos;s what&apos;s happening with your clients today.
          </p>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
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

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Recent Activities */}
          <div className="lg:col-span-2">
            <div className="bg-white rounded-lg shadow-sm border border-gray-200">
              <div className="px-6 py-4 border-b border-gray-200">
                <h3 className="text-lg font-semibold text-gray-900">Recent Activities</h3>
              </div>
              <div className="divide-y divide-gray-200">
                {recentActivities.map((activity) => (
                  <div key={activity.id} className="px-6 py-4 flex items-center space-x-4">
                    <div className={`p-2 rounded-lg bg-gray-100`}>
                      <activity.icon className={`h-5 w-5 ${activity.color}`} />
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium text-gray-900">
                        {activity.message}
                      </p>
                      <p className="text-sm text-gray-600">
                        {activity.time}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Quick Actions */}
          <div className="space-y-6">
            <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Quick Actions</h3>
              <div className="space-y-3">
                <button className="w-full flex items-center justify-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors">
                  <Users className="h-5 w-5 mr-2" />
                  Add New Client
                </button>
                <button className="w-full flex items-center justify-center px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors">
                  <Calendar className="h-5 w-5 mr-2" />
                  Schedule Session
                </button>
                <button className="w-full flex items-center justify-center px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors">
                  <Target className="h-5 w-5 mr-2" />
                  Set New Goal
                </button>
              </div>
            </div>
          </div>
        </div>
      </main>

    </div>
  );
}


