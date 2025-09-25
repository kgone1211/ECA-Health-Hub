'use client';

import React, { useState } from 'react';
import { 
  Calendar, 
  Plus, 
  Edit, 
  Trash2, 
  CheckCircle,
  Clock,
  Users,
  BarChart3
} from 'lucide-react';
import { db } from '@/lib/database';
import { CheckInForm, CheckInSubmission } from '@/types';
import FormBuilder from '@/components/FormBuilder';

export default function CheckInsPage() {
  const [coachId] = useState('1');
  const [showCreateForm, setShowCreateForm] = useState(false);
  const [editingForm, setEditingForm] = useState<CheckInForm | null>(null);
  const [submissions, setSubmissions] = useState<CheckInSubmission[]>([]);

  const forms = db.getCheckInForms(coachId);

  const handleCreateForm = () => {
    setShowCreateForm(true);
  };

  const handleEditForm = (form: CheckInForm) => {
    setEditingForm(form);
  };

  const handleSaveForm = (formData: Omit<CheckInForm, 'id' | 'createdAt'>) => {
    if (editingForm) {
      // Update existing form
      console.log('Updating form:', formData);
    } else {
      // Create new form
      const newForm = db.createCheckInForm(formData);
      console.log('Created new form:', newForm);
    }
    setShowCreateForm(false);
    setEditingForm(null);
  };

  const handleCancelForm = () => {
    setShowCreateForm(false);
    setEditingForm(null);
  };

  const handleViewSubmissions = (formId: string) => {
    // In a real app, this would fetch submissions from the database
    setSubmissions([
      {
        id: '1',
        userId: '2',
        formId: formId,
        submittedAt: new Date('2024-01-20T10:30:00'),
        responses: [
          { fieldId: '1', value: 8 },
          { fieldId: '2', value: 7.5 },
          { fieldId: '4', value: 180 }
        ],
        photos: [
          {
            id: '1',
            type: 'front',
            url: '/photos/progress-front.jpg',
            date: new Date('2024-01-20')
          }
        ],
        measurements: [
          {
            id: '1',
            type: 'weight',
            value: 180,
            unit: 'lbs',
            date: new Date('2024-01-20')
          }
        ]
      }
    ]);
  };

  const getFieldTypeIcon = (type: string) => {
    switch (type) {
      case 'text': return '📝';
      case 'number': return '🔢';
      case 'select': return '📋';
      case 'checkbox': return '☑️';
      case 'photo': return '📷';
      case 'measurement': return '📏';
      case 'symptom': return '🏥';
      default: return '❓';
    }
  };

  const getFrequencyColor = (frequency: string) => {
    return frequency === 'bi-weekly' 
      ? 'bg-blue-100 text-blue-800' 
      : 'bg-green-100 text-green-800';
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white shadow-sm border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div>
              <h1 className="text-2xl font-bold text-gray-900">Check-in Forms</h1>
              <p className="text-sm text-gray-600">Create and manage client check-in forms</p>
            </div>
            <button
              onClick={handleCreateForm}
              className="flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
            >
              <Plus className="h-5 w-5 mr-2" />
              Create Form
            </button>
          </div>
        </div>
      </div>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Stats Overview */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
            <div className="flex items-center">
              <div className="p-3 rounded-lg bg-blue-100">
                <Calendar className="h-6 w-6 text-blue-600" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Total Forms</p>
                <p className="text-2xl font-bold text-gray-900">{forms.length}</p>
              </div>
            </div>
          </div>
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
            <div className="flex items-center">
              <div className="p-3 rounded-lg bg-green-100">
                <CheckCircle className="h-6 w-6 text-green-600" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Active Forms</p>
                <p className="text-2xl font-bold text-gray-900">
                  {forms.filter(f => f.isActive).length}
                </p>
              </div>
            </div>
          </div>
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
            <div className="flex items-center">
              <div className="p-3 rounded-lg bg-purple-100">
                <Users className="h-6 w-6 text-purple-600" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Total Submissions</p>
                <p className="text-2xl font-bold text-gray-900">47</p>
              </div>
            </div>
          </div>
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
            <div className="flex items-center">
              <div className="p-3 rounded-lg bg-orange-100">
                <Clock className="h-6 w-6 text-orange-600" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Pending Reviews</p>
                <p className="text-2xl font-bold text-gray-900">12</p>
              </div>
            </div>
          </div>
        </div>

        {/* Forms List */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200">
          <div className="px-6 py-4 border-b border-gray-200">
            <h3 className="text-lg font-semibold text-gray-900">Your Check-in Forms</h3>
          </div>
          <div className="divide-y divide-gray-200">
            {forms.length === 0 ? (
              <div className="px-6 py-12 text-center">
                <Calendar className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                <h3 className="text-lg font-medium text-gray-900 mb-2">No forms created yet</h3>
                <p className="text-gray-600 mb-4">Create your first check-in form to start collecting client data.</p>
                <button
                  onClick={handleCreateForm}
                  className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                >
                  Create Your First Form
                </button>
              </div>
            ) : (
              forms.map((form) => (
                <div key={form.id} className="px-6 py-4">
                  <div className="flex items-center justify-between">
                    <div className="flex-1">
                      <div className="flex items-center space-x-3">
                        <h4 className="text-lg font-medium text-gray-900">{form.name}</h4>
                        <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${getFrequencyColor(form.frequency)}`}>
                          {form.frequency === 'bi-weekly' ? 'Bi-weekly' : 'Monthly'}
                        </span>
                        <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${
                          form.isActive ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-800'
                        }`}>
                          {form.isActive ? 'Active' : 'Inactive'}
                        </span>
                      </div>
                      <p className="text-sm text-gray-600 mt-1">
                        Created {form.createdAt.toLocaleDateString('en-US', { 
                          year: 'numeric', 
                          month: 'long', 
                          day: 'numeric' 
                        })}
                      </p>
                      <div className="flex items-center space-x-4 mt-2">
                        <div className="flex items-center text-sm text-gray-500">
                          <span className="mr-1">{form.fields.length}</span>
                          <span>fields</span>
                        </div>
                        <div className="flex items-center text-sm text-gray-500">
                          <span className="mr-1">12</span>
                          <span>submissions</span>
                        </div>
                      </div>
                    </div>
                    <div className="flex items-center space-x-2">
                      <button
                        onClick={() => handleViewSubmissions(form.id)}
                        className="p-2 text-gray-400 hover:text-blue-600 rounded-lg hover:bg-gray-100"
                        title="View Submissions"
                      >
                        <BarChart3 className="h-5 w-5" />
                      </button>
                      <button
                        onClick={() => handleEditForm(form)}
                        className="p-2 text-gray-400 hover:text-yellow-600 rounded-lg hover:bg-gray-100"
                        title="Edit Form"
                      >
                        <Edit className="h-5 w-5" />
                      </button>
                      <button className="p-2 text-gray-400 hover:text-red-600 rounded-lg hover:bg-gray-100" title="Delete Form">
                        <Trash2 className="h-5 w-5" />
                      </button>
                    </div>
                  </div>
                  
                  {/* Form Fields Preview */}
                  <div className="mt-4">
                    <h5 className="text-sm font-medium text-gray-700 mb-2">Form Fields:</h5>
                    <div className="flex flex-wrap gap-2">
                      {form.fields.map((field) => (
                        <span
                          key={field.id}
                          className="inline-flex items-center px-2 py-1 bg-gray-100 text-gray-700 rounded-md text-xs"
                        >
                          <span className="mr-1">{getFieldTypeIcon(field.type)}</span>
                          {field.label}
                          {field.required && <span className="ml-1 text-red-500">*</span>}
                        </span>
                      ))}
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>

        {/* Submissions Modal */}
        {submissions.length > 0 && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
            <div className="bg-white rounded-lg shadow-xl max-w-4xl w-full max-h-[90vh] overflow-y-auto">
              <div className="px-6 py-4 border-b border-gray-200">
                <div className="flex items-center justify-between">
                  <h3 className="text-lg font-semibold text-gray-900">Form Submissions</h3>
                  <button
                    onClick={() => setSubmissions([])}
                    className="text-gray-400 hover:text-gray-600"
                  >
                    <span className="sr-only">Close</span>
                    <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                    </svg>
                  </button>
                </div>
              </div>
              <div className="px-6 py-4">
                <div className="space-y-6">
                  {submissions.map((submission) => (
                    <div key={submission.id} className="border border-gray-200 rounded-lg p-4">
                      <div className="flex items-center justify-between mb-4">
                        <div>
                          <h4 className="text-lg font-medium text-gray-900">Submission</h4>
                          <p className="text-sm text-gray-600">
                            Submitted {submission.submittedAt.toLocaleDateString('en-US', {
                              year: 'numeric',
                              month: 'long',
                              day: 'numeric',
                              hour: '2-digit',
                              minute: '2-digit'
                            })}
                          </p>
                        </div>
                        <span className="inline-flex px-2 py-1 text-xs font-semibold rounded-full bg-green-100 text-green-800">
                          Completed
                        </span>
                      </div>
                      
                      {/* Responses */}
                      <div className="space-y-3">
                        <h5 className="text-sm font-medium text-gray-700">Responses:</h5>
                        {submission.responses.map((response, index) => (
                          <div key={index} className="flex items-center justify-between py-2 border-b border-gray-100">
                            <span className="text-sm text-gray-600">Field {response.fieldId}:</span>
                            <span className="text-sm font-medium text-gray-900">{response.value}</span>
                          </div>
                        ))}
                      </div>

                      {/* Photos */}
                      {submission.photos.length > 0 && (
                        <div className="mt-4">
                          <h5 className="text-sm font-medium text-gray-700 mb-2">Photos:</h5>
                          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                            {submission.photos.map((photo) => (
                              <div key={photo.id} className="relative">
                                <img
                                  src={photo.url}
                                  alt={`Progress photo - ${photo.type}`}
                                  className="w-full h-32 object-cover rounded-lg border border-gray-200"
                                />
                                <span className="absolute bottom-2 left-2 bg-black bg-opacity-75 text-white text-xs px-2 py-1 rounded">
                                  {photo.type}
                                </span>
                              </div>
                            ))}
                          </div>
                        </div>
                      )}

                      {/* Measurements */}
                      {submission.measurements.length > 0 && (
                        <div className="mt-4">
                          <h5 className="text-sm font-medium text-gray-700 mb-2">Measurements:</h5>
                          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                            {submission.measurements.map((measurement) => (
                              <div key={measurement.id} className="bg-gray-50 rounded-lg p-3">
                                <p className="text-xs text-gray-600 capitalize">{measurement.type.replace('_', ' ')}</p>
                                <p className="text-lg font-semibold text-gray-900">
                                  {measurement.value} {measurement.unit}
                                </p>
                              </div>
                            ))}
                          </div>
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Form Builder Modal */}
        {(showCreateForm || editingForm) && (
          <FormBuilder
            form={editingForm || undefined}
            coachId={coachId}
            onSave={handleSaveForm}
            onCancel={handleCancelForm}
          />
        )}
      </main>
    </div>
  );
}
