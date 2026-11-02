'use client';

import React from 'react';
import { cn } from '@/lib/utils';

export interface GlowBorderCardProps extends React.HTMLAttributes<HTMLDivElement> {
  children?: React.ReactNode;
  className?: string;
  borderRadius?: string;
  animationDuration?: number;
  glowColor?: string;
}

export function GlowBorderCard({
  children,
  className,
  borderRadius = '1.25rem',
  animationDuration = 5,
  glowColor = '#5B48EE',
  style,
  ...props
}: GlowBorderCardProps) {
  return (
    <div
      className={cn(
        'relative group rounded-2xl p-[1px] overflow-hidden transition-all duration-300',
        className
      )}
      style={{
        borderRadius,
        ...style,
      }}
      {...props}
    >
      {/* VengeanceUI Animated Conic Border */}
      <div
        className="absolute inset-[-100%] bg-[conic-gradient(from_0deg,#5B48EE_0deg,#8E7CFF_90deg,#06B6D4_180deg,#8E7CFF_270deg,#5B48EE_360deg)] animate-[spin_6s_linear_infinite] opacity-40 group-hover:opacity-100 transition-opacity duration-500"
      />

      {/* Inner Card Content */}
      <div
        className="relative z-10 w-full h-full bg-[#0D0B1E] rounded-[inherit] p-6 text-white"
        style={{ borderRadius: `calc(${borderRadius} - 1px)` }}
      >
        {children}
      </div>
    </div>
  );
}
