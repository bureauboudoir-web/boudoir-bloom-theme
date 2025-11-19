// Custom SVG Potted Rose Components
const SeedlingPot = () => (
  <svg viewBox="0 0 200 280" className="w-full h-full" style={{ maxWidth: '160px', maxHeight: '220px' }}>
    <defs>
      <linearGradient id="potGradient" x1="0%" y1="0%" x2="100%" y2="100%">
        <stop offset="0%" stopColor="#3a4a54" />
        <stop offset="30%" stopColor="#4a5a64" />
        <stop offset="70%" stopColor="#5a6a74" />
        <stop offset="100%" stopColor="#2a3a44" />
      </linearGradient>
      <linearGradient id="potRim" x1="0%" y1="0%" x2="0%" y2="100%">
        <stop offset="0%" stopColor="#6a7a84" />
        <stop offset="50%" stopColor="#4a5a64" />
        <stop offset="100%" stopColor="#2a3a44" />
      </linearGradient>
      <linearGradient id="leafGradient" x1="0%" y1="0%" x2="0%" y2="100%">
        <stop offset="0%" stopColor="#8fce7a" />
        <stop offset="50%" stopColor="#6aaf57" />
        <stop offset="100%" stopColor="#4a8f37" />
      </linearGradient>
      <linearGradient id="soilGradient" x1="0%" y1="0%" x2="0%" y2="100%">
        <stop offset="0%" stopColor="#7b5a47" />
        <stop offset="100%" stopColor="#5a3a22" />
      </linearGradient>
      <radialGradient id="potHighlight" cx="50%" cy="30%">
        <stop offset="0%" stopColor="#8a9aa4" opacity="0.5" />
        <stop offset="100%" stopColor="#4a5a64" opacity="0" />
      </radialGradient>
    </defs>
    
    {/* Shadow */}
    <ellipse cx="100" cy="268" rx="58" ry="8" fill="#000" opacity="0.2" />
    
    {/* Pot body with 3D effect */}
    <path d="M62,200 L138,200 L150,258 L50,258 Z" fill="url(#potGradient)" />
    <path d="M62,200 L138,200 L150,258 L50,258 Z" fill="url(#potHighlight)" />
    <path d="M62,200 L138,200 L150,258 L50,258 Z" stroke="#1a2a34" strokeWidth="1.5" fill="none" />
    
    {/* Pot rim - 3D layered */}
    <ellipse cx="100" cy="258" rx="50" ry="10" fill="#1a2a34" />
    <ellipse cx="100" cy="256" rx="50" ry="9" fill="url(#potRim)" />
    
    {/* Pot top rim */}
    <ellipse cx="100" cy="200" rx="40" ry="9" fill="url(#potRim)" stroke="#1a2a34" strokeWidth="1.5" />
    <ellipse cx="100" cy="199" rx="38" ry="7" fill="#7a8a94" opacity="0.4" />
    
    {/* Soil with texture */}
    <ellipse cx="100" cy="202" rx="36" ry="7" fill="url(#soilGradient)" />
    <ellipse cx="100" cy="201" rx="34" ry="5" fill="#6b4a37" opacity="0.5" />
    
    {/* Stem with gradient */}
    <line x1="100" y1="202" x2="100" y2="145" stroke="#5a9f47" strokeWidth="5" strokeLinecap="round" />
    <line x1="100" y1="202" x2="100" y2="145" stroke="#7fbe6a" strokeWidth="2" strokeLinecap="round" opacity="0.5" />
    
    {/* Young leaves with 3D effect */}
    <ellipse cx="78" cy="165" rx="20" ry="30" fill="url(#leafGradient)" transform="rotate(-35 78 165)" stroke="#3a7027" strokeWidth="2" />
    <ellipse cx="80" cy="163" rx="8" ry="15" fill="#9fde8a" opacity="0.6" transform="rotate(-35 80 163)" />
    <line x1="78" y1="150" x2="78" y2="180" stroke="#3a7027" strokeWidth="1.5" opacity="0.5" transform="rotate(-35 78 165)" />
    
    <ellipse cx="122" cy="170" rx="20" ry="30" fill="url(#leafGradient)" transform="rotate(35 122 170)" stroke="#3a7027" strokeWidth="2" />
    <ellipse cx="120" cy="168" rx="8" ry="15" fill="#9fde8a" opacity="0.6" transform="rotate(35 120 168)" />
    <line x1="122" y1="155" x2="122" y2="185" stroke="#3a7027" strokeWidth="1.5" opacity="0.5" transform="rotate(35 122 170)" />
  </svg>
);

