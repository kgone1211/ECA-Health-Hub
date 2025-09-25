'use client';

import React, { useState } from 'react';
import { 
  Camera, 
  Upload, 
  Save, 
  X,
  CheckCircle,
  AlertCircle
} from 'lucide-react';
import { CheckInForm, FormResponse, PhotoSubmission, MeasurementSubmission, FormField } from '@/types';

interface ClientFormSubmissionProps {
  form: CheckInForm;
  onSubmit: (responses: FormResponse[], photos: PhotoSubmission[], measurements: MeasurementSubmission[]) => void;
  onCancel: () => void;
}

export default function ClientFormSubmission({ form, onSubmit, onCancel }: ClientFormSubmissionProps) {
  const [responses, setResponses] = useState<Record<string, string | number | boolean>>({});
  const [photos, setPhotos] = useState<PhotoSubmission[]>([]);
  const [measurements, setMeasurements] = useState<MeasurementSubmission[]>([]);
  const [errors, setErrors] = useState<Record<string, string>>({});

  const handleResponseChange = (fieldId: string, value: string | number | boolean) => {
    setResponses(prev => ({ ...prev, [fieldId]: value }));
    // Clear error when user starts typing
    if (errors[fieldId]) {
      setErrors(prev => ({ ...prev, [fieldId]: '' }));
    }
  };

  const handlePhotoUpload = (fieldId: string, type: 'front' | 'side' | 'back' | 'progress') => {
    // In a real app, this would handle actual file upload
    const newPhoto: PhotoSubmission = {
      id: Date.now().toString(),
      type,
      url: `/placeholder-photo-${type}.jpg`, // Placeholder
      date: new Date()
    };
    setPhotos(prev => [...prev, newPhoto]);
  };

  const handleMeasurementChange = (fieldId: string, value: number, unit: string) => {
    setMeasurements(prev => {
      const existing = prev.find(m => m.id === fieldId);
      if (existing) {
        return prev.map(m => m.id === fieldId ? { ...m, value, unit } : m);
      } else {
        return [...prev, {
          id: fieldId,
          type: 'weight', // This would be determined by the field
          value,
          unit,
          date: new Date()
        }];
      }
    });
  };

  const validateForm = () => {
    const newErrors: Record<string, string> = {};
    
    form.fields.forEach(field => {
      if (field.required) {
        const value = responses[field.id];
        if (value === undefined || value === '' || value === null) {
          newErrors[field.id] = 'This field is required';
        }
      }
    });

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = () => {
    if (!validateForm()) {
      return;
    }

    const formResponses: FormResponse[] = Object.entries(responses).map(([fieldId, value]) => ({
      fieldId,
      value
    }));

    onSubmit(formResponses, photos, measurements);
  };

  const renderField = (field: FormField) => {
    const value = responses[field.id];
    const error = errors[field.id];

    switch (field.type) {
      case 'text':
        return (
          <div>
            <input
              type="text"
              value={value as string || ''}
              onChange={(e) => handleResponseChange(field.id, e.target.value)}
              className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent ${
                error ? 'border-red-300' : 'border-gray-300'
              }`}
              placeholder={`Enter ${field.label.toLowerCase()}...`}
            />
            {error && <p className="mt-1 text-sm text-red-600">{error}</p>}
          </div>
        );

      case 'number':
        return (
          <div>
            <input
              type="number"
              value={value as number || ''}
              onChange={(e) => handleResponseChange(field.id, parseFloat(e.target.value) || 0)}
              min={field.min}
              max={field.max}
              className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent ${
                error ? 'border-red-300' : 'border-gray-300'
              }`}
              placeholder={`Enter ${field.label.toLowerCase()}...`}
            />
            {error && <p className="mt-1 text-sm text-red-600">{error}</p>}
          </div>
        );

      case 'select':
        return (
          <div>
            <select
              value={value as string || ''}
              onChange={(e) => handleResponseChange(field.id, e.target.value)}
              className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent ${
                error ? 'border-red-300' : 'border-gray-300'
              }`}
            >
              <option value="">Select an option...</option>
              {field.options?.map((option: string, index: number) => (
                <option key={index} value={option}>{option}</option>
              ))}
            </select>
            {error && <p className="mt-1 text-sm text-red-600">{error}</p>}
          </div>
        );

      case 'checkbox':
        return (
          <div>
            <div className="space-y-2">
              {field.options?.map((option: string, index: number) => (
                <label key={index} className="flex items-center space-x-2">
                  <input
                    type="checkbox"
                    checked={value === option}
                    onChange={(e) => handleResponseChange(field.id, e.target.checked ? option : '')}
                    className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                  />
                  <span className="text-sm text-gray-700">{option}</span>
                </label>
              ))}
            </div>
            {error && <p className="mt-1 text-sm text-red-600">{error}</p>}
          </div>
        );

      case 'photo':
        return (
          <div>
            <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center hover:border-gray-400 transition-colors">
              <Camera className="h-12 w-12 text-gray-400 mx-auto mb-4" />
              <p className="text-sm text-gray-600 mb-2">Upload your progress photo</p>
              <button
                onClick={() => handlePhotoUpload(field.id, 'progress')}
                className="inline-flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
              >
                <Upload className="h-4 w-4 mr-2" />
                Choose Photo
              </button>
            </div>
            {photos.length > 0 && (
              <div className="mt-4">
                <p className="text-sm text-gray-600 mb-2">Uploaded photos:</p>
                <div className="grid grid-cols-2 gap-2">
                  {photos.map((photo) => (
                    <div key={photo.id} className="relative">
                      <img
                        src={photo.url}
                        alt={photo.type}
                        className="w-full h-24 object-cover rounded-lg border border-gray-200"
                      />
                      <span className="absolute bottom-1 left-1 bg-black bg-opacity-75 text-white text-xs px-2 py-1 rounded">
                        {photo.type}
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        );

      case 'measurement':
        return (
          <div>
            <div className="flex space-x-2">
              <input
                type="number"
                value={value as number || ''}
                onChange={(e) => handleResponseChange(field.id, parseFloat(e.target.value) || 0)}
                className={`flex-1 px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent ${
                  error ? 'border-red-300' : 'border-gray-300'
                }`}
                placeholder="Enter value..."
              />
              <select
                value={field.unit || 'lbs'}
                onChange={(e) => handleMeasurementChange(field.id, value as number || 0, e.target.value)}
                className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              >
                <option value="lbs">lbs</option>
                <option value="kg">kg</option>
                <option value="inches">inches</option>
                <option value="cm">cm</option>
                <option value="%">%</option>
              </select>
            </div>
            {error && <p className="mt-1 text-sm text-red-600">{error}</p>}
          </div>
        );

      case 'symptom':
        return (
          <div>
            <textarea
              value={value as string || ''}
              onChange={(e) => handleResponseChange(field.id, e.target.value)}
              rows={3}
              className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent ${
                error ? 'border-red-300' : 'border-gray-300'
              }`}
              placeholder="Describe any symptoms or health concerns..."
            />
            <div className="mt-3">
              <p className="text-sm text-gray-600 mb-2">Severity level:</p>
              <div className="flex space-x-4">
                {['Mild', 'Moderate', 'Severe'].map((level) => (
                  <label key={level} className="flex items-center space-x-2">
                    <input
                      type="radio"
                      name={`symptom-${field.id}`}
                      value={level}
                      checked={value === level}
                      onChange={(e) => handleResponseChange(field.id, e.target.value)}
                      className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300"
                    />
                    <span className="text-sm text-gray-700">{level}</span>
                  </label>
                ))}
              </div>
            </div>
            {error && <p className="mt-1 text-sm text-red-600">{error}</p>}
          </div>
        );

      default:
        return <div>Unknown field type</div>;
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-lg shadow-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="px-6 py-4 border-b border-gray-200">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-xl font-semibold text-gray-900">{form.name}</h2>
              <p className="text-sm text-gray-600">
                {form.frequency === 'bi-weekly' ? 'Bi-weekly' : 'Monthly'} check-in form
              </p>
            </div>
            <button
              onClick={onCancel}
              className="p-2 text-gray-400 hover:text-gray-600 rounded-lg hover:bg-gray-100"
            >
              <X className="h-6 w-6" />
            </button>
          </div>
        </div>

        {/* Form Content */}
        <div className="px-6 py-6 space-y-6">
          {form.fields.map((field) => (
            <div key={field.id} className="space-y-2">
              <label className="block text-sm font-medium text-gray-700">
                {field.label}
                {field.required && <span className="text-red-500 ml-1">*</span>}
              </label>
              {renderField(field)}
            </div>
          ))}
        </div>

        {/* Footer */}
        <div className="px-6 py-4 border-t border-gray-200 bg-gray-50">
          <div className="flex items-center justify-between">
            <div className="text-sm text-gray-600">
              {form.fields.filter(f => f.required).length} required field{form.fields.filter(f => f.required).length !== 1 ? 's' : ''}
            </div>
            <div className="flex items-center space-x-3">
              <button
                onClick={onCancel}
                className="px-4 py-2 text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={handleSubmit}
                className="flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
              >
                <Save className="h-4 w-4 mr-2" />
                Submit Check-in
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
