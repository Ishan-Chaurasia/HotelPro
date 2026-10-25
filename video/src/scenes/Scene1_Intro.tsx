import React from 'react';
import { interpolate, spring, useCurrentFrame, useVideoConfig } from 'remotion';
import { Hotel, Sparkles, ShieldCheck, Database, Server, Code2 } from 'lucide-react';

export const Scene1_Intro: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  // Entrance animations
  const logoScale = spring({
    frame,
    fps,
    config: { damping: 12 },
  });

  const titleOpacity = interpolate(frame, [15, 35], [0, 1], {
    extrapolateLeft: 'clamp',
    extrapolateRight: 'clamp',
  });
  const titleY = interpolate(frame, [15, 35], [40, 0], {
    extrapolateLeft: 'clamp',
    extrapolateRight: 'clamp',
  });

  const subtitleOpacity = interpolate(frame, [30, 50], [0, 1], {
    extrapolateLeft: 'clamp',
    extrapolateRight: 'clamp',
  });

  // Staggered badges
  const badgeSpring = (delay: number) =>
    spring({
      frame: frame - delay,
      fps,
      config: { damping: 14 },
    });

  return (
    <div
      style={{
        width: '100%',
        height: '100%',
        background: 'linear-gradient(135deg, #090d16 0%, #0f172a 50%, #1e293b 100%)',
        color: '#ffffff',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        fontFamily: "'Inter', sans-serif",
        position: 'relative',
        overflow: 'hidden',
      }}
    >
      {/* Background Decorative Glow */}
      <div
        style={{
          position: 'absolute',
          width: 800,
          height: 800,
          borderRadius: '50%',
          background: 'radial-gradient(circle, rgba(37,99,235,0.2) 0%, rgba(0,0,0,0) 70%)',
          top: '50%',
          left: '50%',
          transform: 'translate(-50%, -50%)',
          pointerEvents: 'none',
        }}
      />

      {/* Floating Sparkle Badge */}
      <div
        style={{
          opacity: subtitleOpacity,
          display: 'flex',
          alignItems: 'center',
          gap: 10,
          background: 'rgba(255, 255, 255, 0.08)',
          border: '1px solid rgba(255, 255, 255, 0.15)',
          padding: '8px 24px',
          borderRadius: 40,
          fontSize: 22,
          fontWeight: 600,
          color: '#fbbf24',
          marginBottom: 30,
          backdropFilter: 'blur(10px)',
        }}
      >
        <Sparkles size={24} />
        <span>MERN STACK CAPSTONE EVALUATION</span>
      </div>

      {/* Animated Logo Icon */}
      <div
        style={{
          transform: `scale(${logoScale})`,
          background: 'linear-gradient(135deg, #1e3a8a 0%, #2563eb 100%)',
          padding: 32,
          borderRadius: 36,
          boxShadow: '0 20px 50px rgba(37, 99, 235, 0.5), inset 0 2px 4px rgba(255,255,255,0.3)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          marginBottom: 30,
          border: '1px solid rgba(255,255,255,0.2)',
        }}
      >
        <Hotel size={84} color="#ffffff" strokeWidth={2.2} />
      </div>

      {/* Project Title */}
      <h1
        style={{
          opacity: titleOpacity,
          transform: `translateY(${titleY}px)`,
          fontSize: 88,
          fontWeight: 800,
          letterSpacing: '-2px',
          margin: '0 0 16px 0',
          fontFamily: "'Playfair Display', Georgia, serif",
          textAlign: 'center',
        }}
      >
        Hotel<span style={{ color: '#60a5fa' }}>Pro</span>
      </h1>

      {/* Subtitle */}
      <p
        style={{
          opacity: subtitleOpacity,
          fontSize: 34,
          color: '#94a3b8',
          maxWidth: 1000,
          textAlign: 'center',
          margin: '0 0 50px 0',
          fontWeight: 400,
          lineHeight: 1.4,
        }}
      >
        Complete Hotel Booking & Property Management Solution
      </p>

      {/* Tech Stack Pills */}
      <div
        style={{
          display: 'flex',
          gap: 20,
          flexWrap: 'wrap',
          justifyContent: 'center',
          maxWidth: 1200,
        }}
      >
        {[
          { label: 'React 18 & Vite', icon: Code2, color: '#38bdf8', delay: 45 },
          { label: 'Node.js & Express API', icon: Server, color: '#4ade80', delay: 55 },
          { label: 'MongoDB & Mongoose', icon: Database, color: '#34d399', delay: 65 },
          { label: 'JWT & Bcrypt Security', icon: ShieldCheck, color: '#f87171', delay: 75 },
        ].map((item, index) => {
          const scale = badgeSpring(item.delay);
          const Icon = item.icon;
          return (
            <div
              key={index}
              style={{
                transform: `scale(${scale})`,
                display: 'flex',
                alignItems: 'center',
                gap: 12,
                background: 'rgba(15, 23, 42, 0.85)',
                border: '1px solid rgba(255, 255, 255, 0.12)',
                padding: '14px 28px',
                borderRadius: 20,
                fontSize: 22,
                fontWeight: 600,
                color: '#e2e8f0',
                boxShadow: '0 10px 25px rgba(0,0,0,0.3)',
              }}
            >
              <Icon size={24} color={item.color} />
              <span>{item.label}</span>
            </div>
          );
        })}
      </div>
    </div>
  );
};
