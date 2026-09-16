'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { motion, AnimatePresence } from 'framer-motion';
import { Wallet, CheckCircle, AlertCircle, ArrowLeft } from 'lucide-react';
import Link from 'next/link';

export default function NewAccountPage() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  
  const [formData, setFormData] = useState({
    name: '',
    bankName: '',
    accountNo: '',
    type: 'SAVINGS',
    currency: 'INR',
    balance: '',
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.name) { setError('Account name is required'); return; }
    
    setLoading(true);
    setError('');
    
    try {
      const res = await fetch('/api/accounts', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      });
      const data = await res.json();
      if (res.ok) {
        router.push('/dashboard');
        router.refresh();
      } else {
        setError(data.error || 'Failed to add account');
        setLoading(false);
      }
    } catch {
      setError('Connection error');
      setLoading(false);
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
      <div style={{ marginBottom: '24px' }}>
        <Link href="/dashboard" style={{ display: 'inline-flex', alignItems: 'center', gap: '6px', color: 'var(--text-muted)', textDecoration: 'none', fontSize: '0.9rem', fontWeight: 600 }}>
          <ArrowLeft size={16} /> Back to Dashboard
        </Link>
      </div>

      <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }}
        style={{ display: 'flex', alignItems: 'center', gap: '14px', marginBottom: '28px' }}>
        <div style={{
          width: '48px', height: '48px', borderRadius: '14px',
          background: 'var(--gradient-hero)', display: 'flex',
          alignItems: 'center', justifyContent: 'center',
          boxShadow: '0 4px 16px rgba(91,106,240,0.4)',
        }}>
          <Wallet size={22} color="#fff" />
        </div>
        <div>
          <h1 style={{ fontSize: '1.5rem', fontWeight: 800, color: 'var(--text-primary)' }}>Add Account</h1>
          <p style={{ fontSize: '0.85rem', color: 'var(--text-muted)' }}>Add a new bank account or wallet</p>
        </div>
      </motion.div>

      <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }} className="card" style={{ padding: '24px' }}>
        <AnimatePresence>
          {error && (
            <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, height: 0 }}
              style={{ background: 'var(--gradient-danger)', color: '#fff', padding: '12px 16px', borderRadius: 'var(--radius-md)', marginBottom: '20px', display: 'flex', alignItems: 'center', gap: '8px', fontSize: '0.85rem', fontWeight: 600 }}>
              <AlertCircle size={16} /> {error}
            </motion.div>
          )}
        </AnimatePresence>

        <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
          <div>
            <label style={labelStyle}>Account Name (e.g. Personal Savings)</label>
            <input style={inputStyle} value={formData.name} onChange={e => setFormData({ ...formData, name: e.target.value })} placeholder="Account name" required />
          </div>
          
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
            <div>
              <label style={labelStyle}>Bank / Provider (Optional)</label>
              <input style={inputStyle} value={formData.bankName} onChange={e => setFormData({ ...formData, bankName: e.target.value })} placeholder="SBI, ADCB, etc." />
            </div>
            <div>
              <label style={labelStyle}>Last 4 Digits (Optional)</label>
              <input style={inputStyle} value={formData.accountNo} onChange={e => setFormData({ ...formData, accountNo: e.target.value })} placeholder="1234" maxLength={4} />
            </div>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
            <div>
              <label style={labelStyle}>Account Type</label>
              <select style={{ ...inputStyle, cursor: 'pointer' }} value={formData.type} onChange={e => setFormData({ ...formData, type: e.target.value })}>
                <option value="SAVINGS">Savings</option>
                <option value="CURRENT">Current</option>
                <option value="SALARY">Salary</option>
                <option value="CASH">Cash Wallet</option>
                <option value="INVESTMENT">Investment</option>
              </select>
            </div>
            <div>
              <label style={labelStyle}>Currency</label>
              <select style={{ ...inputStyle, cursor: 'pointer' }} value={formData.currency} onChange={e => setFormData({ ...formData, currency: e.target.value })}>
                <option value="INR">INR (₹)</option>
                <option value="AED">AED (د.إ)</option>
              </select>
            </div>
          </div>

          <div>
            <label style={labelStyle}>Current Balance</label>
            <input style={inputStyle} type="number" step="0.01" value={formData.balance} onChange={e => setFormData({ ...formData, balance: e.target.value })} placeholder="0.00" />
          </div>

          <button type="submit" disabled={loading} className="btn btn-primary" style={{ marginTop: '12px', padding: '14px' }}>
            {loading ? 'Adding...' : 'Add Account'}
          </button>
        </form>
      </motion.div>
    </div>
  );
}
