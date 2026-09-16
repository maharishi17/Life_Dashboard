'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { motion } from 'framer-motion';
import { Heart } from 'lucide-react';
import { useAuth } from '@/context/AuthContext';
import LoginPage from '@/components/LoginPage';

export default function Home() {
  const { isAuthenticated, isLoading } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!isLoading && isAuthenticated) {
      router.push('/dashboard');
    }
  }, [isAuthenticated, isLoading, router]);

  // Loading splash screen
  if (isLoading) {
    return (
      <div style={{
        minHeight: '100dvh',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        background: 'var(--bg-primary)',
        gap: '20px',
      }}>
        <motion.div
          animate={{
            scale: [1, 1.15, 1],
            rotate: [0, 5, -5, 0],
          }}
          transition={{ repeat: Infinity, duration: 2, ease: 'easeInOut' }}
          style={{
            width: '80px', height: '80px', borderRadius: '50%',
            background: 'var(--gradient-hero)',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            boxShadow: '0 8px 40px rgba(91,106,240,0.5)',
          }}
        >
          <Heart size={36} color="#fff" fill="#fff" />
        </motion.div>

        <motion.div
          animate={{ opacity: [0.4, 1, 0.4] }}
          transition={{ repeat: Infinity, duration: 1.5 }}
          style={{ color: 'var(--text-muted)', fontSize: '0.85rem', fontWeight: 500 }}
        >
          Loading your dashboard...
        </motion.div>
      </div>
    );
  }

  // If already authenticated, show nothing (redirect is in progress)
  if (isAuthenticated) return null;

  // Not authenticated — show login
  return <LoginPage />;
}
