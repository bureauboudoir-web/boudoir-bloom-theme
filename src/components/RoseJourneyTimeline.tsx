import { Flower2, Sprout, Leaf, Flower } from "lucide-react";
const stages = [{
  icon: Sprout,
  title: "The Seed",
  description: "Onboarding & Foundation",
  subtitle: "Plant the seed of your creator journey. Complete your profile, set your vision, and prepare for growth."
}, {
  icon: Flower,
  title: "The Growth",
  description: "Development & Creation",
  subtitle: "Watch your brand blossom with professional shoots, curated content, and expert guidance."
}, {
  icon: Flower2,
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
        <div className="hidden md:flex items-center justify-between relative max-w-6xl mx-auto">
          {/* Gold Connecting Line */}
          <div className="absolute top-12 left-0 right-0 h-0.5 bg-gradient-to-r from-rose-gold/30 via-rose-gold to-rose-gold/30" />
          
          {stages.map((stage, index) => {
          const Icon = stage.icon;
          return <div key={index} className="relative z-10 flex flex-col items-center w-1/3">
                {/* Icon Circle */}
                <div className="w-24 h-24 rounded-full bg-background border-2 border-rose-gold flex items-center justify-center mb-4 hover:scale-110 transition-transform duration-300 glow-gold">
                  <Icon className="w-12 h-12 text-rose-gold" />
                </div>
                
                {/* Content */}
                <div className="text-center">
                  <h3 className="font-serif text-2xl text-rose-gold mb-1">{stage.title}</h3>
                  <p className="text-sm text-muted-foreground mb-1">{stage.description}</p>
                  <p className="text-xs text-muted-foreground/70">{stage.subtitle}</p>
                </div>
              </div>;
        })}
        </div>
        
        {/* Mobile Timeline */}
        <div className="md:hidden space-y-8">
          {stages.map((stage, index) => {
          const Icon = stage.icon;
          return <div key={index} className="flex items-start gap-4">
                {/* Icon Circle */}
                <div className="w-16 h-16 rounded-full bg-background border-2 border-rose-gold flex items-center justify-center flex-shrink-0 glow-gold">
                  <Icon className="w-8 h-8 text-rose-gold" />
                </div>
                
                {/* Content */}
                <div>
                  <h3 className="font-serif text-xl text-rose-gold mb-1">{stage.title}</h3>
                  <p className="text-sm text-muted-foreground mb-1">{stage.description}</p>
                  <p className="text-xs text-muted-foreground/70">{stage.subtitle}</p>
                </div>
              </div>;
        })}
        </div>
      </div>
    </div>;
};
export default RoseJourneyTimeline;