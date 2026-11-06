'use client';

import React, { useEffect, useRef } from 'react';

const createStarStyle = (imagePath: string, duration: string, delay?: string) => ({
  WebkitMaskImage: `url('${imagePath}')`,
  maskImage: `url('${imagePath}')`,
  WebkitMaskSize: '512px 512px',
  maskSize: '512px 512px',
  WebkitMaskRepeat: 'repeat',
  maskRepeat: 'repeat',
  animationDuration: duration,
  ...(delay ? { animationDelay: delay } : {}),
});

export default function StarrySky() {
  const z1Ref = useRef<HTMLDivElement>(null);
  const z2Ref = useRef<HTMLDivElement>(null);
  const z3Ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    let mouseX = 0;
    let mouseY = 0;
    let targetX = 0;
    let targetY = 0;
    let animationFrameId: number;

    const handleMouseMove = (e: MouseEvent) => {
      targetX = e.clientX;
      targetY = e.clientY;
    };

    window.addEventListener('mousemove', handleMouseMove, { passive: true });

    const ratio = 0.04;
    const animate = () => {
      mouseX += (targetX - mouseX) * 0.05;
      mouseY += (targetY - mouseY) * 0.05;

      const pX = -mouseX * ratio;
      const pY = -mouseY * ratio;

      if (z1Ref.current) {
        z1Ref.current.style.transform = `translate(-50%, -50%) translate3d(${pX}px, ${pY}px, 0)`;
      }
      if (z2Ref.current) {
        z2Ref.current.style.transform = `translate(-50%, -50%) translate3d(${pX * 0.7}px, ${pY * 0.7}px, 0) rotate(217deg)`;
      }
      if (z3Ref.current) {
        z3Ref.current.style.transform = `translate(-50%, -50%) translate3d(${pX * 0.4}px, ${pY * 0.4}px, 0) rotate(71deg)`;
      }

      animationFrameId = requestAnimationFrame(animate);
    };

    animationFrameId = requestAnimationFrame(animate);

    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
      cancelAnimationFrame(animationFrameId);
    };
  }, []);

  return (
    <div
      aria-hidden="true"
      className="fixed inset-0 pointer-events-none z-0 overflow-hidden opacity-65 dark:opacity-95 transition-opacity duration-700"
    >
      {/* Layer 3 - Distant background stars */}
      <div
        ref={z3Ref}
        className="absolute top-1/2 left-1/2 w-[220vmax] h-[220vmax] origin-center will-change-transform"
      >
        <div
          className="absolute inset-0 bg-[#8C60F3] dark:bg-[#E0E7FF] animate-opacity"
          style={createStarStyle('/images/stars/topleft.png', '5s')}
        />
        <div
          className="absolute inset-0 bg-[#8C60F3] dark:bg-[#E0E7FF] animate-opacity"
          style={createStarStyle('/images/stars/topright.png', '9s')}
        />
        <div
          className="absolute inset-0 bg-[#8C60F3] dark:bg-[#E0E7FF] animate-opacity"
          style={createStarStyle('/images/stars/bottomleft.png', '7s')}
        />
        <div
          className="absolute inset-0 bg-[#8C60F3] dark:bg-[#E0E7FF] animate-opacity"
          style={createStarStyle('/images/stars/bottomright.png', '10.17s')}
        />
      </div>

      {/* Layer 2 - Midground stars */}
      <div
        ref={z2Ref}
        className="absolute top-1/2 left-1/2 w-[220vmax] h-[220vmax] origin-center will-change-transform"
      >
        <div
          className="absolute inset-0 bg-[#5E26E5] dark:bg-slate-200 animate-opacity"
          style={createStarStyle('/images/stars/topleft.png', '9s', '1.33s')}
        />
        <div
          className="absolute inset-0 bg-[#5E26E5] dark:bg-slate-200 animate-opacity"
          style={createStarStyle('/images/stars/topright.png', '5s', '1.33s')}
        />
        <div
          className="absolute inset-0 bg-[#5E26E5] dark:bg-slate-200 animate-opacity"
          style={createStarStyle('/images/stars/bottomleft.png', '6.33s', '2.11s')}
        />
        <div
          className="absolute inset-0 bg-[#5E26E5] dark:bg-slate-200 animate-opacity"
          style={createStarStyle('/images/stars/bottomright.png', '10.17s', '2.11s')}
        />
      </div>

      {/* Layer 1 - Foreground bright stars */}
      <div
        ref={z1Ref}
        className="absolute top-1/2 left-1/2 w-[220vmax] h-[220vmax] origin-center will-change-transform"
      >
        <div
          className="absolute inset-0 bg-[#7038F0] dark:bg-white animate-opacity"
          style={createStarStyle('/images/stars/topleft.png', '7s', '1.33s')}
        />
        <div
          className="absolute inset-0 bg-[#7038F0] dark:bg-white animate-opacity"
          style={createStarStyle('/images/stars/topright.png', '5s', '2.11s')}
        />
        <div
          className="absolute inset-0 bg-[#7038F0] dark:bg-white animate-opacity"
          style={createStarStyle('/images/stars/bottomleft.png', '9s', '1.33s')}
        />
        <div
          className="absolute inset-0 bg-[#7038F0] dark:bg-white animate-opacity"
          style={createStarStyle('/images/stars/bottomright.png', '5s', '0.8s')}
        />
      </div>
    </div>
  );
}
