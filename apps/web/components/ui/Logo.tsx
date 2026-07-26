import React from "react";

interface LogoProps {
  className?: string;
  iconSize?: number;
  textSize?: number;
  showText?: boolean;
}

export function Logo({
  className = "",
  iconSize = 36,
  textSize = 20,
  showText = true,
}: LogoProps) {
  return (
    <div className={`flex items-center gap-1 select-none ${className}`}>
      {/* Custom SVG Kotonoha Emblem */}
      <div 
        className="relative flex items-center justify-center rounded-xl shadow-sm overflow-hidden flex-shrink-0 transition-transform hover:scale-105 duration-200"
        style={{ width: `${iconSize}px`, height: `${iconSize}px` }}
      >
        <svg
          viewBox="0 0 40 40"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
          className="w-full h-full"
        >
          <defs>
            <linearGradient id="kotonoha-grad" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#E63946" />
              <stop offset="50%" stopColor="#D93025" />
              <stop offset="100%" stopColor="#9B1B12" />
            </linearGradient>
            <linearGradient id="k-shine" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#FFFFFF" stopOpacity="0.22" />
              <stop offset="100%" stopColor="#FFFFFF" stopOpacity="0" />
            </linearGradient>
          </defs>
          
          {/* Rounded base box with red gradient */}
          <rect width="40" height="40" rx="11" fill="url(#kotonoha-grad)" />
          
          {/* Subtle inner shine for premium depth */}
          <rect width="40" height="40" rx="11" fill="url(#k-shine)" />
          
          {/* Dynamic Calligraphic/Geometric K Emblem */}
          <path
            d="M13 10C13 9.44772 13.4477 9 14 9H16C16.5523 9 17 9.44772 17 10V20.5L25.2929 11.2071C25.6834 10.8166 26.3166 10.8166 26.7071 11.2071L28.7071 13.2071C29.0976 13.5976 29.0976 14.2308 28.7071 14.6213L21.5 21.8284L28.8536 29.182C29.2441 29.5725 29.2441 30.2056 28.8536 30.5962L26.8536 32.5962C26.463 32.9867 25.8299 32.9867 25.4393 32.5962L17 24.1569V30C17 30.5523 16.5523 31 16 31H14C13.4477 31 13 30.5523 13 30V10Z"
            fill="white"
          />
          {/* Accent flourish leaf on top right */}
          <circle cx="28" cy="9.5" r="2.5" fill="#FF8A80" />
        </svg>
      </div>

      {/* Brand Text */}
      {showText && (
        <span 
          className="font-extrabold tracking-tight text-white leading-none"
          style={{ 
            fontSize: `${textSize}px`,
            fontFamily: "var(--font-sans, inherit)",
            letterSpacing: "-0.03em"
          }}
        >
          otonoha
        </span>
      )}
    </div>
  );
}
