'use client';

import { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Heart, MessageSquare, CheckSquare, Image as ImageIcon, Plus, CheckCircle, Upload, X, Trash2 } from 'lucide-react';
import { useAuth } from '@/context/AuthContext';

type Tab = 'moods' | 'bucket' | 'scrapbook';

export default function MemoriesPage() {
  const [activeTab, setActiveTab] = useState<Tab>('moods');

  return (
    <div className="container-app" style={{ display: 'flex', flexDirection: 'column', height: '100%', gap: '20px' }}>
      
      {/* Header */}
      <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }}
        style={{ display: 'flex', alignItems: 'center', gap: '14px', marginBottom: '10px' }}>
        <div style={{
          width: '48px', height: '48px', borderRadius: '14px',
          background: 'var(--gradient-danger)', display: 'flex',
          alignItems: 'center', justifyContent: 'center',
          boxShadow: '0 4px 16px rgba(231,76,60,0.4)',
        }}>
          <Heart size={22} color="#fff" />
        </div>
        <div>
          <h1 style={{ fontSize: '1.5rem', fontWeight: 800, color: 'var(--text-primary)' }}>Memories Engine</h1>
          <p style={{ fontSize: '0.85rem', color: 'var(--text-muted)' }}>The emotional core of your 15-year journey</p>
        </div>
      </motion.div>

      {/* Inner Layout (Sidebar + Content) */}
      <div style={{ display: 'flex', gap: '20px', flex: 1, minHeight: '600px' }}>
        
        {/* Inner Sidebar */}
        <div className="card" style={{ width: '220px', padding: '16px', display: 'flex', flexDirection: 'column', gap: '8px', border: 'none', background: 'var(--bg-card)' }}>
          {[
            { id: 'moods', icon: MessageSquare, label: 'Mood Jar' },
            { id: 'bucket', icon: CheckSquare, label: 'Bucket List' },
            { id: 'scrapbook', icon: ImageIcon, label: 'Scrapbook' }
          ].map(tab => {
            const isActive = activeTab === tab.id;
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id as Tab)}
                style={{
                  display: 'flex', alignItems: 'center', gap: '12px',
                  padding: '12px 16px', borderRadius: 'var(--radius-md)',
                  background: isActive ? 'var(--accent-1)' : 'transparent',
                  color: isActive ? '#fff' : 'var(--text-muted)',
                  border: 'none', cursor: 'pointer',
                  fontWeight: isActive ? 700 : 600,
                  transition: 'all 0.2s ease',
                  textAlign: 'left'
                }}
              >
                <tab.icon size={18} />
                {tab.label}
              </button>
            )
          })}
        </div>

        {/* Content Area */}
        <div className="card" style={{ flex: 1, padding: '24px', overflowY: 'auto', border: 'none', position: 'relative' }}>
          <AnimatePresence mode="wait">
            <motion.div
              key={activeTab}
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              transition={{ duration: 0.25 }}
              style={{ height: '100%' }}
            >
              {activeTab === 'moods' && <MoodJar />}
              {activeTab === 'bucket' && <BucketList />}
              {activeTab === 'scrapbook' && <Scrapbook />}
            </motion.div>
          </AnimatePresence>
        </div>

      </div>
    </div>
  );
}

