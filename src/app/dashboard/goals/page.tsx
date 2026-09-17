'use client';

import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { Target, Plus, Lock, CheckCircle, ArrowRight, Trash2 } from 'lucide-react';
import Link from 'next/link';

export default function GoalsPage() {
  const [goals, setGoals] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchGoals = async () => {
    try {
      const res = await fetch('/api/goals');
      if (res.ok) {
        const data = await res.json();
        setGoals(data.goals || []);
      }
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id: string) => {
    if (confirm("Are you sure you want to delete this goal? All its contributions will be deleted.")) {
      try {
        const res = await fetch(`/api/goals/${id}`, { method: 'DELETE' });
        if (res.ok) fetchGoals();
      } catch (error) {
        console.error("Failed to delete goal", error);
      }
    }
  };

  useEffect(() => {
    fetchGoals();
  }, []);

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
      maximumFractionDigits: 0,
    }).format(amount);
  };

  const activeGoals = goals.filter(g => g.status === 'ACTIVE');
  const lockedGoals = goals.filter(g => g.status === 'LOCKED');
  const achievedGoals = goals.filter(g => g.status === 'ACHIEVED');

  return (
    <div className="container-app">
      {/* Header */}
      <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }}
        className="header-flex" style={{ marginBottom: '28px' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '14px' }}>
          <div style={{
            width: '48px', height: '48px', borderRadius: '14px',
            background: 'var(--gradient-purple)', display: 'flex',
            alignItems: 'center', justifyContent: 'center',
            boxShadow: '0 4px 16px rgba(155,89,182,0.4)',
          }}>
            <Target size={22} color="#fff" />
          </div>
          <div>
            <h1 style={{ fontSize: '1.5rem', fontWeight: 800, color: 'var(--text-primary)' }}>Goals Engine</h1>
            <p style={{ fontSize: '0.85rem', color: 'var(--text-muted)' }}>Dreams into reality</p>
          </div>
        </div>
        <Link href="/dashboard/goals/new" style={{ textDecoration: 'none' }}>
          <button className="btn btn-primary" style={{ padding: '10px 16px', display: 'flex', gap: '6px', background: 'var(--gradient-purple)', borderColor: 'transparent' }}>
            <Plus size={16} /> <span style={{ display: 'none' }} className="sm:inline">Add Goal</span>
          </button>
        </Link>
      </motion.div>

      {loading ? (
        <div style={{ textAlign: 'center', padding: '40px', color: 'var(--text-muted)' }}>Loading goals...</div>
      ) : (
        <>
          {/* Active Goals */}
          <div style={{ marginBottom: '32px' }}>
            <p className="section-label" style={{ marginBottom: '12px' }}>In Progress</p>
            {activeGoals.length === 0 ? (
              <div className="card" style={{ padding: '32px', textAlign: 'center', color: 'var(--text-muted)' }}>
                <Target size={40} style={{ margin: '0 auto 12px', opacity: 0.5 }} color="var(--accent-5)" />
                <p style={{ fontWeight: 600, color: 'var(--text-primary)' }}>No active goals</p>
                <p style={{ fontSize: '0.85rem' }}>Set your first financial goal to get started!</p>
              </div>
            ) : (
              <div style={{ display: 'grid', gridTemplateColumns: '1fr', gap: '16px' }}>
                {activeGoals.map((goal, idx) => {
                  const progress = Math.min((goal.currentAmount / goal.targetAmount) * 100, 100);
                  
                  return (
                    <motion.div key={goal.id} initial={{ opacity: 0, scale: 0.98 }} animate={{ opacity: 1, scale: 1 }} transition={{ delay: idx * 0.1 }}
                      className="card" style={{ padding: '24px', border: '1.5px solid var(--accent-5)' }}>
                      <div className="header-flex" style={{ alignItems: 'center', marginBottom: '20px' }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                          <span style={{ fontSize: '2rem' }}>{goal.emoji}</span>
                          <div>
                            <h3 style={{ fontSize: '1.2rem', fontWeight: 800, color: 'var(--text-primary)' }}>{goal.name}</h3>
                            <p style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>Target: {formatCurrency(goal.targetAmount)}</p>
                          </div>
                        </div>
                        <div style={{ textAlign: 'right', display: 'flex', flexDirection: 'column', alignItems: 'flex-end', gap: '8px' }}>
                          <button onClick={() => handleDelete(goal.id)} className="delete-icon-btn" title="Delete Goal">
                            <Trash2 size={16} />
                          </button>
                          <div>
                            <p style={{ fontSize: '1.3rem', fontWeight: 800, color: 'var(--accent-5)' }}>{formatCurrency(goal.currentAmount)}</p>
                            <p style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>Saved</p>
                          </div>
                        </div>
                      </div>

                      <div style={{ marginBottom: '20px' }}>
                        <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.75rem', fontWeight: 700, color: 'var(--text-primary)', marginBottom: '8px' }}>
                          <span>Progress</span>
                          <span>{progress.toFixed(1)}%</span>
                        </div>
                        <div style={{ width: '100%', height: '12px', background: 'var(--bg-input)', borderRadius: 'var(--radius-full)', overflow: 'hidden' }}>
                          <motion.div 
                            initial={{ width: 0 }} 
                            animate={{ width: `${progress}%` }} 
                            transition={{ duration: 1, ease: 'easeOut' }}
                            style={{ height: '100%', background: 'var(--gradient-purple)', borderRadius: 'var(--radius-full)' }} 
                          />
                        </div>
                      </div>

                      <Link href={`/dashboard/goals/${goal.id}/contribute`} style={{ textDecoration: 'none' }}>
                        <button className="btn btn-primary" style={{ width: '100%', padding: '12px', background: 'var(--gradient-purple)', borderColor: 'transparent', display: 'flex', justifyContent: 'center', gap: '8px' }}>
                          Add Funds <ArrowRight size={16} />
                        </button>
                      </Link>
                    </motion.div>
                  );
                })}
              </div>
            )}
          </div>

          {/* Locked Goals */}
          {lockedGoals.length > 0 && (
            <div style={{ marginBottom: '32px' }}>
              <p className="section-label" style={{ marginBottom: '12px' }}>Locked (Unlocks Later)</p>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                {lockedGoals.map(goal => (
                  <div key={goal.id} className="card header-flex" style={{ padding: '20px', alignItems: 'center', opacity: 0.6, background: 'var(--bg-input)' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
                      <div style={{ width: '40px', height: '40px', borderRadius: '50%', background: 'var(--border)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                        <Lock size={18} color="var(--text-muted)" />
                      </div>
                      <div>
                        <h4 style={{ fontSize: '1rem', fontWeight: 700, color: 'var(--text-primary)' }}>{goal.emoji} {goal.name}</h4>
                        <p style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>
                          Unlocks after: <strong style={{color: 'var(--text-primary)'}}>{goal.unlocksGoal?.name || 'Previous goal'}</strong>
                        </p>
                      </div>
                    </div>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
                      <p style={{ fontSize: '0.9rem', fontWeight: 700, color: 'var(--text-muted)' }}>
                        {formatCurrency(goal.targetAmount)}
                      </p>
                      <button onClick={() => handleDelete(goal.id)} className="delete-icon-btn" title="Delete Goal">
                        <Trash2 size={16} />
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Achieved Goals */}
          {achievedGoals.length > 0 && (
            <div>
              <p className="section-label" style={{ marginBottom: '12px' }}>Achieved 🎉</p>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                {achievedGoals.map(goal => (
                  <div key={goal.id} className="card header-flex" style={{ padding: '20px', alignItems: 'center', background: 'var(--gradient-success)', color: '#fff' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
                      <span style={{ fontSize: '1.8rem' }}>{goal.emoji}</span>
                      <div>
                        <h4 style={{ fontSize: '1.1rem', fontWeight: 800 }}>{goal.name}</h4>
                        <p style={{ fontSize: '0.8rem', opacity: 0.8 }}>
                          Target reached! ({formatCurrency(goal.targetAmount)})
                        </p>
                      </div>
                    </div>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                      <CheckCircle size={32} color="rgba(255,255,255,0.5)" />
                      <button onClick={() => handleDelete(goal.id)} className="delete-icon-btn" title="Delete Goal">
                        <Trash2 size={18} />
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </>
      )}
    </div>
  );
}
