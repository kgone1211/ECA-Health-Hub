'use client';

import { useState, useEffect } from 'react';
import { Loader2, CheckCircle, AlertCircle, Heart, Activity, Target, Users, Award } from 'lucide-react';

interface WhopUser {
  id: string;
  email: string;
  company_id: string;
  subscription_status: 'active' | 'inactive' | 'cancelled';
}

export default function WhopPage() {
  const [whopUser, setWhopUser] = useState<WhopUser | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const initializeWhopUser = async () => {
      try {
        setLoading(true);
        
        const urlParams = new URLSearchParams(window.location.search);
        let whopUserId = urlParams.get('userId') || urlParams.get('whop_user_id') || urlParams.get('user_id');
        
        if (!whopUserId && process.env.NODE_ENV === 'development') {
          whopUserId = 'test_user_123';
          console.log('Development mode: Using test user ID');
        }
        
        if (!whopUserId) {
          setError('No Whop user ID provided');
          setLoading(false);
          return;
        }

        const response = await fetch(`/api/whop/auth?userId=${whopUserId}`);
        const data = await response.json();

        if (response.ok) {
          setWhopUser(data.user);
        } else {
          setError(data.error || 'Authentication failed');
        }
      } catch (err: any) {
        console.error('Whop initialization error:', err);
        setError(err.message || 'Failed to initialize Whop integration');
      } finally {
        setLoading(false);
      }
    };

    initializeWhopUser();
  }, []);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 via-white to-purple-50">
        <div className="relative bg-white/80 backdrop-blur-xl rounded-2xl p-8 border border-white/20 shadow-xl text-center">
          <Loader2 className="animate-spin h-12 w-12 text-blue-600 mx-auto mb-4" />
          <p className="text-gray-600 text-lg">Loading ECA Health Hub...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 via-white to-purple-50">
        <div className="relative bg-white/80 backdrop-blur-xl rounded-2xl p-8 border border-white/20 shadow-xl text-center">
          <AlertCircle className="h-12 w-12 text-red-500 mx-auto mb-4" />
          <h3 className="text-xl font-bold text-gray-900 mb-2">Integration Error</h3>
          <p className="text-gray-600 mb-4">{error}</p>
          <button
            onClick={() => window.location.reload()}
            className="px-6 py-3 bg-gradient-to-r from-blue-500 to-purple-500 text-white rounded-xl hover:from-blue-600 hover:to-purple-600 transition-all duration-300 font-medium shadow-lg hover:shadow-xl"
          >
            Retry
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50">
      {/* Header */}
      <div className="relative bg-white/80 backdrop-blur-xl border-b border-white/20 shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center space-x-3">
              <div className="h-10 w-10 bg-gradient-to-br from-blue-600 to-purple-600 rounded-xl flex items-center justify-center shadow-lg">
                <Heart className="h-6 w-6 text-white" />
              </div>
              <div>
                <span className="text-xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">ECA Health Hub</span>
                <p className="text-sm text-gray-500">Health Coaching Platform</p>
              </div>
            </div>
            {whopUser && (
              <div className="flex items-center space-x-3">
                <div className="w-8 h-8 rounded-full bg-gradient-to-br from-blue-500 to-purple-500 flex items-center justify-center">
                  <span className="text-white text-sm font-medium">
                    {whopUser.email.charAt(0).toUpperCase()}
                  </span>
                </div>
                <span className="text-sm text-gray-600">{whopUser.email}</span>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {whopUser ? (
          <div className="space-y-8">
            {/* Welcome Section */}
            <div className="relative bg-white/80 backdrop-blur-xl rounded-2xl p-8 border border-white/20 shadow-xl">
              <div className="text-center">
                <CheckCircle className="h-16 w-16 text-green-500 mx-auto mb-4" />
                <h1 className="text-3xl font-bold text-gray-900 mb-2">Welcome to ECA Health Hub!</h1>
                <p className="text-gray-600 text-lg mb-6">
                  Your comprehensive health coaching platform is ready to help you achieve your wellness goals.
                </p>
                <div className="inline-flex items-center px-4 py-2 bg-green-100 text-green-800 rounded-full text-sm font-medium">
                  <div className="w-2 h-2 bg-green-500 rounded-full mr-2"></div>
                  Subscription Active
                </div>
              </div>
            </div>

            {/* Features Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              <div className="relative bg-white/80 backdrop-blur-xl rounded-2xl p-6 border border-white/20 shadow-xl hover:shadow-2xl transition-all duration-300">
                <div className="h-12 w-12 bg-gradient-to-br from-blue-500 to-blue-600 rounded-xl flex items-center justify-center mb-4">
                  <Activity className="h-6 w-6 text-white" />
                </div>
                <h3 className="text-lg font-semibold text-gray-900 mb-2">M.A.R.C.H. Tracking</h3>
                <p className="text-gray-600 text-sm">Monitor Movement, Alcohol, Recovery, Chemistry, and Habits</p>
              </div>

              <div className="relative bg-white/80 backdrop-blur-xl rounded-2xl p-6 border border-white/20 shadow-xl hover:shadow-2xl transition-all duration-300">
                <div className="h-12 w-12 bg-gradient-to-br from-purple-500 to-purple-600 rounded-xl flex items-center justify-center mb-4">
                  <Award className="h-6 w-6 text-white" />
                </div>
                <h3 className="text-lg font-semibold text-gray-900 mb-2">Gamification</h3>
                <p className="text-gray-600 text-sm">Earn points, unlock achievements, and stay motivated</p>
              </div>

              <div className="relative bg-white/80 backdrop-blur-xl rounded-2xl p-6 border border-white/20 shadow-xl hover:shadow-2xl transition-all duration-300">
                <div className="h-12 w-12 bg-gradient-to-br from-green-500 to-green-600 rounded-xl flex items-center justify-center mb-4">
                  <Target className="h-6 w-6 text-white" />
                </div>
                <h3 className="text-lg font-semibold text-gray-900 mb-2">Health Metrics</h3>
                <p className="text-gray-600 text-sm">Track your progress with comprehensive analytics</p>
              </div>

              <div className="relative bg-white/80 backdrop-blur-xl rounded-2xl p-6 border border-white/20 shadow-xl hover:shadow-2xl transition-all duration-300">
                <div className="h-12 w-12 bg-gradient-to-br from-orange-500 to-orange-600 rounded-xl flex items-center justify-center mb-4">
                  <Users className="h-6 w-6 text-white" />
                </div>
                <h3 className="text-lg font-semibold text-gray-900 mb-2">Client Management</h3>
                <p className="text-gray-600 text-sm">Manage clients and track their wellness journey</p>
              </div>
            </div>

            {/* Quick Actions */}
            <div className="relative bg-white/80 backdrop-blur-xl rounded-2xl p-8 border border-white/20 shadow-xl">
              <h2 className="text-2xl font-bold text-gray-900 mb-6">Quick Actions</h2>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <button
                  onClick={() => window.location.href = '/march-phase'}
                  className="px-6 py-4 bg-gradient-to-r from-blue-500 to-purple-500 text-white rounded-xl hover:from-blue-600 hover:to-purple-600 transition-all duration-300 font-medium shadow-lg hover:shadow-xl text-center"
                >
                  View M.A.R.C.H. Phase
                </button>
                <button
                  onClick={() => window.location.href = '/health-metrics'}
                  className="px-6 py-4 bg-gradient-to-r from-green-500 to-blue-500 text-white rounded-xl hover:from-green-600 hover:to-blue-600 transition-all duration-300 font-medium shadow-lg hover:shadow-xl text-center"
                >
                  Health Metrics
                </button>
                <button
                  onClick={() => window.location.href = '/gamification'}
                  className="px-6 py-4 bg-gradient-to-r from-purple-500 to-pink-500 text-white rounded-xl hover:from-purple-600 hover:to-pink-600 transition-all duration-300 font-medium shadow-lg hover:shadow-xl text-center"
                >
                  Gamification
                </button>
              </div>
            </div>

            {/* User Info */}
            <div className="relative bg-white/80 backdrop-blur-xl rounded-2xl p-6 border border-white/20 shadow-xl">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Account Information</h3>
              <div className="space-y-3 text-sm">
                <div className="flex justify-between">
                  <span className="text-gray-600">User ID:</span>
                  <span className="font-mono bg-gray-100 px-2 py-1 rounded">{whopUser.id}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Email:</span>
                  <span className="font-medium">{whopUser.email}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Company ID:</span>
                  <span className="font-mono bg-gray-100 px-2 py-1 rounded">{whopUser.company_id}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Status:</span>
                  <span className={`font-semibold ${whopUser.subscription_status === 'active' ? 'text-green-600' : 'text-red-600'}`}>
                    {whopUser.subscription_status}
                  </span>
                </div>
              </div>
            </div>
          </div>
        ) : (
          <div className="text-center">
            <AlertCircle className="h-12 w-12 text-red-500 mx-auto mb-4" />
            <h2 className="text-xl font-bold text-gray-900 mb-2">No User Data</h2>
            <p className="text-gray-600">Unable to load user information.</p>
          </div>
        )}
      </div>
    </div>
  );
}