// ==========================================
// MOOD JAR COMPONENT
// ==========================================
function MoodJar() {
  const { user } = useAuth();
  const [moods, setMoods] = useState<any[]>([]);
  const [emoji, setEmoji] = useState('😊');
  const [note, setNote] = useState('');
  const [loading, setLoading] = useState(false);

  useEffect(() => { fetchMoods(); }, []);
  
  const fetchMoods = async () => {
    const res = await fetch('/api/memories/moods');
    if (res.ok) {
      const data = await res.json();
      setMoods(data.moods);
    }
  };

  const handleDeleteMood = async (id: string) => {
    if (confirm("Delete this note?")) {
      await fetch(`/api/memories/moods/${id}`, { method: 'DELETE' });
      fetchMoods();
    }
  };

  const handlePost = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!emoji) return;
    setLoading(true);
    const res = await fetch('/api/memories/moods', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ emoji, note })
    });
    if (res.ok) {
      setNote('');
      fetchMoods();
    }
    setLoading(false);
  };

  const EMOJIS = ['😊', '😍', '😢', '😡', '😎', '😴', '❤️', '🔥', '✨'];

  return (
    <div style={{ display: 'flex', flexDirection: 'column', height: '100%' }}>
      <h2 style={{ fontSize: '1.2rem', marginBottom: '16px', color: 'var(--text-primary)' }}>Daily Mood & Notes Jar 💌</h2>
      
      <form onSubmit={handlePost} style={{ display: 'flex', gap: '10px', marginBottom: '24px', background: 'var(--bg-input)', padding: '16px', borderRadius: 'var(--radius-md)' }}>
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: '6px', width: '150px' }}>
          {EMOJIS.map(e => (
            <div key={e} onClick={() => setEmoji(e)} style={{ fontSize: '1.5rem', cursor: 'pointer', padding: '4px', background: emoji === e ? 'var(--accent-1-light)' : 'transparent', borderRadius: '8px' }}>
              {e}
            </div>
          ))}
        </div>
        <div style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: '10px' }}>
          <textarea 
            value={note} onChange={e => setNote(e.target.value)}
            placeholder="Leave a sweet note for your partner..." 
            style={{ width: '100%', padding: '12px', borderRadius: '8px', border: '1px solid var(--border)', background: 'var(--bg-primary)', color: 'var(--text-primary)', outline: 'none', resize: 'none', height: '80px' }}
          />
          <button type="submit" disabled={loading} className="btn btn-primary" style={{ alignSelf: 'flex-end' }}>
            Drop in Jar {emoji}
          </button>
        </div>
      </form>

      <div style={{ flex: 1, overflowY: 'auto', display: 'flex', flexDirection: 'column', gap: '12px' }}>
        {moods.map((m) => {
          const isMe = m.userId === user?.id;
          return (
            <motion.div key={m.id} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} 
              style={{
                alignSelf: isMe ? 'flex-end' : 'flex-start',
                maxWidth: '70%', background: isMe ? 'var(--accent-1-light)' : 'var(--bg-input)',
                padding: '12px 16px', borderRadius: '16px',
                borderBottomRightRadius: isMe ? '4px' : '16px',
                borderBottomLeftRadius: !isMe ? '4px' : '16px',
              }}>
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '4px' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                  <span style={{ fontSize: '1.2rem' }}>{m.emoji}</span>
                  <span style={{ fontSize: '0.75rem', fontWeight: 600, color: 'var(--text-muted)' }}>
                    {m.user.name} • {new Date(m.createdAt).toLocaleDateString()}
                  </span>
                </div>
                {isMe && (
                  <button onClick={() => handleDeleteMood(m.id)} className="delete-icon-btn">
                    <X size={14} />
                  </button>
                )}
              </div>
              {m.note && <p style={{ margin: 0, fontSize: '0.9rem', color: 'var(--text-primary)', lineHeight: 1.5 }}>{m.note}</p>}
            </motion.div>
          );
        })}
      </div>
    </div>
  );
}

// ==========================================
// BUCKET LIST COMPONENT
// ==========================================
function BucketList() {
  const [items, setItems] = useState<any[]>([]);
  const [title, setTitle] = useState('');
  const [loading, setLoading] = useState(false);

  useEffect(() => { fetchItems(); }, []);
  
  const fetchItems = async () => {
    const res = await fetch('/api/memories/bucket-list');
    if (res.ok) {
      const data = await res.json();
      setItems(data.items);
    }
  };

  const handleDeleteBucket = async (e: React.MouseEvent, id: string) => {
    e.stopPropagation();
    if (confirm("Delete this dream?")) {
      await fetch(`/api/memories/bucket-list/${id}`, { method: 'DELETE' });
      fetchItems();
    }
  };

  const handleAdd = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!title) return;
    setLoading(true);
    const res = await fetch('/api/memories/bucket-list', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ title })
    });
    if (res.ok) {
      setTitle('');
      fetchItems();
    }
    setLoading(false);
  };

  const handleToggle = async (id: string, isCompleted: boolean) => {
    await fetch(`/api/memories/bucket-list/${id}`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ isCompleted: !isCompleted })
    });
    fetchItems();
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', height: '100%' }}>
      <h2 style={{ fontSize: '1.2rem', marginBottom: '16px', color: 'var(--text-primary)' }}>Shared Bucket List 🪣</h2>
      
      <form onSubmit={handleAdd} style={{ display: 'flex', gap: '10px', marginBottom: '24px' }}>
        <input 
          value={title} onChange={e => setTitle(e.target.value)}
          placeholder="e.g. Visit Paris, Buy a Husky..." 
          style={{ flex: 1, padding: '12px 16px', borderRadius: '8px', border: '1px solid var(--border)', background: 'var(--bg-input)', color: 'var(--text-primary)', outline: 'none' }}
        />
        <button type="submit" disabled={loading} className="btn btn-primary" style={{ background: 'var(--gradient-hero)', border: 'none' }}>
          <Plus size={18} /> Add Dream
        </button>
      </form>

      <div style={{ flex: 1, overflowY: 'auto', display: 'flex', flexDirection: 'column', gap: '8px' }}>
        {items.map((item) => (
          <motion.div key={item.id} layout initial={{ opacity: 0 }} animate={{ opacity: 1 }}
            style={{
              display: 'flex', alignItems: 'center', gap: '12px',
              padding: '16px', borderRadius: '12px',
              background: item.isCompleted ? 'rgba(46,204,113,0.1)' : 'var(--bg-input)',
              border: '1px solid', borderColor: item.isCompleted ? 'rgba(46,204,113,0.3)' : 'var(--border)',
              cursor: 'pointer', transition: 'all 0.2s'
            }}
            onClick={() => handleToggle(item.id, item.isCompleted)}
          >
            <div style={{ color: item.isCompleted ? 'var(--success)' : 'var(--text-muted)' }}>
              <CheckCircle size={24} fill={item.isCompleted ? 'currentColor' : 'none'} />
            </div>
            <div style={{ flex: 1 }}>
              <span style={{ fontSize: '1rem', fontWeight: 600, color: item.isCompleted ? 'var(--text-muted)' : 'var(--text-primary)', textDecoration: item.isCompleted ? 'line-through' : 'none' }}>
                {item.title}
              </span>
            </div>
            <button onClick={(e) => handleDeleteBucket(e, item.id)} className="delete-icon-btn">
              <Trash2 size={16} />
            </button>
          </motion.div>
        ))}
        {items.length === 0 && <p style={{ color: 'var(--text-muted)', textAlign: 'center', marginTop: '40px' }}>No bucket list items yet. Dream big!</p>}
      </div>
    </div>
  );
}