const BudPot = () => (
  <svg viewBox="0 0 200 310" className="w-full h-full" style={{ maxWidth: '160px', maxHeight: '250px' }}>
    <defs>
      <linearGradient id="potGradient2" x1="0%" y1="0%" x2="100%" y2="100%">
        <stop offset="0%" stopColor="#3a4a54" />
        <stop offset="30%" stopColor="#4a5a64" />
        <stop offset="70%" stopColor="#5a6a74" />
        <stop offset="100%" stopColor="#2a3a44" />
      </linearGradient>
      <linearGradient id="potRim2" x1="0%" y1="0%" x2="0%" y2="100%">
        <stop offset="0%" stopColor="#6a7a84" />
        <stop offset="50%" stopColor="#4a5a64" />
        <stop offset="100%" stopColor="#2a3a44" />
      </linearGradient>
      <linearGradient id="leafGradient2" x1="0%" y1="0%" x2="0%" y2="100%">
        <stop offset="0%" stopColor="#8fce7a" />
        <stop offset="50%" stopColor="#6aaf57" />
        <stop offset="100%" stopColor="#4a8f37" />
      </linearGradient>
      <linearGradient id="budGradient" x1="0%" y1="0%" x2="0%" y2="100%">
        <stop offset="0%" stopColor="#ff9a9a" />
        <stop offset="30%" stopColor="#ff7a7a" />
        <stop offset="70%" stopColor="#dc5c5c" />
        <stop offset="100%" stopColor="#b73e3e" />
      </linearGradient>
      <linearGradient id="budPetalGradient" x1="0%" y1="0%" x2="0%" y2="100%">
        <stop offset="0%" stopColor="#7fbe6a" />
        <stop offset="100%" stopColor="#5a9f47" />
      </linearGradient>
      <linearGradient id="soilGradient2" x1="0%" y1="0%" x2="0%" y2="100%">
        <stop offset="0%" stopColor="#7b5a47" />
        <stop offset="100%" stopColor="#5a3a22" />
      </linearGradient>
      <radialGradient id="potHighlight2" cx="50%" cy="30%">
        <stop offset="0%" stopColor="#8a9aa4" opacity="0.5" />
        <stop offset="100%" stopColor="#4a5a64" opacity="0" />
      </radialGradient>
      <radialGradient id="budGlow" cx="50%" cy="50%">
        <stop offset="0%" stopColor="#ff7a7a" opacity="0.4" />
        <stop offset="100%" stopColor="#dc5c5c" opacity="0" />
      </radialGradient>
    </defs>
    
    {/* Shadow */}
    <ellipse cx="100" cy="298" rx="58" ry="8" fill="#000" opacity="0.2" />
    
    {/* Pot body with 3D effect */}
    <path d="M62,230 L138,230 L150,288 L50,288 Z" fill="url(#potGradient2)" />
    <path d="M62,230 L138,230 L150,288 L50,288 Z" fill="url(#potHighlight2)" />
    <path d="M62,230 L138,230 L150,288 L50,288 Z" stroke="#1a2a34" strokeWidth="1.5" fill="none" />
    
    {/* Pot rim - 3D layered */}
    <ellipse cx="100" cy="288" rx="50" ry="10" fill="#1a2a34" />
    <ellipse cx="100" cy="286" rx="50" ry="9" fill="url(#potRim2)" />
    
    {/* Pot top rim */}
    <ellipse cx="100" cy="230" rx="40" ry="9" fill="url(#potRim2)" stroke="#1a2a34" strokeWidth="1.5" />
    <ellipse cx="100" cy="229" rx="38" ry="7" fill="#7a8a94" opacity="0.4" />
    
    {/* Soil with texture */}
    <ellipse cx="100" cy="232" rx="36" ry="7" fill="url(#soilGradient2)" />
    <ellipse cx="100" cy="231" rx="34" ry="5" fill="#6b4a37" opacity="0.5" />
    
    {/* Main stem with gradient */}
    <line x1="100" y1="232" x2="100" y2="80" stroke="#5a9f47" strokeWidth="6" strokeLinecap="round" />
    <line x1="100" y1="232" x2="100" y2="80" stroke="#7fbe6a" strokeWidth="2.5" strokeLinecap="round" opacity="0.5" />
    
    {/* Multiple leaves along stem with 3D effect */}
    <ellipse cx="73" cy="190" rx="18" ry="26" fill="url(#leafGradient2)" transform="rotate(-40 73 190)" stroke="#3a7027" strokeWidth="2" />
    <ellipse cx="75" cy="188" rx="7" ry="13" fill="#9fde8a" opacity="0.6" transform="rotate(-40 75 188)" />
    
    <ellipse cx="127" cy="200" rx="18" ry="26" fill="url(#leafGradient2)" transform="rotate(40 127 200)" stroke="#3a7027" strokeWidth="2" />
    <ellipse cx="125" cy="198" rx="7" ry="13" fill="#9fde8a" opacity="0.6" transform="rotate(40 125 198)" />
    
    <ellipse cx="75" cy="145" rx="17" ry="25" fill="url(#leafGradient2)" transform="rotate(-38 75 145)" stroke="#3a7027" strokeWidth="2" />
    <ellipse cx="77" cy="143" rx="6" ry="12" fill="#9fde8a" opacity="0.6" transform="rotate(-38 77 143)" />
    
    <ellipse cx="125" cy="155" rx="17" ry="25" fill="url(#leafGradient2)" transform="rotate(38 125 155)" stroke="#3a7027" strokeWidth="2" />
    <ellipse cx="123" cy="153" rx="6" ry="12" fill="#9fde8a" opacity="0.6" transform="rotate(38 123 153)" />
    
    {/* Bud glow effect */}
    <circle cx="100" cy="65" r="35" fill="url(#budGlow)" />
    
    {/* Rose bud with green sepals */}
    <ellipse cx="85" cy="75" rx="14" ry="20" fill="url(#budPetalGradient)" transform="rotate(-25 85 75)" stroke="#3a7027" strokeWidth="1.5" />
    <ellipse cx="115" cy="75" rx="14" ry="20" fill="url(#budPetalGradient)" transform="rotate(25 115 75)" stroke="#3a7027" strokeWidth="1.5" />
    <ellipse cx="100" cy="80" rx="15" ry="18" fill="url(#budPetalGradient)" stroke="#3a7027" strokeWidth="1.5" />
    <ellipse cx="90" cy="70" rx="12" ry="16" fill="url(#budPetalGradient)" transform="rotate(-15 90 70)" stroke="#3a7027" strokeWidth="1.5" />
    <ellipse cx="110" cy="70" rx="12" ry="16" fill="url(#budPetalGradient)" transform="rotate(15 110 70)" stroke="#3a7027" strokeWidth="1.5" />
    
    {/* Red bud emerging */}
    <ellipse cx="100" cy="55" rx="18" ry="24" fill="url(#budGradient)" stroke="#a73e3e" strokeWidth="2" />
    <ellipse cx="100" cy="53" rx="12" ry="16" fill="#ff8a8a" opacity="0.7" />
    <ellipse cx="92" cy="58" rx="8" ry="12" fill="#dc5c5c" transform="rotate(-20 92 58)" />
    <ellipse cx="108" cy="58" rx="8" ry="12" fill="#dc5c5c" transform="rotate(20 108 58)" />
    
    {/* Bud details */}
    <ellipse cx="100" cy="52" rx="6" ry="8" fill="#a73e3e" />
    <ellipse cx="100" cy="50" rx="3" ry="4" fill="#ff9a9a" opacity="0.6" />
  </svg>
);

