'use client';

import type { Metadata } from 'next'
import { Inter } from 'next/font/google'
import { useState } from 'react'
import Navigation from '@/components/Navigation'
import SettingsModal from '@/components/SettingsModal'
import ColorApplier from '@/components/ColorApplier'
import { ThemeProvider } from '@/contexts/ThemeContext'
import './globals.css'

const inter = Inter({ subsets: ['latin'] })

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const [isSettingsOpen, setIsSettingsOpen] = useState(false);
  return (
    <html lang="en">
      <head>
        <script
          dangerouslySetInnerHTML={{
            __html: `
              try {
                if (localStorage.getItem('app-theme') === 'dark') {
                  document.documentElement.classList.add('dark');
                }
              } catch (e) {}
            `,
          }}
        />
      </head>
      <body className={inter.className}>
        <ThemeProvider>
          <ColorApplier />
          <div className="min-h-screen" style={{ backgroundColor: 'var(--bg-color, #f9fafb)', color: 'var(--text-color, #111827)' }}>
            {/* Navigation */}
            <Navigation 
              isSettingsOpen={isSettingsOpen} 
              setIsSettingsOpen={setIsSettingsOpen} 
            />
          
            {/* Main Content */}
            <main>
              {children}
            </main>
            
            {/* Settings Modal */}
            <SettingsModal 
              isOpen={isSettingsOpen} 
              onClose={() => setIsSettingsOpen(false)} 
            />
          </div>
        </ThemeProvider>
      </body>
    </html>
  )
}
