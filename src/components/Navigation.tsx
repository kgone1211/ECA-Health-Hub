'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useState, useEffect } from 'react';
import MobileNavigation from './MobileNavigation';

interface NavigationProps {
  isSettingsOpen: boolean;
  setIsSettingsOpen: (open: boolean) => void;
}

export default function Navigation({ isSettingsOpen, setIsSettingsOpen }: NavigationProps) {
  const pathname = usePathname();
  const [isDarkMode, setIsDarkMode] = useState(false);

  // Initialize dark mode on mount
  useEffect(() => {
    if (typeof window !== 'undefined') {
      const savedTheme = localStorage.getItem('app-theme');
      const shouldBeDark = savedTheme === 'dark';
      setIsDarkMode(shouldBeDark);
      
      // Apply theme immediately
      if (shouldBeDark) {
        document.documentElement.classList.add('dark');
        document.documentElement.style.setProperty('--bg-color', '#111827');
        document.documentElement.style.setProperty('--text-color', '#f9fafb');
      } else {
        document.documentElement.classList.remove('dark');
        document.documentElement.style.setProperty('--bg-color', '#f9fafb');
        document.documentElement.style.setProperty('--text-color', '#111827');
      }
    }
  }, []);

  // Toggle dark mode function
  const toggleDarkMode = () => {
    const newMode = !isDarkMode;
    setIsDarkMode(newMode);
    
    if (typeof window !== 'undefined') {
      localStorage.setItem('app-theme', newMode ? 'dark' : 'light');
      
      if (newMode) {
        document.documentElement.classList.add('dark');
        document.documentElement.style.setProperty('--bg-color', '#111827');
        document.documentElement.style.setProperty('--text-color', '#f9fafb');
      } else {
        document.documentElement.classList.remove('dark');
        document.documentElement.style.setProperty('--bg-color', '#f9fafb');
        document.documentElement.style.setProperty('--text-color', '#111827');
      }
    }
  };

  const navItems = [
    { href: '/', label: 'Dashboard' },
    { href: '/health-metrics', label: 'Health Metrics' },
    { href: '/macros', label: 'Macros' },
    { href: '/workouts', label: 'Workouts' },
    { href: '/journal', label: 'Journal' },
    { href: '/check-ins', label: 'Check-ins' },
    { href: '/gamification', label: 'Gamification' },
    { href: '/march-phase', label: 'M.A.R.C.H.' },
    { href: '/client-dashboard', label: 'Client View' },
  ];

  const isActive = (href: string) => {
    if (href === '/') {
      return pathname === '/';
    }
    return pathname.startsWith(href);
  };

  return (
    <nav className="bg-white dark:bg-gray-800 shadow-lg border-b border-gray-100 dark:border-gray-700 sticky top-0 z-50" style={{ backgroundColor: isDarkMode ? '#1f2937' : '#ffffff' }}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Logo and Brand */}
          <div className="flex items-center flex-shrink-0">
            <div className="flex items-center space-x-2">
              <div className="h-8 w-8 rounded-lg flex items-center justify-center shadow-sm" style={{ backgroundColor: 'var(--primary-color)' }}>
                <span className="text-white font-bold text-sm">E</span>
              </div>
            </div>
          </div>

          {/* Desktop Navigation */}
          <div className="hidden lg:flex lg:items-center lg:space-x-1 lg:flex-1 lg:justify-center">
            {navItems.map((item) => {
              const active = isActive(item.href);
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  className={`px-3 py-2 text-sm font-medium rounded-md transition-all duration-200 ${
                    active
                      ? 'text-white hover:bg-opacity-30'
                      : 'text-gray-600 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white hover:bg-gray-50 dark:hover:bg-gray-700'
                  }`}
                  style={active ? { backgroundColor: 'var(--primary-color)' } : {}}
                >
                  {item.label}
                </Link>
              );
            })}
          </div>

          {/* Mobile Navigation - Dropdown */}
          <div className="lg:hidden flex-1 mx-4">
            <MobileNavigation />
          </div>

          {/* User Info and Points */}
          <div className="flex items-center space-x-3 flex-shrink-0">
            <div className="hidden sm:flex items-center space-x-2 bg-yellow-50 dark:bg-yellow-900/20 px-3 py-1.5 rounded-full border border-yellow-200 dark:border-yellow-800">
              <div className="h-2 w-2 bg-yellow-500 dark:bg-yellow-400 rounded-full"></div>
              <span className="text-sm font-semibold text-yellow-800 dark:text-yellow-200">1,250 pts</span>
            </div>
            
            {/* Dark Mode Toggle */}
            <button 
              onClick={toggleDarkMode}
              className="p-2 text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition-colors"
              title={isDarkMode ? 'Switch to light mode' : 'Switch to dark mode'}
            >
              {isDarkMode ? (
                <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 3v1m0 16v1m9-9h-1M4 12H3m15.364 6.364l-.707-.707M6.343 6.343l-.707-.707m12.728 0l-.707.707M6.343 17.657l-.707.707M16 12a4 4 0 11-8 0 4 4 0 018 0z" />
                </svg>
              ) : (
                <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20.354 15.354A9 9 0 018.646 3.646 9.003 9.003 0 0012 21a9.003 9.003 0 008.354-5.646z" />
                </svg>
              )}
            </button>
            
            {/* Settings Button */}
            <button 
              onClick={() => setIsSettingsOpen(true)}
              className="p-2 text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition-colors"
            >
              <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
              </svg>
            </button>
            
                   <div className="h-9 w-9 rounded-full flex items-center justify-center shadow-sm" style={{ backgroundColor: 'var(--primary-color)' }}>
              <span className="text-white text-sm font-bold">JS</span>
            </div>
          </div>
        </div>
      </div>
    </nav>
  );
}
