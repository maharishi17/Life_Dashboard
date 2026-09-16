'use client';

import { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { PiggyBank, TrendingUp, AlertCircle, CheckCircle, Camera } from 'lucide-react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip as RechartsTooltip, ResponsiveContainer, Legend } from 'recharts';

export default function SavingsPage() {
  const [snapshots, setSnapshots] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [snapLoading, setSnapLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  // Exchange rate state
  const [currentRate, setCurrentRate] = useState<string>('');
  const [rateLoading, setRateLoading] = useState(false);
  const [rateSuccess, setRateSuccess] = useState(false);

  useEffect(() => {
    fetchData();
  }, []);

  async function fetchData() {
    setLoading(true);
    try {
      const [snapRes, rateRes] = await Promise.all([
        fetch('/api/savings/snapshots'),
        fetch('/api/exchange-rates')
      ]);
      
      if (snapRes.ok) {
        const snapData = await snapRes.json();
        setSnapshots(snapData.snapshots);
      }
      
      if (rateRes.ok) {
        const rateData = await rateRes.json();
        setCurrentRate(rateData.rate.toString());
      }
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  }

  const handleTakeSnapshot = async () => {
    setSnapLoading(true);
    setError('');
    setSuccess('');
    
    const now = new Date();
    const year = now.getFullYear();
    const month = now.getMonth() + 1; // 1-12

    try {
      const res = await fetch('/api/savings/snapshots', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ year, month, notes: 'Manual Snapshot' }),
      });
      const data = await res.json();
      
      if (res.ok) {
        setSuccess('Snapshot taken successfully! Chart updated.');
        fetchData(); // Refresh data
      } else {
        setError(data.error || 'Failed to take snapshot');
      }
    } catch {
      setError('Connection error');
    } finally {
      setSnapLoading(false);
    }
  };

  const handleUpdateRate = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!currentRate || parseFloat(currentRate) <= 0) return;
    
    setRateLoading(true);
    setRateSuccess(false);
    try {
      const res = await fetch('/api/exchange-rates', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ rate: currentRate }),
      });
      if (res.ok) {
        setRateSuccess(true);
        setTimeout(() => setRateSuccess(false), 3000);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setRateLoading(false);
    }
  };

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
      maximumFractionDigits: 0,
    }).format(amount);
  };

  const chartData = snapshots.map(s => {
    const date = new Date(s.year, s.month - 1);
    const monthStr = date.toLocaleString('default', { month: 'short' });
    return {
      name: `${monthStr} ${s.year.toString().slice(2)}`,
      NetWorth: s.netWorthINR,
      Savings: s.totalSavingsINR,
      Debt: s.totalLoansINR
    };
  });

  return (
    <div className="container-app">
      {/* Header */}
      <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }}
        style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '28px' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '14px' }}>
          <div style={{
            width: '48px', height: '48px', borderRadius: '14px',
            background: 'var(--gradient-success)', display: 'flex',
            alignItems: 'center', justifyContent: 'center',
            boxShadow: '0 4px 16px rgba(46,204,113,0.4)',
          }}>
            <PiggyBank size={22} color="#fff" />
          </div>
          <div>
            <h1 style={{ fontSize: '1.5rem', fontWeight: 800, color: 'var(--text-primary)' }}>Savings & Net Worth</h1>
            <p style={{ fontSize: '0.85rem', color: 'var(--text-muted)' }}>15-year growth tracker</p>
          </div>
        </div>
        
        {/* Update Exchange Rate Widget */}
        <form onSubmit={handleUpdateRate} style={{ display: 'flex', alignItems: 'center', gap: '8px', background: 'var(--bg-card)', padding: '6px 8px 6px 12px', borderRadius: 'var(--radius-full)', border: '1px solid var(--border)' }}>
          <span style={{ fontSize: '0.75rem', fontWeight: 600, color: 'var(--text-muted)' }}>AED/INR</span>
          <input 
            type="number" step="0.01" value={currentRate} 
            onChange={e => setCurrentRate(e.target.value)}
            style={{ width: '60px', background: 'transparent', border: 'none', color: 'var(--text-primary)', fontWeight: 700, outline: 'none' }}
          />
          <button type="submit" disabled={rateLoading} style={{ background: rateSuccess ? 'var(--gradient-success)' : 'var(--accent-1)', border: 'none', borderRadius: 'var(--radius-full)', padding: '4px 10px', color: '#fff', fontSize: '0.75rem', fontWeight: 700, cursor: 'pointer' }}>
            {rateSuccess ? 'Saved' : 'Update'}
          </button>
        </form>
      </motion.div>

      <AnimatePresence>
        {error && (
          <motion.div initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: 'auto' }} exit={{ opacity: 0, height: 0 }}
            style={{ background: 'var(--gradient-danger)', color: '#fff', padding: '12px 16px', borderRadius: 'var(--radius-md)', marginBottom: '20px', display: 'flex', alignItems: 'center', gap: '8px', fontSize: '0.85rem', fontWeight: 600 }}>
            <AlertCircle size={16} /> {error}
          </motion.div>
        )}
        {success && (
          <motion.div initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: 'auto' }} exit={{ opacity: 0, height: 0 }}
            style={{ background: 'var(--gradient-success)', color: '#fff', padding: '12px 16px', borderRadius: 'var(--radius-md)', marginBottom: '20px', display: 'flex', alignItems: 'center', gap: '8px', fontSize: '0.85rem', fontWeight: 600 }}>
            <CheckCircle size={16} /> {success}
          </motion.div>
        )}
      </AnimatePresence>

      {/* Snapshot Action Card */}
      <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }} 
        className="card" style={{ padding: '24px', marginBottom: '24px', display: 'flex', justifyContent: 'space-between', alignItems: 'center', background: 'var(--gradient-hero)', color: '#fff', border: 'none' }}>
        <div>
          <h3 style={{ fontSize: '1.2rem', fontWeight: 800, marginBottom: '4px' }}>Monthly Snapshot</h3>
          <p style={{ fontSize: '0.85rem', opacity: 0.9 }}>
            Click this at the end of every month to record your exact Net Worth (Total Savings - Total Debt).
          </p>
        </div>
        <button 
          onClick={handleTakeSnapshot} 
          disabled={snapLoading}
          className="btn" 
          style={{ background: '#fff', color: 'var(--accent-1)', padding: '12px 20px', display: 'flex', gap: '8px', alignItems: 'center', fontWeight: 800 }}
        >
          <Camera size={18} /> {snapLoading ? 'Capturing...' : 'Take Snapshot Now'}
        </button>
      </motion.div>

      {/* Chart */}
      {chartData.length > 0 ? (
        <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }} className="card" style={{ padding: '24px', marginBottom: '32px' }}>
          <h3 style={{ fontSize: '1.1rem', fontWeight: 700, marginBottom: '20px', display: 'flex', alignItems: 'center', gap: '8px' }}>
            <TrendingUp size={18} color="var(--accent-1)" /> Net Worth Growth (15 Years)
          </h3>
          <div style={{ width: '100%', height: '300px' }}>
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={chartData} margin={{ top: 5, right: 0, left: -20, bottom: 5 }}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="var(--border)" />
                <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{ fontSize: 12, fill: 'var(--text-muted)' }} dy={10} />
                <YAxis axisLine={false} tickLine={false} tick={{ fontSize: 12, fill: 'var(--text-muted)' }} tickFormatter={formatCurrency} />
                <RechartsTooltip 
                  contentStyle={{ background: 'var(--bg-card)', border: '1px solid var(--border)', borderRadius: '8px', color: 'var(--text-primary)' }}
                  itemStyle={{ fontWeight: 600 }}
                  formatter={(value: number) => formatCurrency(value)}
                />
                <Legend iconType="circle" wrapperStyle={{ fontSize: '12px', paddingTop: '10px' }} />
                <Line type="monotone" dataKey="NetWorth" name="Net Worth" stroke="var(--accent-1)" strokeWidth={3} dot={{ r: 4, fill: 'var(--accent-1)', strokeWidth: 0 }} activeDot={{ r: 6 }} />
                <Line type="monotone" dataKey="Savings" name="Total Liquid" stroke="var(--accent-3)" strokeWidth={2} strokeDasharray="5 5" dot={false} />
                <Line type="monotone" dataKey="Debt" name="Total Debt" stroke="var(--accent-2)" strokeWidth={2} strokeDasharray="5 5" dot={false} />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </motion.div>
      ) : (
        <div className="card" style={{ padding: '32px', textAlign: 'center', marginBottom: '32px' }}>
          <p style={{ color: 'var(--text-muted)' }}>Take your first snapshot to start tracking your net worth!</p>
        </div>
      )}

      {/* Snapshot History Table */}
      {snapshots.length > 0 && (
        <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3 }}>
          <p className="section-label" style={{ marginBottom: '12px' }}>Snapshot History</p>
          <div className="card" style={{ overflow: 'hidden' }}>
            <div style={{ overflowX: 'auto' }}>
              <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left', fontSize: '0.85rem' }}>
                <thead>
                  <tr style={{ borderBottom: '1px solid var(--border)', background: 'var(--bg-input)' }}>
                    <th style={{ padding: '12px 16px', color: 'var(--text-muted)', fontWeight: 600 }}>Date</th>
                    <th style={{ padding: '12px 16px', color: 'var(--text-muted)', fontWeight: 600 }}>Rate (AED)</th>
                    <th style={{ padding: '12px 16px', color: 'var(--text-muted)', fontWeight: 600 }}>Savings</th>
                    <th style={{ padding: '12px 16px', color: 'var(--text-muted)', fontWeight: 600 }}>Debt</th>
                    <th style={{ padding: '12px 16px', color: 'var(--text-primary)', fontWeight: 800 }}>Net Worth</th>
                  </tr>
                </thead>
                <tbody>
                  {snapshots.slice().reverse().map((s) => {
                    const date = new Date(s.year, s.month - 1);
                    return (
                      <tr key={s.id} style={{ borderBottom: '1px solid var(--border)' }}>
                        <td style={{ padding: '12px 16px', fontWeight: 600, color: 'var(--text-primary)' }}>
                          {date.toLocaleString('default', { month: 'short' })} {s.year}
                        </td>
                        <td style={{ padding: '12px 16px', color: 'var(--text-muted)' }}>₹{s.aedToInrRate}</td>
                        <td style={{ padding: '12px 16px', color: 'var(--accent-3)', fontWeight: 600 }}>{formatCurrency(s.totalSavingsINR)}</td>
                        <td style={{ padding: '12px 16px', color: 'var(--accent-2)', fontWeight: 600 }}>{formatCurrency(s.totalLoansINR)}</td>
                        <td style={{ padding: '12px 16px', color: 'var(--accent-1)', fontWeight: 800 }}>{formatCurrency(s.netWorthINR)}</td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </div>
        </motion.div>
      )}
    </div>
  );
}
