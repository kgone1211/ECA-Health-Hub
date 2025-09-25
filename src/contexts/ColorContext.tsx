'use client';

import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { AppColors } from '@/components/ColorCustomizationModal';

interface ColorContextType {
  colors: AppColors;
  updateColors: (newColors: AppColors) => void;
  resetColors: () => void;
}

const defaultColors: AppColors = {
  primary: '#3B82F6', // blue-600
  secondary: '#6B7280', // gray-500
  accent: '#10B981', // emerald-500
  background: '#F9FAFB', // gray-50
  text: '#111827' // gray-900
};

const ColorContext = createContext<ColorContextType | undefined>(undefined);

export function ColorProvider({ children }: { children: ReactNode }) {
  const [colors, setColors] = useState<AppColors>(defaultColors);

  // Load colors from localStorage on mount
  useEffect(() => {
    if (typeof window !== 'undefined') {
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

  // Save colors to localStorage whenever they change
  useEffect(() => {
    if (typeof window !== 'undefined') {
      localStorage.setItem('app-colors', JSON.stringify(colors));
    }
  }, [colors]);

  const updateColors = (newColors: AppColors) => {
    setColors(newColors);
  };

  const resetColors = () => {
    setColors(defaultColors);
  };

  return (
    <ColorContext.Provider value={{ colors, updateColors, resetColors }}>
      {children}
    </ColorContext.Provider>
  );
}

export function useColors() {
  const context = useContext(ColorContext);
  if (context === undefined) {
    throw new Error('useColors must be used within a ColorProvider');
  }
  return context;
}
