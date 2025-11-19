import roseStagesImage from "@/assets/rose-stages.png";

const stages = [
  {
    title: "The Seed",
    subtitle: "Planting Your Foundation",
    description: "Every great creator starts with a vision. We nurture your unique story, helping you define your brand identity and establish your presence in the digital landscape.",
    translateX: "0%",
  },
  {
    title: "The Bud",
    subtitle: "Growing Your Presence",
    description: "As you develop, we provide the tools and guidance needed to flourish. Professional shoots, content strategy, and marketing support help you reach new audiences.",
    translateX: "-33.33%",
  },
  {
    title: "In Full Bloom",
    subtitle: "Thriving Success",
    description: "Watch your creator business blossom into sustainable success. With consistent support and proven strategies, you'll build a loyal fanbase and steady income.",
    translateX: "-66.66%",
  },
];

const RoseJourneyTimeline = () => {
  return (
    <section className="py-16 sm:py-24 px-4 sm:px-6 bg-gradient-to-b from-background to-secondary/20">
      <div className="container mx-auto max-w-6xl">
        <div className="text-center mb-12 sm:mb-16">
          <h2 className="font-serif text-4xl sm:text-5xl md:text-6xl mb-4 sm:mb-6 text-[#d1ae94]">
            Grow With Us
          </h2>
          <p className="text-base sm:text-lg text-muted-foreground max-w-2xl mx-auto leading-relaxed">
            Your journey from aspiring creator to successful entrepreneur, supported every step of the way
          </p>
        </div>

        {/* Desktop: Horizontal Layout */}
        <div className="hidden md:grid md:grid-cols-3 gap-8 lg:gap-12 mb-8">
          {stages.map((stage, index) => (
            <div
              key={index}
              className="group flex flex-col items-center text-center transition-all duration-300 hover:scale-105"
            >
              <div className="relative w-48 h-64 mb-6 overflow-hidden rounded-lg">
                <img
                  src={roseStagesImage}
                  alt={stage.title}
                  className="absolute inset-0 w-[300%] h-full object-cover transition-transform duration-500 group-hover:scale-110"
                  style={{
                    transform: `translateX(${stage.translateX})`,
                  }}
                />
              </div>
              <h3 className="font-serif text-2xl mb-2 text-[#d1ae94]">{stage.title}</h3>
              <p className="text-sm font-medium text-primary mb-3">{stage.subtitle}</p>
              <p className="text-sm text-muted-foreground leading-relaxed">{stage.description}</p>
            </div>
          ))}
        </div>

        {/* Mobile: Vertical Stack */}
        <div className="md:hidden space-y-12">
          {stages.map((stage, index) => (
            <div key={index} className="flex flex-col items-center text-center">
              <div className="relative w-40 h-52 mb-4 overflow-hidden rounded-lg">
                <img
                  src={roseStagesImage}
                  alt={stage.title}
                  className="absolute inset-0 w-[300%] h-full object-cover"
                  style={{
                    transform: `translateX(${stage.translateX})`,
                  }}
                />
              </div>
              <h3 className="font-serif text-2xl mb-2 text-[#d1ae94]">{stage.title}</h3>
              <p className="text-sm font-medium text-primary mb-3">{stage.subtitle}</p>
              <p className="text-sm text-muted-foreground leading-relaxed px-4">{stage.description}</p>
            </div>
          ))}
        </div>

        {/* Connecting Line - Desktop Only */}
        <div className="hidden md:block relative -mt-4 mb-8">
          <div className="absolute left-[16.6%] right-[16.6%] h-0.5 bg-gradient-to-r from-primary/20 via-primary/60 to-primary/20"></div>
        </div>
      </div>
    </section>
  );
};

export default RoseJourneyTimeline;