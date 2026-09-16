'use client';

import { useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { motion, AnimatePresence } from 'framer-motion';
import {
  LayoutDashboard, CreditCard, Target, PiggyBank, BarChart2,
  Settings, LogOut, Sun, Moon, Heart, Menu, X, Coffee
} from 'lucide-react';
import { useAuth } from '@/context/AuthContext';
import { useTheme } from '@/context/ThemeContext';
import clsx from 'clsx';

const NAV_ITEMS = [
  { href: '/dashboard', icon: LayoutDashboard, label: 'Dashboard', id: 'nav-dashboard' },
  { href: '/dashboard/loans', icon: CreditCard, label: 'Loans', id: 'nav-loans' },
  { href: '/dashboard/goals', icon: Target, label: 'Goals', id: 'nav-goals' },
  { href: '/dashboard/savings', icon: PiggyBank, label: 'Savings', id: 'nav-savings' },
  { href: '/dashboard/analytics', icon: BarChart2, label: 'Analytics', id: 'nav-analytics' },
  { href: '/dashboard/memories', icon: Heart, label: 'Memories', id: 'nav-memories' },
  { href: '/dashboard/life', icon: Coffee, label: 'Life Hub', id: 'nav-life' },
];

export default function DashboardShell({ children }: { children: React.ReactNode }) {
  const { user, logout } = useAuth();
  const { theme, toggleTheme } = useTheme();
  const pathname = usePathname();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const initials = user?.name
    ? user.name.split(' ').map((n) => n[0]).join('').toUpperCase().slice(0, 2)
    : '??';

  return (
    <div style={{ minHeight: '100dvh', background: 'var(--bg-primary)' }}>

      {/* ===== DESKTOP SIDEBAR ===== */}
      <aside className="sidebar desktop-only" style={{ flexDirection: 'column' }}>
        {/* Brand */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '12px', padding: '8px 8px 24px' }}>
          <div style={{
            width: '40px', height: '40px', borderRadius: '12px',
            background: 'var(--gradient-hero)',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            flexShrink: 0, boxShadow: '0 4px 16px rgba(91,106,240,0.4)',
          }}>
            <Heart size={20} color="#fff" fill="#fff" />
          </div>
          <div>
            <p style={{ fontWeight: 800, fontSize: '0.95rem', color: 'var(--text-primary)', lineHeight: 1.2 }}>
              Life Dashboard
            </p>
            <p style={{ fontSize: '0.7rem', color: 'var(--text-muted)' }}>Our Journey ✨</p>
          </div>
        </div>

        {/* Nav */}
        <p className="section-label" style={{ padding: '0 8px' }}>Navigation</p>
        <nav style={{ display: 'flex', flexDirection: 'column', gap: '4px', flex: 1 }}>
          {NAV_ITEMS.map(({ href, icon: Icon, label, id }) => {
            const isActive = pathname === href || (href !== '/dashboard' && pathname.startsWith(href));
            return (
              <Link
                key={href}
                href={href}
                id={id}
                className={clsx('sidebar-item', isActive && 'active')}
              >
                <Icon size={18} className="sidebar-icon" />
                {label}
                {isActive && (
                  <motion.div
                    layoutId="sidebar-active"
                    style={{
                      position: 'absolute', right: 0, top: '50%',
                      transform: 'translateY(-50%)',
                      width: '3px', height: '24px',
                      background: 'var(--gradient-hero)',
                      borderRadius: '3px 0 0 3px',
                    }}
                  />
                )}
              </Link>
            );
          })}
        </nav>

        <div className="divider" />

        {/* Bottom sidebar actions */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
          <Link href="/dashboard/settings" id="nav-settings" className={clsx('sidebar-item', pathname === '/dashboard/settings' && 'active')}>
            <Settings size={18} />
            Settings
          </Link>
          <button
            id="theme-toggle-sidebar"
            onClick={toggleTheme}
            className="sidebar-item"
            style={{ cursor: 'pointer' }}
          >
            {theme === 'dark' ? <Sun size={18} /> : <Moon size={18} />}
            {theme === 'dark' ? 'Light Mode' : 'Dark Mode'}
          </button>
          <button
            id="logout-btn"
            onClick={logout}
            className="sidebar-item"
            style={{ cursor: 'pointer', color: 'var(--accent-2)' }}
          >
            <LogOut size={18} />
            Sign Out
          </button>
        </div>

        <div className="divider" />

        {/* User profile */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '10px', padding: '8px' }}>
          <div className="avatar" style={{ width: '36px', height: '36px', fontSize: '0.75rem' }}>
            {initials}
          </div>
          <div style={{ flex: 1, minWidth: 0 }}>
            <p style={{ fontSize: '0.85rem', fontWeight: 600, color: 'var(--text-primary)', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
              {user?.name || 'User'}
            </p>
            <p style={{ fontSize: '0.72rem', color: 'var(--text-muted)' }}>
              {user?.location || '📍 Unknown'}
            </p>
          </div>
        </div>
      </aside>

      {/* ===== MOBILE TOP HEADER ===== */}
      <header className="mobile-only" style={{
        position: 'sticky', top: 0, zIndex: 60,
        background: 'var(--bg-bottom-nav)',
        backdropFilter: 'blur(20px)',
        borderBottom: '1px solid var(--border)',
        padding: '12px 16px',
        alignItems: 'center', justifyContent: 'space-between',
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
          <div style={{
            width: '32px', height: '32px', borderRadius: '10px',
            background: 'var(--gradient-hero)',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
          }}>
            <Heart size={16} color="#fff" fill="#fff" />
          </div>
          <span style={{ fontWeight: 800, fontSize: '1rem', color: 'var(--text-primary)' }}>Life Dashboard</span>
        </div>
        <div style={{ display: 'flex', gap: '8px', alignItems: 'center' }}>
          <button
            id="theme-toggle-mobile"
            onClick={toggleTheme}
            className="btn-icon"
            style={{ width: '36px', height: '36px', padding: 0 }}
          >
            {theme === 'dark' ? '☀️' : '🌙'}
          </button>
          <div className="avatar" style={{ width: '36px', height: '36px', fontSize: '0.75rem' }}>
            {initials}
          </div>
        </div>
      </header>

      {/* ===== MAIN CONTENT ===== */}
      <main className="main-with-sidebar">
        <motion.div
          key={pathname}
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.2, ease: 'easeOut' }}
        >
          {children}
        </motion.div>
      </main>

      {/* ===== MOBILE BOTTOM NAVIGATION ===== */}
      <nav className="bottom-nav mobile-only">
        {NAV_ITEMS.map(({ href, icon: Icon, label, id }) => {
          const isActive = pathname === href || (href !== '/dashboard' && pathname.startsWith(href));
          return (
            <Link
              key={href}
              href={href}
              id={`bottom-${id}`}
              className={clsx('bottom-nav-item', isActive && 'active')}
            >
              <div style={{ position: 'relative' }}>
                {isActive && (
                  <motion.div
                    layoutId="bottom-nav-pill"
                    style={{
                      position: 'absolute', inset: '-6px -12px',
                      background: 'var(--accent-1-light)',
                      borderRadius: 'var(--radius-md)',
                      zIndex: -1,
                    }}
                  />
                )}
                <Icon size={20} />
              </div>
              <span>{label}</span>
            </Link>
          );
        })}
      </nav>

    </div>
  );
}
