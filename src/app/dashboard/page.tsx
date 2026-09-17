'use client';

import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import {
  TrendingUp, TrendingDown, CreditCard, Target,
  PiggyBank, Wallet, ArrowRight, MapPin, Heart
} from 'lucide-react';
import { useAuth } from '@/context/AuthContext';
import Link from 'next/link';
import { io } from 'socket.io-client';

interface DashboardStats {
  totalBalance: number;
  totalLoans: number;
  totalSavings: number;
  activeGoalsCount: number;
}

const formatINR = (amount: number) => {
  return new Intl.NumberFormat('en-IN', {
    style: 'currency',
    currency: 'INR',
    maximumFractionDigits: 0,
  }).format(amount);
};

function StatCard({ label, value, sub, icon: Icon, color, gradient, trend, index }: any) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.1 * index, duration: 0.4 }}
      className="card"
      style={{ padding: '24px' }}
    >
      <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', marginBottom: '16px' }}>
        <div style={{
          width: '48px', height: '48px', borderRadius: '14px',
          background: gradient, display: 'flex', alignItems: 'center',
          justifyContent: 'center', boxShadow: `0 4px 16px ${color}40`,
        }}>
          <Icon size={22} color="#fff" />
        </div>
        {trend !== null && (
          <span className={`stat-chip ${trend >= 0 ? 'up' : 'down'}`}>
            {trend >= 0 ? <TrendingUp size={11} /> : <TrendingDown size={11} />}
            {Math.abs(trend)}%
          </span>
        )}
      </div>
      <p style={{ fontSize: '0.78rem', fontWeight: 600, color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.08em', marginBottom: '4px' }}>
        {label}
      </p>
      <p style={{ fontSize: '1.7rem', fontWeight: 800, color: 'var(--text-primary)', marginBottom: '4px', lineHeight: 1.1 }}>
        {value}
      </p>
      <p style={{ fontSize: '0.78rem', color: 'var(--text-muted)' }}>{sub}</p>
    </motion.div>
  );
}

const QUICK_ACTIONS = [
  { href: '/dashboard/accounts/new', label: 'Add Account', icon: Wallet, color: 'var(--accent-1)', id: 'action-add-account' },
  { href: '/dashboard/transactions/new', label: 'Add Transaction', icon: TrendingUp, color: 'var(--accent-3)', id: 'action-add-transaction' },
  { href: '/dashboard/loans', label: 'Add Loan', icon: CreditCard, color: 'var(--accent-2)', id: 'action-add-loan' },
  { href: '/dashboard/goals', label: 'Set Goal', icon: Target, color: 'var(--accent-5)', id: 'action-set-goal' },
];

