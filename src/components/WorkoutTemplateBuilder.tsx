'use client';

import React, { useState } from 'react';
import { 
  Plus, 
  Trash2, 
  Save, 
  X, 
  Dumbbell, 
  Clock, 
  Target,
  Edit3,
  Copy,
  Eye
} from 'lucide-react';
import { WorkoutTemplate, WorkoutExercise } from '@/types';

interface WorkoutTemplateBuilderProps {
  clientId: string;
  clientName: string;
  onSave: (template: Omit<WorkoutTemplate, 'id' | 'createdAt' | 'updatedAt'>) => void;
  onCancel: () => void;
  existingTemplate?: WorkoutTemplate;
}

export default function WorkoutTemplateBuilder({ 
  clientId, 
  clientName, 
  onSave, 
  onCancel,
  existingTemplate 
}: WorkoutTemplateBuilderProps) {
  const [template, setTemplate] = useState<Omit<WorkoutTemplate, 'id' | 'createdAt' | 'updatedAt'>>({
    coachId: '1',
    clientId,
    name: existingTemplate?.name || '',
    description: existingTemplate?.description || '',
    category: existingTemplate?.category || 'strength',
    difficulty: existingTemplate?.difficulty || 'beginner',
    estimatedDuration: existingTemplate?.estimatedDuration || 30,
    exercises: existingTemplate?.exercises || [],
    isActive: existingTemplate?.isActive ?? true,
    notes: existingTemplate?.notes || ''
  });

  const [editingExercise, setEditingExercise] = useState<WorkoutExercise | null>(null);
  const [isExerciseModalOpen, setIsExerciseModalOpen] = useState(false);

  const categories = [
    { value: 'strength', label: 'Strength Training' },
    { value: 'cardio', label: 'Cardio' },
    { value: 'hiit', label: 'HIIT' },
    { value: 'yoga', label: 'Yoga' },
    { value: 'pilates', label: 'Pilates' },
    { value: 'functional', label: 'Functional' },
    { value: 'sports', label: 'Sports' },
    { value: 'other', label: 'Other' }
  ];

  const difficulties = [
    { value: 'beginner', label: 'Beginner' },
    { value: 'intermediate', label: 'Intermediate' },
    { value: 'advanced', label: 'Advanced' }
  ];

  const muscleGroups = [
    'chest', 'back', 'shoulders', 'biceps', 'triceps', 'forearms',
    'quads', 'hamstrings', 'glutes', 'calves', 'core', 'abs'
  ];

  const equipmentOptions = [
    'barbell', 'dumbbells', 'kettlebell', 'resistance bands', 'cables',
    'bench', 'squat rack', 'pull-up bar', 'treadmill', 'bike',
    'yoga mat', 'stability ball', 'medicine ball', 'none'
  ];

  const handleAddExercise = () => {
    const newExercise: WorkoutExercise = {
      id: Date.now().toString(),
      name: '',
      description: '',
      category: 'strength',
      muscleGroups: [],
      equipment: [],
      sets: 3,
      reps: 10,
      restTime: 60,
      notes: '',
      order: template.exercises.length + 1
    };
    setEditingExercise(newExercise);
    setIsExerciseModalOpen(true);
  };

  const handleEditExercise = (exercise: WorkoutExercise) => {
    setEditingExercise(exercise);
    setIsExerciseModalOpen(true);
  };

  const handleSaveExercise = (exercise: WorkoutExercise) => {
    if (editingExercise?.id === exercise.id) {
      // Editing existing exercise
      setTemplate(prev => ({
        ...prev,
        exercises: prev.exercises.map(ex => ex.id === exercise.id ? exercise : ex)
      }));
    } else {
      // Adding new exercise
      setTemplate(prev => ({
        ...prev,
        exercises: [...prev.exercises, exercise]
      }));
    }
    setIsExerciseModalOpen(false);
    setEditingExercise(null);
  };

  const handleDeleteExercise = (exerciseId: string) => {
    setTemplate(prev => ({
      ...prev,
      exercises: prev.exercises.filter(ex => ex.id !== exerciseId)
    }));
  };

  const handleMoveExercise = (exerciseId: string, direction: 'up' | 'down') => {
    const exercises = [...template.exercises];
    const index = exercises.findIndex(ex => ex.id === exerciseId);
    
    if (direction === 'up' && index > 0) {
      [exercises[index], exercises[index - 1]] = [exercises[index - 1], exercises[index]];
    } else if (direction === 'down' && index < exercises.length - 1) {
      [exercises[index], exercises[index + 1]] = [exercises[index + 1], exercises[index]];
    }
    
    // Update order numbers
    exercises.forEach((ex, i) => {
      ex.order = i + 1;
    });
    
    setTemplate(prev => ({
      ...prev,
      exercises
    }));
  };

  const handleSave = () => {
    if (!template.name.trim()) {
      alert('Please enter a workout name');
      return;
    }
    if (template.exercises.length === 0) {
      alert('Please add at least one exercise');
      return;
    }
    onSave(template);
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg shadow-xl max-w-4xl w-full max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-gray-200">
          <div>
            <h2 className="text-2xl font-bold text-gray-900">
              {existingTemplate ? 'Edit Workout Template' : 'Create Workout Template'}
            </h2>
            <p className="text-sm text-gray-600">For {clientName}</p>
          </div>
          <button
            onClick={onCancel}
            className="p-2 text-gray-400 hover:text-gray-600 rounded-lg hover:bg-gray-100"
          >
            <X className="h-6 w-6" />
          </button>
        </div>

        <div className="p-6 space-y-6">
          {/* Basic Info */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Workout Name *
              </label>
              <input
                type="text"
                value={template.name}
                onChange={(e) => setTemplate(prev => ({ ...prev, name: e.target.value }))}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                placeholder="e.g., Upper Body Strength"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Estimated Duration (minutes)
              </label>
              <input
                type="number"
                value={template.estimatedDuration}
                onChange={(e) => setTemplate(prev => ({ ...prev, estimatedDuration: parseInt(e.target.value) || 30 }))}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                min="5"
                max="180"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Category
              </label>
              <select
                value={template.category}
                onChange={(e) => setTemplate(prev => ({ ...prev, category: e.target.value as any }))}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              >
                {categories.map(cat => (
                  <option key={cat.value} value={cat.value}>
                    {cat.label}
                  </option>
                ))}
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Difficulty Level
              </label>
              <select
                value={template.difficulty}
                onChange={(e) => setTemplate(prev => ({ ...prev, difficulty: e.target.value as any }))}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              >
                {difficulties.map(diff => (
                  <option key={diff.value} value={diff.value}>
                    {diff.label}
                  </option>
                ))}
              </select>
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Description
            </label>
            <textarea
              value={template.description}
              onChange={(e) => setTemplate(prev => ({ ...prev, description: e.target.value }))}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              rows={3}
              placeholder="Brief description of the workout..."
            />
          </div>

          {/* Exercises */}
          <div>
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold text-gray-900">Exercises</h3>
              <button
                onClick={handleAddExercise}
                className="flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
              >
                <Plus className="h-4 w-4 mr-2" />
                Add Exercise
              </button>
            </div>

            {template.exercises.length === 0 ? (
              <div className="text-center py-8 text-gray-500">
                <Dumbbell className="h-12 w-12 mx-auto mb-4 text-gray-300" />
                <p>No exercises added yet. Click "Add Exercise" to get started.</p>
              </div>
            ) : (
              <div className="space-y-4">
                {template.exercises.map((exercise, index) => (
                  <div key={exercise.id} className="bg-gray-50 rounded-lg p-4">
                    <div className="flex items-center justify-between mb-2">
                      <div className="flex items-center space-x-3">
                        <span className="bg-blue-100 text-blue-800 text-sm font-medium px-2 py-1 rounded">
                          {exercise.order}
                        </span>
                        <h4 className="font-medium text-gray-900">{exercise.name}</h4>
                        <span className="text-sm text-gray-500">
                          {exercise.sets} sets × {exercise.reps || exercise.duration} {exercise.reps ? 'reps' : 'sec'}
                        </span>
                      </div>
                      <div className="flex items-center space-x-2">
                        <button
                          onClick={() => handleMoveExercise(exercise.id, 'up')}
                          disabled={index === 0}
                          className="p-1 text-gray-400 hover:text-gray-600 disabled:opacity-50"
                        >
                          ↑
                        </button>
                        <button
                          onClick={() => handleMoveExercise(exercise.id, 'down')}
                          disabled={index === template.exercises.length - 1}
                          className="p-1 text-gray-400 hover:text-gray-600 disabled:opacity-50"
                        >
                          ↓
                        </button>
                        <button
                          onClick={() => handleEditExercise(exercise)}
                          className="p-1 text-gray-400 hover:text-blue-600"
                        >
                          <Edit3 className="h-4 w-4" />
                        </button>
                        <button
                          onClick={() => handleDeleteExercise(exercise.id)}
                          className="p-1 text-gray-400 hover:text-red-600"
                        >
                          <Trash2 className="h-4 w-4" />
                        </button>
                      </div>
                    </div>
                    {exercise.description && (
                      <p className="text-sm text-gray-600 mb-2">{exercise.description}</p>
                    )}
                    <div className="flex flex-wrap gap-2">
                      {exercise.muscleGroups.map(muscle => (
                        <span key={muscle} className="bg-green-100 text-green-800 text-xs px-2 py-1 rounded">
                          {muscle}
                        </span>
                      ))}
                      {exercise.equipment.map(eq => (
                        <span key={eq} className="bg-purple-100 text-purple-800 text-xs px-2 py-1 rounded">
                          {eq}
                        </span>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Notes
            </label>
            <textarea
              value={template.notes}
              onChange={(e) => setTemplate(prev => ({ ...prev, notes: e.target.value }))}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              rows={3}
              placeholder="Additional notes for the client..."
            />
          </div>
        </div>

        {/* Footer */}
        <div className="flex items-center justify-end space-x-4 p-6 border-t border-gray-200">
          <button
            onClick={onCancel}
            className="px-4 py-2 text-gray-700 bg-gray-100 rounded-lg hover:bg-gray-200 transition-colors"
          >
            Cancel
          </button>
          <button
            onClick={handleSave}
            className="flex items-center px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
          >
            <Save className="h-4 w-4 mr-2" />
            {existingTemplate ? 'Update Template' : 'Create Template'}
          </button>
        </div>
      </div>

      {/* Exercise Modal */}
      {isExerciseModalOpen && editingExercise && (
        <ExerciseModal
          exercise={editingExercise}
          onSave={handleSaveExercise}
          onCancel={() => {
            setIsExerciseModalOpen(false);
            setEditingExercise(null);
          }}
          muscleGroups={muscleGroups}
          equipmentOptions={equipmentOptions}
        />
      )}
    </div>
  );
}

// Exercise Modal Component
interface ExerciseModalProps {
  exercise: WorkoutExercise;
  onSave: (exercise: WorkoutExercise) => void;
  onCancel: () => void;
  muscleGroups: string[];
  equipmentOptions: string[];
}

function ExerciseModal({ exercise, onSave, onCancel, muscleGroups, equipmentOptions }: ExerciseModalProps) {
  const [formData, setFormData] = useState<WorkoutExercise>(exercise);

  const handleSave = () => {
    if (!formData.name.trim()) {
      alert('Please enter an exercise name');
      return;
    }
    onSave(formData);
  };

  const toggleMuscleGroup = (muscle: string) => {
    setFormData(prev => ({
      ...prev,
      muscleGroups: prev.muscleGroups.includes(muscle)
        ? prev.muscleGroups.filter(m => m !== muscle)
        : [...prev.muscleGroups, muscle]
    }));
  };

  const toggleEquipment = (equipment: string) => {
    setFormData(prev => ({
      ...prev,
      equipment: prev.equipment.includes(equipment)
        ? prev.equipment.filter(e => e !== equipment)
        : [...prev.equipment, equipment]
    }));
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-60 p-4">
      <div className="bg-white rounded-lg shadow-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
        <div className="flex items-center justify-between p-6 border-b border-gray-200">
          <h3 className="text-xl font-bold text-gray-900">Exercise Details</h3>
          <button
            onClick={onCancel}
            className="p-2 text-gray-400 hover:text-gray-600 rounded-lg hover:bg-gray-100"
          >
            <X className="h-6 w-6" />
          </button>
        </div>

        <div className="p-6 space-y-6">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Exercise Name *
            </label>
            <input
              type="text"
              value={formData.name}
              onChange={(e) => setFormData(prev => ({ ...prev, name: e.target.value }))}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              placeholder="e.g., Bench Press"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Description
            </label>
            <textarea
              value={formData.description}
              onChange={(e) => setFormData(prev => ({ ...prev, description: e.target.value }))}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              rows={3}
              placeholder="Exercise instructions or tips..."
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Sets
              </label>
              <input
                type="number"
                value={formData.sets}
                onChange={(e) => setFormData(prev => ({ ...prev, sets: parseInt(e.target.value) || 1 }))}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                min="1"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Reps (leave empty for time-based)
              </label>
              <input
                type="number"
                value={formData.reps || ''}
                onChange={(e) => setFormData(prev => ({ ...prev, reps: e.target.value ? parseInt(e.target.value) : undefined }))}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                min="1"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Duration (seconds, for time-based exercises)
              </label>
              <input
                type="number"
                value={formData.duration || ''}
                onChange={(e) => setFormData(prev => ({ ...prev, duration: e.target.value ? parseInt(e.target.value) : undefined }))}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                min="1"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Weight (lbs, optional)
              </label>
              <input
                type="number"
                value={formData.weight || ''}
                onChange={(e) => setFormData(prev => ({ ...prev, weight: e.target.value ? parseInt(e.target.value) : undefined }))}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                min="0"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Rest Time (seconds)
              </label>
              <input
                type="number"
                value={formData.restTime}
                onChange={(e) => setFormData(prev => ({ ...prev, restTime: parseInt(e.target.value) || 60 }))}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                min="0"
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Muscle Groups
            </label>
            <div className="flex flex-wrap gap-2">
              {muscleGroups.map(muscle => (
                <button
                  key={muscle}
                  onClick={() => toggleMuscleGroup(muscle)}
                  className={`px-3 py-1 rounded-full text-sm transition-colors ${
                    formData.muscleGroups.includes(muscle)
                      ? 'bg-green-100 text-green-800 border border-green-300'
                      : 'bg-gray-100 text-gray-700 border border-gray-300 hover:bg-gray-200'
                  }`}
                >
                  {muscle}
                </button>
              ))}
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Equipment
            </label>
            <div className="flex flex-wrap gap-2">
              {equipmentOptions.map(equipment => (
                <button
                  key={equipment}
                  onClick={() => toggleEquipment(equipment)}
                  className={`px-3 py-1 rounded-full text-sm transition-colors ${
                    formData.equipment.includes(equipment)
                      ? 'bg-purple-100 text-purple-800 border border-purple-300'
                      : 'bg-gray-100 text-gray-700 border border-gray-300 hover:bg-gray-200'
                  }`}
                >
                  {equipment}
                </button>
              ))}
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Notes
            </label>
            <textarea
              value={formData.notes}
              onChange={(e) => setFormData(prev => ({ ...prev, notes: e.target.value }))}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              rows={2}
              placeholder="Additional notes for this exercise..."
            />
          </div>
        </div>

        <div className="flex items-center justify-end space-x-4 p-6 border-t border-gray-200">
          <button
            onClick={onCancel}
            className="px-4 py-2 text-gray-700 bg-gray-100 rounded-lg hover:bg-gray-200 transition-colors"
          >
            Cancel
          </button>
          <button
            onClick={handleSave}
            className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
          >
            Save Exercise
          </button>
        </div>
      </div>
    </div>
  );
}

