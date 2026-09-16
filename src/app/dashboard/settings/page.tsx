'use client';

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Settings, User, Lock, MapPin, Moon, Sun,
  CheckCircle, AlertCircle, LogOut, Database,
  ChevronRight, Edit3, Eye, EyeOff
} from 'lucide-react';
import { useAuth } from '@/context/AuthContext';
import { useTheme } from '@/context/ThemeContext';

interface ProfileData {
  name: string;
  location: string;
}

function Toast({ message, type }: { message: string; type: 'success' | 'error' }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: -20, scale: 0.95 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      exit={{ opacity: 0, y: -20, scale: 0.95 }}
      style={{
        position: 'fixed', top: '20px', left: '50%', transform: 'translateX(-50%)',
        zIndex: 200, padding: '12px 20px', borderRadius: 'var(--radius-full)',
        background: type === 'success' ? 'var(--gradient-success)' : 'var(--gradient-danger)',
        color: '#fff', fontWeight: 600, fontSize: '0.875rem',
        display: 'flex', alignItems: 'center', gap: '8px',
        boxShadow: 'var(--shadow-lg)', whiteSpace: 'nowrap',
      }}
    >
      {type === 'success' ? <CheckCircle size={16} /> : <AlertCircle size={16} />}
      {message}
    </motion.div>
  );
}

function SectionCard({ title, icon: Icon, children }: { title: string; icon: React.ElementType; children: React.ReactNode }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      className="card"
      style={{ padding: '24px', marginBottom: '16px' }}
    >
      <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '20px' }}>
        <div style={{
          width: '36px', height: '36px', borderRadius: '10px',
          background: 'var(--accent-1-light)', display: 'flex',
          alignItems: 'center', justifyContent: 'center',
        }}>
          <Icon size={18} style={{ color: 'var(--accent-1)' }} />
        </div>
        <h2 style={{ fontWeight: 700, fontSize: '1rem', color: 'var(--text-primary)' }}>{title}</h2>
      </div>
      {children}
    </motion.div>
  );
}

