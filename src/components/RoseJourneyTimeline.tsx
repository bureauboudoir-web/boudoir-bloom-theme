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
    <section className="py-12 sm:py-20 px-4 sm:px-6 bg-gradient-to-b from-background to-secondary/20">
      <div className="container mx-auto max-w-7xl">
        <div className="text-center mb-10 sm:mb-14">
          <h2 className="font-serif text-4xl sm:text-5xl md:text-6xl mb-3 sm:mb-4 text-[#d1ae94]">
            Grow With Us
          </h2>
          <p className="text-base sm:text-lg text-muted-foreground max-w-2xl mx-auto leading-relaxed">
            Your journey from aspiring creator to successful entrepreneur, supported every step of the way
          </p>
        </div>

        {/* Desktop: Horizontal Layout */}
        <div className="hidden md:grid md:grid-cols-3 gap-10 lg:gap-14">
          {stages.map((stage, index) => (
            <div
              key={index}
              className="group flex flex-col items-center text-center transition-all duration-300 hover:scale-105"
            >
              <div className="relative w-80 h-96 mb-1 overflow-hidden rounded-lg shadow-lg group-hover:shadow-xl transition-shadow duration-300">
                <img
                  src={stage.image}
                  alt={stage.title}
                  className="w-full h-full object-contain transition-transform duration-500 group-hover:scale-110"
                />
              </div>
              <h3 className="font-serif text-2xl mb-1.5 text-[#d1ae94]">{stage.title}</h3>
              <p className="text-sm font-medium text-primary mb-2.5">{stage.subtitle}</p>
              <p className="text-sm text-muted-foreground leading-relaxed px-2">{stage.description}</p>
            </div>
          ))}
        </div>

        {/* Mobile: Vertical Stack */}
        <div className="md:hidden space-y-10">
          {stages.map((stage, index) => (
            <div key={index} className="flex flex-col items-center text-center">
              <div className="relative w-56 h-72 mb-1 overflow-hidden rounded-lg shadow-lg">
                <img
                  src={stage.image}
                  alt={stage.title}
                  className="w-full h-full object-contain"
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