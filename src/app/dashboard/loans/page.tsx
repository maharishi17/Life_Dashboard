'use client';

import { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { CreditCard, Plus, ArrowRight, CheckCircle, Clock, Trash2 } from 'lucide-react';
import Link from 'next/link';
import { useAuth } from '@/context/AuthContext';

export default function LoansPage() {
  const { user } = useAuth();
  const [loans, setLoans] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchLoans = async () => {
    try {
      const res = await fetch('/api/loans');
      if (res.ok) {
        const data = await res.json();
        setLoans(data.loans || []);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id: string) => {
    if (confirm("Are you sure you want to delete this loan? This will also delete all payment history.")) {
      try {
        const res = await fetch(`/api/loans/${id}`, { method: 'DELETE' });
        if (res.ok) fetchLoans();
      } catch (error) {
        console.error("Failed to delete loan", error);
      }
    }
  };

  useEffect(() => {
    fetchLoans();
  }, []);

  const formatCurrency = (amount: number, currency: string = 'INR') => {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: currency,
      maximumFractionDigits: 0,
    }).format(amount);
  };

  const activeLoans = loans.filter(l => !l.isCleared);
  const clearedLoans = loans.filter(l => l.isCleared);

  return (
    <div className="container-app">
      {/* Header */}
      <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }}
        className="header-flex" style={{ marginBottom: '28px' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '14px' }}>
          <div style={{
            width: '48px', height: '48px', borderRadius: '14px',
            background: 'var(--gradient-danger)', display: 'flex',
            alignItems: 'center', justifyContent: 'center',
            boxShadow: '0 4px 16px rgba(231,76,60,0.4)',
          }}>
            <CreditCard size={22} color="#fff" />
          </div>
          <div>
            <h1 style={{ fontSize: '1.5rem', fontWeight: 800, color: 'var(--text-primary)' }}>Loan Tracker</h1>
            <p style={{ fontSize: '0.85rem', color: 'var(--text-muted)' }}>Manage EMIs & payoff progress</p>
          </div>
        </div>
        <Link href="/dashboard/loans/new" style={{ textDecoration: 'none' }}>
          <button className="btn btn-primary" style={{ padding: '10px 16px', display: 'flex', gap: '6px' }}>
            <Plus size={16} /> <span style={{ display: 'none' }} className="sm:inline">Add Loan</span>
          </button>
        </Link>
      </motion.div>

      {/* Loading state */}
      {loading ? (
        <div style={{ textAlign: 'center', padding: '40px', color: 'var(--text-muted)' }}>Loading loans...</div>
      ) : (
        <>
          {/* Active Loans */}
          <div style={{ marginBottom: '32px' }}>
            <p className="section-label" style={{ marginBottom: '12px' }}>Active Loans</p>
            {activeLoans.length === 0 ? (
              <div className="card" style={{ padding: '32px', textAlign: 'center', color: 'var(--text-muted)' }}>
                <CheckCircle size={40} style={{ margin: '0 auto 12px', opacity: 0.5 }} color="var(--accent-3)" />
                <p style={{ fontWeight: 600, color: 'var(--text-primary)' }}>You are debt-free!</p>
                <p style={{ fontSize: '0.85rem' }}>No active loans to track right now.</p>
              </div>
            ) : (
              <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                {activeLoans.map((loan, idx) => {
                  const paidOff = loan.principalAmount - loan.currentBalance;
                  const progressPercentage = (paidOff / loan.principalAmount) * 100;
                  
                  return (
                    <motion.div key={loan.id} initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: idx * 0.1 }}
                      className="card" style={{ padding: '24px' }}>
                      <div className="header-flex" style={{ alignItems: 'flex-start', marginBottom: '16px' }}>
                        <div>
                          <h3 style={{ fontSize: '1.1rem', fontWeight: 700, color: 'var(--text-primary)', marginBottom: '4px' }}>{loan.name}</h3>
                          <p style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>{loan.lender || 'Private Lender'}</p>
                        </div>
                        <div style={{ textAlign: 'right' }}>
                          <p style={{ fontSize: '1.2rem', fontWeight: 800, color: 'var(--accent-2)' }}>{formatCurrency(loan.currentBalance)}</p>
                          <p style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>remaining of {formatCurrency(loan.principalAmount)}</p>
                        </div>
                      </div>

                      {/* Progress Bar */}
                      <div style={{ marginBottom: '16px' }}>
                        <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.75rem', fontWeight: 600, color: 'var(--text-muted)', marginBottom: '6px' }}>
                          <span>{formatCurrency(paidOff)} Paid</span>
                          <span>{progressPercentage.toFixed(1)}%</span>
                        </div>
                        <div style={{ width: '100%', height: '8px', background: 'var(--bg-input)', borderRadius: 'var(--radius-full)', overflow: 'hidden' }}>
                          <motion.div 
                            initial={{ width: 0 }} 
                            animate={{ width: `${progressPercentage}%` }} 
                            transition={{ duration: 1, ease: 'easeOut' }}
                            style={{ height: '100%', background: 'var(--gradient-success)', borderRadius: 'var(--radius-full)' }} 
                          />
                        </div>
                      </div>

                      {/* Details & Actions */}
                      <div className="header-flex" style={{ paddingTop: '16px', borderTop: '1px solid var(--border)' }}>
                        <div style={{ display: 'flex', gap: '16px' }}>
                          <div>
                            <p style={{ fontSize: '0.7rem', textTransform: 'uppercase', color: 'var(--text-muted)', fontWeight: 600 }}>EMI Amount</p>
                            <p style={{ fontSize: '0.9rem', fontWeight: 700, color: 'var(--text-primary)' }}>{formatCurrency(loan.emiAmount)}</p>
                          </div>
                          {loan.interestRate && (
                            <div>
                              <p style={{ fontSize: '0.7rem', textTransform: 'uppercase', color: 'var(--text-muted)', fontWeight: 600 }}>Interest</p>
                              <p style={{ fontSize: '0.9rem', fontWeight: 700, color: 'var(--text-primary)' }}>{loan.interestRate}%</p>
                            </div>
                          )}
                        </div>
                        <div style={{ display: 'flex', gap: '8px' }}>
                          <button onClick={() => handleDelete(loan.id)} className="delete-icon-btn" title="Delete Loan">
                            <Trash2 size={16} />
                          </button>
                          <Link href={`/dashboard/loans/${loan.id}/pay`} style={{ textDecoration: 'none' }}>
                            <button className="btn btn-ghost" style={{ fontSize: '0.85rem', padding: '8px 12px', color: 'var(--accent-2)', borderColor: 'var(--accent-2)' }}>
                              Log EMI
                            </button>
                          </Link>
                        </div>
                      </div>
                    </motion.div>
                  );
                })}
              </div>
            )}
          </div>

          {/* Cleared Loans */}
          {clearedLoans.length > 0 && (
            <div>
              <p className="section-label" style={{ marginBottom: '12px' }}>Cleared Loans</p>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                {clearedLoans.map(loan => (
                  <div key={loan.id} className="card header-flex" style={{ padding: '16px', opacity: 0.7 }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                      <div style={{ width: '32px', height: '32px', borderRadius: '50%', background: 'var(--gradient-success)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                        <CheckCircle size={16} color="#fff" />
                      </div>
                      <div>
                        <h4 style={{ fontSize: '0.9rem', fontWeight: 700, color: 'var(--text-primary)' }}>{loan.name}</h4>
                        <p style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>Cleared on {new Date(loan.clearedAt).toLocaleDateString()}</p>
                      </div>
                    </div>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
                      <p style={{ fontSize: '0.9rem', fontWeight: 700, color: 'var(--text-primary)' }}>
                        {formatCurrency(loan.principalAmount)}
                      </p>
                      <button onClick={() => handleDelete(loan.id)} className="delete-icon-btn" title="Delete Loan">
                        <Trash2 size={16} />
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
