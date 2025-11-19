// Custom SVG Potted Rose Components
const SeedlingPot = () => (
  <svg viewBox="0 0 200 280" className="w-full h-full" style={{ maxWidth: '160px', maxHeight: '220px' }}>
    <defs>
      <linearGradient id="potGradient" x1="0%" y1="0%" x2="0%" y2="100%">
        <stop offset="0%" stopColor="#5a4a42" />
        <stop offset="50%" stopColor="#6b5347" />
        <stop offset="100%" stopColor="#4a3a32" />
      </linearGradient>
      <linearGradient id="leafGradient" x1="0%" y1="0%" x2="0%" y2="100%">
        <stop offset="0%" stopColor="#7fbe6a" />
        <stop offset="100%" stopColor="#5a9f47" />
      </linearGradient>
      <linearGradient id="soilGradient" x1="0%" y1="0%" x2="0%" y2="100%">
        <stop offset="0%" stopColor="#6b5347" />
        <stop offset="100%" stopColor="#4a3a32" />
      </linearGradient>
    </defs>
    
    {/* Pot */}
    <path d="M65,200 L135,200 L145,255 L55,255 Z" fill="url(#potGradient)" stroke="#3a2a22" strokeWidth="2" />
    <ellipse cx="100" cy="200" rx="37" ry="8" fill="#6b5347" stroke="#3a2a22" strokeWidth="2" />
    <ellipse cx="100" cy="255" rx="47" ry="9" fill="#3a2a22" />
    
    {/* Pot rim highlight */}
    <ellipse cx="100" cy="199" rx="35" ry="6" fill="#8b7355" opacity="0.3" />
    
    {/* Soil */}
    <ellipse cx="100" cy="200" rx="33" ry="6" fill="url(#soilGradient)" />
    
    {/* Small stem */}
    <line x1="100" y1="200" x2="100" y2="145" stroke="#5a9f47" strokeWidth="4" strokeLinecap="round" />
    
    {/* Two young leaves */}
    <ellipse cx="80" cy="165" rx="18" ry="28" fill="url(#leafGradient)" transform="rotate(-35 80 165)" stroke="#4a8037" strokeWidth="1.5" />
    <ellipse cx="120" cy="170" rx="18" ry="28" fill="url(#leafGradient)" transform="rotate(35 120 170)" stroke="#4a8037" strokeWidth="1.5" />
    
    {/* Leaf veins */}
    <line x1="80" y1="150" x2="80" y2="180" stroke="#4a8037" strokeWidth="1" opacity="0.4" transform="rotate(-35 80 165)" />
    <line x1="120" y1="155" x2="120" y2="185" stroke="#4a8037" strokeWidth="1" opacity="0.4" transform="rotate(35 120 170)" />
    
    {/* Shadow */}
    <ellipse cx="100" cy="265" rx="50" ry="6" fill="#000" opacity="0.15" />
  </svg>
);

