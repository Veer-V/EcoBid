import React from 'react';

interface LogoProps {
  className?: string;
  variant?: 'light' | 'dark'; // 'light' is for dark backgrounds (Splash), 'dark' is for light backgrounds (Login)
  showTagline?: boolean;
}

const Logo: React.FC<LogoProps> = ({ className = "", variant = 'dark', showTagline = true }) => {
  // Text colors based on background
  const ecoColor = 'text-eco-green'; // Always green
  const bidColor = variant === 'light' ? 'text-white' : 'text-slate-800';
  const taglineColor = variant === 'light' ? 'text-gray-200' : 'text-slate-600';
  
  // Icon stroke colors
  const loopColor = variant === 'light' ? '#FFFFFF' : '#1e293b'; 

  return (
    <div className={`flex items-center gap-4 ${className}`}>
      {/* Logo Icon */}
      <div className="relative w-20 h-20 flex-shrink-0">
        <svg viewBox="0 0 100 100" fill="none" xmlns="http://www.w3.org/2000/svg" className="w-full h-full drop-shadow-lg">
          <defs>
             <linearGradient id="globeGrad" x1="20" y1="80" x2="80" y2="20">
                <stop offset="0%" stopColor="#1565C0" />
                <stop offset="50%" stopColor="#2E7D32" />
                <stop offset="100%" stopColor="#4CAF50" />
             </linearGradient>
             <filter id="glow">
                <feGaussianBlur stdDeviation="1.5" result="coloredBlur"/>
                <feMerge>
                    <feMergeNode in="coloredBlur"/>
                    <feMergeNode in="SourceGraphic"/>
                </feMerge>
             </filter>
          </defs>

          {/* 1. The Globe (Inner Circle) */}
          <circle cx="50" cy="55" r="28" fill="url(#globeGrad)" opacity="0.9" />
          
          {/* Continent shapes (Abstract) */}
          <path d="M40 45 C45 40, 55 40, 60 50 C65 60, 55 70, 50 65 C45 60, 35 55, 40 45" fill="rgba(255,255,255,0.2)" />
          
          {/* Recycle Symbol inside Globe */}
          <path d="M50 40 L55 50 L45 50 Z" stroke="white" strokeWidth="2" strokeLinejoin="round" fill="none" transform="translate(0, -3)" />
          <path d="M55 50 L60 60 L50 60" stroke="white" strokeWidth="2" strokeLinejoin="round" fill="none" transform="translate(3, 2) rotate(120 55 55)" />
          <path d="M45 50 L50 60 L40 60" stroke="white" strokeWidth="2" strokeLinejoin="round" fill="none" transform="translate(-3, 2) rotate(240 45 55)" />

          {/* 2. The Green Leaf (Left Swoosh) */}
          {/* Starts bottom, curves left and up to top center */}
          <path d="M50 88 C30 88, 10 65, 10 40 C10 25, 25 10, 50 10" 
                stroke="#4CAF50" strokeWidth="6" strokeLinecap="round" fill="none" />
          {/* Leaf detail at top */}
          <path d="M10 40 Q5 30 20 20" fill="#4CAF50" opacity="0.8" />
          <path d="M50 10 C40 10, 35 15, 30 25" stroke="#4CAF50" strokeWidth="2" fill="none" />

          {/* 3. The Gavel / Loop (Right Swoosh) */}
          {/* Starts top center, curves right and down to bottom */}
          <path d="M50 10 C75 10, 90 30, 90 55 C90 75, 75 88, 50 88" 
                stroke={loopColor} strokeWidth="6" strokeLinecap="round" fill="none" />
          
          {/* Gavel Head at Top Right (approx 1-2 o'clock position on the loop) */}
          {/* The loop actually forms the handle. Let's place a gavel head intersecting the loop at top right */}
          <g transform="translate(72, 22) rotate(45)">
            <rect x="-8" y="-12" width="16" height="24" rx="2" fill={loopColor} />
            <rect x="-10" y="-12" width="20" height="4" rx="1" fill={loopColor} />
            <rect x="-10" y="8" width="20" height="4" rx="1" fill={loopColor} />
          </g>

        </svg>
      </div>
      
      {/* Text Container */}
      <div className="flex flex-col justify-center items-start">
          <h1 className="text-5xl font-extrabold tracking-tight leading-none" style={{ fontFamily: '"Inter", sans-serif' }}>
            <span className={ecoColor}>Eco</span>
            <span className={bidColor}>Bid</span>
          </h1>
          
          {showTagline && (
            <p className={`text-sm font-medium tracking-wide mt-1 ${taglineColor}`}>
              Waste to Worth. For Nature.
            </p>
          )}
      </div>
    </div>
  );
};

export default Logo;