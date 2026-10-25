import React from 'react';
import { Composition } from 'remotion';
import { MainVideo } from './MainVideo';

export const RemotionRoot: React.FC = () => {
  return (
    <>
      <Composition
        id="HotelProDemo"
        component={MainVideo}
        durationInFrames={1350} // 45 seconds at 30 fps
        fps={30}
        width={1920}
        height={1080}
      />
    </>
  );
};
