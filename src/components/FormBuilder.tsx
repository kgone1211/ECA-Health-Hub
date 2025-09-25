'use client';

import React, { useState } from 'react';
import { 
  Plus, 
  Trash2, 
  Edit, 
  Save, 
  Eye, 
  Copy,
  Move,
  Settings,
  Type,
  Hash,
  List,
  CheckSquare,
  Camera,
  Ruler,
  Heart,
  X,
  ChevronDown,
  ChevronUp
} from 'lucide-react';
import { FormField, CheckInForm } from '@/types';

interface FormBuilderProps {
  form?: CheckInForm;
  coachId: string;
  onSave: (form: Omit<CheckInForm, 'id' | 'createdAt'>) => void;
  onCancel: () => void;
}

export default function FormBuilder({ form, coachId, onSave, onCancel }: FormBuilderProps) {
  const [formData, setFormData] = useState({
    name: form?.name || '',
    frequency: form?.frequency || 'bi-weekly' as 'bi-weekly' | 'monthly',
    isActive: form?.isActive ?? true,
    fields: form?.fields || []
  });

  const [draggedField, setDraggedField] = useState<FormField | null>(null);
  const [editingField, setEditingField] = useState<FormField | null>(null);
  const [showFieldTypes, setShowFieldTypes] = useState(false);

  const fieldTypes = [
    { 
      id: 'text', 
      name: 'Text Input', 
      icon: Type, 
      description: 'Single line text input',
      color: 'text-blue-600',
      bgColor: 'bg-blue-100'
    },
    { 
      id: 'number', 
      name: 'Number Input', 
      icon: Hash, 
      description: 'Numeric input with validation',
      color: 'text-green-600',
      bgColor: 'bg-green-100'
    },
    { 
      id: 'select', 
      name: 'Dropdown', 
      icon: List, 
      description: 'Select from predefined options',
      color: 'text-purple-600',
      bgColor: 'bg-purple-100'
    },
    { 
      id: 'checkbox', 
      name: 'Checkbox', 
      icon: CheckSquare, 
      description: 'Yes/No or multiple choice',
      color: 'text-orange-600',
      bgColor: 'bg-orange-100'
    },
    { 
      id: 'photo', 
      name: 'Photo Upload', 
      icon: Camera, 
      description: 'Image upload for progress photos',
      color: 'text-pink-600',
      bgColor: 'bg-pink-100'
    },
    { 
      id: 'measurement', 
      name: 'Measurement', 
      icon: Ruler, 
      description: 'Body measurements (weight, etc.)',
      color: 'text-indigo-600',
      bgColor: 'bg-indigo-100'
    },
    { 
      id: 'symptom', 
      name: 'Symptom Tracker', 
      icon: Heart, 
      description: 'Health symptoms and conditions',
      color: 'text-red-600',
      bgColor: 'bg-red-100'
    }
  ];

  const createField = (type: string): FormField => {
    const baseField: FormField = {
      id: Date.now().toString(),
      type: type as 'text' | 'number' | 'select' | 'checkbox' | 'photo' | 'measurement' | 'symptom',
      label: `New ${fieldTypes.find(ft => ft.id === type)?.name || 'Field'}`,
      required: false,
      options: type === 'select' || type === 'checkbox' ? ['Option 1', 'Option 2'] : undefined,
      unit: type === 'measurement' ? 'lbs' : undefined,
      min: type === 'number' ? 0 : undefined,
      max: type === 'number' ? 1000 : undefined
    };

    return baseField;
  };

  const addField = (type: string) => {
    const newField = createField(type);
    setFormData(prev => ({
      ...prev,
      fields: [...prev.fields, newField]
    }));
    setEditingField(newField);
    setShowFieldTypes(false);
  };

  const updateField = (fieldId: string, updates: Partial<FormField>) => {
    setFormData(prev => ({
      ...prev,
      fields: prev.fields.map(field => 
        field.id === fieldId ? { ...field, ...updates } : field
      )
    }));
  };

  const deleteField = (fieldId: string) => {
    setFormData(prev => ({
      ...prev,
      fields: prev.fields.filter(field => field.id !== fieldId)
    }));
    if (editingField?.id === fieldId) {
      setEditingField(null);
    }
  };

  const duplicateField = (field: FormField) => {
    const newField: FormField = {
      ...field,
      id: Date.now().toString(),
      label: `${field.label} (Copy)`
    };
    setFormData(prev => ({
      ...prev,
      fields: [...prev.fields, newField]
    }));
  };

  const moveField = (fromIndex: number, toIndex: number) => {
    const newFields = [...formData.fields];
    const [movedField] = newFields.splice(fromIndex, 1);
    newFields.splice(toIndex, 0, movedField);
    setFormData(prev => ({
      ...prev,
      fields: newFields
    }));
  };

  const handleSave = () => {
    if (!formData.name.trim()) {
      alert('Please enter a form name');
      return;
    }
    if (formData.fields.length === 0) {
      alert('Please add at least one field to the form');
      return;
    }
    onSave({ ...formData, coachId });
  };

  const getFieldIcon = (type: string) => {
    const fieldType = fieldTypes.find(ft => ft.id === type);
    return fieldType ? fieldType.icon : Type;
  };

  const getFieldColor = (type: string) => {
    const fieldType = fieldTypes.find(ft => ft.id === type);
    return fieldType ? fieldType.color : 'text-gray-600';
  };

  const getFieldBgColor = (type: string) => {
    const fieldType = fieldTypes.find(ft => ft.id === type);
    return fieldType ? fieldType.bgColor : 'bg-gray-100';
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-lg shadow-xl max-w-6xl w-full max-h-[90vh] overflow-hidden flex">
        {/* Left Sidebar - Field Types */}
        <div className="w-80 bg-gray-50 border-r border-gray-200 flex flex-col">
          <div className="p-4 border-b border-gray-200">
            <h3 className="text-lg font-semibold text-gray-900">Form Builder</h3>
            <p className="text-sm text-gray-600">Add fields to build your check-in form</p>
          </div>
          
          <div className="flex-1 overflow-y-auto p-4">
            <div className="space-y-2">
              {fieldTypes.map((fieldType) => {
                const Icon = fieldType.icon;
                return (
                  <button
                    key={fieldType.id}
                    onClick={() => addField(fieldType.id)}
                    className="w-full p-3 text-left rounded-lg border border-gray-200 bg-white hover:border-gray-300 hover:shadow-sm transition-all"
                  >
                    <div className="flex items-center space-x-3">
                      <div className={`p-2 rounded-lg ${fieldType.bgColor}`}>
                        <Icon className={`h-5 w-5 ${fieldType.color}`} />
                      </div>
                      <div>
                        <p className="text-sm font-medium text-gray-900">{fieldType.name}</p>
                        <p className="text-xs text-gray-500">{fieldType.description}</p>
                      </div>
                    </div>
                  </button>
                );
              })}
            </div>
          </div>
        </div>

        {/* Main Content - Form Preview */}
        <div className="flex-1 flex flex-col">
          {/* Header */}
          <div className="p-6 border-b border-gray-200">
            <div className="flex items-center justify-between">
              <div className="flex-1 max-w-md">
                <input
                  type="text"
                  value={formData.name}
                  onChange={(e) => setFormData(prev => ({ ...prev, name: e.target.value }))}
                  placeholder="Enter form name..."
                  className="w-full text-xl font-semibold text-gray-900 border-none outline-none bg-transparent"
                />
              </div>
              <div className="flex items-center space-x-4">
                <select
                  value={formData.frequency}
                  onChange={(e) => setFormData(prev => ({ ...prev, frequency: e.target.value as 'bi-weekly' | 'monthly' }))}
                  className="px-3 py-2 border border-gray-300 rounded-lg text-sm"
                >
                  <option value="bi-weekly">Bi-weekly</option>
                  <option value="monthly">Monthly</option>
                </select>
                <div className="flex items-center space-x-2">
                  <input
                    type="checkbox"
                    id="isActive"
                    checked={formData.isActive}
                    onChange={(e) => setFormData(prev => ({ ...prev, isActive: e.target.checked }))}
                    className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                  />
                  <label htmlFor="isActive" className="text-sm text-gray-700">Active</label>
                </div>
              </div>
            </div>
          </div>

          {/* Form Preview */}
          <div className="flex-1 overflow-y-auto p-6">
            <div className="max-w-2xl mx-auto">
              <div className="bg-white border border-gray-200 rounded-lg p-6 shadow-sm">
                <h4 className="text-lg font-semibold text-gray-900 mb-6">Form Preview</h4>
                
                {formData.fields.length === 0 ? (
                  <div className="text-center py-12">
                    <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
                      <Plus className="h-8 w-8 text-gray-400" />
                    </div>
                    <h3 className="text-lg font-medium text-gray-900 mb-2">No fields added yet</h3>
                    <p className="text-gray-600">Add fields from the sidebar to build your form</p>
                  </div>
                ) : (
                  <div className="space-y-6">
                    {formData.fields.map((field, index) => {
                      const Icon = getFieldIcon(field.type);
                      return (
                        <div
                          key={field.id}
                          className={`p-4 border-2 rounded-lg transition-all ${
                            editingField?.id === field.id
                              ? 'border-blue-500 bg-blue-50'
                              : 'border-gray-200 hover:border-gray-300'
                          }`}
                        >
                          <div className="flex items-start justify-between">
                            <div className="flex-1">
                              <div className="flex items-center space-x-3 mb-3">
                                <div className={`p-2 rounded-lg ${getFieldBgColor(field.type)}`}>
                                  <Icon className={`h-4 w-4 ${getFieldColor(field.type)}`} />
                                </div>
                                <div>
                                  <h5 className="text-sm font-medium text-gray-900">
                                    {field.label}
                                    {field.required && <span className="text-red-500 ml-1">*</span>}
                                  </h5>
                                  <p className="text-xs text-gray-500 capitalize">{field.type.replace('_', ' ')}</p>
                                </div>
                              </div>

                              {/* Field Preview */}
                              <div className="ml-11">
                                {field.type === 'text' && (
                                  <input
                                    type="text"
                                    placeholder="Enter text..."
                                    className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm"
                                    disabled
                                  />
                                )}
                                {field.type === 'number' && (
                                  <input
                                    type="number"
                                    placeholder="Enter number..."
                                    min={field.min}
                                    max={field.max}
                                    className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm"
                                    disabled
                                  />
                                )}
                                {field.type === 'select' && (
                                  <select className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm" disabled>
                                    <option>Select an option...</option>
                                    {field.options?.map((option, i) => (
                                      <option key={i}>{option}</option>
                                    ))}
                                  </select>
                                )}
                                {field.type === 'checkbox' && (
                                  <div className="space-y-2">
                                    {field.options?.map((option, i) => (
                                      <label key={i} className="flex items-center space-x-2">
                                        <input type="checkbox" className="h-4 w-4" disabled />
                                        <span className="text-sm text-gray-700">{option}</span>
                                      </label>
                                    ))}
                                  </div>
                                )}
                                {field.type === 'photo' && (
                                  <div className="border-2 border-dashed border-gray-300 rounded-lg p-4 text-center">
                                    <Camera className="h-8 w-8 text-gray-400 mx-auto mb-2" />
                                    <p className="text-sm text-gray-600">Click to upload photo</p>
                                  </div>
                                )}
                                {field.type === 'measurement' && (
                                  <div className="flex space-x-2">
                                    <input
                                      type="number"
                                      placeholder="Enter value..."
                                      className="flex-1 px-3 py-2 border border-gray-300 rounded-lg text-sm"
                                      disabled
                                    />
                                    <select className="px-3 py-2 border border-gray-300 rounded-lg text-sm" disabled>
                                      <option>{field.unit}</option>
                                    </select>
                                  </div>
                                )}
                                {field.type === 'symptom' && (
                                  <div className="space-y-2">
                                    <input
                                      type="text"
                                      placeholder="Describe symptoms..."
                                      className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm"
                                      disabled
                                    />
                                    <div className="flex space-x-2">
                                      <label className="flex items-center space-x-1">
                                        <input type="radio" name={`symptom-${field.id}`} className="h-4 w-4" disabled />
                                        <span className="text-sm text-gray-700">Mild</span>
                                      </label>
                                      <label className="flex items-center space-x-1">
                                        <input type="radio" name={`symptom-${field.id}`} className="h-4 w-4" disabled />
                                        <span className="text-sm text-gray-700">Moderate</span>
                                      </label>
                                      <label className="flex items-center space-x-1">
                                        <input type="radio" name={`symptom-${field.id}`} className="h-4 w-4" disabled />
                                        <span className="text-sm text-gray-700">Severe</span>
                                      </label>
                                    </div>
                                  </div>
                                )}
                              </div>
                            </div>

                            <div className="flex items-center space-x-1 ml-4">
                              <button
                                onClick={() => setEditingField(field)}
                                className="p-1 text-gray-400 hover:text-blue-600 rounded"
                                title="Edit field"
                              >
                                <Edit className="h-4 w-4" />
                              </button>
                              <button
                                onClick={() => duplicateField(field)}
                                className="p-1 text-gray-400 hover:text-green-600 rounded"
                                title="Duplicate field"
                              >
                                <Copy className="h-4 w-4" />
                              </button>
                              <button
                                onClick={() => deleteField(field.id)}
                                className="p-1 text-gray-400 hover:text-red-600 rounded"
                                title="Delete field"
                              >
                                <Trash2 className="h-4 w-4" />
                              </button>
                            </div>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Footer */}
          <div className="p-6 border-t border-gray-200 bg-gray-50">
            <div className="flex items-center justify-between">
              <div className="text-sm text-gray-600">
                {formData.fields.length} field{formData.fields.length !== 1 ? 's' : ''} • {formData.frequency} frequency
              </div>
              <div className="flex items-center space-x-3">
                <button
                  onClick={onCancel}
                  className="px-4 py-2 text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
                >
                  Cancel
                </button>
                <button
                  onClick={handleSave}
                  className="flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                >
                  <Save className="h-4 w-4 mr-2" />
                  Save Form
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Right Sidebar - Field Editor */}
        {editingField && (
          <div className="w-80 bg-gray-50 border-l border-gray-200 flex flex-col">
            <div className="p-4 border-b border-gray-200">
              <div className="flex items-center justify-between">
                <h3 className="text-lg font-semibold text-gray-900">Field Settings</h3>
                <button
                  onClick={() => setEditingField(null)}
                  className="p-1 text-gray-400 hover:text-gray-600 rounded"
                >
                  <X className="h-5 w-5" />
                </button>
              </div>
            </div>

            <div className="flex-1 overflow-y-auto p-4 space-y-6">
              {/* Basic Settings */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Field Label
                </label>
                <input
                  type="text"
                  value={editingField.label}
                  onChange={(e) => updateField(editingField.id, { label: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm"
                />
              </div>

              <div className="flex items-center space-x-2">
                <input
                  type="checkbox"
                  id="required"
                  checked={editingField.required}
                  onChange={(e) => updateField(editingField.id, { required: e.target.checked })}
                  className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                />
                <label htmlFor="required" className="text-sm text-gray-700">Required field</label>
              </div>

              {/* Type-specific settings */}
              {editingField.type === 'number' && (
                <div className="space-y-4">
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">Min Value</label>
                      <input
                        type="number"
                        value={editingField.min || ''}
                        onChange={(e) => updateField(editingField.id, { min: parseInt(e.target.value) || undefined })}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">Max Value</label>
                      <input
                        type="number"
                        value={editingField.max || ''}
                        onChange={(e) => updateField(editingField.id, { max: parseInt(e.target.value) || undefined })}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm"
                      />
                    </div>
                  </div>
                </div>
              )}

              {(editingField.type === 'select' || editingField.type === 'checkbox') && (
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Options (one per line)
                  </label>
                  <textarea
                    value={editingField.options?.join('\n') || ''}
                    onChange={(e) => updateField(editingField.id, { 
                      options: e.target.value.split('\n').filter(opt => opt.trim() !== '')
                    })}
                    rows={4}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm"
                    placeholder="Option 1&#10;Option 2&#10;Option 3"
                  />
                </div>
              )}

              {editingField.type === 'measurement' && (
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Unit</label>
                  <select
                    value={editingField.unit || 'lbs'}
                    onChange={(e) => updateField(editingField.id, { unit: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm"
                  >
                    <option value="lbs">Pounds (lbs)</option>
                    <option value="kg">Kilograms (kg)</option>
                    <option value="inches">Inches</option>
                    <option value="cm">Centimeters (cm)</option>
                    <option value="%">Percentage (%)</option>
                  </select>
                </div>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
