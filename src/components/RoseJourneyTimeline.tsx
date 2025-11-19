import roseSeedImage from "@/assets/rose-seed.png";
import roseBudImage from "@/assets/rose-bud.png";
import roseBloomImage from "@/assets/rose-bloom.png";

const stages = [
  {
    title: "The Seed",
    subtitle: "Planting Your Foundation",
    description: "Every great creator starts with a vision. We nurture your unique story, helping you define your brand identity and establish your presence in the digital landscape.",
    image: roseSeedImage,
  },
  {
    title: "The Bud",
    subtitle: "Growing Your Presence",
    description: "As you develop, we provide the tools and guidance needed to flourish. Professional shoots, content strategy, and marketing support help you reach new audiences.",
    image: roseBudImage,
  },
  {
    title: "In Full Bloom",
    subtitle: "Thriving Success",
    description: "Watch your creator business blossom into sustainable success. With consistent support and proven strategies, you'll build a loyal fanbase and steady income.",
    image: roseBloomImage,
  },
];

const RoseJourneyTimeline = () => {
  return (
    <section className="py-8 sm:py-12 px-4 sm:px-6 bg-gradient-to-b from-background to-secondary/20">
      <div className="container mx-auto max-w-7xl">
        <div className="text-center mb-6 sm:mb-8">
          <h2 className="font-serif text-4xl sm:text-5xl md:text-6xl mb-3 sm:mb-4 text-[#d1ae94]">
            Grow With Us
          </h2>
          <p className="text-base sm:text-lg text-muted-foreground max-w-2xl mx-auto leading-relaxed">
            Your journey from aspiring creator to successful entrepreneur, supported every step of the way
          </p>
        </div>

        {/* Desktop: Horizontal Layout */}
        <div className="hidden md:grid md:grid-cols-3 gap-6 lg:gap-8">
          {stages.map((stage, index) => (
            <div
              key={index}
              className="group flex flex-col items-center text-center transition-all duration-300 hover:scale-105"
            >
              <div className="relative w-full aspect-[3/4] mb-1 overflow-hidden rounded-lg shadow-lg group-hover:shadow-xl transition-shadow duration-300">
                <img
                  src={stage.image}
                  alt={stage.title}
                  className="w-full h-full object-cover scale-[0.71] transition-transform duration-500 group-hover:scale-[0.78]"
                />
              </div>
              <h3 className="font-serif text-2xl mb-1.5 text-[#d1ae94]">{stage.title}</h3>
              <p className="text-sm font-medium text-primary mb-2.5">{stage.subtitle}</p>
              <p className="text-sm text-muted-foreground leading-relaxed px-2">{stage.description}</p>
            </div>
          ))}
        </div>

        {/* Mobile: Vertical Stack */}
        <div className="md:hidden space-y-6">
          {stages.map((stage, index) => (
            <div key={index} className="flex flex-col items-center text-center">
              <div className="relative w-full max-w-sm mx-auto aspect-square mb-1 overflow-hidden rounded-lg shadow-lg">
                <img
                  src={stage.image}
                  alt={stage.title}
                  className="w-full h-full object-cover scale-[0.64]"
                />
              </div>
              <h3 className="font-serif text-2xl mb-1.5 text-[#d1ae94]">{stage.title}</h3>
              <p className="text-sm font-medium text-primary mb-2">{stage.subtitle}</p>
              <p className="text-sm text-muted-foreground leading-relaxed px-6">{stage.description}</p>
            </div>
          ))}
        </div>

      </div>
    </section>
  );
};

export default RoseJourneyTimeline;