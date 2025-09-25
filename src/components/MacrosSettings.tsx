'use client';

import React, { useState, useEffect } from 'react';
import { 
  Save, 
  Edit, 
  X, 
  Target, 
  Zap, 
  Apple, 
  Droplets,
  Calculator,
  TrendingUp,
  AlertCircle
} from 'lucide-react';
import { MacrosTarget, User } from '@/types';

interface MacrosSettingsProps {
  clients: User[];
  onSave: (target: Omit<MacrosTarget, 'id' | 'createdAt' | 'updatedAt'>) => void;
  onUpdate: (id: string, updates: Partial<Omit<MacrosTarget, 'id' | 'createdAt' | 'clientId' | 'coachId'>>) => void;
  existingTargets: MacrosTarget[];
  coachId: string;
}

export default function MacrosSettings({ 
  clients, 
  onSave, 
  onUpdate, 
  existingTargets, 
  coachId 
}: MacrosSettingsProps) {
  const [selectedClientId, setSelectedClientId] = useState<string>('');
  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState({
    protein: 0,
    carbs: 0,
    fats: 0,
    calories: 0,
    notes: ''
  });

  const selectedClient = clients.find(c => c.id === selectedClientId);
  const existingTarget = existingTargets.find(t => t.clientId === selectedClientId);

  useEffect(() => {
    if (existingTarget) {
      setFormData({
        protein: existingTarget.protein,
        carbs: existingTarget.carbs,
        fats: existingTarget.fats,
        calories: existingTarget.calories,
        notes: existingTarget.notes || ''
      });
    } else {
      setFormData({
        protein: 0,
        carbs: 0,
        fats: 0,
        calories: 0,
        notes: ''
      });
    }
  }, [selectedClientId, existingTarget]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!selectedClientId) return;

    const targetData = {
      clientId: selectedClientId,
      coachId,
      protein: formData.protein,
      carbs: formData.carbs,
      fats: formData.fats,
      calories: formData.calories,
      isActive: true,
      notes: formData.notes
    };

    if (existingTarget) {
      onUpdate(existingTarget.id, targetData);
    } else {
      onSave(targetData);
    }
    
    setIsEditing(false);
  };

  const handleCancel = () => {
    setIsEditing(false);
    if (existingTarget) {
      setFormData({
        protein: existingTarget.protein,
        carbs: existingTarget.carbs,
        fats: existingTarget.fats,
        calories: existingTarget.calories,
        notes: existingTarget.notes || ''
      });
    } else {
      setFormData({
        protein: 0,
        carbs: 0,
        fats: 0,
        calories: 0,
        notes: ''
      });
    }
  };

  const calculateCalories = () => {
    // 4 calories per gram of protein and carbs, 9 calories per gram of fat
    const calculated = (formData.protein * 4) + (formData.carbs * 4) + (formData.fats * 9);
    setFormData(prev => ({ ...prev, calories: calculated }));
  };

  const getMacroPercentage = (macro: number, total: number) => {
    if (total === 0) return 0;
    return Math.round((macro / total) * 100);
  };

  return (
    <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center space-x-3">
          <div className="p-2 bg-blue-100 rounded-lg">
            <Target className="h-6 w-6 text-blue-600" />
          </div>
          <div>
            <h3 className="text-lg font-semibold text-gray-900">Macros Settings</h3>
            <p className="text-sm text-gray-600">Set daily macro targets for your clients</p>
          </div>
        </div>
        {selectedClientId && !isEditing && (
          <button
            onClick={() => setIsEditing(true)}
            className="flex items-center px-3 py-2 text-sm font-medium text-blue-600 bg-blue-50 rounded-lg hover:bg-blue-100 transition-colors"
          >
            <Edit className="h-4 w-4 mr-2" />
            {existingTarget ? 'Edit' : 'Set Targets'}
          </button>
        )}
      </div>

      {/* Client Selection */}
      <div className="mb-6">
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Select Client
        </label>
        <select
          value={selectedClientId}
          onChange={(e) => {
            setSelectedClientId(e.target.value);
            setIsEditing(false);
          }}
          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
        >
          <option value="">Choose a client...</option>
          {clients.map((client) => (
            <option key={client.id} value={client.id}>
              {client.name}
            </option>
          ))}
        </select>
      </div>

      {selectedClientId && (
        <>
          {/* Current Targets Display */}
          {!isEditing && existingTarget && (
            <div className="mb-6 p-4 bg-gray-50 rounded-lg">
              <h4 className="text-sm font-medium text-gray-900 mb-3">
                Current Targets for {selectedClient.name}
              </h4>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                <div className="text-center">
                  <div className="text-2xl font-bold text-red-600">{existingTarget.protein}g</div>
                  <div className="text-sm text-gray-600">Protein</div>
                  <div className="text-xs text-gray-500">
                    {getMacroPercentage(existingTarget.protein * 4, existingTarget.calories)}% of calories
                  </div>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold text-orange-600">{existingTarget.carbs}g</div>
                  <div className="text-sm text-gray-600">Carbs</div>
                  <div className="text-xs text-gray-500">
                    {getMacroPercentage(existingTarget.carbs * 4, existingTarget.calories)}% of calories
                  </div>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold text-yellow-600">{existingTarget.fats}g</div>
                  <div className="text-sm text-gray-600">Fats</div>
                  <div className="text-xs text-gray-500">
                    {getMacroPercentage(existingTarget.fats * 9, existingTarget.calories)}% of calories
                  </div>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold text-gray-900">{existingTarget.calories}</div>
                  <div className="text-sm text-gray-600">Total Calories</div>
                </div>
              </div>
              {existingTarget.notes && (
                <div className="mt-3 p-2 bg-white rounded border">
                  <p className="text-sm text-gray-700">{existingTarget.notes}</p>
                </div>
              )}
            </div>
          )}

          {/* No Targets Message */}
          {!isEditing && !existingTarget && (
            <div className="mb-6 p-4 bg-yellow-50 border border-yellow-200 rounded-lg">
              <div className="flex items-center">
                <AlertCircle className="h-5 w-5 text-yellow-600 mr-2" />
                <p className="text-sm text-yellow-800">
                  No macros targets set for {selectedClient.name}. Click "Set Targets" to create them.
                </p>
              </div>
            </div>
          )}

          {/* Edit Form */}
          {isEditing && (
            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* Protein */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    <div className="flex items-center space-x-2">
                      <Zap className="h-4 w-4 text-red-600" />
                      <span>Protein (g)</span>
                    </div>
                  </label>
                  <input
                    type="number"
                    value={formData.protein}
                    onChange={(e) => setFormData(prev => ({ ...prev, protein: Number(e.target.value) }))}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    min="0"
                    step="1"
                  />
                </div>

                {/* Carbs */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    <div className="flex items-center space-x-2">
                      <Apple className="h-4 w-4 text-orange-600" />
                      <span>Carbs (g)</span>
                    </div>
                  </label>
                  <input
                    type="number"
                    value={formData.carbs}
                    onChange={(e) => setFormData(prev => ({ ...prev, carbs: Number(e.target.value) }))}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    min="0"
                    step="1"
                  />
                </div>

                {/* Fats */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    <div className="flex items-center space-x-2">
                      <Droplets className="h-4 w-4 text-yellow-600" />
                      <span>Fats (g)</span>
                    </div>
                  </label>
                  <input
                    type="number"
                    value={formData.fats}
                    onChange={(e) => setFormData(prev => ({ ...prev, fats: Number(e.target.value) }))}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    min="0"
                    step="1"
                  />
                </div>

                {/* Calories */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    <div className="flex items-center space-x-2">
                      <Calculator className="h-4 w-4 text-gray-600" />
                      <span>Total Calories</span>
                    </div>
                  </label>
                  <div className="flex space-x-2">
                    <input
                      type="number"
                      value={formData.calories}
                      onChange={(e) => setFormData(prev => ({ ...prev, calories: Number(e.target.value) }))}
                      className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                      min="0"
                      step="1"
                    />
                    <button
                      type="button"
                      onClick={calculateCalories}
                      className="px-3 py-2 text-sm font-medium text-blue-600 bg-blue-50 rounded-lg hover:bg-blue-100 transition-colors"
                      title="Calculate calories from macros"
                    >
                      <Calculator className="h-4 w-4" />
                    </button>
                  </div>
                </div>
              </div>

              {/* Notes */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Notes (Optional)
                </label>
                <textarea
                  value={formData.notes}
                  onChange={(e) => setFormData(prev => ({ ...prev, notes: e.target.value }))}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  rows={3}
                  placeholder="Add any notes about this macro plan..."
                />
              </div>

              {/* Macro Breakdown */}
              {formData.calories > 0 && (
                <div className="p-4 bg-gray-50 rounded-lg">
                  <h4 className="text-sm font-medium text-gray-900 mb-3">Macro Breakdown</h4>
                  <div className="grid grid-cols-3 gap-4 text-center">
                    <div>
                      <div className="text-lg font-semibold text-red-600">
                        {getMacroPercentage(formData.protein * 4, formData.calories)}%
                      </div>
                      <div className="text-xs text-gray-600">Protein</div>
                    </div>
                    <div>
                      <div className="text-lg font-semibold text-orange-600">
                        {getMacroPercentage(formData.carbs * 4, formData.calories)}%
                      </div>
                      <div className="text-xs text-gray-600">Carbs</div>
                    </div>
                    <div>
                      <div className="text-lg font-semibold text-yellow-600">
                        {getMacroPercentage(formData.fats * 9, formData.calories)}%
                      </div>
                      <div className="text-xs text-gray-600">Fats</div>
                    </div>
                  </div>
                </div>
              )}

              {/* Action Buttons */}
              <div className="flex justify-end space-x-3">
                <button
                  type="button"
                  onClick={handleCancel}
                  className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                >
                  <X className="h-4 w-4 mr-2" />
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 text-sm font-medium text-white bg-blue-600 rounded-lg hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                >
                  <Save className="h-4 w-4 mr-2" />
                  {existingTarget ? 'Update Targets' : 'Save Targets'}
                </button>
              </div>
            </form>
          )}
        </>
      )}
    </div>
  );
}

