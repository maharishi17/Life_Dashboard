"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Coffee,
  Shield,
  Calendar,
  Tv,
  Heart,
  TrendingUp,
  CheckCircle,
  Plus,
  Trash2,
  X,
} from "lucide-react";
import { useAuth } from "@/context/AuthContext";

type Tab = "lifestyle" | "timeline" | "vault";

export default function LifeHubPage() {
  const [activeTab, setActiveTab] = useState<Tab>("lifestyle");

  return (
    <div
      className="container-app"
      style={{
        display: "flex",
        flexDirection: "column",
        height: "100%",
        gap: "20px",
      }}
    >
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        style={{
          display: "flex",
          alignItems: "center",
          gap: "14px",
          marginBottom: "10px",
        }}
      >
        <div
          style={{
            width: "48px",
            height: "48px",
            borderRadius: "14px",
            background: "var(--gradient-hero)",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            boxShadow: "0 4px 16px rgba(91,106,240,0.4)",
          }}
        >
          <Coffee size={22} color="#fff" />
        </div>
        <div>
          <h1
            style={{
              fontSize: "1.5rem",
              fontWeight: 800,
              color: "var(--text-primary)",
            }}
          >
            Life Hub
          </h1>
          <p style={{ fontSize: "0.85rem", color: "var(--text-muted)" }}>
            The master operating system for your 15-year vision
          </p>
        </div>
      </motion.div>

      {/* Main Layout */}
      <div
        style={{ display: "flex", gap: "24px", flex: 1, minHeight: "600px" }}
      >
        {/* Massive Cards Sidebar */}
        <div
          style={{
            width: "280px",
            display: "flex",
            flexDirection: "column",
            gap: "16px",
          }}
        >
          <HubCard
            icon={Coffee}
            title="Lifestyle & Planning"
            desc="Subscriptions, Marriage, Vision"
            isActive={activeTab === "lifestyle"}
            onClick={() => setActiveTab("lifestyle")}
            color="var(--accent)"
          />
          <HubCard
            icon={Calendar}
            title="Timeline & Journey"
            desc="Dates, Master Calendar (Phase 13)"
            isActive={activeTab === "timeline"}
            onClick={() => setActiveTab("timeline")}
            color="var(--warning)"
          />
          <HubCard
            icon={Shield}
            title="Privacy & Vault"
            desc="Passports, Passwords (Phase 14)"
            isActive={activeTab === "vault"}
            onClick={() => setActiveTab("vault")}
            color="var(--danger)"
          />
        </div>

        {/* Dynamic Content Area */}
        <div
          className="card"
          style={{
            flex: 1,
            padding: "24px",
            overflowY: "auto",
            border: "none",
            position: "relative",
          }}
        >
          <AnimatePresence mode="wait">
            <motion.div
              key={activeTab}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.25 }}
              style={{ height: "100%" }}
            >
              {activeTab === "lifestyle" && <LifestyleEngine />}
              {activeTab === "timeline" && <TimelineEngine />}
              {activeTab === "vault" && <PrivacyVault />}
            </motion.div>
          </AnimatePresence>
        </div>
      </div>
    </div>
  );
}

// Hub Card Component
function HubCard({ icon: Icon, title, desc, isActive, onClick, color }: any) {
  return (
    <motion.div 
      whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}
      onClick={onClick}
      style={{
        background: isActive ? 'var(--bg-card)' : 'var(--bg-input)',
        border: `2px solid ${isActive ? color : 'transparent'}`,
        borderRadius: '16px', padding: '20px', cursor: 'pointer',
        display: 'flex', flexDirection: 'column', gap: '12px',
        boxShadow: isActive ? `0 8px 24px ${color}20` : 'none',
        transition: 'all 0.3s ease'
      }}
    >
      <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
        <div style={{ background: `${color}20`, padding: '10px', borderRadius: '12px', color: color }}>
          <Icon size={24} />
        </div>
        <div>
          <h3 style={{ margin: 0, fontSize: '1.1rem', color: 'var(--text-primary)' }}>{title}</h3>
          <span style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>{desc}</span>
        </div>
      </div>
    </motion.div>
  );
}

