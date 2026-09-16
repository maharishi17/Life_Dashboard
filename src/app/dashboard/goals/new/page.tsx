'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { motion, AnimatePresence } from 'framer-motion';
import { Target, AlertCircle, ArrowLeft } from 'lucide-react';
import Link from 'next/link';

export default function NewGoalPage() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [existingGoals, setExistingGoals] = useState<any[]>([]);
  
  const [formData, setFormData] = useState({
    name: '',
    emoji: '🎯',
    targetAmount: '',
    targetDate: '',
    unlockAfterGoalId: '',
  });

  useEffect(() => {
    async function fetchGoals() {
      try {
        const res = await fetch('/api/goals');
        if (res.ok) {
          const data = await res.json();
          setExistingGoals(data.goals);
        }
      } catch (err) {
        console.error(err);
      }
    }
    fetchGoals();
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.name) { setError('Goal name is required'); return; }
    if (!formData.targetAmount || parseFloat(formData.targetAmount) <= 0) { setError('Valid target amount is required'); return; }
    
    setLoading(true);
    setError('');
    
    // Determine unlock order based on the selected prerequisite goal
    let unlockOrder = existingGoals.length;
    if (formData.unlockAfterGoalId) {
      const prerequisite = existingGoals.find(g => g.id === formData.unlockAfterGoalId);
      if (prerequisite) {
        unlockOrder = prerequisite.unlockOrder + 1;
      }
    }

    try {
      const res = await fetch('/api/goals', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ ...formData, unlockOrder }),
      });
      const data = await res.json();
      if (res.ok) {
        router.push('/dashboard/goals');
        router.refresh();
      } else {
        setError(data.error || 'Failed to add goal');
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

  const EMOJIS = ['🎯', '💍', '🚗', '🏠', '✈️', '👶', '🏥', '🎉', '💻', '🎓'];

  return (
    <div className="container-app">
      <div style={{ marginBottom: '24px' }}>
        <Link href="/dashboard/goals" style={{ display: 'inline-flex', alignItems: 'center', gap: '6px', color: 'var(--text-muted)', textDecoration: 'none', fontSize: '0.9rem', fontWeight: 600 }}>
          <ArrowLeft size={16} /> Back to Goals
        </Link>
      </div>

      <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }}
        style={{ display: 'flex', alignItems: 'center', gap: '14px', marginBottom: '28px' }}>
        <div style={{
          width: '48px', height: '48px', borderRadius: '14px',
          background: 'var(--gradient-purple)', display: 'flex',
          alignItems: 'center', justifyContent: 'center',
          boxShadow: '0 4px 16px rgba(155,89,182,0.4)',
        }}>
          <Target size={22} color="#fff" />
        </div>
        <div>
          <h1 style={{ fontSize: '1.5rem', fontWeight: 800, color: 'var(--text-primary)' }}>Set a Goal</h1>
          <p style={{ fontSize: '0.85rem', color: 'var(--text-muted)' }}>What are you saving for?</p>
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

        <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
          
          <div>
            <label style={labelStyle}>Choose an Emoji</label>
            <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
              {EMOJIS.map(emoji => (
                <button
                  key={emoji} type="button"
                  onClick={() => setFormData({ ...formData, emoji })}
                  style={{
                    fontSize: '1.5rem', width: '44px', height: '44px', borderRadius: '12px', cursor: 'pointer',
                    background: formData.emoji === emoji ? 'var(--accent-5)' : 'var(--bg-input)',
                    border: formData.emoji === emoji ? 'none' : '1.5px solid var(--border)',
                    boxShadow: formData.emoji === emoji ? '0 4px 12px rgba(155,89,182,0.4)' : 'none',
                    display: 'flex', alignItems: 'center', justifyContent: 'center'
                  }}
                >
                  {emoji}
                </button>
              ))}
            </div>
          </div>

          <div>
            <label style={labelStyle}>Goal Name</label>
            <input style={inputStyle} value={formData.name} onChange={e => setFormData({ ...formData, name: e.target.value })} placeholder="e.g. Marriage, Car, Emergency Fund" required />
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
            <div>
              <label style={labelStyle}>Target Amount</label>
              <input style={inputStyle} type="number" step="0.01" value={formData.targetAmount} onChange={e => setFormData({ ...formData, targetAmount: e.target.value })} placeholder="0.00" required />
            </div>
            <div>
              <label style={labelStyle}>Target Date (Optional)</label>
              <input style={inputStyle} type="date" value={formData.targetDate} onChange={e => setFormData({ ...formData, targetDate: e.target.value })} />
            </div>
          </div>

          <div>
            <label style={labelStyle}>Unlock After (Optional)</label>
            <p style={{ fontSize: '0.75rem', color: 'var(--text-muted)', marginBottom: '8px' }}>
              Select a goal that must be completed before this one unlocks.
            </p>
            <select style={{ ...inputStyle, cursor: 'pointer' }} value={formData.unlockAfterGoalId} onChange={e => setFormData({ ...formData, unlockAfterGoalId: e.target.value })}>
              <option value="">None (Always Active)</option>
              {existingGoals.map(g => (
                <option key={g.id} value={g.id}>{g.emoji} {g.name}</option>
              ))}
            </select>
          </div>

          <button type="submit" disabled={loading} className="btn btn-primary" style={{ marginTop: '12px', padding: '14px', background: 'var(--gradient-purple)', borderColor: 'transparent' }}>
            {loading ? 'Adding...' : 'Add Goal'}
          </button>
        </form>
      </motion.div>
    </div>
  );
}
