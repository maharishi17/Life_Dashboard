'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { motion, AnimatePresence } from 'framer-motion';
import { CreditCard, AlertCircle, ArrowLeft } from 'lucide-react';
import Link from 'next/link';

export default function NewLoanPage() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  
  const [formData, setFormData] = useState({
    name: '',
    lender: '',
    principalAmount: '',
    currentBalance: '',
    emiAmount: '',
    interestRate: '',
    startDate: new Date().toISOString().split('T')[0],
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.name) { setError('Loan name is required'); return; }
    if (!formData.principalAmount || parseFloat(formData.principalAmount) <= 0) { setError('Valid principal amount is required'); return; }
    
    // Default current balance to principal if not set
    if (!formData.currentBalance) formData.currentBalance = formData.principalAmount;

    setLoading(true);
    setError('');
    
    try {
      const res = await fetch('/api/loans', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      });
      const data = await res.json();
      if (res.ok) {
        router.push('/dashboard/loans');
        router.refresh();
      } else {
        setError(data.error || 'Failed to add loan');
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
        <Link href="/dashboard/loans" style={{ display: 'inline-flex', alignItems: 'center', gap: '6px', color: 'var(--text-muted)', textDecoration: 'none', fontSize: '0.9rem', fontWeight: 600 }}>
          <ArrowLeft size={16} /> Back to Loans
        </Link>
      </div>

      <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }}
        style={{ display: 'flex', alignItems: 'center', gap: '14px', marginBottom: '28px' }}>
        <div style={{
          width: '48px', height: '48px', borderRadius: '14px',
          background: 'var(--gradient-danger)', display: 'flex',
          alignItems: 'center', justifyContent: 'center',
          boxShadow: '0 4px 16px rgba(231,76,60,0.4)',
        }}>
          <CreditCard size={22} color="#fff" />
        </div>
        <div>
          <h1 style={{ fontSize: '1.5rem', fontWeight: 800, color: 'var(--text-primary)' }}>Add Loan</h1>
          <p style={{ fontSize: '0.85rem', color: 'var(--text-muted)' }}>Start tracking a new debt</p>
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
            <label style={labelStyle}>Loan Name (e.g. Home Loan)</label>
            <input style={inputStyle} value={formData.name} onChange={e => setFormData({ ...formData, name: e.target.value })} required />
          </div>
          
          <div>
            <label style={labelStyle}>Lender / Bank</label>
            <input style={inputStyle} value={formData.lender} onChange={e => setFormData({ ...formData, lender: e.target.value })} placeholder="SBI, HDFC, Friend's Name" />
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
            <div>
              <label style={labelStyle}>Principal (Total Borrowed)</label>
              <input style={inputStyle} type="number" step="0.01" value={formData.principalAmount} onChange={e => setFormData({ ...formData, principalAmount: e.target.value })} required />
            </div>
            <div>
              <label style={labelStyle}>Current Remaining Balance</label>
              <input style={inputStyle} type="number" step="0.01" value={formData.currentBalance} onChange={e => setFormData({ ...formData, currentBalance: e.target.value })} placeholder="Same as principal if new" />
            </div>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
            <div>
              <label style={labelStyle}>Monthly EMI</label>
              <input style={inputStyle} type="number" step="0.01" value={formData.emiAmount} onChange={e => setFormData({ ...formData, emiAmount: e.target.value })} />
            </div>
            <div>
              <label style={labelStyle}>Interest Rate (%)</label>
              <input style={inputStyle} type="number" step="0.01" value={formData.interestRate} onChange={e => setFormData({ ...formData, interestRate: e.target.value })} />
            </div>
          </div>

          <div>
            <label style={labelStyle}>Start Date</label>
            <input style={inputStyle} type="date" value={formData.startDate} onChange={e => setFormData({ ...formData, startDate: e.target.value })} required />
          </div>

          <button type="submit" disabled={loading} className="btn btn-primary" style={{ marginTop: '12px', padding: '14px', background: 'var(--gradient-danger)', borderColor: 'transparent' }}>
            {loading ? 'Adding...' : 'Add Loan'}
          </button>
        </form>
      </motion.div>
    </div>
  );
}
