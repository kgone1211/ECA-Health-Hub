'use client';

import React, { useState, useEffect } from 'react';
import { X, BarChart3, TrendingUp, TrendingDown, Calendar, Download } from 'lucide-react';
import { db } from '@/lib/database';
import { MacrosTarget, MacrosLog, User } from '@/types';

interface MacroReportsModalProps {
  isOpen: boolean;
  onClose: () => void;
  coachId: string;
}

export default function MacroReportsModal({ isOpen, onClose, coachId }: MacroReportsModalProps) {
  const [selectedClientId, setSelectedClientId] = useState('');
  const [selectedPeriod, setSelectedPeriod] = useState('7'); // days
  const [clients, setClients] = useState<User[]>([]);
  const [macrosTargets, setMacrosTargets] = useState<MacrosTarget[]>([]);
  const [macrosLogs, setMacrosLogs] = useState<MacrosLog[]>([]);

  useEffect(() => {
    if (isOpen) {
      const coachClients = db.getUsersByCoachId(coachId);
      const targets = db.getMacrosTargetsByCoach(coachId);
      setClients(coachClients);
      setMacrosTargets(targets);
      
      if (coachClients.length > 0) {
        setSelectedClientId(coachClients[0].id);
      }
    }
  }, [isOpen, coachId]);

  useEffect(() => {
    if (selectedClientId) {
      const logs = db.getMacrosLogsByClient(selectedClientId);
      setMacrosLogs(logs);
    }
  }, [selectedClientId]);

  const getClientTarget = () => {
    return macrosTargets.find(target => target.clientId === selectedClientId);
  };

  const getFilteredLogs = () => {
    const days = parseInt(selectedPeriod);
    const cutoffDate = new Date();
    cutoffDate.setDate(cutoffDate.getDate() - days);
    
    return macrosLogs.filter(log => log.date >= cutoffDate);
  };

  const calculateAverages = () => {
    const filteredLogs = getFilteredLogs();
    if (filteredLogs.length === 0) return null;

    const totals = filteredLogs.reduce((acc, log) => ({
      protein: acc.protein + log.protein,
      carbs: acc.carbs + log.carbs,
      fats: acc.fats + log.fats,
      calories: acc.calories + log.calories
    }), { protein: 0, carbs: 0, fats: 0, calories: 0 });

    return {
      protein: Math.round(totals.protein / filteredLogs.length),
      carbs: Math.round(totals.carbs / filteredLogs.length),
      fats: Math.round(totals.fats / filteredLogs.length),
      calories: Math.round(totals.calories / filteredLogs.length)
    };
  };

  const calculateCompliance = () => {
    const target = getClientTarget();
    const averages = calculateAverages();
    if (!target || !averages) return null;

    return {
      protein: Math.round((averages.protein / target.protein) * 100),
      carbs: Math.round((averages.carbs / target.carbs) * 100),
      fats: Math.round((averages.fats / target.fats) * 100),
      calories: Math.round((averages.calories / target.calories) * 100)
    };
  };

  const exportReport = () => {
    const target = getClientTarget();
    const averages = calculateAverages();
    const compliance = calculateCompliance();
    const filteredLogs = getFilteredLogs();
    const selectedClient = clients.find(c => c.id === selectedClientId);

    if (!target || !averages || !compliance || !selectedClient) return;

    const reportData = {
      client: selectedClient.name,
      period: `${selectedPeriod} days`,
      generatedAt: new Date().toISOString(),
      target: {
        protein: target.protein,
        carbs: target.carbs,
        fats: target.fats,
        calories: target.calories
      },
      averages: averages,
      compliance: compliance,
      dailyLogs: filteredLogs.map(log => ({
        date: log.date.toISOString().split('T')[0],
        protein: log.protein,
        carbs: log.carbs,
        fats: log.fats,
        calories: log.calories,
        notes: log.notes || ''
      }))
    };

    const dataStr = JSON.stringify(reportData, null, 2);
    const dataBlob = new Blob([dataStr], { type: 'application/json' });
    const url = URL.createObjectURL(dataBlob);
    
    const link = document.createElement('a');
    link.href = url;
    link.download = `macro-report-${selectedClient.name.replace(' ', '-')}-${selectedPeriod}days.json`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  };

  const handleBackdropClick = (e: React.MouseEvent) => {
    if (e.target === e.currentTarget) {
      onClose();
    }
  };

  if (!isOpen) return null;

  const target = getClientTarget();
  const averages = calculateAverages();
  const compliance = calculateCompliance();
  const filteredLogs = getFilteredLogs();
  const selectedClient = clients.find(c => c.id === selectedClientId);

  return (
    <div 
      className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4"
      onClick={handleBackdropClick}
    >
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-xl max-w-4xl w-full max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-gray-200 dark:border-gray-700">
          <div className="flex items-center space-x-2">
            <BarChart3 className="h-6 w-6 text-blue-500" />
            <h2 className="text-xl font-bold text-gray-900 dark:text-white">Macro Reports</h2>
          </div>
          <button
            onClick={onClose}
            className="p-2 text-gray-400 dark:text-gray-500 hover:text-gray-600 dark:hover:text-gray-300 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        {/* Content */}
        <div className="p-6 space-y-6">
          {/* Filters */}
          <div className="flex items-center space-x-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Client
              </label>
              <select
                value={selectedClientId}
                onChange={(e) => setSelectedClientId(e.target.value)}
                className="px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md text-gray-900 dark:text-white bg-white dark:bg-gray-700 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              >
                {clients.map((client) => (
                  <option key={client.id} value={client.id}>
                    {client.name}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Period
              </label>
              <select
                value={selectedPeriod}
                onChange={(e) => setSelectedPeriod(e.target.value)}
                className="px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md text-gray-900 dark:text-white bg-white dark:bg-gray-700 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              >
                <option value="7">Last 7 days</option>
                <option value="14">Last 14 days</option>
                <option value="30">Last 30 days</option>
                <option value="90">Last 90 days</option>
              </select>
            </div>

            <div className="flex-1"></div>

            <button
              onClick={exportReport}
              className="flex items-center px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors"
            >
              <Download className="h-4 w-4 mr-2" />
              Export Report
            </button>
          </div>

          {/* Summary Cards */}
          {target && averages && compliance && (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
              <div className="bg-white dark:bg-gray-700 rounded-lg border border-gray-200 dark:border-gray-600 p-4">
                <div className="flex items-center justify-between mb-2">
                  <h3 className="text-sm font-medium text-gray-600 dark:text-gray-400">Protein</h3>
                  <div className={`flex items-center ${compliance.protein >= 90 ? 'text-green-600' : compliance.protein >= 70 ? 'text-yellow-600' : 'text-red-600'}`}>
                    {compliance.protein >= 90 ? <TrendingUp className="h-4 w-4" /> : <TrendingDown className="h-4 w-4" />}
                  </div>
                </div>
                <div className="text-2xl font-bold text-gray-900 dark:text-white">{averages.protein}g</div>
                <div className="text-sm text-gray-500 dark:text-gray-400">
                  Target: {target.protein}g ({compliance.protein}%)
                </div>
              </div>

              <div className="bg-white dark:bg-gray-700 rounded-lg border border-gray-200 dark:border-gray-600 p-4">
                <div className="flex items-center justify-between mb-2">
                  <h3 className="text-sm font-medium text-gray-600 dark:text-gray-400">Carbs</h3>
                  <div className={`flex items-center ${compliance.carbs >= 90 ? 'text-green-600' : compliance.carbs >= 70 ? 'text-yellow-600' : 'text-red-600'}`}>
                    {compliance.carbs >= 90 ? <TrendingUp className="h-4 w-4" /> : <TrendingDown className="h-4 w-4" />}
                  </div>
                </div>
                <div className="text-2xl font-bold text-gray-900 dark:text-white">{averages.carbs}g</div>
                <div className="text-sm text-gray-500 dark:text-gray-400">
                  Target: {target.carbs}g ({compliance.carbs}%)
                </div>
              </div>

              <div className="bg-white dark:bg-gray-700 rounded-lg border border-gray-200 dark:border-gray-600 p-4">
                <div className="flex items-center justify-between mb-2">
                  <h3 className="text-sm font-medium text-gray-600 dark:text-gray-400">Fats</h3>
                  <div className={`flex items-center ${compliance.fats >= 90 ? 'text-green-600' : compliance.fats >= 70 ? 'text-yellow-600' : 'text-red-600'}`}>
                    {compliance.fats >= 90 ? <TrendingUp className="h-4 w-4" /> : <TrendingDown className="h-4 w-4" />}
                  </div>
                </div>
                <div className="text-2xl font-bold text-gray-900 dark:text-white">{averages.fats}g</div>
                <div className="text-sm text-gray-500 dark:text-gray-400">
                  Target: {target.fats}g ({compliance.fats}%)
                </div>
              </div>

              <div className="bg-white dark:bg-gray-700 rounded-lg border border-gray-200 dark:border-gray-600 p-4">
                <div className="flex items-center justify-between mb-2">
                  <h3 className="text-sm font-medium text-gray-600 dark:text-gray-400">Calories</h3>
                  <div className={`flex items-center ${compliance.calories >= 90 ? 'text-green-600' : compliance.calories >= 70 ? 'text-yellow-600' : 'text-red-600'}`}>
                    {compliance.calories >= 90 ? <TrendingUp className="h-4 w-4" /> : <TrendingDown className="h-4 w-4" />}
                  </div>
                </div>
                <div className="text-2xl font-bold text-gray-900 dark:text-white">{averages.calories}</div>
                <div className="text-sm text-gray-500 dark:text-gray-400">
                  Target: {target.calories} ({compliance.calories}%)
                </div>
              </div>
            </div>
          )}

          {/* Daily Logs Table */}
          <div className="bg-white dark:bg-gray-700 rounded-lg border border-gray-200 dark:border-gray-600">
            <div className="px-6 py-4 border-b border-gray-200 dark:border-gray-600">
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white">Daily Logs</h3>
              <p className="text-sm text-gray-600 dark:text-gray-400">
                {filteredLogs.length} entries for {selectedClient?.name} over the last {selectedPeriod} days
              </p>
            </div>
            
            {filteredLogs.length === 0 ? (
              <div className="p-8 text-center">
                <Calendar className="h-12 w-12 text-gray-400 dark:text-gray-600 mx-auto mb-4" />
                <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-2">No data available</h3>
                <p className="text-gray-600 dark:text-gray-400">
                  No macro logs found for the selected period. Start logging macros to see reports.
                </p>
              </div>
            ) : (
              <div className="overflow-x-auto">
                <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-600">
                  <thead className="bg-gray-50 dark:bg-gray-800">
                    <tr>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                        Date
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                        Protein (g)
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                        Carbs (g)
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                        Fats (g)
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                        Calories
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                        Notes
                      </th>
                    </tr>
                  </thead>
                  <tbody className="bg-white dark:bg-gray-700 divide-y divide-gray-200 dark:divide-gray-600">
                    {filteredLogs.map((log) => (
                      <tr key={log.id}>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 dark:text-white">
                          {log.date.toLocaleDateString()}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 dark:text-white">
                          {log.protein}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 dark:text-white">
                          {log.carbs}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 dark:text-white">
                          {log.fats}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 dark:text-white">
                          {log.calories}
                        </td>
                        <td className="px-6 py-4 text-sm text-gray-900 dark:text-white">
                          {log.notes || '-'}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

