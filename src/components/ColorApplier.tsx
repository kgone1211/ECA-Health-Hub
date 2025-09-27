'use client';

import { useEffect } from 'react';
import { AppColors } from './ColorCustomizationModal';

export default function ColorApplier() {
  useEffect(() => {
    // Apply saved colors on app load
    if (typeof window !== 'undefined') {
      const savedColors = localStorage.getItem('app-colors');
      if (savedColors) {
        try {
          const colors: AppColors = JSON.parse(savedColors);
          const root = document.documentElement;
          
          root.style.setProperty('--primary-color', colors.primary);
          root.style.setProperty('--secondary-color', colors.secondary);
          root.style.setProperty('--accent-color', colors.accent);
          root.style.setProperty('--bg-color', colors.background);
          root.style.setProperty('--text-color', colors.text);
        } catch (error) {
          console.error('Failed to apply saved colors:', error);
        }
      }
    }
  }, []);

  return null; // This component doesn't render anything
}

