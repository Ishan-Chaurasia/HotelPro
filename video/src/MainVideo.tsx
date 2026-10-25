import React from 'react';
import { Series } from 'remotion';
import { Scene1_Intro } from './scenes/Scene1_Intro';
import { Scene2_GuestPortal } from './scenes/Scene2_GuestPortal';
import { Scene3_CollisionEngine } from './scenes/Scene3_CollisionEngine';
import { Scene4_AdminConsole } from './scenes/Scene4_AdminConsole';
import { Scene5_Outro } from './scenes/Scene5_Outro';

export const MainVideo: React.FC = () => {
  return (
    <Series>
      {/* Scene 1: Project Identity & Tech Stack (8s = 240 frames) */}
      <Series.Sequence durationInFrames={240}>
        <Scene1_Intro />
      </Series.Sequence>

      {/* Scene 2: Guest Experience & Room Discovery (9s = 270 frames) */}
      <Series.Sequence durationInFrames={270}>
        <Scene2_GuestPortal />
      </Series.Sequence>

      {/* Scene 3: Booking Engine & Collision Avoidance (9s = 270 frames) */}
      <Series.Sequence durationInFrames={270}>
        <Scene3_CollisionEngine />
      </Series.Sequence>

      {/* Scene 4: Admin Workspace & Telemetry (9s = 270 frames) */}
      <Series.Sequence durationInFrames={270}>
        <Scene4_AdminConsole />
      </Series.Sequence>

      {/* Scene 5: Outro & Repository Link (10s = 300 frames) */}
      <Series.Sequence durationInFrames={300}>
        <Scene5_Outro />
      </Series.Sequence>
    </Series>
  );
};
