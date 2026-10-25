import React from 'react';
import { interpolate, spring, useCurrentFrame, useVideoConfig } from 'remotion';
import { DollarSign, CalendarCheck, Activity, BedDouble, PlusCircle, CheckSquare, ShieldCheck } from 'lucide-react';

export const Scene4_AdminConsole: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const titleOpacity = interpolate(frame, [0, 20], [0, 1], { extrapolateRight: 'clamp' });
  const kpiSpring = (delay: number) => spring({ frame: frame - delay, fps, config: { damping: 14 } });

  return (
    <div
      style={{
        width: '100%',
        height: '100%',
        background: 'linear-gradient(135deg, #090d16 0%, #1e1b4b 100%)',
        color: '#ffffff',
        padding: '60px 100px',
        boxSizing: 'border-box',
        display: 'flex',
        flexDirection: 'column',
        fontFamily: "'Inter', sans-serif",
      }}
    >
      {/* Scene Header */}
      <div style={{ opacity: titleOpacity, marginBottom: 40 }}>
        <div style={{ color: '#f43f5e', fontWeight: 700, fontSize: 20, letterSpacing: '2px', textTransform: 'uppercase', marginBottom: 8 }}>
          FEATURE 03 • ADMIN OPERATIONS
        </div>
        <h2 style={{ fontSize: 52, margin: 0, fontWeight: 800, fontFamily: "'Playfair Display', Georgia, serif" }}>
          Executive Telemetry & Inventory Management
        </h2>
      </div>

      {/* 4 Animated KPI Cards */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 30, marginBottom: 45 }}>
        {[
          { label: 'TOTAL REVENUE', value: '$1,647', icon: DollarSign, color: '#4ade80', sub: '+100% from confirmed stays', delay: 10 },
          { label: 'ACTIVE BOOKINGS', value: '1', icon: CalendarCheck, color: '#38bdf8', sub: 'Instant real-time sync', delay: 20 },
          { label: 'OCCUPANCY RATE', value: '100%', icon: Activity, color: '#fbbf24', sub: 'Current occupied suites', delay: 30 },
          { label: 'TOTAL INVENTORY', value: '8 Rooms', icon: BedDouble, color: '#a78bfa', sub: 'Across 5 luxury categories', delay: 40 },
        ].map((kpi, idx) => {
          const scale = kpiSpring(kpi.delay);
          const Icon = kpi.icon;
          return (
            <div
              key={idx}
              style={{
                transform: `scale(${scale})`,
                background: 'rgba(255, 255, 255, 0.06)',
                border: '1px solid rgba(255, 255, 255, 0.12)',
                borderRadius: 20,
                padding: 28,
                boxShadow: '0 15px 35px rgba(0,0,0,0.3)',
              }}
            >
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 12 }}>
                <span style={{ fontSize: 16, fontWeight: 700, color: '#94a3b8' }}>{kpi.label}</span>
                <div style={{ background: 'rgba(255,255,255,0.1)', padding: 10, borderRadius: 12 }}>
                  <Icon size={24} color={kpi.color} />
                </div>
              </div>
              <div style={{ fontSize: 44, fontWeight: 800, margin: '6px 0', fontFamily: "'Playfair Display', serif" }}>
                {kpi.value}
              </div>
              <div style={{ fontSize: 15, color: kpi.color, fontWeight: 600 }}>{kpi.sub}</div>
            </div>
          );
        })}
      </div>

      {/* Lower Dual Feature Highlights */}
      <div style={{ display: 'flex', gap: 40, flex: 1 }}>
        <div
          style={{
            flex: 1,
            background: 'rgba(255, 255, 255, 0.05)',
            border: '1px solid rgba(255, 255, 255, 0.1)',
            borderRadius: 20,
            padding: 32,
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'space-between',
          }}
        >
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 14 }}>
              <PlusCircle size={28} color="#38bdf8" />
              <h3 style={{ fontSize: 24, margin: 0, fontWeight: 700 }}>Full Room Inventory CRUD</h3>
            </div>
            <p style={{ color: '#cbd5e1', fontSize: 18, lineHeight: 1.5, margin: 0 }}>
              Hotel managers can effortlessly add new suites, edit pricing, upload CDN photography, configure custom amenities, and toggle room maintenance states.
            </p>
          </div>
          <div style={{ display: 'flex', gap: 12, marginTop: 16 }}>
            <span style={{ background: 'rgba(56, 189, 248, 0.15)', color: '#38bdf8', padding: '8px 18px', borderRadius: 16, fontSize: 16, fontWeight: 600 }}>
              Create Room
            </span>
            <span style={{ background: 'rgba(255,255,255,0.08)', color: '#e2e8f0', padding: '8px 18px', borderRadius: 16, fontSize: 16, fontWeight: 600 }}>
              Update Rates
            </span>
            <span style={{ background: 'rgba(239, 68, 68, 0.15)', color: '#f87171', padding: '8px 18px', borderRadius: 16, fontSize: 16, fontWeight: 600 }}>
              Delete Room
            </span>
          </div>
        </div>

        <div
          style={{
            flex: 1,
            background: 'rgba(255, 255, 255, 0.05)',
            border: '1px solid rgba(255, 255, 255, 0.1)',
            borderRadius: 20,
            padding: 32,
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'space-between',
          }}
        >
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 14 }}>
              <CheckSquare size={28} color="#4ade80" />
              <h3 style={{ fontSize: 24, margin: 0, fontWeight: 700 }}>Reservation Lifecycle Management</h3>
            </div>
            <p style={{ color: '#cbd5e1', fontSize: 18, lineHeight: 1.5, margin: 0 }}>
              Staff can transition guest reservations through the complete lifecycle with real-time state tracking and automatic occupancy rate updates.
            </p>
          </div>
          <div style={{ display: 'flex', gap: 12, marginTop: 16, alignItems: 'center' }}>
            <span style={{ background: '#22c55e', color: '#fff', padding: '8px 18px', borderRadius: 16, fontSize: 16, fontWeight: 700 }}>
              Confirmed
            </span>
            <span style={{ color: '#94a3b8' }}>&rarr;</span>
            <span style={{ background: '#2563eb', color: '#fff', padding: '8px 18px', borderRadius: 16, fontSize: 16, fontWeight: 700 }}>
              Checked-In
            </span>
            <span style={{ color: '#94a3b8' }}>&rarr;</span>
            <span style={{ background: '#64748b', color: '#fff', padding: '8px 18px', borderRadius: 16, fontSize: 16, fontWeight: 700 }}>
              Checked-Out
            </span>
          </div>
        </div>
      </div>
    </div>
  );
};