// ==========================================
// SCRAPBOOK COMPONENT
// ==========================================
function Scrapbook() {
  const [memories, setMemories] = useState<any[]>([]);
  const [title, setTitle] = useState('');
  const [file, setFile] = useState<File | null>(null);
  const [loading, setLoading] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => { fetchMemories(); }, []);
  
  const fetchMemories = async () => {
    const res = await fetch('/api/memories/scrapbook');
    if (res.ok) {
      const data = await res.json();
      setMemories(data.memories);
    }
  };

  const handleDeleteScrapbook = async (id: string) => {
    if (confirm("Delete this photo?")) {
      await fetch(`/api/memories/scrapbook/${id}`, { method: 'DELETE' });
      fetchMemories();
    }
  };

  const handleUpload = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!title || !file) return;
    setLoading(true);
    
    const formData = new FormData();
    formData.append('title', title);
    formData.append('image', file);
    
    const res = await fetch('/api/memories/scrapbook', {
      method: 'POST',
      body: formData
    });
    
    if (res.ok) {
      setTitle('');
      setFile(null);
      if (fileInputRef.current) fileInputRef.current.value = '';
      fetchMemories();
    }
    setLoading(false);
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', height: '100%' }}>
      <h2 style={{ fontSize: '1.2rem', marginBottom: '16px', color: 'var(--text-primary)' }}>Digital Scrapbook 📸</h2>
      
      <form onSubmit={handleUpload} style={{ display: 'flex', flexWrap: 'wrap', gap: '10px', marginBottom: '24px', background: 'var(--bg-input)', padding: '16px', borderRadius: 'var(--radius-md)' }}>
        <input 
          value={title} onChange={e => setTitle(e.target.value)}
          placeholder="Photo Title (e.g. First time in Dubai!)" 
          style={{ flex: 1, minWidth: '200px', padding: '10px 16px', borderRadius: '8px', border: '1px solid var(--border)', background: 'var(--bg-primary)', color: 'var(--text-primary)', outline: 'none' }}
        />
        <input 
          type="file" accept="image/*"
          onChange={e => setFile(e.target.files ? e.target.files[0] : null)}
          ref={fileInputRef}
          style={{ padding: '10px', background: 'var(--bg-primary)', borderRadius: '8px', border: '1px solid var(--border)', color: 'var(--text-primary)' }}
        />
        <button type="submit" disabled={loading || !file || !title} className="btn btn-primary" style={{ background: 'var(--gradient-success)', border: 'none' }}>
          {loading ? 'Saving...' : <><Upload size={16} style={{marginRight: '6px'}}/> Save Memory</>}
        </button>
      </form>

      <div style={{ flex: 1, overflowY: 'auto', display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(200px, 1fr))', gap: '16px', alignContent: 'start' }}>
        {memories.map((m) => (
          <motion.div key={m.id} initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }}
            style={{
              background: '#fff', padding: '12px 12px 24px 12px', 
              borderRadius: '8px', boxShadow: '0 10px 20px rgba(0,0,0,0.2)',
              display: 'flex', flexDirection: 'column', gap: '12px'
            }}>
            <div style={{ width: '100%', aspectRatio: '1/1', background: '#e0e0e0', borderRadius: '4px', overflow: 'hidden' }}>
              <img src={m.imageUrl} alt={m.title} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <div style={{ textAlign: 'left' }}>
                <h4 style={{ margin: 0, color: '#333', fontFamily: '"Comic Sans MS", cursive, sans-serif', fontSize: '1.1rem' }}>{m.title}</h4>
                <span style={{ fontSize: '0.75rem', color: '#888' }}>{new Date(m.date).toLocaleDateString()}</span>
              </div>
              <button onClick={() => handleDeleteScrapbook(m.id)} className="delete-icon-btn">
                <Trash2 size={16} />
              </button>
            </div>
          </motion.div>
        ))}
        {memories.length === 0 && <p style={{ color: 'var(--text-muted)', gridColumn: '1 / -1', textAlign: 'center', marginTop: '40px' }}>No photos yet. Start making memories!</p>}
      </div>
    </div>
  );
}