// ==========================================
// PHASE 12: LIFESTYLE ENGINE
// ==========================================
function LifestyleEngine() {
  const [subTab, setSubTab] = useState<
    "subs" | "marriage" | "vision" | "car" | "family"
  >("marriage");

  return (
    <div style={{ display: "flex", flexDirection: "column", height: "100%" }}>
      {/* Sub Navigation */}
      <div
        style={{
          display: "flex",
          gap: "12px",
          borderBottom: "1px solid var(--border)",
          paddingBottom: "16px",
          marginBottom: "24px",
          flexWrap: "wrap",
        }}
      >
        <button
          onClick={() => setSubTab("marriage")}
          className={subTab === "marriage" ? "btn btn-primary" : "btn"}
          style={{
            background:
              subTab === "marriage"
                ? "var(--gradient-hero)"
                : "var(--bg-input)",
          }}
        >
          <Heart size={16} /> Marriage Prep
        </button>
        <button
          onClick={() => setSubTab("subs")}
          className={subTab === "subs" ? "btn btn-primary" : "btn"}
          style={{
            background:
              subTab === "subs" ? "var(--gradient-hero)" : "var(--bg-input)",
          }}
        >
          <Tv size={16} /> Subscriptions
        </button>
        <button
          onClick={() => setSubTab("vision")}
          className={subTab === "vision" ? "btn btn-primary" : "btn"}
          style={{
            background:
              subTab === "vision" ? "var(--gradient-hero)" : "var(--bg-input)",
          }}
        >
          <TrendingUp size={16} /> 15-Year Vision
        </button>
        <button
          onClick={() => setSubTab("car")}
          className={subTab === "car" ? "btn btn-primary" : "btn"}
          style={{
            background:
              subTab === "car" ? "var(--gradient-hero)" : "var(--bg-input)",
          }}
        >
          <Shield size={16} /> Car Plan
        </button>
        <button
          onClick={() => setSubTab("family")}
          className={subTab === "family" ? "btn btn-primary" : "btn"}
          style={{
            background:
              subTab === "family" ? "var(--gradient-hero)" : "var(--bg-input)",
          }}
        >
          <Heart size={16} /> Family Planning
        </button>
      </div>

      <div style={{ flex: 1, overflowY: "auto" }}>
        {subTab === "subs" && <Subscriptions />}
        {subTab === "marriage" && <MarriagePrep />}
        {subTab === "vision" && <VisionPlanner />}
        {subTab === "car" && <GenericPlanner title="Car Plan" description="Plan your dream car, budget, and timeline here." planType="CAR_PLAN" />}
        {subTab === "family" && <GenericPlanner title="Children / Family Planning" description="Discuss and plan your family future, kids, and timelines." planType="FAMILY_PLAN" />}
      </div>
    </div>
  );
}

