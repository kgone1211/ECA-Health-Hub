'use client';

import React, { useState, useEffect } from 'react';
import { X, Palette, Check } from 'lucide-react';

interface ColorCustomizationModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (colors: AppColors) => void;
  currentColors: AppColors;
}

export interface AppColors {
  primary: string;
  secondary: string;
  accent: string;
  background: string;
  text: string;
}

const predefinedColorSchemes: Record<string, AppColors> = {
  default: {
    primary: '#3B82F6', // blue-600
    secondary: '#6B7280', // gray-500
    accent: '#10B981', // emerald-500
    background: '#F9FAFB', // gray-50
    text: '#111827' // gray-900
  },
  ocean: {
    primary: '#0EA5E9', // sky-500
    secondary: '#64748B', // slate-500
    accent: '#06B6D4', // cyan-500
    background: '#F0F9FF', // sky-50
    text: '#0F172A' // slate-900
  },
  forest: {
    primary: '#059669', // emerald-600
    secondary: '#6B7280', // gray-500
    accent: '#10B981', // emerald-500
    background: '#F0FDF4', // green-50
    text: '#064E3B' // emerald-900
  },
  sunset: {
    primary: '#F59E0B', // amber-500
    secondary: '#6B7280', // gray-500
    accent: '#EF4444', // red-500
    background: '#FFFBEB', // amber-50
    text: '#92400E' // amber-900
  },
  purple: {
    primary: '#8B5CF6', // violet-500
    secondary: '#6B7280', // gray-500
    accent: '#A855F7', // purple-500
    background: '#FAF5FF', // violet-50
    text: '#581C87' // purple-900
  },
  rose: {
    primary: '#F43F5E', // rose-500
    secondary: '#6B7280', // gray-500
    accent: '#EC4899', // pink-500
    background: '#FFF1F2', // rose-50
    text: '#881337' // rose-900
  }
};

