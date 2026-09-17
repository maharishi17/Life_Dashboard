'use client';

import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { PieChart, Pie, Cell, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip as RechartsTooltip, ResponsiveContainer, Legend } from 'recharts';
import { BarChart3, TrendingUp, TrendingDown, PieChart as PieChartIcon } from 'lucide-react';

export default function AnalyticsPage() {
  const [data, setData] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchAnalytics() {
      try {
        const res = await fetch('/api/analytics');
        if (res.ok) {
          const json = await res.json();
          setData(json);
        }
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    }
    fetchAnalytics();
  }, []);

  const formatCurrency = (amount: number) => {
    if (amount >= 100000) return `₹${(amount / 100000).toFixed(1)}L`;
    if (amount >= 1000) return `₹${(amount / 1000).toFixed(1)}k`;
    return `₹${amount}`;
  };

  const COLORS = ['#5b6af0', '#2ecc71', '#f5a623', '#9b59b6', '#e74c3c', '#1abc9c', '#34495e'];

  if (loading) {
    return <div className="container-app" style={{ textAlign: 'center', padding: '40px', color: 'var(--text-muted)' }}>Loading Analytics...</div>;
  }

  if (!data || (data.categoryData.length === 0 && data.goalData.length === 0)) {
    return (
      <div className="container-app">
        <h1 style={{ fontSize: '1.5rem', fontWeight: 800, marginBottom: '20px' }}>Analytics</h1>
        <div className="card" style={{ padding: '32px', textAlign: 'center' }}>
          <p style={{ color: 'var(--text-muted)' }}>Not enough data yet. Add some income and expenses to see your charts!</p>
        </div>
      </div>
    );
  }

  return (
    <div className="container-app">
      {/* Header */}
      <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }}
        className="header-flex" style={{ marginBottom: '28px' }}>
        <div style={{
          width: '48px', height: '48px', borderRadius: '14px',
          background: 'var(--gradient-hero)', display: 'flex',
          alignItems: 'center', justifyContent: 'center',
          boxShadow: '0 4px 16px rgba(91,106,240,0.4)',
        }}>
          <BarChart3 size={22} color="#fff" />
        </div>
        <div>
          <h1 style={{ fontSize: '1.5rem', fontWeight: 800, color: 'var(--text-primary)' }}>Analytics</h1>
          <p style={{ fontSize: '0.85rem', color: 'var(--text-muted)' }}>Your 15-year financial overview</p>
        </div>
      </motion.div>

      {/* Summary Cards */}
      <div className="flex-col-mobile" style={{ marginBottom: '32px' }}>
        <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }} className="card" style={{ padding: '16px', flex: 1 }}>
          <p style={{ fontSize: '0.75rem', fontWeight: 600, color: 'var(--text-muted)', textTransform: 'uppercase' }}>Total Income</p>
          <p style={{ fontSize: '1.2rem', fontWeight: 800, color: 'var(--accent-3)' }}>{formatCurrency(data.summary.totalIncome)}</p>
        </motion.div>
        <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }} className="card" style={{ padding: '16px', flex: 1 }}>
          <p style={{ fontSize: '0.75rem', fontWeight: 600, color: 'var(--text-muted)', textTransform: 'uppercase' }}>Total Expense</p>
          <p style={{ fontSize: '1.2rem', fontWeight: 800, color: 'var(--accent-2)' }}>{formatCurrency(data.summary.totalExpense)}</p>
        </motion.div>
        <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3 }} className="card" style={{ padding: '16px', flex: 1 }}>
          <p style={{ fontSize: '0.75rem', fontWeight: 600, color: 'var(--text-muted)', textTransform: 'uppercase' }}>Savings Rate</p>
          <p style={{ fontSize: '1.2rem', fontWeight: 800, color: 'var(--accent-1)' }}>{data.summary.savingsRate.toFixed(1)}%</p>
        </motion.div>
      </div>

      {/* 6-Month Trend */}
      <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.4 }} className="card" style={{ padding: '24px', marginBottom: '24px' }}>
        <h3 style={{ fontSize: '1.1rem', fontWeight: 700, marginBottom: '20px', display: 'flex', alignItems: 'center', gap: '8px' }}>
          <TrendingUp size={18} color="var(--accent-1)" /> Income vs Expense (6 Months)
        </h3>
        <div className="scroll-x" style={{ width: '100%', height: '250px' }}>
          <div style={{ minWidth: '500px', height: '100%', flex: 1 }}>
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={data.monthlyData} margin={{ top: 5, right: 0, left: -20, bottom: 5 }}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="var(--border)" />
                <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{ fontSize: 12, fill: 'var(--text-muted)' }} dy={10} />
                <YAxis axisLine={false} tickLine={false} tick={{ fontSize: 12, fill: 'var(--text-muted)' }} tickFormatter={formatCurrency} />
                <RechartsTooltip 
                  cursor={{ fill: 'var(--border)', opacity: 0.4 }}
                  contentStyle={{ background: 'var(--bg-card)', border: '1px solid var(--border)', borderRadius: '8px', color: 'var(--text-primary)' }}
                  itemStyle={{ fontWeight: 600 }}
                />
                <Legend iconType="circle" wrapperStyle={{ fontSize: '12px', paddingTop: '10px' }} />
                <Bar dataKey="income" name="Income" fill="var(--accent-3)" radius={[4, 4, 0, 0]} barSize={20} />
                <Bar dataKey="expense" name="Expense" fill="var(--accent-2)" radius={[4, 4, 0, 0]} barSize={20} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
      </motion.div>

      {/* Category Breakdown & Goals */}
      <div style={{ display: 'grid', gridTemplateColumns: '1fr', gap: '24px' }}>
        {data.categoryData.length > 0 && (
          <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.5 }} className="card" style={{ padding: '24px' }}>
            <h3 style={{ fontSize: '1.1rem', fontWeight: 700, marginBottom: '20px', display: 'flex', alignItems: 'center', gap: '8px' }}>
              <PieChartIcon size={18} color="var(--accent-5)" /> Expense Categories
            </h3>
            <div style={{ width: '100%', height: '250px' }}>
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={data.categoryData}
                    cx="50%" cy="50%"
                    innerRadius={60} outerRadius={80}
                    paddingAngle={5} dataKey="value"
                  >
                    {data.categoryData.map((entry: any, index: number) => (
                      <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                    ))}
                  </Pie>
                  <RechartsTooltip 
                    contentStyle={{ background: 'var(--bg-card)', border: '1px solid var(--border)', borderRadius: '8px', color: 'var(--text-primary)' }}
                    itemStyle={{ fontWeight: 600 }}
                    formatter={(value: any) => new Intl.NumberFormat('en-IN', { style: 'currency', currency: 'INR' }).format(Number(value))}
                  />
                  <Legend iconType="circle" wrapperStyle={{ fontSize: '12px' }} />
                </PieChart>
              </ResponsiveContainer>
            </div>
          </motion.div>
        )}
      </div>
    </div>
  );
}
