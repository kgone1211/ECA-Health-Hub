'use client';

import React, { useState } from 'react';
import { 
  Target, 
  Users, 
  TrendingUp, 
  Calendar,
  Plus,
  Edit,
  BarChart3
} from 'lucide-react';
import { db } from '@/lib/database';
import { MacrosTarget, User } from '@/types';
import MacrosSettings from '@/components/MacrosSettings';
import MacroReportsModal from '@/components/MacroReportsModal';

export default function MacrosPage() {
  const [coachId] = useState('1'); // Coach user
  const [activeTab, setActiveTab] = useState<'overview' | 'settings'>('overview');
  const [isReportsModalOpen, setIsReportsModalOpen] = useState(false);
  
  const clients = db.getUsersByCoachId(coachId);
  const macrosTargets = db.getMacrosTargetsByCoach(coachId);

  const handleSaveTarget = (target: Omit<MacrosTarget, 'id' | 'createdAt' | 'updatedAt'>) => {
    db.createMacrosTarget(target);
    // In a real app, you'd update the UI state here
    window.location.reload(); // Simple refresh for demo
  };

  const handleUpdateTarget = (id: string, updates: Partial<Omit<MacrosTarget, 'id' | 'createdAt' | 'clientId' | 'coachId'>>) => {
    db.updateMacrosTarget(id, updates);
    // In a real app, you'd update the UI state here
    window.location.reload(); // Simple refresh for demo
  };

  const getClientMacros = (clientId: string) => {
    return macrosTargets.find(target => target.clientId === clientId);
  };

  const getMacroPercentage = (macro: number, total: number) => {
    if (total === 0) return 0;
    return Math.round((macro / total) * 100);
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white shadow-sm border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div>
              <h1 className="text-2xl font-bold text-gray-900">Macros Management</h1>
              <p className="text-sm text-gray-600">Set and track macro targets for your clients</p>
            </div>
            <div className="flex items-center space-x-4">
              <button 
                onClick={() => setIsReportsModalOpen(true)}
                className="flex items-center px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50"
              >
                <BarChart3 className="h-4 w-4 mr-2" />
                View Reports
              </button>
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
                { id: 'settings', name: 'Settings', icon: Target }
              ].map((tab) => (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id as 'overview' | 'settings')}
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
          <div className="space-y-6">
            {/* Stats Overview */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
                <div className="flex items-center">
                  <div className="p-3 bg-blue-100 rounded-lg">
                    <Users className="h-6 w-6 text-blue-600" />
                  </div>
                  <div className="ml-4">
                    <p className="text-sm font-medium text-gray-600">Total Clients</p>
                    <p className="text-2xl font-bold text-gray-900">{clients.length}</p>
                  </div>
                </div>
              </div>
              
              <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
                <div className="flex items-center">
                  <div className="p-3 bg-green-100 rounded-lg">
                    <Target className="h-6 w-6 text-green-600" />
                  </div>
                  <div className="ml-4">
                    <p className="text-sm font-medium text-gray-600">With Macros Set</p>
                    <p className="text-2xl font-bold text-gray-900">{macrosTargets.length}</p>
                  </div>
                </div>
              </div>
              
              <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
                <div className="flex items-center">
                  <div className="p-3 bg-orange-100 rounded-lg">
                    <TrendingUp className="h-6 w-6 text-orange-600" />
                  </div>
                  <div className="ml-4">
                    <p className="text-sm font-medium text-gray-600">Avg. Protein</p>
                    <p className="text-2xl font-bold text-gray-900">
                      {macrosTargets.length > 0 
                        ? Math.round(macrosTargets.reduce((sum, t) => sum + t.protein, 0) / macrosTargets.length)
                        : 0
                      }g
                    </p>
                  </div>
                </div>
              </div>
            </div>

            {/* Client Macros Overview */}
            <div className="bg-white rounded-lg shadow-sm border border-gray-200">
              <div className="px-6 py-4 border-b border-gray-200">
                <h3 className="text-lg font-semibold text-gray-900">Client Macros Overview</h3>
              </div>
              <div className="divide-y divide-gray-200">
                {clients.map((client) => {
                  const macros = getClientMacros(client.id);
                  return (
                    <div key={client.id} className="p-6">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center space-x-4">
                          <div className="h-10 w-10 bg-blue-600 rounded-full flex items-center justify-center">
                            <span className="text-white text-sm font-medium">
                              {client.name.split(' ').map(n => n[0]).join('')}
                            </span>
                          </div>
                          <div>
                            <h4 className="text-sm font-medium text-gray-900">{client.name}</h4>
                            <p className="text-sm text-gray-600">
                              {macros ? 'Macros configured' : 'No macros set'}
                            </p>
                          </div>
                        </div>
                        
                        {macros ? (
                          <div className="flex items-center space-x-6">
                            <div className="text-center">
                              <div className="text-lg font-semibold text-red-600">{macros.protein}g</div>
                              <div className="text-xs text-gray-600">Protein</div>
                            </div>
                            <div className="text-center">
                              <div className="text-lg font-semibold text-orange-600">{macros.carbs}g</div>
                              <div className="text-xs text-gray-600">Carbs</div>
                            </div>
                            <div className="text-center">
                              <div className="text-lg font-semibold text-yellow-600">{macros.fats}g</div>
                              <div className="text-xs text-gray-600">Fats</div>
                            </div>
                            <div className="text-center">
                              <div className="text-lg font-semibold text-gray-900">{macros.calories}</div>
                              <div className="text-xs text-gray-600">Calories</div>
                            </div>
                            <button
                              onClick={() => setActiveTab('settings')}
                              className="p-2 text-gray-400 hover:text-gray-600 rounded-lg hover:bg-gray-100"
                            >
                              <Edit className="h-4 w-4" />
                            </button>
                          </div>
                        ) : (
                          <button
                            onClick={() => setActiveTab('settings')}
                            className="flex items-center px-3 py-2 text-sm font-medium text-blue-600 bg-blue-50 rounded-lg hover:bg-blue-100"
                          >
                            <Plus className="h-4 w-4 mr-2" />
                            Set Macros
                          </button>
                        )}
                      </div>
                      
                      {macros && macros.notes && (
                        <div className="mt-3 p-3 bg-gray-50 rounded-lg">
                          <p className="text-sm text-gray-700">{macros.notes}</p>
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>
            </div>
          </div>
        )}

        {activeTab === 'settings' && (
          <MacrosSettings
            clients={clients}
            onSave={handleSaveTarget}
            onUpdate={handleUpdateTarget}
            existingTargets={macrosTargets}
            coachId={coachId}
          />
        )}
      </main>

      {/* Macro Reports Modal */}
      <MacroReportsModal
        isOpen={isReportsModalOpen}
        onClose={() => setIsReportsModalOpen(false)}
        coachId={coachId}
      />
    </div>
  );
}

