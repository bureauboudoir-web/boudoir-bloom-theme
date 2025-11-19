interface StreetLampIconProps {
  className?: string;
}

const StreetLampIcon = ({ className = "" }: StreetLampIconProps) => {
  return (
    <svg 
      viewBox="0 0 24 24" 
      fill="none" 
      xmlns="http://www.w3.org/2000/svg"
      className={`inline-block ${className}`}
    >
      {/* Lamp post */}
      <path 
        d="M12 3v18" 
        stroke="hsl(var(--rose-gold))" 
        strokeWidth="1.5" 
        strokeLinecap="round"
      />
      
      {/* Top ornament */}
      <circle 
        cx="12" 
        cy="3" 
        r="1" 
        fill="hsl(var(--rose-gold))"
      />
      
      {/* Lamp housing - gold */}
      <path 
        d="M9 8h6c1 0 1.5 0.5 1.5 1.5v2c0 1-0.5 1.5-1.5 1.5H9c-1 0-1.5-0.5-1.5-1.5v-2C7.5 8.5 8 8 9 8z" 
        fill="hsl(var(--rose-gold))"
        stroke="hsl(var(--rose-gold))"
        strokeWidth="0.5"
      />
      
      {/* Red light glow */}
      <ellipse 
        cx="12" 
        cy="10" 
        rx="4" 
        ry="2" 
        fill="hsl(0 80% 50%)"
        opacity="0.6"
        filter="url(#glow)"
      />
      
      {/* Red light core */}
      <ellipse 
        cx="12" 
        cy="10" 
        rx="2.5" 
        ry="1.2" 
        fill="hsl(0 90% 60%)"
      />
      
      {/* Lamp bracket */}
      <path 
        d="M12 8V6" 
        stroke="hsl(var(--rose-gold))" 
        strokeWidth="1" 
        strokeLinecap="round"
      />
      
      {/* Base */}
      <rect 
        x="10.5" 
        y="21" 
        width="3" 
        height="1" 
        fill="hsl(var(--rose-gold))"
        rx="0.5"
      />
      
      {/* Glow filter */}
      <defs>
        <filter id="glow" x="-50%" y="-50%" width="200%" height="200%">
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
