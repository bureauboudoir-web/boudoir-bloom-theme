// Realistic Potted Rose Components - Enhanced Design
const SeedlingPot = () => <svg viewBox="0 0 200 280" className="w-full h-full drop-shadow-2xl" style={{
  maxWidth: '180px',
  maxHeight: '240px'
}}>
    <defs>
      {/* Terracotta pot gradients */}
      <linearGradient id="terracottaGradient" x1="0%" y1="0%" x2="100%" y2="100%">
        <stop offset="0%" stopColor="#d89c7c" />
        <stop offset="30%" stopColor="#c67c5c" />
        <stop offset="70%" stopColor="#a85a3c" />
        <stop offset="100%" stopColor="#8a4a2c" />
      </linearGradient>
      <radialGradient id="terracottaLight" cx="30%" cy="30%">
        <stop offset="0%" stopColor="#f8bcac" opacity="0.7" />
        <stop offset="100%" stopColor="#c67c5c" opacity="0" />
      </radialGradient>
      {/* Realistic leaf gradients with depth */}
      <linearGradient id="leafMain" x1="0%" y1="0%" x2="100%" y2="100%">
        <stop offset="0%" stopColor="#c8e8af" />
        <stop offset="30%" stopColor="#a8d88f" />
        <stop offset="60%" stopColor="#7fb85f" />
        <stop offset="100%" stopColor="#5a9f37" />
      </linearGradient>
      <radialGradient id="leafHighlight" cx="35%" cy="35%">
        <stop offset="0%" stopColor="#d8f8bf" opacity="0.8" />
        <stop offset="100%" stopColor="#7fb85f" opacity="0" />
      </radialGradient>
      <linearGradient id="soilRich" x1="0%" y1="0%" x2="0%" y2="100%">
        <stop offset="0%" stopColor="#9b7a5f" />
        <stop offset="100%" stopColor="#6a4a2f" />
      </linearGradient>
      <filter id="softGlow">
        <feGaussianBlur stdDeviation="2" result="coloredBlur"/>
        <feMerge>
          <feMergeNode in="coloredBlur"/>
          <feMergeNode in="SourceGraphic"/>
        </feMerge>
      </filter>
    </defs>
    
    {/* Soft realistic shadow */}
    <ellipse cx="100" cy="270" rx="65" ry="8" fill="#000" opacity="0.2" filter="url(#softGlow)" />
    
    {/* Terracotta pot with texture */}
    <path d="M58,195 L142,195 L154,260 L46,260 Z" fill="url(#terracottaGradient)" stroke="#6a3a1c" strokeWidth="2" />
    <path d="M58,195 L142,195 L154,260 L46,260 Z" fill="url(#terracottaLight)" />
    
    {/* Clay texture details */}
    <line x1="56" y1="210" x2="144" y2="212" stroke="#984a2c" strokeWidth="0.8" opacity="0.25" />
    <line x1="54" y1="230" x2="146" y2="232" stroke="#984a2c" strokeWidth="0.8" opacity="0.25" />
    <line x1="52" y1="248" x2="148" y2="250" stroke="#984a2c" strokeWidth="0.8" opacity="0.25" />
    
    {/* Pot rim with dimensional depth */}
    <ellipse cx="100" cy="260" rx="54" ry="12" fill="#7a3a1c" />
    <ellipse cx="100" cy="258" rx="54" ry="11" fill="#984a2c" />
    <ellipse cx="100" cy="256" rx="52" ry="10" fill="url(#terracottaGradient)" />
    
    {/* Top rim */}
    <ellipse cx="100" cy="195" rx="43" ry="11" fill="url(#terracottaGradient)" stroke="#6a3a1c" strokeWidth="2" />
    <ellipse cx="100" cy="194" rx="41" ry="9" fill="#e8ac8c" opacity="0.6" />
    
    {/* Drainage detail */}
    <ellipse cx="100" cy="256" rx="4" ry="2.5" fill="#4a2a0c" />
    
    {/* Rich soil with particles */}
    <ellipse cx="100" cy="197" rx="40" ry="8" fill="url(#soilRich)" />
    <ellipse cx="100" cy="196" rx="38" ry="6" fill="#8b6a4f" opacity="0.7" />
    {/* Soil particles */}
    <circle cx="88" cy="197" r="2" fill="#ab8a6f" opacity="0.6" />
    <circle cx="110" cy="198" r="1.5" fill="#9a7a5f" opacity="0.6" />
    <circle cx="96" cy="199" r="1.8" fill="#8a6a4f" opacity="0.6" />
    
    {/* Natural stem with texture */}
    <line x1="100" y1="200" x2="100" y2="140" stroke="#5a9f37" strokeWidth="5" strokeLinecap="round" />
    <line x1="99" y1="200" x2="99" y2="140" stroke="#7fb85f" strokeWidth="2" strokeLinecap="round" opacity="0.5" />
    <line x1="100" y1="200" x2="100" y2="140" stroke="#4a7f27" strokeWidth="1" strokeLinecap="round" opacity="0.3" />
    
    {/* Left leaf - realistic shape with curves */}
    <path d="M100,165 Q70,155 65,165 Q60,175 70,185 Q80,195 100,185 Z" 
          fill="url(#leafGradient1)" stroke="#4a7f27" strokeWidth="2" />
    {/* Leaf veining */}
    <path d="M100,165 Q85,170 70,185" stroke="#5a8f37" strokeWidth="1" opacity="0.4" fill="none" />
    <path d="M90,168 Q82,173 75,180" stroke="#5a8f37" strokeWidth="0.5" opacity="0.3" fill="none" />
    <path d="M92,175 Q85,178 78,183" stroke="#5a8f37" strokeWidth="0.5" opacity="0.3" fill="none" />
    {/* Highlight on leaf */}
    <ellipse cx="80" cy="172" rx="8" ry="6" fill="#c8f8af" opacity="0.4" transform="rotate(-25 80 172)" />
    {/* Dewdrop */}
    <circle cx="75" cy="178" r="2.5" fill="#e8f8ff" opacity="0.8" />
    <circle cx="74.5" cy="177.5" r="1" fill="#fff" opacity="0.9" />
    
    {/* Right leaf - realistic shape with curves */}
    <path d="M100,170 Q130,160 135,170 Q140,180 130,190 Q120,200 100,190 Z" 
          fill="url(#leafGradient2)" stroke="#4a7f27" strokeWidth="2" />
    {/* Leaf veining */}
    <path d="M100,170 Q115,175 130,190" stroke="#5a8f37" strokeWidth="1" opacity="0.4" fill="none" />
    <path d="M110,173 Q118,178 125,185" stroke="#5a8f37" strokeWidth="0.5" opacity="0.3" fill="none" />
    <path d="M108,180 Q115,183 122,188" stroke="#5a8f37" strokeWidth="0.5" opacity="0.3" fill="none" />
    {/* Highlight on leaf */}
    <ellipse cx="120" cy="177" rx="8" ry="6" fill="#c8f8af" opacity="0.4" transform="rotate(25 120 177)" />
    {/* Dewdrop */}
    <circle cx="125" cy="183" r="2.5" fill="#e8f8ff" opacity="0.8" />
    <circle cx="124.5" cy="182.5" r="1" fill="#fff" opacity="0.9" />
    
    {/* Small center leaf emerging */}
    <path d="M100,145 Q95,135 100,125 Q105,135 100,145 Z" 
          fill="url(#leafGradient1)" stroke="#4a7f27" strokeWidth="1.5" opacity="0.9" />
    <path d="M100,125 L100,145" stroke="#6a9f47" strokeWidth="0.5" opacity="0.3" />
  </svg>;