const BloomPot = () => (
  <svg viewBox="0 0 200 340" className="w-full h-full" style={{ maxWidth: '160px', maxHeight: '280px' }}>
    <defs>
      <linearGradient id="potGradient3" x1="0%" y1="0%" x2="100%" y2="100%">
        <stop offset="0%" stopColor="#3a4a54" />
        <stop offset="30%" stopColor="#4a5a64" />
        <stop offset="70%" stopColor="#5a6a74" />
        <stop offset="100%" stopColor="#2a3a44" />
      </linearGradient>
      <linearGradient id="potRim3" x1="0%" y1="0%" x2="0%" y2="100%">
        <stop offset="0%" stopColor="#6a7a84" />
        <stop offset="50%" stopColor="#4a5a64" />
        <stop offset="100%" stopColor="#2a3a44" />
      </linearGradient>
      <linearGradient id="leafGradient3" x1="0%" y1="0%" x2="0%" y2="100%">
        <stop offset="0%" stopColor="#8fce7a" />
        <stop offset="50%" stopColor="#6aaf57" />
        <stop offset="100%" stopColor="#4a8f37" />
      </linearGradient>
      <linearGradient id="roseGradient" x1="0%" y1="0%" x2="0%" y2="100%">
        <stop offset="0%" stopColor="#ff8b9a" />
        <stop offset="30%" stopColor="#ff6b7a" />
        <stop offset="70%" stopColor="#dc3545" />
        <stop offset="100%" stopColor="#a71d2a" />
      </linearGradient>
      <linearGradient id="rosePetalLight" x1="0%" y1="0%" x2="0%" y2="100%">
        <stop offset="0%" stopColor="#ffbac4" />
        <stop offset="50%" stopColor="#ff9aa4" />
        <stop offset="100%" stopColor="#ff7a84" />
      </linearGradient>
      <linearGradient id="rosePetalDark" x1="0%" y1="0%" x2="0%" y2="100%">
        <stop offset="0%" stopColor="#dc3545" />
        <stop offset="100%" stopColor="#a71d2a" />
      </linearGradient>
      <linearGradient id="soilGradient3" x1="0%" y1="0%" x2="0%" y2="100%">
        <stop offset="0%" stopColor="#7b5a47" />
        <stop offset="100%" stopColor="#5a3a22" />
      </linearGradient>
      <radialGradient id="goldGlow" cx="50%" cy="50%">
        <stop offset="0%" stopColor="#d1ae94" opacity="0.5" />
        <stop offset="70%" stopColor="#d1ae94" opacity="0.1" />
        <stop offset="100%" stopColor="#d1ae94" opacity="0" />
      </radialGradient>
      <radialGradient id="roseGlow" cx="50%" cy="50%">
        <stop offset="0%" stopColor="#ff6b7a" opacity="0.3" />
        <stop offset="100%" stopColor="#dc3545" opacity="0" />
      </radialGradient>
      <radialGradient id="potHighlight3" cx="50%" cy="30%">
        <stop offset="0%" stopColor="#8a9aa4" opacity="0.5" />
        <stop offset="100%" stopColor="#4a5a64" opacity="0" />
      </radialGradient>
    </defs>
    
    {/* Shadow */}
    <ellipse cx="100" cy="328" rx="60" ry="9" fill="#000" opacity="0.25" />
    
    {/* Pot body with 3D effect */}
    <path d="M60,260 L140,260 L152,318 L48,318 Z" fill="url(#potGradient3)" />
    <path d="M60,260 L140,260 L152,318 L48,318 Z" fill="url(#potHighlight3)" />
    <path d="M60,260 L140,260 L152,318 L48,318 Z" stroke="#1a2a34" strokeWidth="1.5" fill="none" />
    
    {/* Pot rim - 3D layered */}
    <ellipse cx="100" cy="318" rx="52" ry="11" fill="#1a2a34" />
    <ellipse cx="100" cy="316" rx="52" ry="10" fill="url(#potRim3)" />
    
    {/* Pot top rim */}
    <ellipse cx="100" cy="260" rx="42" ry="10" fill="url(#potRim3)" stroke="#1a2a34" strokeWidth="1.5" />
    <ellipse cx="100" cy="259" rx="40" ry="8" fill="#7a8a94" opacity="0.4" />
    
    {/* Soil with texture */}
    <ellipse cx="100" cy="262" rx="38" ry="8" fill="url(#soilGradient3)" />
    <ellipse cx="100" cy="261" rx="36" ry="6" fill="#6b4a37" opacity="0.5" />
    
    {/* Main stem with gradient */}
    <line x1="100" y1="262" x2="100" y2="85" stroke="#5a9f47" strokeWidth="7" strokeLinecap="round" />
    <line x1="100" y1="262" x2="100" y2="85" stroke="#7fbe6a" strokeWidth="3" strokeLinecap="round" opacity="0.5" />
    
    {/* Leaves along stem with 3D effect */}
    <ellipse cx="70" cy="220" rx="20" ry="28" fill="url(#leafGradient3)" transform="rotate(-42 70 220)" stroke="#3a7027" strokeWidth="2" />
    <ellipse cx="72" cy="218" rx="8" ry="14" fill="#9fde8a" opacity="0.6" transform="rotate(-42 72 218)" />
    
    <ellipse cx="130" cy="230" rx="20" ry="28" fill="url(#leafGradient3)" transform="rotate(42 130 230)" stroke="#3a7027" strokeWidth="2" />
    <ellipse cx="128" cy="228" rx="8" ry="14" fill="#9fde8a" opacity="0.6" transform="rotate(42 128 228)" />
    
    <ellipse cx="73" cy="170" rx="19" ry="27" fill="url(#leafGradient3)" transform="rotate(-38 73 170)" stroke="#3a7027" strokeWidth="2" />
    <ellipse cx="75" cy="168" rx="7" ry="13" fill="#9fde8a" opacity="0.6" transform="rotate(-38 75 168)" />
    
    <ellipse cx="127" cy="180" rx="19" ry="27" fill="url(#leafGradient3)" transform="rotate(38 127 180)" stroke="#3a7027" strokeWidth="2" />
    <ellipse cx="125" cy="178" rx="7" ry="13" fill="#9fde8a" opacity="0.6" transform="rotate(38 125 178)" />
    
    <ellipse cx="76" cy="125" rx="18" ry="26" fill="url(#leafGradient3)" transform="rotate(-35 76 125)" stroke="#3a7027" strokeWidth="2" />
    <ellipse cx="78" cy="123" rx="6" ry="12" fill="#9fde8a" opacity="0.6" transform="rotate(-35 78 123)" />
    
    <ellipse cx="124" cy="130" rx="18" ry="26" fill="url(#leafGradient3)" transform="rotate(35 124 130)" stroke="#3a7027" strokeWidth="2" />
    <ellipse cx="122" cy="128" rx="6" ry="12" fill="#9fde8a" opacity="0.6" transform="rotate(35 122 128)" />
    
    {/* Gold and rose glow around flower */}
    <circle cx="100" cy="50" r="50" fill="url(#goldGlow)" />
    <circle cx="100" cy="50" r="42" fill="url(#roseGlow)" />
    
    {/* Full bloom rose - outermost petals */}
    <ellipse cx="70" cy="45" rx="22" ry="26" fill="url(#rosePetalLight)" transform="rotate(-50 70 45)" stroke="#dc3545" strokeWidth="1.5" />
    <ellipse cx="130" cy="45" rx="22" ry="26" fill="url(#rosePetalLight)" transform="rotate(50 130 45)" stroke="#dc3545" strokeWidth="1.5" />
    <ellipse cx="75" cy="70" rx="20" ry="24" fill="url(#roseGradient)" transform="rotate(-25 75 70)" stroke="#a71d2a" strokeWidth="1.5" />
    <ellipse cx="125" cy="70" rx="20" ry="24" fill="url(#roseGradient)" transform="rotate(25 125 70)" stroke="#a71d2a" strokeWidth="1.5" />
    <ellipse cx="100" cy="75" rx="24" ry="22" fill="url(#roseGradient)" stroke="#a71d2a" strokeWidth="1.5" />
    
    {/* Middle layer petals */}
    <ellipse cx="85" cy="48" rx="18" ry="24" fill="url(#roseGradient)" transform="rotate(-30 85 48)" stroke="#a71d2a" strokeWidth="1.5" />
    <ellipse cx="115" cy="48" rx="18" ry="24" fill="url(#roseGradient)" transform="rotate(30 115 48)" stroke="#a71d2a" strokeWidth="1.5" />
    <ellipse cx="90" cy="62" rx="16" ry="20" fill="url(#rosePetalDark)" transform="rotate(-15 90 62)" />
    <ellipse cx="110" cy="62" rx="16" ry="20" fill="url(#rosePetalDark)" transform="rotate(15 110 62)" />
    
    {/* Inner petals with highlights */}
    <ellipse cx="100" cy="48" rx="22" ry="26" fill="url(#rosePetalLight)" stroke="#ff6b7a" strokeWidth="1.5" />
    <ellipse cx="100" cy="46" rx="16" ry="20" fill="url(#roseGradient)" />
    <ellipse cx="92" cy="52" rx="13" ry="16" fill="#dc3545" transform="rotate(-20 92 52)" />
    <ellipse cx="108" cy="52" rx="13" ry="16" fill="#dc3545" transform="rotate(20 108 52)" />
    
    {/* Rose center with gold accent */}
    <ellipse cx="100" cy="50" rx="10" ry="12" fill="#a71d2a" />
    <ellipse cx="100" cy="49" rx="7" ry="9" fill="#8b1a2a" />
    <ellipse cx="100" cy="47" rx="5" ry="7" fill="#d1ae94" opacity="0.5" />
    <circle cx="100" cy="46" r="3" fill="#ffcc99" opacity="0.6" />
    
    {/* Petal details and highlights */}
    <ellipse cx="100" cy="45" rx="3" ry="4" fill="#ffbac4" opacity="0.7" />
    <path d="M70,45 Q100,38 130,45" fill="none" stroke="#ffbac4" strokeWidth="1.5" opacity="0.4" />
    <path d="M75,70 Q100,65 125,70" fill="none" stroke="#a71d2a" strokeWidth="1" opacity="0.5" />
  </svg>
);