const BudPot = () => (
  <svg viewBox="0 0 200 310" className="w-full h-full" style={{ maxWidth: '160px', maxHeight: '250px' }}>
    <defs>
      <linearGradient id="potGradient2" x1="0%" y1="0%" x2="0%" y2="100%">
        <stop offset="0%" stopColor="#5a4a42" />
        <stop offset="50%" stopColor="#6b5347" />
        <stop offset="100%" stopColor="#4a3a32" />
      </linearGradient>
      <linearGradient id="leafGradient2" x1="0%" y1="0%" x2="0%" y2="100%">
        <stop offset="0%" stopColor="#7fbe6a" />
        <stop offset="100%" stopColor="#5a9f47" />
      </linearGradient>
      <linearGradient id="budGradient" x1="0%" y1="0%" x2="0%" y2="100%">
        <stop offset="0%" stopColor="#e87a7a" />
        <stop offset="50%" stopColor="#dc5c5c" />
        <stop offset="100%" stopColor="#c73e3e" />
      </linearGradient>
      <linearGradient id="soilGradient2" x1="0%" y1="0%" x2="0%" y2="100%">
        <stop offset="0%" stopColor="#6b5347" />
        <stop offset="100%" stopColor="#4a3a32" />
      </linearGradient>
    </defs>
    
    {/* Pot */}
    <path d="M65,230 L135,230 L145,285 L55,285 Z" fill="url(#potGradient2)" stroke="#3a2a22" strokeWidth="2" />
    <ellipse cx="100" cy="230" rx="37" ry="8" fill="#6b5347" stroke="#3a2a22" strokeWidth="2" />
    <ellipse cx="100" cy="285" rx="47" ry="9" fill="#3a2a22" />
    
    {/* Pot rim highlight */}
    <ellipse cx="100" cy="229" rx="35" ry="6" fill="#8b7355" opacity="0.3" />
    
    {/* Soil */}
    <ellipse cx="100" cy="230" rx="33" ry="6" fill="url(#soilGradient2)" />
    
    {/* Main stem */}
    <line x1="100" y1="230" x2="100" y2="80" stroke="#5a9f47" strokeWidth="5" strokeLinecap="round" />
    
    {/* Multiple leaves along stem */}
    <ellipse cx="75" cy="190" rx="16" ry="24" fill="url(#leafGradient2)" transform="rotate(-40 75 190)" stroke="#4a8037" strokeWidth="1.5" />
    <ellipse cx="125" cy="200" rx="16" ry="24" fill="url(#leafGradient2)" transform="rotate(40 125 200)" stroke="#4a8037" strokeWidth="1.5" />
    <ellipse cx="78" cy="140" rx="15" ry="22" fill="url(#leafGradient2)" transform="rotate(-35 78 140)" stroke="#4a8037" strokeWidth="1.5" />
    <ellipse cx="122" cy="150" rx="15" ry="22" fill="url(#leafGradient2)" transform="rotate(35 122 150)" stroke="#4a8037" strokeWidth="1.5" />
    <ellipse cx="82" cy="100" rx="14" ry="20" fill="url(#leafGradient2)" transform="rotate(-30 82 100)" stroke="#4a8037" strokeWidth="1.5" />
    <ellipse cx="118" cy="105" rx="14" ry="20" fill="url(#leafGradient2)" transform="rotate(30 118 105)" stroke="#4a8037" strokeWidth="1.5" />
    
    {/* Rose bud - closed */}
    <ellipse cx="100" cy="60" rx="14" ry="20" fill="url(#budGradient)" stroke="#a12e2e" strokeWidth="2" />
    <ellipse cx="100" cy="58" rx="12" ry="16" fill="#e87a7a" opacity="0.6" />
    
    {/* Bud sepals (green parts) */}
    <path d="M88,70 Q85,65 88,60" fill="none" stroke="#5a9f47" strokeWidth="2.5" strokeLinecap="round" />
    <path d="M100,75 Q100,70 100,65" fill="none" stroke="#5a9f47" strokeWidth="2.5" strokeLinecap="round" />
    <path d="M112,70 Q115,65 112,60" fill="none" stroke="#5a9f47" strokeWidth="2.5" strokeLinecap="round" />
    
    {/* Shadow */}
    <ellipse cx="100" cy="295" rx="50" ry="6" fill="#000" opacity="0.15" />
  </svg>
);

