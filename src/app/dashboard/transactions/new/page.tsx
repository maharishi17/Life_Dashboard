'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { motion, AnimatePresence } from 'framer-motion';
import { TrendingUp, TrendingDown, CheckCircle, AlertCircle, ArrowLeft } from 'lucide-react';
import Link from 'next/link';

export default function NewTransactionPage() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [accounts, setAccounts] = useState<any[]>([]);
  
  const [formData, setFormData] = useState({
    type: 'EXPENSE',
    amount: '',
    accountId: '',
    category: '',
    description: '',
    date: new Date().toISOString().split('T')[0], // YYYY-MM-DD
  });

  useEffect(() => {
    async function fetchAccounts() {
      try {
        const res = await fetch('/api/accounts');
        if (res.ok) {
          const data = await res.json();
          setAccounts(data.accounts);
          if (data.accounts.length > 0) {
            setFormData(prev => ({ ...prev, accountId: data.accounts[0].id }));
          }
        }
      } catch (err) {
        console.error("Failed to load accounts", err);
      }
    }
    fetchAccounts();
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.accountId) { setError('Please select an account. Add an account first if you have none.'); return; }
    if (!formData.amount || parseFloat(formData.amount) <= 0) { setError('Enter a valid amount'); return; }
    if (!formData.category) { setError('Category is required'); return; }
    
    setLoading(true);
    setError('');
    
    try {
      const res = await fetch('/api/transactions', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      });
      const data = await res.json();
      if (res.ok) {
        router.push('/dashboard');
        router.refresh();
      } else {
        setError(data.error || 'Failed to add transaction');
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

  const isIncome = formData.type === 'INCOME';

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
          background: isIncome ? 'var(--gradient-success)' : 'var(--gradient-danger)', 
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          boxShadow: isIncome ? '0 4px 16px rgba(46,204,113,0.4)' : '0 4px 16px rgba(231,76,60,0.4)',
        }}>
          {isIncome ? <TrendingUp size={22} color="#fff" /> : <TrendingDown size={22} color="#fff" />}
        </div>
        <div>
          <h1 style={{ fontSize: '1.5rem', fontWeight: 800, color: 'var(--text-primary)' }}>
            Add {isIncome ? 'Income' : 'Expense'}
          </h1>
          <p style={{ fontSize: '0.85rem', color: 'var(--text-muted)' }}>Log a new transaction</p>
        </div>
      </motion.div>

      <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }} className="card" style={{ padding: '24px' }}>
        
        {/* Type Toggle */}
        <div style={{ display: 'flex', gap: '12px', marginBottom: '24px' }}>
          <button 
            type="button"
            onClick={() => setFormData({ ...formData, type: 'EXPENSE' })}
            style={{
              flex: 1, padding: '12px', borderRadius: 'var(--radius-md)', fontWeight: 600, fontSize: '0.9rem', cursor: 'pointer',
              border: !isIncome ? 'none' : '1.5px solid var(--border)',
              background: !isIncome ? 'var(--gradient-danger)' : 'transparent',
              color: !isIncome ? '#fff' : 'var(--text-muted)',
              display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px'
            }}
          >
            <TrendingDown size={18} /> Expense
          </button>
          <button 
            type="button"
            onClick={() => setFormData({ ...formData, type: 'INCOME' })}
            style={{
              flex: 1, padding: '12px', borderRadius: 'var(--radius-md)', fontWeight: 600, fontSize: '0.9rem', cursor: 'pointer',
              border: isIncome ? 'none' : '1.5px solid var(--border)',
              background: isIncome ? 'var(--gradient-success)' : 'transparent',
              color: isIncome ? '#fff' : 'var(--text-muted)',
              display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px'
            }}
          >
            <TrendingUp size={18} /> Income
          </button>
        </div>

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
            <label style={labelStyle}>Amount</label>
            <input style={{...inputStyle, fontSize: '1.2rem', fontWeight: 700}} type="number" step="0.01" value={formData.amount} onChange={e => setFormData({ ...formData, amount: e.target.value })} placeholder="0.00" required />
          </div>
          
          <div>
            <label style={labelStyle}>Account</label>
            {accounts.length === 0 ? (
              <p style={{ color: 'var(--text-muted)', fontSize: '0.85rem', padding: '12px', background: 'var(--bg-input)', borderRadius: 'var(--radius-md)' }}>
                No accounts found. Please <Link href="/dashboard/accounts/new" style={{color: 'var(--accent-1)'}}>add an account first</Link>.
              </p>
            ) : (
              <select style={{ ...inputStyle, cursor: 'pointer' }} value={formData.accountId} onChange={e => setFormData({ ...formData, accountId: e.target.value })} required>
                {accounts.map(acc => (
                  <option key={acc.id} value={acc.id}>
                    {acc.name} ({acc.currency}) — {acc.user.name}
                  </option>
                ))}
              </select>
            )}
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
            <div>
              <label style={labelStyle}>Category</label>
              <select style={{ ...inputStyle, cursor: 'pointer' }} value={formData.category} onChange={e => setFormData({ ...formData, category: e.target.value })} required>
                <option value="">Select...</option>
                {isIncome ? (
                  <>
                    <option value="Salary">Salary</option>
                    <option value="Bonus">Bonus</option>
                    <option value="Gift">Gift</option>
                    <option value="Other Income">Other</option>
                  </>
                ) : (
                  <>
                    <option value="Food & Dining">Food & Dining</option>
                    <option value="Rent/Mortgage">Rent/Mortgage</option>
                    <option value="Utilities">Utilities</option>
                    <option value="Shopping">Shopping</option>
                    <option value="Transportation">Transportation</option>
                    <option value="Entertainment">Entertainment</option>
                    <option value="Other Expense">Other</option>
                  </>
                )}
              </select>
            </div>
            <div>
              <label style={labelStyle}>Date</label>
              <input style={inputStyle} type="date" value={formData.date} onChange={e => setFormData({ ...formData, date: e.target.value })} required />
            </div>
          </div>

          <div>
            <label style={labelStyle}>Description (Optional)</label>
            <input style={inputStyle} value={formData.description} onChange={e => setFormData({ ...formData, description: e.target.value })} placeholder="What was this for?" />
          </div>

          <button type="submit" disabled={loading || accounts.length === 0} className="btn btn-primary" style={{ marginTop: '12px', padding: '14px', background: isIncome ? 'var(--gradient-success)' : 'var(--gradient-danger)', borderColor: 'transparent' }}>
            {loading ? 'Saving...' : `Save ${isIncome ? 'Income' : 'Expense'}`}
          </button>
        </form>
      </motion.div>
    </div>
  );
}
