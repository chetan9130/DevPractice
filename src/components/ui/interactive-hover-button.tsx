"use client";

import React from "react";
import { ArrowRight } from "lucide-react";
import { cn } from "@/lib/utils";

interface InteractiveHoverButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  children: React.ReactNode;
  icon?: React.ReactNode;
  className?: string;
  glowColor?: string;
}

export function InteractiveHoverButton({
  children,
  icon,
  className,
  glowColor = "#5B48EE",
  ...props
}: InteractiveHoverButtonProps) {
  return (
    <button
      className={cn(
        "group relative inline-flex items-center justify-center overflow-hidden rounded-xl bg-[#5B48EE] px-6 py-3 text-xs sm:text-sm font-bold text-white transition-all duration-300 active:scale-95 shadow-lg shadow-indigo-600/25",
        className
      )}
      {...props}
    >
      <div className="flex items-center gap-2 transition-all duration-300 group-hover:-translate-x-1">
        <span>{children}</span>
        {icon || <ArrowRight className="w-4 h-4 transition-transform duration-300 group-hover:translate-x-1" />}
      </div>
      
      {/* VengeanceUI radial light sweep */}
      <span className="absolute inset-0 block h-full w-full bg-gradient-to-r from-transparent via-white/15 to-transparent -translate-x-full transition-transform duration-700 ease-in-out group-hover:translate-x-full" />
    </button>
  );
}