const BloomPot = () => (
  <svg viewBox="0 0 200 340" className="w-full h-full" style={{ maxWidth: '160px', maxHeight: '280px' }}>
    <defs>
      <linearGradient id="potGradient3" x1="0%" y1="0%" x2="0%" y2="100%">
        <stop offset="0%" stopColor="#5a4a42" />
        <stop offset="50%" stopColor="#6b5347" />
        <stop offset="100%" stopColor="#4a3a32" />
      </linearGradient>
      <linearGradient id="leafGradient3" x1="0%" y1="0%" x2="0%" y2="100%">
        <stop offset="0%" stopColor="#7fbe6a" />
        <stop offset="100%" stopColor="#5a9f47" />
      </linearGradient>
      <linearGradient id="roseGradient" x1="0%" y1="0%" x2="0%" y2="100%">
        <stop offset="0%" stopColor="#ff6b6b" />
        <stop offset="30%" stopColor="#dc3545" />
        <stop offset="70%" stopColor="#c82333" />
        <stop offset="100%" stopColor="#a71d2a" />
      </linearGradient>
      <linearGradient id="rosePetalLight" x1="0%" y1="0%" x2="100%" y2="100%">
        <stop offset="0%" stopColor="#ff8080" />
        <stop offset="100%" stopColor="#dc3545" />
      </linearGradient>
      <linearGradient id="soilGradient3" x1="0%" y1="0%" x2="0%" y2="100%">
        <stop offset="0%" stopColor="#6b5347" />
        <stop offset="100%" stopColor="#4a3a32" />
      </linearGradient>
      <radialGradient id="goldGlow" cx="50%" cy="50%" r="50%">
        <stop offset="0%" stopColor="#d1ae94" stopOpacity="0.6" />
        <stop offset="100%" stopColor="#d1ae94" stopOpacity="0" />
      </radialGradient>
    </defs>
    
    {/* Pot */}
    <path d="M65,260 L135,260 L145,315 L55,315 Z" fill="url(#potGradient3)" stroke="#3a2a22" strokeWidth="2" />
    <ellipse cx="100" cy="260" rx="37" ry="8" fill="#6b5347" stroke="#3a2a22" strokeWidth="2" />
    <ellipse cx="100" cy="315" rx="47" ry="9" fill="#3a2a22" />
    
    {/* Pot rim highlight */}
    <ellipse cx="100" cy="259" rx="35" ry="6" fill="#8b7355" opacity="0.3" />
    
    {/* Soil */}
    <ellipse cx="100" cy="260" rx="33" ry="6" fill="url(#soilGradient3)" />
    
    {/* Main stem */}
    <line x1="100" y1="260" x2="100" y2="90" stroke="#5a9f47" strokeWidth="6" strokeLinecap="round" />
    
    {/* Leaves along stem */}
    <ellipse cx="72" cy="220" rx="18" ry="26" fill="url(#leafGradient3)" transform="rotate(-42 72 220)" stroke="#4a8037" strokeWidth="1.5" />
    <ellipse cx="128" cy="230" rx="18" ry="26" fill="url(#leafGradient3)" transform="rotate(42 128 230)" stroke="#4a8037" strokeWidth="1.5" />
    <ellipse cx="75" cy="170" rx="17" ry="25" fill="url(#leafGradient3)" transform="rotate(-38 75 170)" stroke="#4a8037" strokeWidth="1.5" />
    <ellipse cx="125" cy="180" rx="17" ry="25" fill="url(#leafGradient3)" transform="rotate(38 125 180)" stroke="#4a8037" strokeWidth="1.5" />
    <ellipse cx="78" cy="125" rx="16" ry="24" fill="url(#leafGradient3)" transform="rotate(-35 78 125)" stroke="#4a8037" strokeWidth="1.5" />
    <ellipse cx="122" cy="130" rx="16" ry="24" fill="url(#leafGradient3)" transform="rotate(35 122 130)" stroke="#4a8037" strokeWidth="1.5" />
    
    {/* Gold glow around rose */}
    <circle cx="100" cy="55" r="40" fill="url(#goldGlow)" />
    
    {/* Full bloom rose - outer petals */}
    <ellipse cx="100" cy="55" rx="32" ry="30" fill="url(#roseGradient)" opacity="0.9" />
    <ellipse cx="75" cy="50" rx="18" ry="22" fill="url(#rosePetalLight)" transform="rotate(-45 75 50)" />
    <ellipse cx="125" cy="50" rx="18" ry="22" fill="url(#rosePetalLight)" transform="rotate(45 125 50)" />
    <ellipse cx="80" cy="70" rx="18" ry="20" fill="url(#roseGradient)" transform="rotate(-20 80 70)" />
    <ellipse cx="120" cy="70" rx="18" ry="20" fill="url(#roseGradient)" transform="rotate(20 120 70)" />
    <ellipse cx="100" cy="75" rx="20" ry="18" fill="url(#roseGradient)" />
    
    {/* Inner petals with gold highlight */}
    <ellipse cx="100" cy="50" rx="20" ry="22" fill="url(#rosePetalLight)" />
    <ellipse cx="90" cy="55" rx="12" ry="14" fill="#dc3545" transform="rotate(-25 90 55)" />
    <ellipse cx="110" cy="55" rx="12" ry="14" fill="#dc3545" transform="rotate(25 110 55)" />
    
    {/* Rose center with gold accent */}
    <ellipse cx="100" cy="55" rx="8" ry="10" fill="#a71d2a" />
    <ellipse cx="100" cy="53" rx="5" ry="6" fill="#d1ae94" opacity="0.4" />
    <circle cx="100" cy="52" r="3" fill="#8b6f47" opacity="0.3" />
    
    {/* Petal details/shadows */}
    <path d="M75,50 Q100,45 100,55" fill="none" stroke="#a71d2a" strokeWidth="1" opacity="0.5" />
    <path d="M125,50 Q100,45 100,55" fill="none" stroke="#a71d2a" strokeWidth="1" opacity="0.5" />
    
    {/* Shadow */}
    <ellipse cx="100" cy="325" rx="50" ry="6" fill="#000" opacity="0.15" />
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
          {/* Gold Connecting Line - positioned at pot level */}
          <div className="absolute bottom-32 left-24 right-24 h-0.5 bg-gradient-to-r from-transparent via-rose-gold/40 to-transparent" style={{ backgroundImage: 'repeating-linear-gradient(90deg, #d1ae94 0px, #d1ae94 10px, transparent 10px, transparent 20px)' }} />
          
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