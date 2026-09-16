'use client';

import { useState, useEffect } from 'react';
import { useRouter, useParams } from 'next/navigation';
import { motion, AnimatePresence } from 'framer-motion';
import { CreditCard, AlertCircle, ArrowLeft } from 'lucide-react';
import Link from 'next/link';

export default function LogEmiPage() {
  const router = useRouter();
  const params = useParams();
  const loanId = params.id as string;

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [loan, setLoan] = useState<any>(null);
  
  const [formData, setFormData] = useState({
    amount: '',
    currency: 'INR',
    date: new Date().toISOString().split('T')[0],
    notes: '',
  });

  useEffect(() => {
    async function fetchLoan() {
      try {
        const res = await fetch('/api/loans');
        if (res.ok) {
          const data = await res.json();
          const found = data.loans.find((l: any) => l.id === loanId);
          if (found) {
            setLoan(found);
            setFormData(prev => ({ ...prev, amount: found.emiAmount ? found.emiAmount.toString() : '' }));
          }
        }
      } catch (err) {
        console.error(err);
      }
    }
    fetchLoan();
  }, [loanId]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.amount || parseFloat(formData.amount) <= 0) { setError('Valid amount is required'); return; }
    
    setLoading(true);
    setError('');
    
    try {
      const res = await fetch(`/api/loans/${loanId}/payments`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      });
      const data = await res.json();
      if (res.ok) {
        router.push('/dashboard/loans');
        router.refresh();
      } else {
        setError(data.error || 'Failed to log payment');
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

  if (!loan) return <div className="container-app"><p>Loading...</p></div>;

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
          background: 'var(--gradient-success)', display: 'flex',
          alignItems: 'center', justifyContent: 'center',
          boxShadow: '0 4px 16px rgba(46,204,113,0.4)',
        }}>
          <CreditCard size={22} color="#fff" />
        </div>
        <div>
          <h1 style={{ fontSize: '1.5rem', fontWeight: 800, color: 'var(--text-primary)' }}>Log Payment</h1>
          <p style={{ fontSize: '0.85rem', color: 'var(--text-muted)' }}>Payment for: <strong>{loan.name}</strong></p>
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
          
          <div style={{ display: 'grid', gridTemplateColumns: '2fr 1fr', gap: '16px' }}>
            <div>
              <label style={labelStyle}>Amount Paid</label>
              <input style={{...inputStyle, fontSize: '1.2rem', fontWeight: 700}} type="number" step="0.01" value={formData.amount} onChange={e => setFormData({ ...formData, amount: e.target.value })} required />
            </div>
            <div>
              <label style={labelStyle}>Currency</label>
              <select style={{ ...inputStyle, cursor: 'pointer' }} value={formData.currency} onChange={e => setFormData({ ...formData, currency: e.target.value })}>
                <option value="INR">INR</option>
                <option value="AED">AED</option>
              </select>
            </div>
          </div>

          <div>
            <label style={labelStyle}>Date of Payment</label>
            <input style={inputStyle} type="date" value={formData.date} onChange={e => setFormData({ ...formData, date: e.target.value })} required />
          </div>

          <div>
            <label style={labelStyle}>Notes (Optional)</label>
            <input style={inputStyle} value={formData.notes} onChange={e => setFormData({ ...formData, notes: e.target.value })} placeholder="Reference number, source bank, etc." />
          </div>

          <button type="submit" disabled={loading} className="btn btn-primary" style={{ marginTop: '12px', padding: '14px', background: 'var(--gradient-success)', borderColor: 'transparent' }}>
            {loading ? 'Logging...' : 'Log Payment'}
          </button>
        </form>
      </motion.div>
    </div>
  );
}
