interface StreetLampIconProps {
  className?: string;
}

const StreetLampIcon = ({ className = "" }: StreetLampIconProps) => {
  return (
    <svg 
      viewBox="0 0 100 120" 
      fill="none" 
      xmlns="http://www.w3.org/2000/svg"
      className={`inline-block ${className}`}
    >
      {/* Main post - dark metal (shortened) */}
      <rect 
        x="46" 
        y="80" 
        width="8" 
        height="35" 
        fill="#2d2d2d"
        rx="1"
      />
      
      {/* Conical top/roof (larger) */}
      <path 
        d="M50 5 L72 30 L28 30 Z" 
        fill="#2d2d2d"
        stroke="#1d1d1d"
        strokeWidth="1.5"
      />
      
      {/* Top ornament point (larger) */}
      <path 
        d="M50 0 L55 10 L45 10 Z" 
        fill="#3d3d3d"
      />
      
      {/* Hexagonal lantern housing - outer red glow (largest, 40% bigger) */}
      <ellipse 
        cx="50" 
        cy="55" 
        rx="40" 
        ry="26" 
        fill="hsl(0 90% 50%)"
        opacity="0.15"
        filter="url(#outerGlow)"
      />
      
      {/* Middle red glow layer (40% bigger) */}
      <ellipse 
        cx="50" 
        cy="55" 
        rx="28" 
        ry="18" 
        fill="hsl(0 95% 55%)"
        opacity="0.3"
        filter="url(#middleGlow)"
      />
      
      {/* Inner red glow layer (40% bigger) */}
      <ellipse 
        cx="50" 
        cy="55" 
        rx="20" 
        ry="13" 
        fill="hsl(0 100% 60%)"
        opacity="0.5"
        filter="url(#innerGlow)"
      />
      
      {/* Hexagonal red glass panels (1.5x larger) */}
      <polygon 
        points="50,35 68,42 68,68 50,75 32,68 32,42" 
        fill="hsl(0 85% 50%)"
        opacity="0.8"
      />
      
      {/* Brighter center core (1.5x larger) */}
      <polygon 
        points="50,40 63,46 63,64 50,70 37,64 37,46" 
        fill="hsl(0 100% 65%)"
        opacity="0.9"
      />
      
      {/* Dark metal frame bars - vertical strips (1.5x scaled) */}
      <line x1="50" y1="28" x2="50" y2="80" stroke="#1d1d1d" strokeWidth="2" />
      <line x1="68" y1="38" x2="68" y2="72" stroke="#1d1d1d" strokeWidth="2" />
      <line x1="32" y1="38" x2="32" y2="72" stroke="#1d1d1d" strokeWidth="2" />
      <line x1="61" y1="32" x2="61" y2="77" stroke="#1d1d1d" strokeWidth="1.5" />
      <line x1="39" y1="32" x2="39" y2="77" stroke="#1d1d1d" strokeWidth="1.5" />
      
      {/* Top metal rim (1.5x scaled) */}
      <ellipse 
        cx="50" 
        cy="30" 
        rx="22" 
        ry="4" 
        fill="#2d2d2d"
        stroke="#1d1d1d"
        strokeWidth="1"
      />
      
      {/* Bottom metal rim (1.5x scaled) */}
      <ellipse 
        cx="50" 
        cy="80" 
        rx="22" 
        ry="4" 
        fill="#2d2d2d"
        stroke="#1d1d1d"
        strokeWidth="1"
      />
      
      {/* Connection bracket to post */}
      <rect 
        x="47" 
        y="80" 
        width="6" 
        height="10" 
        fill="#2d2d2d"
        rx="0.5"
      />
      
      {/* Decorative rivets on frame */}
      <circle cx="50" cy="25" r="0.8" fill="#4d4d4d" />
      <circle cx="62" cy="30" r="0.8" fill="#4d4d4d" />
      <circle cx="38" cy="30" r="0.8" fill="#4d4d4d" />
      <circle cx="62" cy="50" r="0.8" fill="#4d4d4d" />
      <circle cx="38" cy="50" r="0.8" fill="#4d4d4d" />
      
      {/* Glow filters */}
      <defs>
        <filter id="outerGlow" x="-100%" y="-100%" width="300%" height="300%">
          <feGaussianBlur stdDeviation="4" result="coloredBlur"/>
          <feMerge>
            <feMergeNode in="coloredBlur"/>
            <feMergeNode in="SourceGraphic"/>
          </feMerge>
        </filter>
        <filter id="middleGlow" x="-80%" y="-80%" width="260%" height="260%">
          <feGaussianBlur stdDeviation="3" result="coloredBlur"/>
          <feMerge>
            <feMergeNode in="coloredBlur"/>
            <feMergeNode in="SourceGraphic"/>
          </feMerge>
        </filter>
        <filter id="innerGlow" x="-60%" y="-60%" width="220%" height="220%">
          <feGaussianBlur stdDeviation="2" result="coloredBlur"/>
          <feMerge>
            <feMergeNode in="coloredBlur"/>
            <feMergeNode in="SourceGraphic"/>
          </feMerge>
        </filter>
      </defs>
    </svg>
  );
};

export default StreetLampIcon;
