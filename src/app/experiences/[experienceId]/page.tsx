'use client';

import { useParams } from 'next/navigation';
import { useEffect, useState } from 'react';
import { Heart, Loader2, CheckCircle, Users, TrendingUp, Calendar } from 'lucide-react';

export default function ExperiencePage() {
  const params = useParams();
  const experienceId = params.experienceId as string;
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Simulate loading user data
    setTimeout(() => setLoading(false), 1000);
  }, []);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 via-white to-purple-50">
        <div className="relative bg-white/80 backdrop-blur-xl rounded-2xl p-8 border border-white/20 shadow-xl text-center">
          <Loader2 className="animate-spin h-12 w-12 text-blue-600 mx-auto mb-4" />
          <p className="text-gray-600 text-lg">Loading EFH Health Hub...</p>
        </div>
      </div>
    );
  }

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
      title: 'Health Score',
      value: '--',
      icon: TrendingUp,
      color: 'text-purple-600',
      bgColor: 'bg-purple-100'
    }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* Header */}
        <div className="relative bg-white/80 backdrop-blur-xl rounded-2xl p-8 border border-white/20 shadow-xl mb-8">
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center space-x-3">
              <div className="h-10 w-10 bg-gradient-to-br from-blue-600 to-purple-600 rounded-xl flex items-center justify-center shadow-lg">
                <Heart className="h-6 w-6 text-white" />
              </div>
              <div>
                <span className="text-xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">EFH Health Hub</span>
                <p className="text-sm text-gray-500">Health Coaching Platform</p>
              </div>
            </div>
          </div>

          <div className="text-center">
            <CheckCircle className="h-16 w-16 text-green-500 mx-auto mb-4" />
            <h1 className="text-3xl font-bold text-gray-900 mb-2">Welcome to EFH Health Hub!</h1>
            <p className="text-gray-600 text-lg mb-6">
              Your comprehensive health coaching platform is ready to help you achieve your wellness goals.
            </p>
            <div className="inline-flex items-center px-4 py-2 bg-green-100 text-green-800 rounded-full text-sm font-medium">
              <div className="w-2 h-2 bg-green-500 rounded-full mr-2"></div>
              Experience ID: {experienceId}
            </div>
          </div>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          {stats.map((stat, index) => (
            <div key={index} className="bg-white/80 backdrop-blur-xl rounded-2xl p-6 border border-white/20 shadow-xl">
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

        {/* Features Section */}
        <div className="bg-white/80 backdrop-blur-xl rounded-2xl p-8 border border-white/20 shadow-xl">
          <h2 className="text-2xl font-bold text-gray-900 mb-6">Your Health Journey Starts Here</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="bg-gradient-to-br from-blue-50 to-blue-100 rounded-xl p-6">
              <h3 className="text-lg font-bold text-blue-900 mb-2">Track Your Progress</h3>
              <p className="text-blue-800 text-sm">
                Monitor your health metrics, sessions, and goals all in one place.
              </p>
            </div>
            <div className="bg-gradient-to-br from-purple-50 to-purple-100 rounded-xl p-6">
              <h3 className="text-lg font-bold text-purple-900 mb-2">Coach Support</h3>
              <p className="text-purple-800 text-sm">
                Get personalized guidance from your dedicated health coach.
              </p>
            </div>
            <div className="bg-gradient-to-br from-green-50 to-green-100 rounded-xl p-6">
              <h3 className="text-lg font-bold text-green-900 mb-2">Custom Plans</h3>
              <p className="text-green-800 text-sm">
                Receive tailored nutrition and workout plans based on your goals.
              </p>
            </div>
            <div className="bg-gradient-to-br from-orange-50 to-orange-100 rounded-xl p-6">
              <h3 className="text-lg font-bold text-orange-900 mb-2">Community</h3>
              <p className="text-orange-800 text-sm">
                Connect with others on similar health journeys.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

