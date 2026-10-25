import React from 'react';
import { interpolate, spring, useCurrentFrame, useVideoConfig } from 'remotion';
import { Hotel, Github, Globe, Award, Sparkles, CheckCircle2 } from 'lucide-react';

export const Scene5_Outro: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const titleScale = spring({ frame, fps, config: { damping: 12 } });
  const contentOpacity = interpolate(frame, [15, 35], [0, 1], { extrapolateRight: 'clamp' });

  return (
    <div
      style={{
        width: '100%',
        height: '100%',
        background: 'linear-gradient(135deg, #090d16 0%, #0f172a 50%, #1e293b 100%)',
        color: '#ffffff',
        padding: '60px 100px',
        boxSizing: 'border-box',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        fontFamily: "'Inter', sans-serif",
        textAlign: 'center',
        position: 'relative',
      }}
    >
      {/* Brand Icon */}
      <div
        style={{
          transform: `scale(${titleScale})`,
          background: 'linear-gradient(135deg, #1e3a8a, #2563eb)',
          padding: 24,
          borderRadius: 28,
          marginBottom: 24,
          boxShadow: '0 20px 40px rgba(37,99,235,0.4)',
        }}
      >
        <Hotel size={56} color="#ffffff" />
      </div>

      <h1
        style={{
          transform: `scale(${titleScale})`,
          fontSize: 68,
          fontWeight: 800,
          margin: '0 0 16px 0',
          fontFamily: "'Playfair Display', serif",
        }}
      >
        Ready for SkillWallet Evaluation
      </h1>

      <p
        style={{
          opacity: contentOpacity,
          fontSize: 26,
          color: '#94a3b8',
          maxWidth: 900,
          margin: '0 0 40px 0',
        }}
      >
        Complete MERN Stack implementation featuring secure JWT auth, real-time availability collision logic, and property operations telemetry.
      </p>

      {/* Turnkey Features Box */}
      <div
        style={{
          opacity: contentOpacity,
          display: 'flex',
          gap: 30,
          marginBottom: 45,
        }}
      >
        <div style={{ background: 'rgba(255,255,255,0.06)', border: '1px solid rgba(255,255,255,0.12)', padding: '16px 30px', borderRadius: 20, display: 'flex', alignItems: 'center', gap: 12 }}>
          <CheckCircle2 size={24} color="#34d399" />
          <span style={{ fontSize: 20, fontWeight: 600 }}>1-Click Mentor Evaluation Logins</span>
        </div>
        <div style={{ background: 'rgba(255,255,255,0.06)', border: '1px solid rgba(255,255,255,0.12)', padding: '16px 30px', borderRadius: 20, display: 'flex', alignItems: 'center', gap: 12 }}>
          <CheckCircle2 size={24} color="#38bdf8" />
          <span style={{ fontSize: 20, fontWeight: 600 }}>Dual-Mode In-Memory + MongoDB Engine</span>
        </div>
        <div style={{ background: 'rgba(255,255,255,0.06)', border: '1px solid rgba(255,255,255,0.12)', padding: '16px 30px', borderRadius: 20, display: 'flex', alignItems: 'center', gap: 12 }}>
          <CheckCircle2 size={24} color="#fbbf24" />
          <span style={{ fontSize: 20, fontWeight: 600 }}>Zero Setup Required for Immediate Testing</span>
        </div>
      </div>

      {/* GitHub Repository Bar */}
      <div
        style={{
          opacity: contentOpacity,
          background: 'rgba(15, 23, 42, 0.9)',
          border: '1px solid #334155',
          borderRadius: 24,
          padding: '16px 36px',
          display: 'flex',
          alignItems: 'center',
          gap: 16,
          boxShadow: '0 15px 35px rgba(0,0,0,0.4)',
        }}
      >
        <Github size={28} color="#ffffff" />
        <span style={{ fontSize: 24, fontWeight: 700, color: '#60a5fa' }}>
          github.com/Ishan-Chaurasia/HotelPro
        </span>
      </div>

      <div style={{ opacity: contentOpacity, marginTop: 40, color: '#64748b', fontSize: 18 }}>
        Engineered with passion for the SkillWallet / SmartInternz Full Stack Development Capstone
      </div>
    </div>
  );
};
