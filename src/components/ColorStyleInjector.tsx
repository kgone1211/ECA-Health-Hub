'use client';

import { useEffect } from 'react';
import { useColors } from '@/contexts/ColorContext';

export default function ColorStyleInjector() {
  const { colors } = useColors();

  useEffect(() => {
    if (typeof window === 'undefined') return;
    
    // Create or update the dynamic style element
    let styleElement = document.getElementById('dynamic-colors') as HTMLStyleElement;
    
    if (!styleElement) {
      styleElement = document.createElement('style');
      styleElement.id = 'dynamic-colors';
      document.head.appendChild(styleElement);
    }

    // Generate CSS custom properties
    const css = `
      :root {
        --color-primary: ${colors.primary};
        --color-secondary: ${colors.secondary};
        --color-accent: ${colors.accent};
        --color-background: ${colors.background};
        --color-text: ${colors.text};
      }

      /* Apply colors to specific elements */
      .dynamic-primary {
        background-color: var(--color-primary) !important;
        color: white !important;
      }

      .dynamic-primary-text {
        color: var(--color-primary) !important;
      }

      .dynamic-accent {
        background-color: var(--color-accent) !important;
        color: white !important;
      }

      .dynamic-accent-text {
        color: var(--color-accent) !important;
      }

      .dynamic-secondary {
        background-color: var(--color-secondary) !important;
        color: white !important;
      }

      .dynamic-secondary-text {
        color: var(--color-secondary) !important;
      }

      /* Override specific Tailwind classes */
      .bg-blue-600 {
        background-color: var(--color-primary) !important;
      }

      .text-blue-600 {
        color: var(--color-primary) !important;
      }

      .border-blue-500 {
        border-color: var(--color-primary) !important;
      }

      .hover\\:text-blue-600:hover {
        color: var(--color-primary) !important;
      }

      .hover\\:bg-blue-700:hover {
        background-color: var(--color-primary) !important;
        opacity: 0.9;
      }

      .bg-emerald-500 {
        background-color: var(--color-accent) !important;
      }

      .text-emerald-500 {
        color: var(--color-accent) !important;
      }

      /* Apply to buttons */
      button.bg-blue-600 {
        background-color: var(--color-primary) !important;
      }

      button.bg-blue-600:hover {
        background-color: var(--color-primary) !important;
        opacity: 0.9;
      }

      /* Apply to navigation */
      .nav-link-active {
        color: var(--color-primary) !important;
        border-color: var(--color-primary) !important;
      }

      /* Apply to progress bars */
      .progress-bar {
        background-color: var(--color-primary) !important;
      }

      /* Apply to M.A.R.C.H. phase indicators */
      .march-phase-primary {
        background-color: var(--color-primary) !important;
        color: white !important;
      }

      .march-phase-accent {
        background-color: var(--color-accent) !important;
        color: white !important;
      }
    `;

    styleElement.textContent = css;
  }, [colors]);

  return null; // This component doesn't render anything
}