// ---------------------------
// 1. Marriage Prep Checklist
// ---------------------------
function MarriagePrep() {
  const [items, setItems] = useState<any[]>([]);
  const [name, setName] = useState("");
  const [cost, setCost] = useState("");

  useEffect(() => {
    fetchItems();
  }, []);

  const fetchItems = async () => {
    const res = await fetch("/api/lifestyle/marriage-prep");
    if (res.ok) setItems((await res.json()).items);
  };

  const handleDeletePrep = async (e: React.MouseEvent, id: string) => {
    e.stopPropagation();
    if (confirm("Delete this item?")) {
      await fetch(`/api/lifestyle/marriage-prep/${id}`, { method: 'DELETE' });
      fetchItems();
    }
  };

  const handleAdd = async (e: React.FormEvent) => {
    e.preventDefault();
    await fetch("/api/lifestyle/marriage-prep", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ name, estimatedCost: cost }),
    });
    setName("");
    setCost("");
    fetchItems();
  };

  const toggleBought = async (id: string, current: boolean) => {
    await fetch(`/api/lifestyle/marriage-prep/${id}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ isBought: !current }),
    });
    fetchItems();
  };

  const totalBudget = items.reduce((acc, curr) => acc + curr.estimatedCost, 0);
  const spent = items
    .filter((i) => i.isBought)
    .reduce((acc, curr) => acc + curr.estimatedCost, 0);

  return (
    <div>
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          marginBottom: "20px",
        }}
      >
        <h2 style={{ color: "var(--text-primary)" }}>Marriage Budget & Prep</h2>
        <div
          style={{
            background: "var(--bg-input)",
            padding: "10px 16px",
            borderRadius: "8px",
            border: "1px solid var(--border)",
          }}
        >
          <span style={{ color: "var(--text-muted)", fontSize: "0.85rem" }}>
            Total Budget:{" "}
          </span>
          <span style={{ color: "var(--warning)", fontWeight: "bold" }}>
            ₹{totalBudget.toLocaleString()}
          </span>
        </div>
      </div>

      <form
        onSubmit={handleAdd}
        style={{ display: "flex", gap: "10px", marginBottom: "24px" }}
      >
        <input
          value={name}
          onChange={(e) => setName(e.target.value)}
          placeholder="Item (e.g. Bed, TV, Sofa)"
          style={{
            flex: 2,
            padding: "10px",
            borderRadius: "8px",
            border: "1px solid var(--border)",
            background: "var(--bg-input)",
            color: "#fff",
          }}
          required
        />
        <input
          value={cost}
          onChange={(e) => setCost(e.target.value)}
          type="number"
          placeholder="Est. Cost (₹)"
          style={{
            flex: 1,
            padding: "10px",
            borderRadius: "8px",
            border: "1px solid var(--border)",
            background: "var(--bg-input)",
            color: "#fff",
          }}
          required
        />
        <button className="btn btn-primary" type="submit">
          <Plus size={16} /> Add
        </button>
      </form>

      <div style={{ display: "flex", flexDirection: "column", gap: "8px" }}>
        {items.map((item) => (
          <div
            key={item.id}
            onClick={() => toggleBought(item.id, item.isBought)}
            style={{
              display: "flex",
              justifyContent: "space-between",
              padding: "16px",
              background: item.isBought
                ? "rgba(46,204,113,0.1)"
                : "var(--bg-card)",
              border: `1px solid ${item.isBought ? "var(--success)" : "var(--border)"}`,
              borderRadius: "8px",
              cursor: "pointer",
              transition: "0.2s",
            }}
          >
            <div style={{ display: "flex", alignItems: "center", gap: "12px" }}>
              <CheckCircle
                color={item.isBought ? "var(--success)" : "var(--text-muted)"}
                size={20}
              />
              <span
                style={{
                  color: item.isBought ? "var(--text-muted)" : "#fff",
                  textDecoration: item.isBought ? "line-through" : "none",
                  fontWeight: 600,
                }}
              >
                {item.name}
              </span>
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
              <span style={{ color: "var(--warning)", fontWeight: "bold" }}>
                ₹{item.estimatedCost.toLocaleString()}
              </span>
              <button onClick={(e) => handleDeletePrep(e, item.id)} className="delete-icon-btn">
                <X size={16} />
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

// ---------------------------
// 2. Subscriptions
// ---------------------------
function Subscriptions() {
  const [subs, setSubs] = useState<any[]>([]);
  const [name, setName] = useState("");
  const [cost, setCost] = useState("");

  useEffect(() => {
    fetchSubs();
  }, []);

  const fetchSubs = async () => {
    const res = await fetch("/api/lifestyle/subscriptions");
    if (res.ok) setSubs((await res.json()).subscriptions);
  };

  const handleAdd = async (e: React.FormEvent) => {
    e.preventDefault();
    await fetch("/api/lifestyle/subscriptions", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ name, cost }),
    });
    setName("");
    setCost("");
    fetchSubs();
  };

  const handleDelete = async (id: string) => {
    await fetch(`/api/lifestyle/subscriptions/${id}`, { method: "DELETE" });
    fetchSubs();
  };

  const monthlyCost = subs.reduce((acc, curr) => acc + curr.cost, 0);

  return (
    <div>
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          marginBottom: "20px",
        }}
      >
        <h2 style={{ color: "var(--text-primary)" }}>Monthly Subscriptions</h2>
        <div
          style={{
            background: "rgba(231,76,60,0.1)",
            padding: "10px 16px",
            borderRadius: "8px",
            border: "1px solid var(--danger)",
          }}
        >
          <span style={{ color: "var(--danger)" }}>
            Total Drain: <b>₹{monthlyCost.toLocaleString()} / mo</b>
          </span>
        </div>
      </div>

      <form
        onSubmit={handleAdd}
        style={{ display: "flex", gap: "10px", marginBottom: "24px" }}
      >
        <input
          value={name}
          onChange={(e) => setName(e.target.value)}
          placeholder="Service (Netflix, Gym)"
          style={{
            flex: 2,
            padding: "10px",
            borderRadius: "8px",
            border: "1px solid var(--border)",
            background: "var(--bg-input)",
            color: "#fff",
          }}
          required
        />
        <input
          value={cost}
          onChange={(e) => setCost(e.target.value)}
          type="number"
          placeholder="Cost/mo (₹)"
          style={{
            flex: 1,
            padding: "10px",
            borderRadius: "8px",
            border: "1px solid var(--border)",
            background: "var(--bg-input)",
            color: "#fff",
          }}
          required
        />
        <button className="btn btn-primary" type="submit">
          <Plus size={16} /> Add
        </button>
      </form>

      <div
        style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "16px" }}
      >
        {subs.map((sub) => (
          <div
            key={sub.id}
            style={{
              padding: "16px",
              background: "var(--bg-card)",
              border: "1px solid var(--border)",
              borderRadius: "12px",
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
            }}
          >
            <div>
              <h4 style={{ margin: "0 0 4px 0", color: "#fff" }}>{sub.name}</h4>
              <span style={{ color: "var(--text-muted)", fontSize: "0.85rem" }}>
                Monthly
              </span>
            </div>
            <div style={{ display: "flex", alignItems: "center", gap: "16px" }}>
              <span style={{ color: "var(--danger)", fontWeight: "bold" }}>
                - ₹{sub.cost}
              </span>
              <button
                onClick={() => handleDelete(sub.id)}
                className="delete-icon-btn"
              >
                <Trash2 size={16} />
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

// ---------------------------
// 3. Vision Planner (LPA Calculator)
// ---------------------------
function VisionPlanner() {
  const [myLpa, setMyLpa] = useState(15);
  const [herLpa, setHerLpa] = useState(10);
  const [hike, setHike] = useState(10); // 10% average hike

  const currentTotal = myLpa + herLpa;

  // Future calculations
  const total2Yrs = currentTotal * Math.pow(1 + hike / 100, 2);
  const total5Yrs = currentTotal * Math.pow(1 + hike / 100, 5);
  const total10Yrs = currentTotal * Math.pow(1 + hike / 100, 10);
  const total15Yrs = currentTotal * Math.pow(1 + hike / 100, 15);

  return (
    <div>
      <h2 style={{ color: "var(--text-primary)", marginBottom: "8px" }}>
        15-Year Salary Projection (LPA)
      </h2>
      <p style={{ color: "var(--text-muted)", marginBottom: "24px" }}>
        Predict your combined earning power to plan for kids, cars, and homes.
      </p>

      <div style={{ display: "flex", gap: "16px", marginBottom: "32px" }}>
        <div
          style={{
            flex: 1,
            padding: "16px",
            background: "var(--bg-input)",
            borderRadius: "12px",
          }}
        >
          <label
            style={{
              display: "block",
              color: "var(--text-muted)",
              marginBottom: "8px",
            }}
          >
            Your Current LPA (Lakhs)
          </label>
          <input
            type="number"
            value={myLpa}
            onChange={(e) => setMyLpa(Number(e.target.value))}
            style={{
              width: "100%",
              padding: "10px",
              borderRadius: "8px",
              border: "1px solid var(--accent)",
              background: "var(--bg-primary)",
              color: "#fff",
              fontSize: "1.2rem",
              fontWeight: "bold",
            }}
          />
        </div>
        <div
          style={{
            flex: 1,
            padding: "16px",
            background: "var(--bg-input)",
            borderRadius: "12px",
          }}
        >
          <label
            style={{
              display: "block",
              color: "var(--text-muted)",
              marginBottom: "8px",
            }}
          >
            Her Current LPA (Lakhs)
          </label>
          <input
            type="number"
            value={herLpa}
            onChange={(e) => setHerLpa(Number(e.target.value))}
            style={{
              width: "100%",
              padding: "10px",
              borderRadius: "8px",
              border: "1px solid var(--success)",
              background: "var(--bg-primary)",
              color: "#fff",
              fontSize: "1.2rem",
              fontWeight: "bold",
            }}
          />
        </div>
        <div
          style={{
            flex: 1,
            padding: "16px",
            background: "var(--bg-input)",
            borderRadius: "12px",
          }}
        >
          <label
            style={{
              display: "block",
              color: "var(--text-muted)",
              marginBottom: "8px",
            }}
          >
            Avg Yearly Hike (%)
          </label>
          <input
            type="number"
            value={hike}
            onChange={(e) => setHike(Number(e.target.value))}
            style={{
              width: "100%",
              padding: "10px",
              borderRadius: "8px",
              border: "1px solid var(--warning)",
              background: "var(--bg-primary)",
              color: "#fff",
              fontSize: "1.2rem",
              fontWeight: "bold",
            }}
          />
        </div>
      </div>

      <div
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(4, 1fr)",
          gap: "16px",
        }}
      >
        <ProjectionCard
          year="Today"
          amount={currentTotal}
          color="var(--text-primary)"
        />
        <ProjectionCard
          year="In 2 Years"
          amount={total2Yrs}
          color="var(--success)"
        />
        <ProjectionCard
          year="In 5 Years"
          amount={total5Yrs}
          color="var(--accent)"
        />
        <ProjectionCard
          year="In 15 Years"
          amount={total15Yrs}
          color="var(--warning)"
          isHero
        />
      </div>
    </div>
  );
}

function ProjectionCard({ year, amount, color, isHero }: any) {
  return (
    <div
      style={{
        padding: isHero ? "24px" : "20px",
        background: isHero ? "rgba(245,166,35,0.1)" : "var(--bg-card)",
        border: `1px solid ${isHero ? color : "var(--border)"}`,
        borderRadius: "16px",
        textAlign: "center",
        transform: isHero ? "scale(1.05)" : "none",
        boxShadow: isHero ? `0 8px 32px ${color}30` : "none",
      }}
    >
      <span
        style={{
          color: "var(--text-muted)",
          fontSize: "0.9rem",
          display: "block",
          marginBottom: "8px",
        }}
      >
        {year}
      </span>
      <h3
        style={{
          margin: 0,
          color: color,
          fontSize: isHero ? "2rem" : "1.5rem",
        }}
      >
        {amount.toFixed(1)}L
      </h3>
      <span
        style={{
          color: "var(--text-muted)",
          fontSize: "0.75rem",
          display: "block",
          marginTop: "4px",
        }}
      >
        Combined LPA
      </span>
    </div>
  );
}

// ---------------------------
// 4. Generic Planner (Car/Family Plan)
// ---------------------------
function GenericPlanner({ title, description, planType }: { title: string; description: string; planType: string }) {
  const [content, setContent] = useState('');
  const [saved, setSaved] = useState(false);

  useEffect(() => {
    fetchPlanner();
  }, [planType]);

  const fetchPlanner = async () => {
    try {
      const res = await fetch(`/api/lifestyle/planner?type=${planType}`);
      if (res.ok) {
        const data = await res.json();
        if (data.content) setContent(data.content);
      }
    } catch (e) {}
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    await fetch('/api/lifestyle/planner', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ type: planType, content })
    });
    setSaved(true);
    setTimeout(() => setSaved(false), 2000);
  };

  return (
    <div>
      <h2 style={{ color: "var(--text-primary)", marginBottom: "8px" }}>{title}</h2>
      <p style={{ color: "var(--text-muted)", marginBottom: "24px" }}>{description}</p>
      <form onSubmit={handleSave} style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
        <textarea
          value={content}
          onChange={(e) => setContent(e.target.value)}
          placeholder="Write your notes, milestones, budget breakdown, and thoughts here..."
          style={{
            width: '100%', minHeight: '250px', padding: '16px', borderRadius: '12px',
            border: '1px solid var(--border)', background: 'var(--bg-input)', color: 'var(--text-primary)',
            fontSize: '1rem', lineHeight: '1.5', resize: 'vertical'
          }}
        />
        <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
          <button className="btn btn-primary" type="submit">Save Plan</button>
          {saved && <span style={{ color: 'var(--success)', fontSize: '0.9rem' }}>Saved successfully!</span>}
        </div>
      </form>
    </div>
  );
}

// ==========================================
// PHASE 13: TIMELINE ENGINE
// ==========================================
function TimelineEngine() {
  const [subTab, setSubTab] = useState<"timeline" | "calendar">("timeline");

  return (
    <div style={{ display: "flex", flexDirection: "column", height: "100%" }}>
      {/* Sub Navigation */}
      <div
        style={{
          display: "flex",
          gap: "12px",
          borderBottom: "1px solid var(--border)",
          paddingBottom: "16px",
          marginBottom: "24px",
        }}
      >
        <button
          onClick={() => setSubTab("timeline")}
          className={subTab === "timeline" ? "btn btn-primary" : "btn"}
          style={{
            background:
              subTab === "timeline"
                ? "var(--gradient-hero)"
                : "var(--bg-input)",
          }}
        >
          <TrendingUp size={16} /> 15-Year Timeline
        </button>
        <button
          onClick={() => setSubTab("calendar")}
          className={subTab === "calendar" ? "btn btn-primary" : "btn"}
          style={{
            background:
              subTab === "calendar"
                ? "var(--gradient-hero)"
                : "var(--bg-input)",
          }}
        >
          <Calendar size={16} /> Shared Calendar
        </button>
      </div>

      <div style={{ flex: 1, overflowY: "auto" }}>
        {subTab === "timeline" && <OurLifeTimeline />}
        {subTab === "calendar" && <SharedCalendar />}
      </div>
    </div>
  );
}

// ---------------------------
// 1. Our Life Timeline
// ---------------------------
function OurLifeTimeline() {
  const [milestones, setMilestones] = useState<any[]>([]);
  const [year, setYear] = useState("2026");
  const [title, setTitle] = useState("");
  const [desc, setDesc] = useState("");
  const [icon, setIcon] = useState("💍");

  useEffect(() => {
    fetchMilestones();
  }, []);

  const fetchMilestones = async () => {
    const res = await fetch("/api/timeline/milestones");
    if (res.ok) setMilestones((await res.json()).milestones);
  };

  const handleDeleteTimeline = async (id: string) => {
    if (confirm("Delete this milestone?")) {
      await fetch(`/api/timeline/milestones/${id}`, { method: 'DELETE' });
      fetchMilestones();
    }
  };

  const handleAdd = async (e: React.FormEvent) => {
    e.preventDefault();
    await fetch("/api/timeline/milestones", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ year, title, description: desc, icon }),
    });
    setTitle("");
    setDesc("");
    fetchMilestones();
  };

  const EMOJIS = ["💍", "🚗", "🏠", "👶", "✈️", "💼", "💰", "🎯"];

  return (
    <div>
      <h2 style={{ color: "var(--text-primary)", marginBottom: "8px" }}>
        Our Life Timeline
      </h2>
      <p style={{ color: "var(--text-muted)", marginBottom: "24px" }}>
        Mapping out the entire 15-year journey of your relationship and goals.
      </p>

      <form
        onSubmit={handleAdd}
        style={{
          display: "flex",
          flexDirection: "column",
          gap: "10px",
          marginBottom: "32px",
          background: "var(--bg-input)",
          padding: "16px",
          borderRadius: "12px",
        }}
      >
        <div style={{ display: "flex", gap: "10px" }}>
          <input
            type="number"
            value={year}
            onChange={(e) => setYear(e.target.value)}
            placeholder="Year (2026)"
            style={{
              width: "100px",
              padding: "10px",
              borderRadius: "8px",
              border: "1px solid var(--border)",
              background: "var(--bg-primary)",
              color: "var(--text-primary)",
            }}
            required
          />
          <input
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            placeholder="Milestone Title (e.g. Marriage)"
            style={{
              flex: 1,
              padding: "10px",
              borderRadius: "8px",
              border: "1px solid var(--border)",
              background: "var(--bg-primary)",
              color: "var(--text-primary)",
            }}
            required
          />
          <select
            value={icon}
            onChange={(e) => setIcon(e.target.value)}
            style={{
              padding: "10px",
              borderRadius: "8px",
              border: "1px solid var(--border)",
              background: "var(--bg-primary)",
              color: "var(--text-primary)",
            }}
          >
            {EMOJIS.map((e) => (
              <option key={e} value={e}>
                {e}
              </option>
            ))}
          </select>
          <button className="btn btn-primary" type="submit">
            <Plus size={16} /> Add
          </button>
        </div>
        <input
          value={desc}
          onChange={(e) => setDesc(e.target.value)}
          placeholder="Short Description (Optional)"
          style={{
            width: "100%",
            padding: "10px",
            borderRadius: "8px",
            border: "1px solid var(--border)",
            background: "var(--bg-primary)",
            color: "var(--text-primary)",
          }}
        />
      </form>

      <div style={{ position: "relative", paddingLeft: "20px" }}>
        {/* Vertical Line */}
        <div
          style={{
            position: "absolute",
            left: "33px",
            top: "10px",
            bottom: "0",
            width: "2px",
            background: "var(--accent)",
          }}
        ></div>

        {milestones.map((m, i) => (
          <motion.div
            key={m.id}
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: i * 0.1 }}
            style={{
              display: "flex",
              gap: "20px",
              marginBottom: "24px",
              position: "relative",
            }}
          >
            <div
              style={{
                width: "30px",
                height: "30px",
                borderRadius: "50%",
                background: "var(--bg-card)",
                border: "2px solid var(--accent)",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                zIndex: 1,
              }}
            >
              <span style={{ fontSize: "0.8rem" }}>{m.icon}</span>
            </div>
            <div
              style={{
                flex: 1,
                background: "var(--bg-card)",
                border: "1px solid var(--border)",
                padding: "16px",
                borderRadius: "12px",
              }}
            >
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                <h3
                  style={{
                    margin: "0 0 4px 0",
                    color: "#fff",
                    display: "flex",
                    gap: "8px",
                    alignItems: "center",
                  }}
                >
                  <span style={{ color: "var(--accent)", fontSize: "1.2rem" }}>
                    {m.year}
                  </span>{" "}
                  — {m.title}
                </h3>
                <button onClick={() => handleDeleteTimeline(m.id)} className="delete-icon-btn">
                  <X size={18} />
                </button>
              </div>
              {m.description && (
                <p
                  style={{
                    margin: 0,
                    color: "var(--text-muted)",
                    fontSize: "0.9rem",
                  }}
                >
                  {m.description}
                </p>
              )}
            </div>
          </motion.div>
        ))}
        {milestones.length === 0 && (
          <p style={{ color: "var(--text-muted)", paddingLeft: "40px" }}>
            No milestones mapped out yet.
          </p>
        )}
      </div>
    </div>
  );
}

// ---------------------------
// 2. Shared Calendar
// ---------------------------
function SharedCalendar() {
  const [events, setEvents] = useState<any[]>([]);
  const [title, setTitle] = useState('');
  const [type, setType] = useState('ANNIVERSARY');
  
  const [currentDate, setCurrentDate] = useState(new Date());
  const [selectedDate, setSelectedDate] = useState<number | null>(null);

  useEffect(() => { fetchEvents(); }, []);

  const fetchEvents = async () => {
    const res = await fetch('/api/timeline/calendar');
    if (res.ok) setEvents((await res.json()).events);
  };

  const handleDeleteCalendar = async (e: React.MouseEvent, id: string) => {
    e.stopPropagation();
    if (confirm("Delete this event?")) {
      await fetch(`/api/timeline/calendar/${id}`, { method: 'DELETE' });
      fetchEvents();
    }
  };

  const handleAdd = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedDate) return;
    const dateStr = new Date(currentDate.getFullYear(), currentDate.getMonth(), selectedDate).toISOString();
    
    await fetch('/api/timeline/calendar', {
      method: 'POST', headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ title, date: dateStr, type })
    });
    setTitle(''); setSelectedDate(null); fetchEvents();
  };

  const getEventColor = (type: string) => {
    switch(type) {
      case 'ANNIVERSARY': return 'var(--danger)'; 
      case 'BIRTHDAY': return 'var(--warning)'; 
      case 'MEETING': return 'var(--accent)'; 
      default: return 'var(--success)';
    }
  };

  const daysInMonth = new Date(currentDate.getFullYear(), currentDate.getMonth() + 1, 0).getDate();
  const firstDayOfMonth = new Date(currentDate.getFullYear(), currentDate.getMonth(), 1).getDay();
  const blanks = Array.from({ length: firstDayOfMonth });
  const days = Array.from({ length: daysInMonth }, (_, i) => i + 1);

  const prevMonth = () => setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() - 1, 1));
  const nextMonth = () => setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() + 1, 1));

  return (
    <div>
      <h2 style={{ color: 'var(--text-primary)', marginBottom: '8px' }}>Master Shared Calendar</h2>
      <p style={{ color: 'var(--text-muted)', marginBottom: '24px' }}>Click any day on the grid to add an event.</p>

      {/* Calendar Header */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
        <h3 style={{ margin: 0, color: 'var(--text-primary)' }}>
          {currentDate.toLocaleString('default', { month: 'long', year: 'numeric' })}
        </h3>
        <div style={{ display: 'flex', gap: '8px' }}>
          <button className="btn" onClick={prevMonth}>Prev</button>
          <button className="btn" onClick={nextMonth}>Next</button>
        </div>
      </div>

      {/* Calendar Grid */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(7, 1fr)', gap: '8px', marginBottom: '24px' }}>
        {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map(d => (
          <div key={d} style={{ textAlign: 'center', fontWeight: 'bold', color: 'var(--text-muted)', fontSize: '0.85rem' }}>{d}</div>
        ))}
        
        {blanks.map((_, i) => <div key={`blank-${i}`} style={{ padding: '20px', borderRadius: '8px', background: 'rgba(0,0,0,0.05)' }} />)}
        
        {days.map(day => {
          const dayEvents = events.filter(e => {
            const ed = new Date(e.date);
            return ed.getDate() === day && ed.getMonth() === currentDate.getMonth() && ed.getFullYear() === currentDate.getFullYear();
          });
          const isSelected = selectedDate === day;

          return (
            <div key={day} onClick={() => setSelectedDate(day)}
              style={{
                minHeight: '80px', padding: '8px', borderRadius: '8px',
                background: isSelected ? 'var(--gradient-hero)' : 'var(--bg-card)',
                border: `1px solid ${isSelected ? 'var(--accent)' : 'var(--border)'}`,
                cursor: 'pointer', transition: '0.2s',
                display: 'flex', flexDirection: 'column', gap: '4px'
              }}
            >
              <span style={{ fontWeight: 'bold', color: isSelected ? '#fff' : 'var(--text-primary)' }}>{day}</span>
              {dayEvents.map(e => (
                <div key={e.id} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', fontSize: '0.7rem', padding: '2px 4px', background: `${getEventColor(e.type)}30`, color: getEventColor(e.type), borderRadius: '4px' }}>
                  <span style={{ whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>{e.title}</span>
                  <button onClick={(ev) => handleDeleteCalendar(ev, e.id)} className="delete-icon-btn" style={{ padding: '2px' }}>
                    <X size={12} />
                  </button>
                </div>
              ))}
            </div>
          );
        })}
      </div>

      {/* Add Event Form (Shown when a date is clicked) */}
      <AnimatePresence>
        {selectedDate && (
          <motion.form initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }}
            onSubmit={handleAdd} style={{ display: 'flex', flexWrap: 'wrap', gap: '10px', marginBottom: '32px', background: 'var(--bg-input)', padding: '16px', borderRadius: '12px' }}>
            <div style={{ padding: '10px', color: 'var(--text-primary)', fontWeight: 'bold' }}>
              Adding to: {currentDate.toLocaleString('default', { month: 'short' })} {selectedDate}, {currentDate.getFullYear()}
            </div>
            <input value={title} onChange={e => setTitle(e.target.value)} placeholder="Event Title" style={{ flex: 1, minWidth: '150px', padding: '10px', borderRadius: '8px', border: '1px solid var(--border)', background: 'var(--bg-primary)', color: 'var(--text-primary)' }} required />
            <select value={type} onChange={e => setType(e.target.value)} style={{ padding: '10px', borderRadius: '8px', border: '1px solid var(--border)', background: 'var(--bg-primary)', color: 'var(--text-primary)' }}>
              <option value="ANNIVERSARY">Anniversary</option>
              <option value="BIRTHDAY">Birthday</option>
              <option value="MEETING">First Meeting/Trip</option>
              <option value="OTHER">Other</option>
            </select>
            <button className="btn btn-primary" type="submit"><Plus size={16}/> Save to Calendar</button>
            <button className="btn" type="button" onClick={() => setSelectedDate(null)}>Cancel</button>
          </motion.form>
        )}
      </AnimatePresence>
    </div>
  );
}

// ==========================================
// PHASE 14: PRIVACY VAULT
// ==========================================
function PrivacyVault() {
  const [items, setItems] = useState<any[]>([]);
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [type, setType] = useState('DOCUMENT');
  const [expiryDate, setExpiryDate] = useState('');
  const [showSensitive, setShowSensitive] = useState<Record<string, boolean>>({});

  useEffect(() => { fetchItems(); }, []);

  const fetchItems = async () => {
    const res = await fetch('/api/vault');
    if (res.ok) setItems((await res.json()).items);
  };

  const handleAdd = async (e: React.FormEvent) => {
    e.preventDefault();
    await fetch('/api/vault', {
      method: 'POST', headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ title, type, content, expiryDate })
    });
    setTitle(''); setContent(''); setExpiryDate(''); fetchItems();
  };

  const handleDelete = async (id: string) => {
    await fetch(`/api/vault/${id}`, { method: 'DELETE' });
    fetchItems();
  };

  const toggleVisibility = (id: string) => {
    setShowSensitive(prev => ({ ...prev, [id]: !prev[id] }));
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', height: '100%' }}>
      <h2 style={{ color: 'var(--text-primary)', marginBottom: '8px' }}>Privacy Vault & Expiry Reminders</h2>
      <p style={{ color: 'var(--text-muted)', marginBottom: '24px' }}>Securely store passport expiry dates, passwords, and 2FA codes. All data remains completely offline in your local database.</p>

      <form onSubmit={handleAdd} style={{ display: 'flex', flexDirection: 'column', gap: '10px', marginBottom: '32px', background: 'var(--bg-input)', padding: '16px', borderRadius: '12px' }}>
        <div style={{ display: 'flex', gap: '10px', flexWrap: 'wrap' }}>
          <select value={type} onChange={e => setType(e.target.value)} style={{ padding: '10px', borderRadius: '8px', border: '1px solid var(--border)', background: 'var(--bg-primary)', color: 'var(--text-primary)' }}>
            <option value="DOCUMENT">Document (Passport/Visa)</option>
            <option value="PASSWORD">Password/2FA Backup</option>
            <option value="OTHER">Other Secret</option>
          </select>
          <input value={title} onChange={e => setTitle(e.target.value)} placeholder="Title (e.g. My Passport, Netflix Password)" style={{ flex: 1, minWidth: '200px', padding: '10px', borderRadius: '8px', border: '1px solid var(--border)', background: 'var(--bg-primary)', color: 'var(--text-primary)' }} required />
          {type === 'DOCUMENT' && (
            <input type="date" value={expiryDate} onChange={e => setExpiryDate(e.target.value)} style={{ padding: '10px', borderRadius: '8px', border: '1px solid var(--border)', background: 'var(--bg-primary)', color: 'var(--text-primary)' }} />
          )}
          <button className="btn btn-primary" type="submit"><Plus size={16}/> Save to Vault</button>
        </div>
        <textarea value={content} onChange={e => setContent(e.target.value)} placeholder="Sensitive Content (Passwords, Codes, ID Numbers)" style={{ width: '100%', padding: '10px', borderRadius: '8px', border: '1px solid var(--border)', background: 'var(--bg-primary)', color: 'var(--text-primary)', minHeight: '80px', resize: 'vertical' }} />
      </form>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))', gap: '16px' }}>
        {items.map(item => (
          <div key={item.id} style={{ background: 'var(--bg-card)', border: '1px solid var(--border)', borderRadius: '12px', padding: '16px', display: 'flex', flexDirection: 'column', gap: '12px', position: 'relative' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
              <div>
                <span style={{ fontSize: '0.75rem', color: 'var(--accent)', fontWeight: 'bold' }}>{item.type}</span>
                <h4 style={{ margin: '4px 0 0 0', color: 'var(--text-primary)' }}>{item.title}</h4>
              </div>
              <button onClick={() => handleDelete(item.id)} className="delete-icon-btn">
                <Trash2 size={16} />
              </button>
            </div>
            
            {item.expiryDate && (
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px', color: 'var(--warning)', fontSize: '0.85rem', background: 'rgba(245,166,35,0.1)', padding: '6px 10px', borderRadius: '6px' }}>
                <Calendar size={14} />
                Expires: {new Date(item.expiryDate).toLocaleDateString()}
              </div>
            )}

            {item.content && (
              <div style={{ background: 'var(--bg-primary)', padding: '10px', borderRadius: '8px', border: '1px solid var(--border)', position: 'relative' }}>
                <p style={{ margin: 0, color: 'var(--text-muted)', fontSize: '0.9rem', filter: showSensitive[item.id] ? 'none' : 'blur(5px)', transition: 'filter 0.3s', wordBreak: 'break-all' }}>
                  {item.content}
                </p>
                <button onClick={() => toggleVisibility(item.id)} style={{ position: 'absolute', top: '50%', left: '50%', transform: 'translate(-50%, -50%)', background: 'var(--bg-card)', border: '1px solid var(--border)', color: '#fff', padding: '4px 12px', borderRadius: '4px', cursor: 'pointer', opacity: showSensitive[item.id] ? 0 : 1, pointerEvents: showSensitive[item.id] ? 'none' : 'auto' }}>
                  Reveal
                </button>
              </div>
            )}
          </div>
        ))}
        {items.length === 0 && <p style={{ color: 'var(--text-muted)' }}>Your vault is empty.</p>}
      </div>
    </div>
  );
}
