'use client';

import { useState, useEffect } from 'react';
import ColorCustomizationModal, { AppColors } from './ColorCustomizationModal';

interface SettingsModalProps {
  isOpen: boolean;
  onClose: () => void;
}

interface Settings {
  notifications: boolean;
  emailUpdates: boolean;
}

export default function SettingsModal({ isOpen, onClose }: SettingsModalProps) {
  const [settings, setSettings] = useState<Settings>({
    notifications: true,
    emailUpdates: true,
  });
  const [showExportSuccess, setShowExportSuccess] = useState(false);
  const [isColorModalOpen, setIsColorModalOpen] = useState(false);
  const [colors, setColors] = useState<AppColors>({
    primary: '#3B82F6',
    secondary: '#6B7280',
    accent: '#10B981',
    background: '#F9FAFB',
    text: '#111827'
  });

  // Load settings from localStorage on mount
  useEffect(() => {
    if (typeof window !== 'undefined') {
      const savedSettings = localStorage.getItem('app-settings');
      if (savedSettings) {
        try {
          const parsedSettings = JSON.parse(savedSettings);
          // Only load non-theme settings
          setSettings({
            notifications: parsedSettings.notifications ?? true,
            emailUpdates: parsedSettings.emailUpdates ?? true,
          });
        } catch (error) {
          console.error('Failed to parse saved settings:', error);
        }
      }
      
      // Load colors
      const savedColors = localStorage.getItem('app-colors');
      if (savedColors) {
        try {
          const parsedColors = JSON.parse(savedColors);
          setColors(parsedColors);
        } catch (error) {
          console.error('Failed to parse saved colors:', error);
        }
      }
    }
  }, []);

  // Save settings to localStorage whenever they change
  useEffect(() => {
    if (typeof window !== 'undefined') {
      localStorage.setItem('app-settings', JSON.stringify(settings));
    }
  }, [settings]);

  // Save colors to localStorage whenever they change
  useEffect(() => {
    if (typeof window !== 'undefined') {
      localStorage.setItem('app-colors', JSON.stringify(colors));
      
      // Apply colors to CSS custom properties
      const root = document.documentElement;
      root.style.setProperty('--primary-color', colors.primary);
      root.style.setProperty('--secondary-color', colors.secondary);
      root.style.setProperty('--accent-color', colors.accent);
      root.style.setProperty('--bg-color', colors.background);
      root.style.setProperty('--text-color', colors.text);
    }
  }, [colors]);

  const toggleSetting = (key: keyof Settings) => {
    setSettings(prev => ({
      ...prev,
      [key]: !prev[key]
    }));
  };

  const handleExportData = () => {
    // Create a simple data export
    const exportData = {
      settings,
      exportDate: new Date().toISOString(),
      version: '2.0'
    };
    
    const dataStr = JSON.stringify(exportData, null, 2);
    const dataBlob = new Blob([dataStr], { type: 'application/json' });
    const url = URL.createObjectURL(dataBlob);
    
    const link = document.createElement('a');
    link.href = url;
    link.download = `eca-health-settings-${new Date().toISOString().split('T')[0]}.json`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
    
    // Show success message
    setShowExportSuccess(true);
    setTimeout(() => setShowExportSuccess(false), 3000);
  };

  const handleBackdropClick = (e: React.MouseEvent) => {
    if (e.target === e.currentTarget) {
      onClose();
    }
  };

  const handleColorSave = (newColors: AppColors) => {
    setColors(newColors);
    
    // Apply colors to CSS custom properties
    if (typeof window !== 'undefined') {
      const root = document.documentElement;
      root.style.setProperty('--primary-color', newColors.primary);
      root.style.setProperty('--secondary-color', newColors.secondary);
      root.style.setProperty('--accent-color', newColors.accent);
      root.style.setProperty('--bg-color', newColors.background);
      root.style.setProperty('--text-color', newColors.text);
    }
  };

  if (!isOpen) return null;

  return (
    <div 
      className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50"
      onClick={handleBackdropClick}
    >
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-xl max-w-md w-full mx-4">
        <div className="flex items-center justify-between p-6 border-b border-gray-200 dark:border-gray-700">
          <h2 className="text-xl font-semibold text-gray-900 dark:text-white">Settings</h2>
          <button
            onClick={onClose}
            className="text-gray-400 dark:text-gray-500 hover:text-gray-600 dark:hover:text-gray-300 transition-colors"
          >
            <svg className="h-6 w-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>
        
        <div className="p-6">
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-sm font-medium text-gray-900 dark:text-white">Notifications</h3>
                <p className="text-sm text-gray-500 dark:text-gray-400">Manage your notification preferences</p>
              </div>
              <button 
                onClick={() => toggleSetting('notifications')}
                className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
                  settings.notifications ? 'bg-blue-600' : 'bg-gray-200'
                }`}
              >
                <span className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                  settings.notifications ? 'translate-x-6' : 'translate-x-1'
                }`} />
              </button>
            </div>
            
            
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-sm font-medium text-gray-900 dark:text-white">Email Updates</h3>
                <p className="text-sm text-gray-500 dark:text-gray-400">Receive weekly progress reports</p>
              </div>
              <button 
                onClick={() => toggleSetting('emailUpdates')}
                className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
                  settings.emailUpdates ? 'bg-blue-600' : 'bg-gray-200'
                }`}
              >
                <span className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                  settings.emailUpdates ? 'translate-x-6' : 'translate-x-1'
                }`} />
              </button>
            </div>
          </div>
          
          <div className="mt-6 pt-6 border-t border-gray-200 dark:border-gray-700 space-y-3">
            <button 
              onClick={() => setIsColorModalOpen(true)}
              className="w-full px-4 py-2 text-sm font-medium text-gray-700 dark:text-gray-300 bg-blue-50 dark:bg-blue-900/20 hover:bg-blue-100 dark:hover:bg-blue-900/30 rounded-lg transition-colors"
            >
              🎨 Customize Colors
            </button>
            
            <button 
              onClick={handleExportData}
              className="w-full px-4 py-2 text-sm font-medium text-gray-700 dark:text-gray-300 bg-gray-100 dark:bg-gray-700 hover:bg-gray-200 dark:hover:bg-gray-600 rounded-lg transition-colors"
            >
              {showExportSuccess ? '✓ Settings Exported!' : 'Export Settings'}
            </button>
          </div>
        </div>
      </div>
      
      {/* Color Customization Modal */}
      <ColorCustomizationModal
        isOpen={isColorModalOpen}
        onClose={() => setIsColorModalOpen(false)}
        onSave={handleColorSave}
        currentColors={colors}
      />
    </div>
  );
}
