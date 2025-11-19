interface StreetLampIconProps {
  className?: string;
}

const StreetLampIcon = ({ className = "" }: StreetLampIconProps) => {
  return (
    <svg 
      viewBox="0 0 100 200" 
      fill="none" 
      xmlns="http://www.w3.org/2000/svg"
      className={`inline-block ${className}`}
    >
      {/* Main post - dark metal */}
      <rect 
        x="47" 
        y="60" 
        width="6" 
        height="135" 
        fill="#2d2d2d"
        rx="1"
      />
      
      {/* Decorative sphere on post */}
      <circle 
        cx="50" 
        cy="75" 
        r="5" 
        fill="#3d3d3d"
        stroke="#1d1d1d"
        strokeWidth="0.5"
      />
      
      {/* Conical top/roof */}
      <path 
        d="M50 8 L65 25 L35 25 Z" 
        fill="#2d2d2d"
        stroke="#1d1d1d"
        strokeWidth="1"
      />
      
      {/* Top ornament point */}
      <path 
        d="M50 0 L54 8 L46 8 Z" 
        fill="#3d3d3d"
      />
      
      {/* Hexagonal lantern housing - outer red glow (largest) */}
      <ellipse 
        cx="50" 
        cy="40" 
        rx="28" 
        ry="18" 
        fill="hsl(0 90% 50%)"
        opacity="0.15"
        filter="url(#outerGlow)"
      />
      
      {/* Middle red glow layer */}
      <ellipse 
        cx="50" 
        cy="40" 
        rx="20" 
        ry="13" 
        fill="hsl(0 95% 55%)"
        opacity="0.3"
        filter="url(#middleGlow)"
      />
      
      {/* Inner red glow layer */}
      <ellipse 
        cx="50" 
        cy="40" 
        rx="14" 
        ry="9" 
        fill="hsl(0 100% 60%)"
        opacity="0.5"
        filter="url(#innerGlow)"
      />
      
      {/* Hexagonal red glass panels */}
      <polygon 
        points="50,28 62,33 62,47 50,52 38,47 38,33" 
        fill="hsl(0 85% 50%)"
        opacity="0.8"
      />
      
      {/* Brighter center core */}
      <polygon 
        points="50,32 58,36 58,44 50,48 42,44 42,36" 
        fill="hsl(0 100% 65%)"
        opacity="0.9"
      />
      
      {/* Dark metal frame bars - vertical strips */}
      <line x1="50" y1="25" x2="50" y2="55" stroke="#1d1d1d" strokeWidth="1.5" />
      <line x1="62" y1="30" x2="62" y2="50" stroke="#1d1d1d" strokeWidth="1.5" />
      <line x1="38" y1="30" x2="38" y2="50" stroke="#1d1d1d" strokeWidth="1.5" />
      <line x1="56" y1="27" x2="56" y2="53" stroke="#1d1d1d" strokeWidth="1.2" />
      <line x1="44" y1="27" x2="44" y2="53" stroke="#1d1d1d" strokeWidth="1.2" />
      
      {/* Top metal rim */}
      <ellipse 
        cx="50" 
        cy="25" 
        rx="15" 
        ry="3" 
        fill="#2d2d2d"
        stroke="#1d1d1d"
        strokeWidth="0.8"
      />
      
      {/* Bottom metal rim */}
      <ellipse 
        cx="50" 
        cy="55" 
        rx="15" 
        ry="3" 
        fill="#2d2d2d"
        stroke="#1d1d1d"
        strokeWidth="0.8"
      />
      
      {/* Connection bracket to post */}
      <rect 
        x="48" 
        y="55" 
        width="4" 
        height="8" 
        fill="#2d2d2d"
        rx="0.5"
      />
      
      {/* Post base mount */}
      <rect 
        x="44" 
        y="190" 
        width="12" 
        height="8" 
        fill="#2d2d2d"
        stroke="#1d1d1d"
        strokeWidth="1"
        rx="1"
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
