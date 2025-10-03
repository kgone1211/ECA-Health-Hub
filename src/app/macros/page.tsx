'use client';

import React, { useState, useEffect } from 'react';
import { Apple, Plus, X, Users, Target } from 'lucide-react';

interface Client {
  id: number;
  name: string;
  email: string;
}

interface MacroTarget {
  id?: number;
  user_id: number;
  calories: number;
  protein: number;
  carbs: number;
  fats: number;
  notes?: string;
}

export default function MacrosPage() {
  const coachId = 1; // TODO: Get from auth
  const [clients, setClients] = useState<Client[]>([]);
  const [selectedClient, setSelectedClient] = useState<number | null>(null);
  const [currentTargets, setCurrentTargets] = useState<MacroTarget | null>(null);
  const [showForm, setShowForm] = useState(false);
  const [loading, setLoading] = useState(false);
  const [saving, setSaving] = useState(false);

  const [formData, setFormData] = useState({
    calories: '',
    protein: '',
    carbs: '',
    fats: '',
    notes: ''
  });

  useEffect(() => {
    loadClients();
  }, []);

  useEffect(() => {
    if (selectedClient) {
      loadMacroTargets(selectedClient);
    }
  }, [selectedClient]);

  const loadClients = async () => {
    setLoading(true);
    try {
      const response = await fetch(`/api/clients?coachId=${coachId}`);
      if (response.ok) {
        const data = await response.json();
        setClients(data.clients || []);
        if (data.clients.length > 0) {
          setSelectedClient(data.clients[0].id);
        }
      }
    } catch (error) {
      console.error('Error loading clients:', error);
    } finally {
      setLoading(false);
    }
  };

  const loadMacroTargets = async (clientId: number) => {
    try {
      const response = await fetch(`/api/macro-targets?userId=${clientId}`);
      if (response.ok) {
        const data = await response.json();
        setCurrentTargets(data.target || null);
        if (data.target) {
          setFormData({
            calories: data.target.calories.toString(),
            protein: data.target.protein.toString(),
            carbs: data.target.carbs.toString(),
            fats: data.target.fats.toString(),
            notes: data.target.notes || ''
          });
        } else {
          setFormData({
            calories: '2000',
            protein: '150',
            carbs: '200',
            fats: '67',
            notes: ''
          });
        }
      }
    } catch (error) {
      console.error('Error loading macro targets:', error);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!selectedClient) {
      alert('Please select a client');
      return;
    }

    if (!formData.calories || !formData.protein || !formData.carbs || !formData.fats) {
      alert('Please fill in all macro fields');
      return;
    }

    setSaving(true);
    try {
      const response = await fetch('/api/macro-targets', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          userId: selectedClient,
          calories: parseInt(formData.calories),
          protein: parseFloat(formData.protein),
          carbs: parseFloat(formData.carbs),
          fats: parseFloat(formData.fats),
          notes: formData.notes || undefined
        })
      });

      if (response.ok) {
        alert('Macro targets set successfully!');
        loadMacroTargets(selectedClient);
        setShowForm(false);
      } else {
        const error = await response.json();
        alert(`Error: ${error.error}`);
      }
    } catch (error) {
      console.error('Error setting macro targets:', error);
      alert('Failed to set macro targets');
    } finally {
      setSaving(false);
    }
  };

  const selectedClientData = clients.find(c => c.id === selectedClient);

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="bg-white shadow-sm border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div>
              <h1 className="text-2xl font-bold text-gray-900">Macro Targets</h1>
              <p className="text-sm text-gray-600">Set nutrition targets for your clients</p>
            </div>
          </div>
        </div>
      </div>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Client Selection */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 mb-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4 flex-1">
              <Users className="h-5 w-5 text-gray-400" />
              <select
                value={selectedClient || ''}
                onChange={(e) => setSelectedClient(parseInt(e.target.value))}
                className="flex-1 max-w-md px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent"
              >
                <option value="">Select a client...</option>
                {clients.map(client => (
                  <option key={client.id} value={client.id}>
                    {client.name} ({client.email})
                  </option>
                ))}
              </select>
            </div>
            {selectedClient && (
              <button
                onClick={() => setShowForm(!showForm)}
                className="flex items-center px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors"
              >
                {showForm ? <X className="h-5 w-5 mr-2" /> : <Plus className="h-5 w-5 mr-2" />}
                {showForm ? 'Cancel' : currentTargets ? 'Update Targets' : 'Set Targets'}
              </button>
            )}
          </div>
        </div>

        {!selectedClient ? (
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-12 text-center">
            <Users className="h-16 w-16 text-gray-400 mx-auto mb-4" />
            <h3 className="text-xl font-semibold text-gray-900 mb-2">No Client Selected</h3>
            <p className="text-gray-600">Select a client to view or set their macro targets</p>
          </div>
        ) : showForm ? (
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
            <h2 className="text-lg font-semibold text-gray-900 mb-4">
              Set Macro Targets for {selectedClientData?.name}
            </h2>
            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Daily Calories *
                  </label>
                  <input
                    type="number"
                    value={formData.calories}
                    onChange={(e) => setFormData({ ...formData, calories: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent"
                    placeholder="2000"
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Protein (g) *
                  </label>
                  <input
                    type="number"
                    step="0.1"
                    value={formData.protein}
                    onChange={(e) => setFormData({ ...formData, protein: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent"
                    placeholder="150"
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Carbs (g) *
                  </label>
                  <input
                    type="number"
                    step="0.1"
                    value={formData.carbs}
                    onChange={(e) => setFormData({ ...formData, carbs: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent"
                    placeholder="200"
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Fats (g) *
                  </label>
                  <input
                    type="number"
                    step="0.1"
                    value={formData.fats}
                    onChange={(e) => setFormData({ ...formData, fats: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent"
                    placeholder="67"
                    required
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
                  placeholder="Dietary restrictions, preferences, or instructions..."
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
                  className="px-6 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors disabled:opacity-50"
                >
                  {saving ? 'Saving...' : currentTargets ? 'Update Targets' : 'Set Targets'}
                </button>
              </div>
            </form>
          </div>
        ) : currentTargets ? (
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-lg font-semibold text-gray-900">
                Current Targets for {selectedClientData?.name}
              </h2>
              <Target className="h-6 w-6 text-red-600" />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-6">
              <div className="p-4 bg-red-50 rounded-lg border border-red-200">
                <p className="text-sm text-gray-600 mb-1">Daily Calories</p>
                <p className="text-3xl font-bold text-red-600">{currentTargets.calories}</p>
              </div>

              <div className="p-4 bg-blue-50 rounded-lg border border-blue-200">
                <p className="text-sm text-gray-600 mb-1">Protein</p>
                <p className="text-3xl font-bold text-blue-600">{currentTargets.protein}g</p>
              </div>

              <div className="p-4 bg-yellow-50 rounded-lg border border-yellow-200">
                <p className="text-sm text-gray-600 mb-1">Carbs</p>
                <p className="text-3xl font-bold text-yellow-600">{currentTargets.carbs}g</p>
              </div>

              <div className="p-4 bg-purple-50 rounded-lg border border-purple-200">
                <p className="text-sm text-gray-600 mb-1">Fats</p>
                <p className="text-3xl font-bold text-purple-600">{currentTargets.fats}g</p>
              </div>
            </div>

            {currentTargets.notes && (
              <div className="p-4 bg-gray-50 rounded-lg">
                <p className="text-sm font-medium text-gray-700 mb-1">Notes:</p>
                <p className="text-gray-600">{currentTargets.notes}</p>
              </div>
            )}
          </div>
        ) : (
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-12 text-center">
            <Apple className="h-16 w-16 text-gray-400 mx-auto mb-4" />
            <h3 className="text-xl font-semibold text-gray-900 mb-2">No Targets Set</h3>
            <p className="text-gray-600 mb-4">
              This client doesn&apos;t have macro targets set yet
            </p>
            <button
              onClick={() => setShowForm(true)}
              className="px-6 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors"
            >
              Set Macro Targets
            </button>
          </div>
        )}
      </main>
    </div>
  );
}
