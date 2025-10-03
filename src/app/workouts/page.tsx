'use client';

import React, { useState, useEffect } from 'react';
import { Dumbbell, Plus, X, Users, Copy, Trash2 } from 'lucide-react';

interface Client {
  id: number;
  name: string;
}

interface Exercise {
  name: string;
  sets: number;
  reps: string;
  rest_seconds?: number;
  notes?: string;
}

interface WorkoutTemplate {
  id?: number;
  name: string;
  description?: string;
  exercises: Exercise[];
  assigned_to?: number[];
}

export default function WorkoutsPage() {
  const coachId = 1; // TODO: Get from auth
  const [clients, setClients] = useState<Client[]>([]);
  const [templates, setTemplates] = useState<WorkoutTemplate[]>([]);
  const [showForm, setShowForm] = useState(false);
  const [editingTemplate, setEditingTemplate] = useState<WorkoutTemplate | null>(null);
  const [loading, setLoading] = useState(false);
  const [saving, setSaving] = useState(false);

  const [formData, setFormData] = useState({
    name: '',
    description: '',
    exercises: [{ name: '', sets: 3, reps: '10', rest_seconds: 60, notes: '' }],
    assignedClients: [] as number[]
  });

  useEffect(() => {
    loadClients();
    loadTemplates();
  }, []);

  const loadClients = async () => {
    try {
      const response = await fetch(`/api/clients?coachId=${coachId}`);
      if (response.ok) {
        const data = await response.json();
        setClients(data.clients || []);
      }
    } catch (error) {
      console.error('Error loading clients:', error);
    }
  };

  const loadTemplates = async () => {
    setLoading(true);
    try {
      const response = await fetch(`/api/workout-templates?coachId=${coachId}`);
      if (response.ok) {
        const data = await response.json();
        setTemplates(data.templates || []);
      }
    } catch (error) {
      console.error('Error loading templates:', error);
    } finally {
      setLoading(false);
    }
  };

  const addExercise = () => {
    setFormData({
      ...formData,
      exercises: [...formData.exercises, { name: '', sets: 3, reps: '10', rest_seconds: 60, notes: '' }]
    });
  };

  const removeExercise = (index: number) => {
    setFormData({
      ...formData,
      exercises: formData.exercises.filter((_, i) => i !== index)
    });
  };

  const updateExercise = (index: number, field: string, value: any) => {
    const newExercises = [...formData.exercises];
    newExercises[index] = { ...newExercises[index], [field]: value };
    setFormData({ ...formData, exercises: newExercises });
  };

  const toggleClientAssignment = (clientId: number) => {
    setFormData({
      ...formData,
      assignedClients: formData.assignedClients.includes(clientId)
        ? formData.assignedClients.filter(id => id !== clientId)
        : [...formData.assignedClients, clientId]
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!formData.name.trim()) {
      alert('Please enter a template name');
      return;
    }

    const validExercises = formData.exercises.filter(ex => ex.name.trim());
    if (validExercises.length === 0) {
      alert('Please add at least one exercise');
      return;
    }

    setSaving(true);
    try {
      const response = await fetch('/api/workout-templates', {
        method: editingTemplate ? 'PUT' : 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          id: editingTemplate?.id,
          coachId,
          name: formData.name.trim(),
          description: formData.description.trim() || undefined,
          exercises: validExercises,
          assignedTo: formData.assignedClients.length > 0 ? formData.assignedClients : undefined
        })
      });

      if (response.ok) {
        alert(`Template ${editingTemplate ? 'updated' : 'created'} successfully!`);
        setFormData({
          name: '',
          description: '',
          exercises: [{ name: '', sets: 3, reps: '10', rest_seconds: 60, notes: '' }],
          assignedClients: []
        });
        setShowForm(false);
        setEditingTemplate(null);
        loadTemplates();
      } else {
        const error = await response.json();
        alert(`Error: ${error.error}`);
      }
    } catch (error) {
      console.error('Error saving template:', error);
      alert('Failed to save template');
    } finally {
      setSaving(false);
    }
  };

  const editTemplate = (template: WorkoutTemplate) => {
    setFormData({
      name: template.name,
      description: template.description || '',
      exercises: template.exercises.length > 0 ? template.exercises : [{ name: '', sets: 3, reps: '10', rest_seconds: 60, notes: '' }],
      assignedClients: template.assigned_to || []
    });
    setEditingTemplate(template);
    setShowForm(true);
  };

  const deleteTemplate = async (id: number) => {
    if (!confirm('Are you sure you want to delete this template?')) return;

    try {
      const response = await fetch(`/api/workout-templates?id=${id}`, {
        method: 'DELETE'
      });

      if (response.ok) {
        alert('Template deleted successfully!');
        loadTemplates();
      }
    } catch (error) {
      console.error('Error deleting template:', error);
      alert('Failed to delete template');
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="bg-white shadow-sm border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div>
              <h1 className="text-2xl font-bold text-gray-900">Workout Templates</h1>
              <p className="text-sm text-gray-600">Create and assign workout programs to clients</p>
            </div>
            <button
              onClick={() => {
                setShowForm(!showForm);
                if (showForm) {
                  setEditingTemplate(null);
                  setFormData({
                    name: '',
                    description: '',
                    exercises: [{ name: '', sets: 3, reps: '10', rest_seconds: 60, notes: '' }],
                    assignedClients: []
                  });
                }
              }}
              className="flex items-center px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors"
            >
              {showForm ? <X className="h-5 w-5 mr-2" /> : <Plus className="h-5 w-5 mr-2" />}
              {showForm ? 'Cancel' : 'Create Template'}
            </button>
          </div>
        </div>
      </div>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {showForm && (
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 mb-6">
            <h2 className="text-lg font-semibold text-gray-900 mb-4">
              {editingTemplate ? 'Edit Template' : 'Create Workout Template'}
            </h2>
            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Template Name *
                  </label>
                  <input
                    type="text"
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent"
                    placeholder="Upper Body Strength"
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Description (Optional)
                  </label>
                  <input
                    type="text"
                    value={formData.description}
                    onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent"
                    placeholder="Focus on compound movements..."
                  />
                </div>
              </div>

              <div>
                <div className="flex items-center justify-between mb-3">
                  <label className="block text-sm font-medium text-gray-700">
                    Exercises *
                  </label>
                  <button
                    type="button"
                    onClick={addExercise}
                    className="text-sm text-red-600 hover:text-red-700 font-medium"
                  >
                    + Add Exercise
                  </button>
                </div>

                <div className="space-y-3">
                  {formData.exercises.map((exercise, index) => (
                    <div key={index} className="flex gap-2 items-start p-3 bg-gray-50 rounded-lg">
                      <input
                        type="text"
                        value={exercise.name}
                        onChange={(e) => updateExercise(index, 'name', e.target.value)}
                        className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent"
                        placeholder="Exercise name"
                      />
                      <input
                        type="number"
                        value={exercise.sets}
                        onChange={(e) => updateExercise(index, 'sets', parseInt(e.target.value) || 3)}
                        className="w-16 px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent"
                        placeholder="Sets"
                      />
                      <input
                        type="text"
                        value={exercise.reps}
                        onChange={(e) => updateExercise(index, 'reps', e.target.value)}
                        className="w-24 px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent"
                        placeholder="Reps"
                      />
                      <input
                        type="number"
                        value={exercise.rest_seconds || ''}
                        onChange={(e) => updateExercise(index, 'rest_seconds', parseInt(e.target.value) || undefined)}
                        className="w-20 px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent"
                        placeholder="Rest"
                      />
                      {formData.exercises.length > 1 && (
                        <button
                          type="button"
                          onClick={() => removeExercise(index)}
                          className="p-2 text-red-600 hover:bg-red-50 rounded-lg"
                        >
                          <X className="h-5 w-5" />
                        </button>
                      )}
                    </div>
                  ))}
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Assign to Clients (Optional)
                </label>
                <div className="grid grid-cols-2 md:grid-cols-3 gap-2">
                  {clients.map(client => (
                    <label key={client.id} className="flex items-center space-x-2 p-2 border border-gray-200 rounded-lg hover:bg-gray-50 cursor-pointer">
                      <input
                        type="checkbox"
                        checked={formData.assignedClients.includes(client.id)}
                        onChange={() => toggleClientAssignment(client.id)}
                        className="h-4 w-4 text-red-600 focus:ring-red-500 border-gray-300 rounded"
                      />
                      <span className="text-sm text-gray-700">{client.name}</span>
                    </label>
                  ))}
                </div>
              </div>

              <div className="flex justify-end gap-3 pt-4">
                <button
                  type="button"
                  onClick={() => {
                    setShowForm(false);
                    setEditingTemplate(null);
                  }}
                  className="px-4 py-2 text-gray-700 bg-gray-100 rounded-lg hover:bg-gray-200 transition-colors"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={saving}
                  className="px-6 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors disabled:opacity-50"
                >
                  {saving ? 'Saving...' : editingTemplate ? 'Update Template' : 'Create Template'}
                </button>
              </div>
            </form>
          </div>
        )}

        {/* Templates List */}
        {loading ? (
          <div className="text-center py-12">
            <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-red-600"></div>
            <p className="mt-2 text-gray-600">Loading templates...</p>
          </div>
        ) : templates.length === 0 ? (
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-12 text-center">
            <Dumbbell className="h-16 w-16 text-gray-400 mx-auto mb-4" />
            <h3 className="text-xl font-semibold text-gray-900 mb-2">No Templates Yet</h3>
            <p className="text-gray-600 mb-4">Create your first workout template to assign to clients</p>
            <button
              onClick={() => setShowForm(true)}
              className="px-6 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors"
            >
              Create First Template
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {templates.map((template) => (
              <div key={template.id} className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
                <div className="flex items-start justify-between mb-4">
                  <div>
                    <h3 className="text-lg font-semibold text-gray-900">{template.name}</h3>
                    {template.description && (
                      <p className="text-sm text-gray-600 mt-1">{template.description}</p>
                    )}
                  </div>
                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => editTemplate(template)}
                      className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg"
                      title="Edit"
                    >
                      <Copy className="h-4 w-4" />
                    </button>
                    <button
                      onClick={() => template.id && deleteTemplate(template.id)}
                      className="p-2 text-red-600 hover:bg-red-50 rounded-lg"
                      title="Delete"
                    >
                      <Trash2 className="h-4 w-4" />
                    </button>
                  </div>
                </div>

                <div className="space-y-2 mb-4">
                  {template.exercises.map((exercise, index) => (
                    <div key={index} className="flex items-center gap-2 text-sm bg-gray-50 p-2 rounded">
                      <span className="font-medium text-gray-900">{exercise.name}</span>
                      <span className="text-gray-400">•</span>
                      <span className="text-gray-600">{exercise.sets} × {exercise.reps}</span>
                      {exercise.rest_seconds && (
                        <>
                          <span className="text-gray-400">•</span>
                          <span className="text-gray-600">{exercise.rest_seconds}s rest</span>
                        </>
                      )}
                    </div>
                  ))}
                </div>

                {template.assigned_to && template.assigned_to.length > 0 && (
                  <div className="flex items-center gap-2 text-sm text-gray-600 pt-3 border-t border-gray-200">
                    <Users className="h-4 w-4" />
                    <span>Assigned to {template.assigned_to.length} client{template.assigned_to.length !== 1 ? 's' : ''}</span>
                  </div>
                )}
              </div>
            ))}
          </div>
        )}
      </main>
    </div>
  );
}
