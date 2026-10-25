import React from 'react';
import { interpolate, spring, useCurrentFrame, useVideoConfig } from 'remotion';
import { ShieldCheck, CheckCircle2, AlertOctagon, ArrowRight, Clock, DollarSign } from 'lucide-react';

export const Scene3_CollisionEngine: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const titleOpacity = interpolate(frame, [0, 20], [0, 1], { extrapolateRight: 'clamp' });
  const cardScale = spring({ frame: frame - 15, fps, config: { damping: 14 } });
  const badgeSpring = spring({ frame: frame - 35, fps, config: { damping: 12 } });

  return (
    <div
      style={{
        width: '100%',
        height: '100%',
        background: 'linear-gradient(135deg, #090d16 0%, #0f172a 100%)',
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
        <div style={{ color: '#34d399', fontWeight: 700, fontSize: 20, letterSpacing: '2px', textTransform: 'uppercase', marginBottom: 8 }}>
          FEATURE 02 • RESERVATION ENGINE
        </div>
        <h2 style={{ fontSize: 52, margin: 0, fontWeight: 800, fontFamily: "'Playfair Display', Georgia, serif" }}>
          Strict Overlap Collision Prevention
        </h2>
      </div>

      <div style={{ display: 'flex', gap: 50, flex: 1, alignItems: 'center' }}>
        {/* Left: Interactive Collision Algorithm Card */}
        <div
          style={{
            transform: `scale(${cardScale})`,
            flex: 1.1,
            background: 'rgba(255, 255, 255, 0.05)',
            border: '1px solid rgba(255, 255, 255, 0.12)',
            borderRadius: 24,
            padding: 40,
            backdropFilter: 'blur(10px)',
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: 16, marginBottom: 24 }}>
            <div style={{ background: 'rgba(52, 211, 153, 0.15)', padding: 14, borderRadius: 16 }}>
              <ShieldCheck size={36} color="#34d399" />
            </div>
            <div>
              <div style={{ fontSize: 26, fontWeight: 700 }}>Centralized Overlap Engine</div>
              <div style={{ color: '#94a3b8', fontSize: 18 }}>Guarantees zero double-booking conflicts</div>
            </div>
          </div>

          {/* Algorithm Code Box */}
          <div
            style={{
              background: '#040711',
              border: '1px solid #1e293b',
              borderRadius: 16,
              padding: 24,
              fontFamily: "'Courier New', monospace",
              fontSize: 20,
              color: '#38bdf8',
              lineHeight: 1.6,
              marginBottom: 28,
            }}
          >
            <span style={{ color: '#94a3b8' }}>// Overlap Intersection Query</span>
            <br />
            <span style={{ color: '#c084fc' }}>const</span> conflict = <span style={{ color: '#c084fc' }}>await</span> Booking.findOne({'{'}
            <br />
            &nbsp;&nbsp;room: roomId, status: {'{ $ne: '} <span style={{ color: '#f87171' }}>'Cancelled'</span> {'}'},
            <br />
            &nbsp;&nbsp;<span style={{ color: '#facc15' }}>checkInDate:</span> {'{ $lt: newCheckOut }'},
            <br />
            &nbsp;&nbsp;<span style={{ color: '#facc15' }}>checkOutDate:</span> {'{ $gt: newCheckIn }'}
            <br />
            {'}'});
          </div>

          <div style={{ display: 'flex', gap: 20 }}>
            <div style={{ flex: 1, background: 'rgba(52, 211, 153, 0.1)', border: '1px solid rgba(52,211,153,0.3)', padding: 20, borderRadius: 16 }}>
              <div style={{ color: '#34d399', fontWeight: 700, fontSize: 18, marginBottom: 4 }}>✓ VALID DATES</div>
              <div style={{ color: '#e2e8f0', fontSize: 16 }}>Proceed to Instant Confirmation</div>
            </div>
            <div style={{ flex: 1, background: 'rgba(239, 68, 68, 0.1)', border: '1px solid rgba(239,68,68,0.3)', padding: 20, borderRadius: 16 }}>
              <div style={{ color: '#f87171', fontWeight: 700, fontSize: 18, marginBottom: 4 }}>✕ INTERSECTING DATES</div>
              <div style={{ color: '#e2e8f0', fontSize: 16 }}>Conflict Blocked with Friendly Alert</div>
            </div>
          </div>
        </div>

        {/* Right: Booking Summary & Cancellation Flow */}
        <div
          style={{
            transform: `scale(${badgeSpring})`,
            flex: 0.9,
            background: 'linear-gradient(135deg, rgba(30, 58, 138, 0.4) 0%, rgba(15, 23, 42, 0.6) 100%)',
            border: '1px solid rgba(96, 165, 250, 0.3)',
            borderRadius: 24,
            padding: 40,
            boxShadow: '0 25px 50px rgba(0,0,0,0.4)',
          }}
        >
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 24, borderBottom: '1px solid rgba(255,255,255,0.15)', paddingBottom: 16 }}>
            <span style={{ fontSize: 24, fontWeight: 800 }}>Reservation Summary</span>
            <span style={{ background: '#22c55e', color: '#fff', padding: '6px 16px', borderRadius: 20, fontSize: 15, fontWeight: 700 }}>
              CONFIRMED
            </span>
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: 16, marginBottom: 28 }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 18 }}>
              <span style={{ color: '#94a3b8' }}>Room:</span>
              <span style={{ fontWeight: 600 }}>Presidential Penthouse (PH-101)</span>
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 18 }}>
              <span style={{ color: '#94a3b8' }}>Stay Duration:</span>
              <span style={{ fontWeight: 600 }}>4 Nights (Oct 28 &rarr; Nov 01)</span>
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 18 }}>
              <span style={{ color: '#94a3b8' }}>Nightly Breakdown:</span>
              <span style={{ fontWeight: 600 }}>$499 × 4 = $1,996</span>
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 18 }}>
              <span style={{ color: '#94a3b8' }}>Hospitality Tax (10%):</span>
              <span style={{ fontWeight: 600 }}>$200</span>
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 26, fontWeight: 800, borderTop: '1px solid rgba(255,255,255,0.15)', paddingTop: 16, color: '#60a5fa' }}>
              <span>Total Paid:</span>
              <span>$2,196</span>
            </div>
          </div>

          <div style={{ background: 'rgba(255, 255, 255, 0.08)', borderRadius: 16, padding: 18, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <div>
              <div style={{ fontWeight: 700, fontSize: 17 }}>Need to reschedule or cancel?</div>
              <div style={{ color: '#94a3b8', fontSize: 15 }}>Instant 1-click cancellation with refund</div>
            </div>
            <div style={{ background: 'rgba(239, 68, 68, 0.2)', border: '1px solid rgba(239,68,68,0.4)', color: '#f87171', padding: '8px 16px', borderRadius: 20, fontWeight: 700, fontSize: 15 }}>
              Cancel Stay
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