export default function ColorCustomizationModal({ 
  isOpen, 
  onClose, 
  onSave, 
  currentColors 
}: ColorCustomizationModalProps) {
  const [selectedScheme, setSelectedScheme] = useState<string>('default');
  const [customColors, setCustomColors] = useState<AppColors>(currentColors);
  const [isCustom, setIsCustom] = useState(false);

  useEffect(() => {
    if (isOpen) {
      setCustomColors(currentColors);
      // Check if current colors match any predefined scheme
      const matchingScheme = Object.entries(predefinedColorSchemes).find(
        ([_, scheme]) => JSON.stringify(scheme) === JSON.stringify(currentColors)
      );
      if (matchingScheme) {
        setSelectedScheme(matchingScheme[0]);
        setIsCustom(false);
      } else {
        setIsCustom(true);
      }
    }
  }, [isOpen, currentColors]);

  const handleSchemeSelect = (schemeName: string) => {
    setSelectedScheme(schemeName);
    setIsCustom(false);
    setCustomColors(predefinedColorSchemes[schemeName]);
  };

  const handleCustomColorChange = (colorKey: keyof AppColors, value: string) => {
    setCustomColors(prev => ({
      ...prev,
      [colorKey]: value
    }));
  };

  const handleSave = () => {
    onSave(customColors);
    onClose();
  };

  const handleReset = () => {
    setCustomColors(predefinedColorSchemes.default);
    setSelectedScheme('default');
    setIsCustom(false);
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg shadow-xl max-w-2xl w-full mx-4 max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-gray-200">
          <div className="flex items-center space-x-2">
            <Palette className="h-6 w-6 text-gray-600" />
            <h2 className="text-xl font-bold text-gray-900">Color Customization</h2>
          </div>
          <button
            onClick={onClose}
            className="p-2 text-gray-400 hover:text-gray-600 rounded-lg hover:bg-gray-100"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        {/* Content */}
        <div className="p-6 space-y-6">
          {/* Predefined Schemes */}
          <div>
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Choose a Color Scheme</h3>
            <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
              {Object.entries(predefinedColorSchemes).map(([name, scheme]) => (
                <button
                  key={name}
                  onClick={() => handleSchemeSelect(name)}
                  className={`p-4 rounded-lg border-2 transition-all ${
                    selectedScheme === name && !isCustom
                      ? 'border-blue-500 bg-blue-50'
                      : 'border-gray-200 hover:border-gray-300'
                  }`}
                >
                  <div className="flex items-center space-x-2 mb-2">
                    <div className="flex space-x-1">
                      <div 
                        className="w-4 h-4 rounded-full" 
                        style={{ backgroundColor: scheme.primary }}
                      ></div>
                      <div 
                        className="w-4 h-4 rounded-full" 
                        style={{ backgroundColor: scheme.secondary }}
                      ></div>
                      <div 
                        className="w-4 h-4 rounded-full" 
                        style={{ backgroundColor: scheme.accent }}
                      ></div>
                    </div>
                    {selectedScheme === name && !isCustom && (
                      <Check className="h-4 w-4 text-blue-600" />
                    )}
                  </div>
                  <div className="text-sm font-medium text-gray-900 capitalize">
                    {name}
                  </div>
                </button>
              ))}
            </div>
          </div>

          {/* Custom Colors */}
          <div>
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold text-gray-900">Custom Colors</h3>
              <button
                onClick={() => setIsCustom(true)}
                className={`px-3 py-1 rounded-lg text-sm font-medium transition-colors ${
                  isCustom
                    ? 'bg-blue-100 text-blue-700'
                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                }`}
              >
                Customize
              </button>
            </div>

            {isCustom && (
              <div className="space-y-4">
                {Object.entries(customColors).map(([key, value]) => (
                  <div key={key} className="flex items-center space-x-4">
                    <label className="w-24 text-sm font-medium text-gray-700 capitalize">
                      {key}:
                    </label>
                    <div className="flex items-center space-x-2 flex-1">
                      <input
                        type="color"
                        value={value}
                        onChange={(e) => handleCustomColorChange(key as keyof AppColors, e.target.value)}
                        className="w-12 h-8 rounded border border-gray-300 cursor-pointer"
                      />
                      <input
                        type="text"
                        value={value}
                        onChange={(e) => handleCustomColorChange(key as keyof AppColors, e.target.value)}
                        className="flex-1 px-3 py-1 border border-gray-300 rounded-md text-sm"
                        placeholder="#000000"
                      />
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Preview */}
          <div>
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Preview</h3>
            <div 
              className="p-6 rounded-lg border"
              style={{ 
                backgroundColor: customColors.background,
                color: customColors.text 
              }}
            >
              <div className="space-y-4">
                <div className="flex items-center space-x-2">
                  <div 
                    className="w-8 h-8 rounded-full flex items-center justify-center text-white text-sm font-medium"
                    style={{ backgroundColor: customColors.primary }}
                  >
                    JS
                  </div>
                  <div>
                    <div className="font-semibold">John Smith</div>
                    <div className="text-sm opacity-75">Coach</div>
                  </div>
                </div>
                <div className="flex space-x-2">
                  <button 
                    className="px-4 py-2 rounded-lg text-white text-sm font-medium"
                    style={{ backgroundColor: customColors.primary }}
                  >
                    Primary Button
                  </button>
                  <button 
                    className="px-4 py-2 rounded-lg text-white text-sm font-medium"
                    style={{ backgroundColor: customColors.accent }}
                  >
                    Accent Button
                  </button>
                </div>
                <div className="text-sm opacity-75">
                  This is how your app will look with these colors.
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="flex items-center justify-between p-6 border-t border-gray-200">
          <button
            onClick={handleReset}
            className="px-4 py-2 text-gray-600 hover:text-gray-800 font-medium"
          >
            Reset to Default
          </button>
          <div className="flex space-x-3">
            <button
              onClick={onClose}
              className="px-4 py-2 text-gray-600 hover:text-gray-800 font-medium"
            >
              Cancel
            </button>
            <button
              onClick={handleSave}
              className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 font-medium transition-colors"
            >
              Save Colors
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

