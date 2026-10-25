import React from 'react';
import { interpolate, spring, useCurrentFrame, useVideoConfig } from 'remotion';
import { Search, Calendar, Users, Star, Bed, Check, Sparkles } from 'lucide-react';

export const Scene2_GuestPortal: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const titleOpacity = interpolate(frame, [0, 20], [0, 1], { extrapolateRight: 'clamp' });
  const filterSlide = spring({ frame: frame - 10, fps, config: { damping: 15 } });
  const card1Slide = spring({ frame: frame - 25, fps, config: { damping: 14 } });
  const card2Slide = spring({ frame: frame - 40, fps, config: { damping: 14 } });

  return (
    <div
      style={{
        width: '100%',
        height: '100%',
        background: 'linear-gradient(135deg, #0f172a 0%, #1e293b 100%)',
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
        <div style={{ color: '#60a5fa', fontWeight: 700, fontSize: 20, letterSpacing: '2px', textTransform: 'uppercase', marginBottom: 8 }}>
          FEATURE 01 • GUEST EXPERIENCE
        </div>
        <h2 style={{ fontSize: 52, margin: 0, fontWeight: 800, fontFamily: "'Playfair Display', Georgia, serif" }}>
          Dynamic Room Discovery & Search Engine
        </h2>
      </div>

      {/* Simulated Search Filter Bar */}
      <div
        style={{
          transform: `scale(${filterSlide})`,
          background: 'rgba(255, 255, 255, 0.07)',
          border: '1px solid rgba(255, 255, 255, 0.15)',
          borderRadius: 24,
          padding: '24px 36px',
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          marginBottom: 40,
          backdropFilter: 'blur(12px)',
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', gap: 16 }}>
          <Calendar size={28} color="#60a5fa" />
          <div>
            <div style={{ fontSize: 16, color: '#94a3b8', fontWeight: 600 }}>DATES</div>
            <div style={{ fontSize: 22, fontWeight: 700 }}>Oct 28 – Nov 01 (4 Nights)</div>
          </div>
        </div>

        <div style={{ width: 1, height: 40, background: 'rgba(255,255,255,0.2)' }} />

        <div style={{ display: 'flex', alignItems: 'center', gap: 16 }}>
          <Users size={28} color="#60a5fa" />
          <div>
            <div style={{ fontSize: 16, color: '#94a3b8', fontWeight: 600 }}>GUESTS</div>
            <div style={{ fontSize: 22, fontWeight: 700 }}>2 Adults, Deluxe Tier</div>
          </div>
        </div>

        <div style={{ width: 1, height: 40, background: 'rgba(255,255,255,0.2)' }} />

        <div style={{ display: 'flex', gap: 12 }}>
          {['All', 'Deluxe', 'Suite', 'Executive'].map((cat, idx) => (
            <div
              key={idx}
              style={{
                background: idx === 2 ? '#2563eb' : 'rgba(255, 255, 255, 0.1)',
                padding: '8px 20px',
                borderRadius: 20,
                fontSize: 18,
                fontWeight: 600,
                color: idx === 2 ? '#fff' : '#cbd5e1',
              }}
            >
              {cat}
            </div>
          ))}
        </div>

        <div
          style={{
            background: 'linear-gradient(135deg, #2563eb, #1d4ed8)',
            padding: '12px 28px',
            borderRadius: 30,
            display: 'flex',
            alignItems: 'center',
            gap: 10,
            fontSize: 20,
            fontWeight: 700,
            boxShadow: '0 8px 20px rgba(37,99,235,0.4)',
          }}
        >
          <Search size={22} />
          <span>8 Available</span>
        </div>
      </div>

      {/* Two Responsive Room Cards */}
      <div style={{ display: 'flex', gap: 40, flex: 1 }}>
        {/* Card 1 */}
        <div
          style={{
            transform: `scale(${card1Slide})`,
            flex: 1,
            background: 'rgba(255, 255, 255, 0.05)',
            border: '1px solid rgba(255, 255, 255, 0.12)',
            borderRadius: 24,
            overflow: 'hidden',
            display: 'flex',
            flexDirection: 'column',
          }}
        >
          <div
            style={{
              height: 280,
              background: "url('https://images.unsplash.com/photo-1582719478250-c89cae4dc85b?auto=format&fit=crop&w=800&q=80') center/cover",
              position: 'relative',
              padding: 24,
              boxSizing: 'border-box',
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'flex-start',
            }}
          >
            <span style={{ background: '#2563eb', padding: '6px 16px', borderRadius: 20, fontWeight: 700, fontSize: 16 }}>
              Suite
            </span>
            <span style={{ background: 'rgba(0,0,0,0.7)', padding: '6px 14px', borderRadius: 20, fontWeight: 700, fontSize: 16, display: 'flex', alignItems: 'center', gap: 6 }}>
              <Star size={16} color="#fbbf24" fill="#fbbf24" /> 4.95 (42)
            </span>
          </div>

          <div style={{ padding: 32, display: 'flex', flexDirection: 'column', flex: 1, justifyContent: 'space-between' }}>
            <div>
              <h3 style={{ fontSize: 28, margin: '0 0 12px 0', fontFamily: "'Playfair Display', serif" }}>
                Presidential Oceanfront Penthouse
              </h3>
              <div style={{ display: 'flex', gap: 16, color: '#94a3b8', fontSize: 18, marginBottom: 18 }}>
                <span>4 Guests</span> • <span>1 Cal King + 1 Queen</span> • <span>1,100 sq.ft</span>
              </div>
              <div style={{ display: 'flex', flexWrap: 'wrap', gap: 10 }}>
                {['Jacuzzi Spa', 'Panoramic Ocean View', 'Butler Service'].map((am, i) => (
                  <span key={i} style={{ background: 'rgba(255,255,255,0.08)', padding: '6px 14px', borderRadius: 12, fontSize: 15, color: '#e2e8f0' }}>
                    ✓ {am}
                  </span>
                ))}
              </div>
            </div>

            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: 24, borderTop: '1px solid rgba(255,255,255,0.1)', paddingTop: 20 }}>
              <div>
                <div style={{ color: '#94a3b8', fontSize: 16 }}>Nightly Rate</div>
                <div style={{ fontSize: 36, fontWeight: 800, color: '#60a5fa' }}>$499 <span style={{ fontSize: 18, color: '#94a3b8' }}>/ night</span></div>
              </div>
              <div style={{ background: 'linear-gradient(135deg, #d97706, #f59e0b)', color: '#fff', padding: '12px 28px', borderRadius: 25, fontWeight: 700, fontSize: 18 }}>
                Book Suite
              </div>
            </div>
          </div>
        </div>

        {/* Card 2 */}
        <div
          style={{
            transform: `scale(${card2Slide})`,
            flex: 1,
            background: 'rgba(255, 255, 255, 0.05)',
            border: '1px solid rgba(255, 255, 255, 0.12)',
            borderRadius: 24,
            overflow: 'hidden',
            display: 'flex',
            flexDirection: 'column',
          }}
        >
          <div
            style={{
              height: 280,
              background: "url('https://images.unsplash.com/photo-1590490360182-c33d57733427?auto=format&fit=crop&w=800&q=80') center/cover",
              position: 'relative',
              padding: 24,
              boxSizing: 'border-box',
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'flex-start',
            }}
          >
            <span style={{ background: '#0284c7', padding: '6px 16px', borderRadius: 20, fontWeight: 700, fontSize: 16 }}>
              Executive
            </span>
            <span style={{ background: 'rgba(0,0,0,0.7)', padding: '6px 14px', borderRadius: 20, fontWeight: 700, fontSize: 16, display: 'flex', alignItems: 'center', gap: 6 }}>
              <Star size={16} color="#fbbf24" fill="#fbbf24" /> 4.88 (31)
            </span>
          </div>

          <div style={{ padding: 32, display: 'flex', flexDirection: 'column', flex: 1, justifyContent: 'space-between' }}>
            <div>
              <h3 style={{ fontSize: 28, margin: '0 0 12px 0', fontFamily: "'Playfair Display', serif" }}>
                Executive Skyline City View Room
              </h3>
              <div style={{ display: 'flex', gap: 16, color: '#94a3b8', fontSize: 18, marginBottom: 18 }}>
                <span>2 Guests</span> • <span>1 King Bed</span> • <span>520 sq.ft</span>
              </div>
              <div style={{ display: 'flex', flexWrap: 'wrap', gap: 10 }}>
                {['Workstation', 'City Skyline View', 'Club Lounge'].map((am, i) => (
                  <span key={i} style={{ background: 'rgba(255,255,255,0.08)', padding: '6px 14px', borderRadius: 12, fontSize: 15, color: '#e2e8f0' }}>
                    ✓ {am}
                  </span>
                ))}
              </div>
            </div>

            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: 24, borderTop: '1px solid rgba(255,255,255,0.1)', paddingTop: 20 }}>
              <div>
                <div style={{ color: '#94a3b8', fontSize: 16 }}>Nightly Rate</div>
                <div style={{ fontSize: 36, fontWeight: 800, color: '#60a5fa' }}>$289 <span style={{ fontSize: 18, color: '#94a3b8' }}>/ night</span></div>
              </div>
              <div style={{ background: 'linear-gradient(135deg, #2563eb, #1d4ed8)', color: '#fff', padding: '12px 28px', borderRadius: 25, fontWeight: 700, fontSize: 18 }}>
                Book Room
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