const stages = [{
  component: SeedlingPot,
  title: "The Seed",
  description: "Onboarding & Foundation",
  subtitle: "Plant the seed of your creator journey. Complete your profile, set your vision, and prepare for growth."
}, {
  component: BudPot,
  title: "The Bud",
  description: "Development & Creation",
  subtitle: "Watch your brand blossom with professional shoots, curated content, and expert guidance."
}, {
  component: BloomPot,
  title: "In Full Bloom",
  description: "Success & Thriving",
  subtitle: "Your full potential realized. Thriving career, devoted audience, and sustainable income."
}];
const RoseJourneyTimeline = () => {
  return <div className="w-full py-24 bg-background">
      <div className="container mx-auto px-6">
        <div className="text-center mb-16">
          <h2 className="font-serif text-5xl mb-4 text-rose-gold text-[#d1ae94]">Grow With Us — The Rose Journey</h2>
          <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
            Every creator's journey is unique, but the path to growth follows a natural progression. 
            From first seed to full bloom, we guide you through each stage.
          </p>
        </div>
        
        {/* Desktop Timeline */}
        <div className="hidden md:flex items-end justify-between relative max-w-6xl mx-auto gap-12">
          
          {stages.map((stage, index) => {
          const RoseComponent = stage.component;
          return <div key={index} className="relative z-10 flex flex-col items-center w-1/3">
                {/* Rose Illustration */}
                <div className="mb-6 hover:scale-105 transition-transform duration-300 flex items-center justify-center">
                  <RoseComponent />
                </div>
                
                {/* Content */}
                <div className="text-center">
                  <h3 className="font-serif text-2xl text-[#d1ae94] mb-1">{stage.title}</h3>
                  <p className="text-sm text-muted-foreground mb-2">{stage.description}</p>
                  <p className="text-xs text-muted-foreground/70 max-w-xs mx-auto">{stage.subtitle}</p>
                </div>
              </div>;
        })}
        </div>
        
        {/* Mobile Timeline */}
        <div className="md:hidden space-y-12">
          {stages.map((stage, index) => {
          const RoseComponent = stage.component;
          return <div key={index} className="flex flex-col items-center text-center">
                {/* Rose Illustration */}
                <div className="mb-4 flex items-center justify-center" style={{ maxWidth: '140px' }}>
                  <RoseComponent />
                </div>
                
                {/* Content */}
                <div>
                  <h3 className="font-serif text-xl text-[#d1ae94] mb-1">{stage.title}</h3>
                  <p className="text-sm text-muted-foreground mb-2">{stage.description}</p>
                  <p className="text-xs text-muted-foreground/70">{stage.subtitle}</p>
                </div>
              </div>;
        })}
        </div>
      </div>
    </div>;
};
export default RoseJourneyTimeline;