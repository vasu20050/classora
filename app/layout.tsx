import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import './globals.css';
import { AuthProvider } from '@/contexts/AuthContext';
import { Toaster } from 'sonner';

const inter = Inter({
  subsets: ['latin'],
  variable: '--font-inter',
  display: 'swap',
});

export const metadata: Metadata = {
  title: {
    default: 'Classora — Modern Learning Platform',
    template: '%s | Classora',
  },
  description:
    'Classora is a modern, lightweight education platform for college students and mentors. Create classes, post assignments, and track progress — all in one place.',
  keywords: ['education', 'classroom', 'learning', 'assignments', 'students', 'teachers'],
  openGraph: {
    title: 'Classora — Modern Learning Platform',
    description: 'Connect, learn, and grow with Classora.',
    type: 'website',
  },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={`${inter.variable} font-sans antialiased`}>
        <AuthProvider>
          {children}
          <Toaster
            position="top-right"
            richColors
            closeButton
            toastOptions={{
              style: {
                borderRadius: '12px',
                fontSize: '14px',
              },
            }}
          />
        </AuthProvider>
      </body>
    </html>
  );
}
