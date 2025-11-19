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
      
      {/* Hexagonal lantern housing - outer red glow (largest, enhanced) */}
      <ellipse 
        cx="50" 
        cy="55" 
        rx="45" 
        ry="30" 
        fill="url(#outerGlow)"
        opacity="0.2"
      />
      
      {/* Middle red glow layer (enhanced) */}
      <ellipse 
        cx="50" 
        cy="55" 
        rx="32" 
        ry="20" 
        fill="url(#middleGlow)"
        opacity="0.4"
      />
      
      {/* Inner red glow layer (enhanced) */}
      <ellipse 
        cx="50" 
        cy="55" 
        rx="22" 
        ry="14" 
        fill="url(#innerGlow)"
        opacity="0.6"
      />
      
      {/* Hexagonal red glass panels with gradient (1.5x larger) */}
      <polygon 
        points="50,35 68,42 68,68 50,75 32,68 32,42" 
        fill="url(#glassGradient)"
        opacity="0.9"
      />
      
      {/* Brighter center core with radial glow (1.5x larger) */}
      <polygon 
        points="50,40 63,46 63,64 50,70 37,64 37,46" 
        fill="url(#coreGlow)"
        opacity="0.95"
      />
      
      {/* Dark metal frame bars - vertical strips (1.5x scaled) */}
      <line x1="50" y1="28" x2="50" y2="80" stroke="#1d1d1d" strokeWidth="2.5" opacity="0.9" />
      <line x1="68" y1="38" x2="68" y2="72" stroke="#1d1d1d" strokeWidth="2.5" opacity="0.9" />
      <line x1="32" y1="38" x2="32" y2="72" stroke="#1d1d1d" strokeWidth="2.5" opacity="0.9" />
      <line x1="61" y1="32" x2="61" y2="77" stroke="#1d1d1d" strokeWidth="2" opacity="0.8" />
      <line x1="39" y1="32" x2="39" y2="77" stroke="#1d1d1d" strokeWidth="2" opacity="0.8" />
      
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
      
      {/* Decorative brackets */}
      <path d="M45 78 L40 82 L40 85 L45 85 Z" fill="#3d3d3d" opacity="0.9" />
      <path d="M55 78 L60 82 L60 85 L55 85 Z" fill="#3d3d3d" opacity="0.9" />
      
      {/* Decorative rivets on frame (enhanced) */}
      <circle cx="50" cy="25" r="1.2" fill="#5d5d5d" />
      <circle cx="50" cy="25" r="0.8" fill="#4d4d4d" />
      <circle cx="62" cy="30" r="1.2" fill="#5d5d5d" />
      <circle cx="62" cy="30" r="0.8" fill="#4d4d4d" />
      <circle cx="38" cy="30" r="1.2" fill="#5d5d5d" />
      <circle cx="38" cy="30" r="0.8" fill="#4d4d4d" />
      <circle cx="62" cy="50" r="1.2" fill="#5d5d5d" />
      <circle cx="62" cy="50" r="0.8" fill="#4d4d4d" />
      <circle cx="38" cy="50" r="1.2" fill="#5d5d5d" />
      <circle cx="38" cy="50" r="0.8" fill="#4d4d4d" />
      
      {/* Enhanced filters and gradients */}
      <defs>
        {/* Glass gradient for realistic effect */}
        <linearGradient id="glassGradient" x1="0%" y1="0%" x2="0%" y2="100%">
          <stop offset="0%" stopColor="hsl(0 100% 70%)" stopOpacity="0.9"/>
          <stop offset="30%" stopColor="hsl(0 95% 60%)" stopOpacity="0.8"/>
          <stop offset="70%" stopColor="hsl(0 90% 55%)" stopOpacity="0.75"/>
          <stop offset="100%" stopColor="hsl(0 85% 50%)" stopOpacity="0.7"/>
        </linearGradient>
        
        {/* Core radial glow */}
        <radialGradient id="coreGlow" cx="50%" cy="50%" r="50%">
          <stop offset="0%" stopColor="hsl(0 100% 85%)" stopOpacity="1"/>
          <stop offset="40%" stopColor="hsl(0 98% 70%)" stopOpacity="0.9"/>
          <stop offset="80%" stopColor="hsl(0 92% 60%)" stopOpacity="0.7"/>
          <stop offset="100%" stopColor="hsl(0 85% 50%)" stopOpacity="0"/>
        </radialGradient>
        
        {/* Enhanced glow filters */}
        <radialGradient id="outerGlow" cx="50%" cy="50%" r="50%">
          <stop offset="0%" stopColor="hsl(0 100% 60%)" stopOpacity="0.8"/>
          <stop offset="60%" stopColor="hsl(0 95% 55%)" stopOpacity="0.4"/>
          <stop offset="100%" stopColor="hsl(0 90% 50%)" stopOpacity="0"/>
        </radialGradient>
        
        <radialGradient id="middleGlow" cx="50%" cy="50%" r="50%">
          <stop offset="0%" stopColor="hsl(0 100% 65%)" stopOpacity="0.9"/>
          <stop offset="70%" stopColor="hsl(0 95% 58%)" stopOpacity="0.5"/>
          <stop offset="100%" stopColor="hsl(0 90% 52%)" stopOpacity="0"/>
        </radialGradient>
        
        <radialGradient id="innerGlow" cx="50%" cy="50%" r="50%">
          <stop offset="0%" stopColor="hsl(0 100% 75%)" stopOpacity="1"/>
          <stop offset="50%" stopColor="hsl(0 98% 65%)" stopOpacity="0.8"/>
          <stop offset="100%" stopColor="hsl(0 92% 55%)" stopOpacity="0"/>
        </radialGradient>
      </defs>
    </svg>
  );
};

export default StreetLampIcon;
