import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import './globals.css';
import { Toaster } from 'react-hot-toast';
import { AuthProvider } from '@/contexts/AuthContext';
import favicon from '../../public/favicon.png'

const inter = Inter({ subsets: ['latin'] });

export const metadata: Metadata = {
  title: 'Techtyrone - Create Stunning Websites with AI',
  description: 'Build professional websites in minutes with our AI-powered website builder',
  icons: {
    icon: favicon.src || favicon,
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={inter.className}>
        <AuthProvider>
          {children}
          <Toaster
            position="top-right"
            toastOptions={{
              duration: 4000,
              style: {
                background: '#000000',
                color: '#FFDEDE',
                border: '1px solid #CF0F47',
              },
            }}
          />
        </AuthProvider>
      </body>
    </html>
  );
}