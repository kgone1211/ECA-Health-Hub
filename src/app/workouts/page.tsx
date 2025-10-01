'use client';

import React from 'react';
import { Dumbbell, Users, Calendar, Plus, Construction } from 'lucide-react';

export default function WorkoutsPage() {
  return (
    <div className="min-h-screen bg-gray-50">
      <div className="bg-white shadow-sm border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div>
              <h1 className="text-2xl font-bold text-gray-900">Workout Templates</h1>
              <p className="text-sm text-gray-600">Create and manage workout programs</p>
            </div>
            <button className="flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700">
              <Plus className="h-5 w-5 mr-2" />
              New Template
            </button>
          </div>
        </div>
      </div>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-12 text-center">
          <Construction className="h-16 w-16 text-orange-600 mx-auto mb-4" />
          <h3 className="text-2xl font-bold text-gray-900 mb-2">Workout Templates - Coming Soon</h3>
          <p className="text-gray-600 max-w-2xl mx-auto">
            Workout template builder is being migrated to the new database system.
          </p>
        </div>
      </main>
    </div>
  );
}