const BudPot = () => <svg viewBox="0 0 200 310" className="w-full h-full" style={{
  maxWidth: '160px',
  maxHeight: '250px'
}}>
    <defs>
      <linearGradient id="ceramicGradient" x1="0%" y1="0%" x2="100%" y2="100%">
        <stop offset="0%" stopColor="#f5f0e8" />
        <stop offset="30%" stopColor="#e8dcc8" />
        <stop offset="70%" stopColor="#d8cbb8" />
        <stop offset="100%" stopColor="#c8baa8" />
      </linearGradient>
      <linearGradient id="ceramicRim" x1="0%" y1="0%" x2="0%" y2="100%">
        <stop offset="0%" stopColor="#ffffff" />
        <stop offset="50%" stopColor="#f5f0e8" />
        <stop offset="100%" stopColor="#d8cbb8" />
      </linearGradient>
      <radialGradient id="ceramicHighlight" cx="35%" cy="25%">
        <stop offset="0%" stopColor="#ffffff" opacity="0.8" />
        <stop offset="100%" stopColor="#f5f0e8" opacity="0" />
      </radialGradient>
      <linearGradient id="goldBand" x1="0%" y1="0%" x2="100%" y2="0%">
        <stop offset="0%" stopColor="#b8934f" />
        <stop offset="50%" stopColor="#d4af6f" />
        <stop offset="100%" stopColor="#b8934f" />
      </linearGradient>
      <linearGradient id="budPetal1" x1="0%" y1="0%" x2="0%" y2="100%">
        <stop offset="0%" stopColor="#ffb3c1" />
        <stop offset="50%" stopColor="#ff8fa3" />
        <stop offset="100%" stopColor="#f76e89" />
      </linearGradient>
      <linearGradient id="budPetal2" x1="0%" y1="0%" x2="0%" y2="100%">
        <stop offset="0%" stopColor="#ff9aab" />
        <stop offset="50%" stopColor="#f76e89" />
        <stop offset="100%" stopColor="#e84a5f" />
      </linearGradient>
      <linearGradient id="sepalGradient" x1="0%" y1="0%" x2="0%" y2="100%">
        <stop offset="0%" stopColor="#7fb85f" />
        <stop offset="50%" stopColor="#6a9f47" />
        <stop offset="100%" stopColor="#5a8f37" />
      </linearGradient>
      <linearGradient id="leafGradientBud" x1="0%" y1="0%" x2="100%" y2="100%">
        <stop offset="0%" stopColor="#a8d88f" />
        <stop offset="50%" stopColor="#7fb85f" />
        <stop offset="100%" stopColor="#5a9f37" />
      </linearGradient>
    </defs>
    
    <ellipse cx="100" cy="298" rx="60" ry="9" fill="#000" opacity="0.15" />
    <path d="M58,228 L142,228 L154,288 L46,288 Z" fill="url(#ceramicGradient)" />
    <path d="M58,228 L142,228 L154,288 L46,288 Z" fill="url(#ceramicHighlight)" />
    <rect x="44" y="243" width="112" height="6" fill="url(#goldBand)" />
    <ellipse cx="100" cy="288" rx="54" ry="11" fill="#c8baa8" />
    <ellipse cx="100" cy="286" rx="54" ry="10" fill="url(#ceramicRim)" />
    <ellipse cx="100" cy="228" rx="44" ry="10" fill="url(#ceramicRim)" />
    <ellipse cx="100" cy="230" rx="40" ry="7" fill="#8b6a4f" />
    <line x1="100" y1="230" x2="100" y2="70" stroke="#5a9f37" strokeWidth="6" strokeLinecap="round" />
    
    <path d="M100,190 Q68,178 60,188 Q54,198 65,210 Q76,222 100,210 Z" fill="url(#leafGradientBud)" stroke="#4a7f27" strokeWidth="2" />
    <path d="M100,195 Q132,183 140,193 Q146,203 135,215 Q124,227 100,215 Z" fill="url(#leafGradientBud)" stroke="#4a7f27" strokeWidth="2" />
    
    <path d="M100,70 Q85,65 82,75 Q80,85 88,90 L100,95 Z" fill="url(#sepalGradient)" stroke="#4a7f27" strokeWidth="1.5" />
    <path d="M100,70 Q115,65 118,75 Q120,85 112,90 L100,95 Z" fill="url(#sepalGradient)" stroke="#4a7f27" strokeWidth="1.5" />
    <ellipse cx="100" cy="85" rx="16" ry="22" fill="url(#budPetal1)" />
    <path d="M84,85 Q88,70 100,65 Q112,70 116,85 Q116,100 100,107 Q84,100 84,85 Z" fill="url(#budPetal2)" stroke="#e84a5f" strokeWidth="1" />
    <path d="M95,68 Q97,60 100,58 Q103,60 105,68 Q105,75 100,78 Q95,75 95,68 Z" fill="#c92a3e" />
    <ellipse cx="92" cy="75" rx="3" ry="8" fill="#ffcdd8" opacity="0.6" transform="rotate(-25 92 75)" />
    <ellipse cx="108" cy="75" rx="3" ry="8" fill="#ffcdd8" opacity="0.6" transform="rotate(25 108 75)" />
  </svg>;
const BloomPot = () => <svg viewBox="0 0 200 340" className="w-full h-full" style={{
  maxWidth: '160px',
  maxHeight: '280px'
}}>
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
  </svg>;
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
          <h2 className="font-serif text-5xl mb-4 text-rose-gold text-[#d1ae94]">Grow With Us    </h2>
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
                <div className="mb-4 flex items-center justify-center" style={{
              maxWidth: '140px'
            }}>
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