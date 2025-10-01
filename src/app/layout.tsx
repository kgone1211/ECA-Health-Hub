'use client';

import type { Metadata } from 'next'
import { Inter } from 'next/font/google'
import { useState, useEffect } from 'react'
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
  const [userName, setUserName] = useState<string>('');
  const [userEmail, setUserEmail] = useState<string>('');

  useEffect(() => {
    // TODO: Get from auth context/session
    // For now, use placeholder or localStorage
    const storedUser = localStorage.getItem('user_name') || 'Coach';
    const storedEmail = localStorage.getItem('user_email') || '';
    setUserName(storedUser);
    setUserEmail(storedEmail);
  }, []);

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
              userName={userName}
              userEmail={userEmail}
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