export default function SettingsPage() {
  const { user, logout } = useAuth();
  const { theme, toggleTheme } = useTheme();

  const [toast, setToast] = useState<{ message: string; type: 'success' | 'error' } | null>(null);
  const [profileLoading, setProfileLoading] = useState(false);
  const [pinLoading, setPinLoading] = useState(false);

  // Profile form
  const [profile, setProfile] = useState<ProfileData>({ name: user?.name || '', location: user?.location || '' });

  // PIN form
  const [currentPin, setCurrentPin] = useState('');
  const [newPin, setNewPin] = useState('');
  const [confirmPin, setConfirmPin] = useState('');
  const [showPins, setShowPins] = useState(false);

  useEffect(() => {
    if (user) setProfile({ name: user.name, location: user.location });
  }, [user]);

  const showToast = (message: string, type: 'success' | 'error') => {
    setToast({ message, type });
    setTimeout(() => setToast(null), 3000);
  };

  const handleProfileSave = async () => {
    if (!profile.name.trim()) { showToast('Name cannot be empty', 'error'); return; }
    setProfileLoading(true);
    try {
      const res = await fetch('/api/user/profile', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name: profile.name, location: profile.location }),
      });
      const data = await res.json();
      if (res.ok) {
        showToast('✅ Profile updated!', 'success');
      } else {
        showToast(data.error || 'Update failed', 'error');
      }
    } catch {
      showToast('Connection error', 'error');
    } finally {
      setProfileLoading(false);
    }
  };

  const handlePinChange = async () => {
    if (!currentPin) { showToast('Enter your current PIN', 'error'); return; }
    if (newPin.length < 4) { showToast('New PIN must be at least 4 digits', 'error'); return; }
    if (newPin !== confirmPin) { showToast('New PINs do not match', 'error'); return; }
    if (newPin === currentPin) { showToast('New PIN must be different', 'error'); return; }

    setPinLoading(true);
    try {
      const res = await fetch('/api/user/profile', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ currentPin, newPin }),
      });
      const data = await res.json();
      if (res.ok) {
        showToast('🔐 PIN changed successfully!', 'success');
        setCurrentPin(''); setNewPin(''); setConfirmPin('');
      } else {
        showToast(data.error || 'PIN change failed', 'error');
      }
    } catch {
      showToast('Connection error', 'error');
    } finally {
      setPinLoading(false);
    }
  };

  const inputStyle = {
    width: '100%', padding: '12px 16px',
    background: 'var(--bg-input)', border: '1.5px solid var(--border)',
    borderRadius: 'var(--radius-md)', color: 'var(--text-primary)',
    fontSize: '0.95rem', fontFamily: 'Inter, sans-serif',
    outline: 'none', boxSizing: 'border-box' as const,
  };

  const labelStyle = {
    fontSize: '0.78rem', fontWeight: 600, color: 'var(--text-muted)',
    textTransform: 'uppercase' as const, letterSpacing: '0.08em',
    marginBottom: '6px', display: 'block',
  };

  return (
    <div className="container-app">
      {/* Toast */}
      <AnimatePresence>
        {toast && <Toast key="toast" message={toast.message} type={toast.type} />}
      </AnimatePresence>

      {/* Header */}
      <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }}
        style={{ display: 'flex', alignItems: 'center', gap: '14px', marginBottom: '28px' }}>
        <div style={{
          width: '48px', height: '48px', borderRadius: '14px',
          background: 'var(--gradient-warning)', display: 'flex',
          alignItems: 'center', justifyContent: 'center',
          boxShadow: '0 4px 16px rgba(245,166,35,0.4)',
        }}>
          <Settings size={22} color="#fff" />
        </div>
        <div>
          <h1 style={{ fontSize: '1.5rem', fontWeight: 800, color: 'var(--text-primary)' }}>Settings</h1>
          <p style={{ fontSize: '0.85rem', color: 'var(--text-muted)' }}>Manage your profile & preferences</p>
        </div>
      </motion.div>

      {/* Who you are */}
      <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }}
        className="card"
        style={{
          padding: '20px', marginBottom: '16px',
          background: 'var(--gradient-hero)', border: 'none',
        }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
          <div className="avatar" style={{ width: '52px', height: '52px', fontSize: '1.1rem', background: 'rgba(255,255,255,0.2)' }}>
            {user?.name?.split(' ').map(n => n[0]).join('').slice(0, 2).toUpperCase()}
          </div>
          <div>
            <p style={{ color: '#fff', fontWeight: 800, fontSize: '1.1rem' }}>{user?.name}</p>
            <p style={{ color: 'rgba(255,255,255,0.75)', fontSize: '0.82rem' }}>
              📍 {user?.location} · {user?.role === 'PRIMARY' ? 'Primary Account' : 'Partner Account'} · {user?.currency}
            </p>
          </div>
        </div>
      </motion.div>

      {/* Profile section */}
      <SectionCard title="Edit Profile" icon={User}>
        <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
          <div>
            <label style={labelStyle}>Your Name</label>
            <input
              id="settings-name"
              style={inputStyle}
              value={profile.name}
              onChange={e => setProfile(p => ({ ...p, name: e.target.value }))}
              placeholder="Your name"
            />
          </div>
          <div>
            <label style={labelStyle}><MapPin size={11} style={{ display: 'inline', marginRight: '4px' }} />Location</label>
            <input
              id="settings-location"
              style={inputStyle}
              value={profile.location}
              onChange={e => setProfile(p => ({ ...p, location: e.target.value }))}
              placeholder="City, Country"
            />
          </div>
          <button
            id="save-profile-btn"
            onClick={handleProfileSave}
            disabled={profileLoading}
            className="btn btn-primary"
            style={{ alignSelf: 'flex-start' }}
          >
            {profileLoading ? '⏳ Saving...' : '💾 Save Profile'}
          </button>
        </div>
      </SectionCard>

      {/* Change PIN section */}
      <SectionCard title="Change PIN" icon={Lock}>
        <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '4px' }}>
            <p style={{ fontSize: '0.82rem', color: 'var(--text-muted)' }}>Your PIN is stored securely (bcrypt encrypted)</p>
            <button
              onClick={() => setShowPins(!showPins)}
              style={{ background: 'none', border: 'none', cursor: 'pointer', color: 'var(--text-muted)' }}
            >
              {showPins ? <EyeOff size={16} /> : <Eye size={16} />}
            </button>
          </div>
          {(['currentPin', 'newPin', 'confirmPin'] as const).map((field) => {
            const labels = { currentPin: 'Current PIN', newPin: 'New PIN', confirmPin: 'Confirm New PIN' };
            const values = { currentPin, newPin, confirmPin };
            const setters = {
              currentPin: setCurrentPin,
              newPin: setNewPin,
              confirmPin: setConfirmPin
            };
            return (
              <div key={field}>
                <label style={labelStyle}>{labels[field]}</label>
                <input
                  id={`pin-${field}`}
                  type={showPins ? 'text' : 'password'}
                  inputMode="numeric"
                  maxLength={8}
                  style={{ ...inputStyle, letterSpacing: showPins ? 'normal' : '0.3em' }}
                  value={values[field]}
                  onChange={e => setters[field](e.target.value.replace(/\D/g, ''))}
                  placeholder={showPins ? 'Enter digits' : '••••••'}
                />
              </div>
            );
          })}
          <button
            id="change-pin-btn"
            onClick={handlePinChange}
            disabled={pinLoading}
            className="btn btn-secondary"
            style={{ alignSelf: 'flex-start' }}
          >
            {pinLoading ? '⏳ Changing...' : '🔐 Change PIN'}
          </button>
        </div>
      </SectionCard>

      {/* Appearance */}
      <SectionCard title="Appearance" icon={theme === 'dark' ? Moon : Sun}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          <div>
            <p style={{ fontWeight: 600, color: 'var(--text-primary)', marginBottom: '2px' }}>
              {theme === 'dark' ? '🌙 Dark Mode' : '☀️ Light Mode'}
            </p>
            <p style={{ fontSize: '0.82rem', color: 'var(--text-muted)' }}>
              Currently using {theme} mode
            </p>
          </div>
          <button
            id="settings-theme-toggle"
            onClick={toggleTheme}
            className="btn btn-ghost"
            style={{ flexShrink: 0 }}
          >
            Switch to {theme === 'dark' ? 'Light' : 'Dark'}
          </button>
        </div>
      </SectionCard>

      {/* Database info */}
      <SectionCard title="Data & Backups" icon={Database}>
        <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
            {[
              { label: 'Database', value: 'PostgreSQL 17 (Local)' },
              { label: 'Location', value: 'D:\\APPS\\data' },
              { label: 'Status', value: '🟢 Running' },
            ].map(({ label, value }) => (
              <div key={label} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <span style={{ fontSize: '0.85rem', color: 'var(--text-muted)' }}>{label}</span>
                <span style={{ fontSize: '0.85rem', fontWeight: 600, color: 'var(--text-primary)' }}>{value}</span>
              </div>
            ))}
          </div>
          
          <div style={{ borderTop: '1px solid var(--border)', paddingTop: '16px', marginTop: '4px' }}>
            <p style={{ fontSize: '0.85rem', color: 'var(--text-muted)', marginBottom: '12px' }}>
              Download a complete backup of all your financial data (Transactions, Accounts, Loans, Goals) in Excel format.
            </p>
            <a href="/api/export" download style={{ textDecoration: 'none' }}>
              <button type="button" className="btn btn-primary" style={{ width: '100%', background: 'var(--gradient-success)', borderColor: 'transparent', display: 'flex', justifyContent: 'center', gap: '8px' }}>
                Export Data to Excel (.xlsx)
              </button>
            </a>
          </div>
        </div>
      </SectionCard>

      {/* Sign Out */}
      <motion.button
        id="settings-signout-btn"
        onClick={logout}
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        whileTap={{ scale: 0.97 }}
        className="btn btn-ghost"
        style={{
          width: '100%', justifyContent: 'center',
          color: 'var(--accent-2)', borderColor: 'var(--accent-2)',
          marginBottom: '32px',
        }}
      >
        <LogOut size={16} />
        Sign Out
      </motion.button>
    </div>
  );
}
