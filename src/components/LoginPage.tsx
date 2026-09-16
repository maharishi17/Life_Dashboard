'use client';

import { useState, useEffect, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Delete, Heart } from 'lucide-react';
import { useAuth } from '@/context/AuthContext';
import { useTheme } from '@/context/ThemeContext';

const PIN_LENGTH = 6;

const KEYPAD = [
  ['1', '2', '3'],
  ['4', '5', '6'],
  ['7', '8', '9'],
  ['', '0', 'del'],
];

export default function LoginPage() {
  const { login } = useAuth();
  const { theme, toggleTheme } = useTheme();
  const [pin, setPin] = useState('');
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [shake, setShake] = useState(false);

  const handleSubmit = useCallback(async (currentPin: string) => {
    if (currentPin.length !== PIN_LENGTH) return;
    setIsLoading(true);
    setError('');

    const result = await login(currentPin);
    if (!result.success) {
      setIsLoading(false);
      setError(result.error || 'Wrong PIN. Try again.');
      setShake(true);
      setTimeout(() => {
        setShake(false);
        setPin('');
      }, 600);
    }
    // On success, AuthContext triggers redirect via parent component
  }, [login]);

  const handleKey = useCallback((key: string) => {
    if (isLoading) return;
    setError('');

    if (key === 'del') {
      setPin((p) => p.slice(0, -1));
      return;
    }
    if (pin.length >= PIN_LENGTH) return;

    const newPin = pin + key;
    setPin(newPin);

    if (newPin.length === PIN_LENGTH) {
      handleSubmit(newPin);
    }
  }, [isLoading, pin, handleSubmit]);

  // Physical keyboard support
  useEffect(() => {
    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key >= '0' && e.key <= '9') handleKey(e.key);
      if (e.key === 'Backspace') handleKey('del');
    };
    window.addEventListener('keydown', onKeyDown);
    return () => window.removeEventListener('keydown', onKeyDown);
  }, [handleKey]);

  return (
    <div
      style={{
        minHeight: '100dvh',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        background: 'var(--bg-primary)',
        position: 'relative',
        overflow: 'hidden',
        padding: '24px',
      }}
    >
      {/* Background glow orbs */}
      <div style={{
        position: 'absolute', top: '-20%', left: '-10%',
        width: '500px', height: '500px', borderRadius: '50%',
        background: 'radial-gradient(circle, rgba(91,106,240,0.15) 0%, transparent 70%)',
        pointerEvents: 'none',
      }} />
      <div style={{
        position: 'absolute', bottom: '-20%', right: '-10%',
        width: '400px', height: '400px', borderRadius: '50%',
        background: 'radial-gradient(circle, rgba(155,89,255,0.12) 0%, transparent 70%)',
        pointerEvents: 'none',
      }} />

      {/* Theme toggle */}
      <button
        onClick={toggleTheme}
        className="btn-icon"
        style={{ position: 'absolute', top: '20px', right: '20px', cursor: 'pointer' }}
        aria-label="Toggle theme"
        id="theme-toggle-btn"
      >
        {theme === 'dark' ? '☀️' : '🌙'}
      </button>

      {/* Card */}
      <motion.div
        initial={{ opacity: 0, y: 30, scale: 0.95 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        transition={{ duration: 0.5, ease: [0.34, 1.56, 0.64, 1] }}
        style={{ width: '100%', maxWidth: '360px' }}
      >
        <div className="card" style={{ padding: '40px 32px', textAlign: 'center' }}>

          {/* Logo / Heart */}
          <motion.div
            className="float"
            style={{
              width: '72px', height: '72px', borderRadius: '50%',
              background: 'var(--gradient-hero)',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              margin: '0 auto 24px',
              boxShadow: '0 8px 32px rgba(91,106,240,0.4)',
            }}
          >
            <Heart size={32} color="#fff" fill="#fff" />
          </motion.div>

          <h1 style={{
            fontSize: '1.6rem', fontWeight: 800,
            marginBottom: '4px', color: 'var(--text-primary)'
          }}>
            Welcome Back 💫
          </h1>
          <p style={{ fontSize: '0.9rem', color: 'var(--text-muted)', marginBottom: '32px' }}>
            Enter your PIN to access your dashboard
          </p>

          {/* PIN Dots */}
          <motion.div
            animate={shake ? { x: [-10, 10, -8, 8, -4, 4, 0] } : { x: 0 }}
            transition={{ duration: 0.5 }}
            style={{
              display: 'flex', justifyContent: 'center', gap: '14px',
              marginBottom: '8px',
            }}
            aria-label="PIN input display"
          >
            {Array.from({ length: PIN_LENGTH }).map((_, i) => (
              <motion.div
                key={i}
                className={`pin-dot ${i < pin.length ? 'filled' : ''}`}
                animate={i < pin.length ? { scale: [1, 1.2, 1] } : { scale: 1 }}
                transition={{ duration: 0.15 }}
              />
            ))}
          </motion.div>

          {/* Error message */}
          <AnimatePresence>
            {error && (
              <motion.p
                key="error"
                initial={{ opacity: 0, y: -5 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0 }}
                style={{
                  color: 'var(--accent-2)', fontSize: '0.8rem',
                  fontWeight: 500, marginBottom: '16px', marginTop: '8px',
                }}
              >
                {error}
              </motion.p>
            )}
          </AnimatePresence>

          {!error && <div style={{ height: '32px' }} />}

          {/* Keypad */}
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '10px' }}>
            {KEYPAD.flat().map((key, idx) => {
              if (!key) return <div key={idx} />;

              const isDel = key === 'del';
              return (
                <motion.button
                  key={key}
                  id={`pin-key-${key}`}
                  onClick={() => handleKey(key)}
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.93 }}
                  disabled={isLoading}
                  style={{
                    height: '64px',
                    borderRadius: 'var(--radius-md)',
                    border: '1px solid var(--border)',
                    background: isDel ? 'var(--bg-card-hover)' : 'var(--bg-input)',
                    color: 'var(--text-primary)',
                    fontSize: isDel ? '1rem' : '1.4rem',
                    fontWeight: 600,
                    cursor: 'pointer',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    transition: 'all 0.15s ease',
                    outline: 'none',
                  }}
                  aria-label={isDel ? 'Delete' : key}
                >
                  {isDel ? <Delete size={20} style={{ color: 'var(--text-secondary)' }} /> : key}
                </motion.button>
              );
            })}
          </div>

          {/* Loading state */}
          <AnimatePresence>
            {isLoading && (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                style={{
                  marginTop: '20px',
                  display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px',
                  color: 'var(--text-muted)', fontSize: '0.85rem',
                }}
              >
                <motion.div
                  animate={{ rotate: 360 }}
                  transition={{ repeat: Infinity, duration: 0.8, ease: 'linear' }}
                  style={{
                    width: '16px', height: '16px', borderRadius: '50%',
                    border: '2px solid var(--accent-1)',
                    borderTopColor: 'transparent',
                  }}
                />
                Verifying...
              </motion.div>
            )}
          </AnimatePresence>

        </div>

        <p style={{
          textAlign: 'center', marginTop: '20px',
          fontSize: '0.78rem', color: 'var(--text-muted)',
        }}>
          🔒 Private & Secure — Only you two have access
        </p>
      </motion.div>
    </div>
  );
}
