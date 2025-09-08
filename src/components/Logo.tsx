import React from 'react';

interface LogoProps {
  className?: string;
  size?: 'sm' | 'md' | 'lg';
}

const Logo: React.FC<LogoProps> = ({ className = '', size = 'md' }) => {
  const sizeClasses = {
    sm: 'w-6 h-6',
    md: 'w-8 h-8',
    lg: 'w-12 h-12'
  };

  return (
    <div className={`flex items-center gap-3 ${className}`}>
      {/* Mermaid Tail SVG */}
      <div className={`${sizeClasses[size]} flex-shrink-0`}>
        <svg
          viewBox="0 0 32 32"
          className="w-full h-full"
          xmlns="http://www.w3.org/2000/svg"
        >
          <defs>
            <radialGradient id="tailGlow" cx="50%" cy="50%" r="50%">
              <stop offset="0%" stopColor="#3b82f6" stopOpacity="0.8" />
              <stop offset="70%" stopColor="#1d4ed8" stopOpacity="0.4" />
              <stop offset="100%" stopColor="#1e40af" stopOpacity="0" />
            </radialGradient>
            <linearGradient id="tailGradient" x1="0%" y1="100%" x2="0%" y2="0%">
              <stop offset="0%" stopColor="#1e40af" />
              <stop offset="50%" stopColor="#3b82f6" />
              <stop offset="100%" stopColor="#60a5fa" />
            </linearGradient>
            <filter id="glow">
              <feGaussianBlur stdDeviation="2" result="coloredBlur"/>
              <feMerge> 
                <feMergeNode in="coloredBlur"/>
                <feMergeNode in="SourceGraphic"/>
              </feMerge>
            </filter>
          </defs>
          
          {/* Glow effect */}
          <circle
            cx="16"
            cy="16"
            r="14"
            fill="url(#tailGlow)"
            opacity="0.6"
          />
          
          {/* Mermaid tail shape */}
          <path
            d="M16 28 
               C12 24, 8 20, 6 16
               C8 12, 12 8, 16 4
               C20 8, 24 12, 26 16
               C24 20, 20 24, 16 28 Z"
            fill="url(#tailGradient)"
            filter="url(#glow)"
            className="drop-shadow-lg"
          />
          
          {/* Inner highlight */}
          <path
            d="M16 26 
               C13 23, 10 20, 8 16
               C10 13, 13 10, 16 7
               C19 10, 22 13, 24 16
               C22 20, 19 23, 16 26 Z"
            fill="rgba(255,255,255,0.3)"
            opacity="0.6"
          />
        </svg>
      </div>
      
      {/* Text */}
      <div className="flex flex-col">
        <span className="text-lg font-semibold text-foreground tracking-tight leading-none">
          Mermaid Maker
        </span>
        <span className="text-xs text-muted-foreground leading-none">
          AI-powered Mermaid editor
        </span>
      </div>
    </div>
  );
};

export default Logo;