export default function DashboardPage() {
  const { user } = useAuth();
  const [stats, setStats] = useState<DashboardStats | null>(null);
  const [loading, setLoading] = useState(true);
  const [partnerStatus, setPartnerStatus] = useState<any>(null);
  
  const hour = new Date().getHours();
  const greeting = hour < 12 ? 'Good Morning' : hour < 17 ? 'Good Afternoon' : 'Good Evening';

  useEffect(() => {
    async function fetchStats() {
      try {
        const res = await fetch('/api/dashboard');
        if (res.ok) {
          const data = await res.json();
          setStats(data);
        }
      } catch (error) {
        console.error("Failed to load stats", error);
      } finally {
        setLoading(false);
      }
    }
    fetchStats();
  }, []);

  useEffect(() => {
    if (!user?.id) return;
    
    // Connect to the socket server
    const socket = io();
    
    // Tell the server we are online
    socket.on('connect', () => {
      socket.emit('user_connected', { userId: user.id, name: user.name });
    });
    
    // Listen for real-time status updates from server
    socket.on('status_update', (onlineUsers) => {
      // Is our partner in the online users array?
      const partnerOnline = onlineUsers.find((u: any) => u.userId !== user.id);
      
      if (partnerOnline) {
        setPartnerStatus({
          name: partnerOnline.name,
          isOnline: true,
          lastSeenText: 'Online now'
        });
      } else {
        // Fetch their last active time from DB once to show "Last seen" accurately
        fetch('/api/user/status').then(res => res.json()).then(({ users }) => {
          const partner = users?.find((u: any) => u.id !== user.id);
          if (partner) {
             const lastActive = new Date(partner.lastActiveAt);
             const now = new Date();
             const diffMs = now.getTime() - lastActive.getTime();
             const diffMins = Math.floor(diffMs / 60000);
             let lastSeenText = '';
             
             if (diffMins < 60) {
                lastSeenText = `Last seen ${diffMins} min${diffMins !== 1 ? 's' : ''} ago`;
             } else {
                const diffHours = Math.floor(diffMins / 60);
                if (diffHours < 24) {
                   lastSeenText = `Last seen ${diffHours} hr${diffHours !== 1 ? 's' : ''} ago`;
                } else {
                   lastSeenText = `Last seen ${Math.floor(diffHours / 24)} days ago`;
                }
             }
             
             setPartnerStatus({
                name: partner.name,
                isOnline: false,
                lastSeenText
             });
          }
        }).catch(e => console.error(e));
      }
    });
    
    // Ping periodically so server knows we are still active without refreshing DB constantly
    const pingInterval = setInterval(() => {
       if (socket.connected) {
          socket.emit('ping_active', { userId: user.id });
       }
    }, 60000);
    
    return () => {
      clearInterval(pingInterval);
      socket.disconnect();
    };
  }, [user]);

  const STATS_DATA = [
    {
      id: 'total-balance',
      label: 'Combined Balance',
      value: loading ? '...' : formatINR(stats?.totalBalance || 0),
      sub: (stats?.totalBalance || 0) === 0 ? 'Add your accounts to start' : 'Across all accounts',
      icon: Wallet,
      color: 'var(--accent-1)',
      gradient: 'var(--gradient-hero)',
      trend: null,
    },
    {
      id: 'total-loans',
      label: 'Active Loans',
      value: loading ? '...' : formatINR(stats?.totalLoans || 0),
      sub: (stats?.totalLoans || 0) === 0 ? 'No loans tracked yet' : 'Total outstanding',
      icon: CreditCard,
      color: 'var(--accent-2)',
      gradient: 'var(--gradient-danger)',
      trend: null,
    },
    {
      id: 'total-savings',
      label: 'Total Savings',
      value: loading ? '...' : formatINR(stats?.totalSavings || 0),
      sub: (stats?.totalSavings || 0) === 0 ? 'Start saving today' : 'Towards goals',
      icon: PiggyBank,
      color: 'var(--accent-3)',
      gradient: 'var(--gradient-success)',
      trend: null,
    },
    {
      id: 'active-goals',
      label: 'Active Goals',
      value: loading ? '...' : (stats?.activeGoalsCount || 0).toString(),
      sub: (stats?.activeGoalsCount || 0) === 0 ? 'Set your first goal' : 'Goals in progress',
      icon: Target,
      color: 'var(--accent-5)',
      gradient: 'var(--gradient-purple)',
      trend: null,
    },
  ];

  return (
    <div className="container-app">
      {/* ---- Hero greeting ---- */}
      <motion.div
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        style={{
          background: 'var(--gradient-hero)',
          borderRadius: 'var(--radius-xl)',
          padding: '32px',
          marginBottom: '28px',
          position: 'relative',
          overflow: 'hidden',
          boxShadow: 'var(--shadow-lg)',
        }}
      >
        <div style={{ position: 'absolute', top: '-40px', right: '-40px', width: '200px', height: '200px', borderRadius: '50%', background: 'rgba(255,255,255,0.08)' }} />
        <div style={{ position: 'absolute', bottom: '-60px', right: '60px', width: '160px', height: '160px', borderRadius: '50%', background: 'rgba(255,255,255,0.06)' }} />

        <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', flexWrap: 'wrap', gap: '16px' }}>
          <div>
            <p style={{ color: 'rgba(255,255,255,0.7)', fontSize: '0.85rem', fontWeight: 500, marginBottom: '6px' }}>
              {greeting} 👋
            </p>
            <h1 style={{ color: '#fff', fontSize: '1.8rem', fontWeight: 800, marginBottom: '8px', lineHeight: 1.2 }}>
              {user?.name || 'Welcome'}
            </h1>
            <div style={{ display: 'flex', alignItems: 'center', gap: '6px', color: 'rgba(255,255,255,0.7)', fontSize: '0.82rem' }}>
              <MapPin size={13} />
              <span>{user?.location || 'Tamil Nadu'}</span>
            </div>
          </div>

          <div style={{ display: 'flex', gap: '16px', alignItems: 'center', flexWrap: 'wrap' }}>
            {partnerStatus && (
              <div style={{
                background: 'rgba(255,255,255,0.15)',
                backdropFilter: 'blur(10px)',
                borderRadius: 'var(--radius-lg)',
                padding: '16px 20px',
                textAlign: 'right',
                border: '1px solid rgba(255,255,255,0.2)',
              }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '6px', justifyContent: 'flex-end', marginBottom: '4px' }}>
                  <div style={{ width: '8px', height: '8px', borderRadius: '50%', background: partnerStatus.isOnline ? '#2ecc71' : '#95a5a6', boxShadow: partnerStatus.isOnline ? '0 0 8px #2ecc71' : 'none' }} />
                  <span style={{ color: '#fff', fontSize: '1.1rem', fontWeight: 800 }}>
                    {partnerStatus.name}
                  </span>
                </div>
                <p style={{ color: 'rgba(255,255,255,0.65)', fontSize: '0.75rem', fontWeight: 500 }}>
                  {partnerStatus.lastSeenText}
                </p>
              </div>
            )}
            <div style={{
              background: 'rgba(255,255,255,0.15)',
              backdropFilter: 'blur(10px)',
              borderRadius: 'var(--radius-lg)',
              padding: '16px 20px',
              textAlign: 'center',
              border: '1px solid rgba(255,255,255,0.2)',
            }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '6px', marginBottom: '4px' }}>
                <Heart size={14} color="#fff" fill="#fff" />
                <span style={{ color: 'rgba(255,255,255,0.8)', fontSize: '0.72rem', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.08em' }}>
                  Together Since
                </span>
              </div>
              <p style={{ color: '#fff', fontSize: '1.3rem', fontWeight: 800 }}>2026</p>
              <p style={{ color: 'rgba(255,255,255,0.65)', fontSize: '0.72rem' }}>Year 1 of our journey</p>
            </div>
          </div>
        </div>

        {/* Setup progress bar */}
        <div style={{ marginTop: '24px' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '8px' }}>
            <span style={{ color: 'rgba(255,255,255,0.8)', fontSize: '0.78rem', fontWeight: 600 }}>
              Dashboard Setup Progress
            </span>
            <span style={{ color: 'rgba(255,255,255,0.8)', fontSize: '0.78rem', fontWeight: 700 }}>
              30%
            </span>
          </div>
          <div style={{
            height: '6px', background: 'rgba(255,255,255,0.2)',
            borderRadius: 'var(--radius-full)', overflow: 'hidden',
          }}>
            <motion.div
              initial={{ width: 0 }}
              animate={{ width: '30%' }}
              transition={{ delay: 0.5, duration: 1, ease: 'easeOut' }}
              style={{ height: '100%', background: 'rgba(255,255,255,0.9)', borderRadius: 'var(--radius-full)' }}
            />
          </div>
          <p style={{ color: 'rgba(255,255,255,0.6)', fontSize: '0.72rem', marginTop: '6px' }}>
            ✅ Database connected · 🔜 Add accounts · 🔜 Track loans
          </p>
        </div>
      </motion.div>

      {/* ---- Stats Grid ---- */}
      <div style={{ marginBottom: '28px' }}>
        <p className="section-label" style={{ marginBottom: '12px' }}>Overview</p>
        <div className="grid-cards">
          {STATS_DATA.map((stat, i) => <StatCard key={stat.id} {...stat} index={i} />)}
        </div>
      </div>

      {/* ---- Quick Actions ---- */}
      <div style={{ marginBottom: '28px' }}>
        <p className="section-label" style={{ marginBottom: '12px' }}>Quick Actions</p>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '12px' }}>
          {QUICK_ACTIONS.map(({ href, label, icon: Icon, color, id }, i) => (
            <motion.div
              key={id}
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.15 + i * 0.06 }}
            >
              <Link href={href} id={id} style={{ textDecoration: 'none' }}>
                <div className="card" style={{
                  padding: '20px', display: 'flex', alignItems: 'center', gap: '14px', cursor: 'pointer',
                }}>
                  <div style={{
                    width: '44px', height: '44px', borderRadius: '12px', background: `${color}20`,
                    display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0,
                  }}>
                    <Icon size={20} style={{ color }} />
                  </div>
                  <span style={{ fontWeight: 600, color: 'var(--text-primary)', fontSize: '0.9rem', flex: 1 }}>
                    {label}
                  </span>
                  <ArrowRight size={16} style={{ color: 'var(--text-muted)' }} />
                </div>
              </Link>
            </motion.div>
          ))}
        </div>
      </div>
    </div>
  );
}
