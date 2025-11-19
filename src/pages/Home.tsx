import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import Navigation from "@/components/Navigation";
import RoseJourneyTimeline from "@/components/RoseJourneyTimeline";
import ComparisonTable from "@/components/ComparisonTable";
import QAAccordion from "@/components/QAAccordion";
import StreetLampIcon from "@/components/StreetLampIcon";
import heroBackground from "@/assets/hero-curtains-amsterdam.jpg";
import locationMap from "@/assets/amsterdam-map-luxury.png";
import { 
  Lightbulb, 
  Camera, 
  Megaphone, 
  DollarSign, 
  Crown, 
  Gem, 
  CheckCircle,
  Twitter,
  Instagram
} from "lucide-react";

const Home = () => {
  const scrollToSection = (sectionId: string) => {
    const element = document.getElementById(sectionId);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  };

  return (
    <div className="min-h-screen bg-background text-foreground">
      <Navigation />
      
      {/* Section 1: Hero Banner */}
      <section 
        className="relative min-h-screen flex items-center justify-center overflow-hidden"
        style={{
          backgroundImage: `linear-gradient(rgba(0, 0, 0, 0.65), rgba(0, 0, 0, 0.65)), url(${heroBackground})`,
          backgroundSize: 'cover',
          backgroundPosition: 'center'
        }}
      >
        <div className="absolute inset-0 bg-gradient-to-b from-transparent via-primary/5 to-background" />
        <div className="container mx-auto px-6 text-center relative z-10 max-w-5xl">
          <h1 className="font-serif text-5xl md:text-7xl font-bold mb-8 text-glow-red leading-tight">
            Where Real Creators Become Iconic
          </h1>
          <p className="text-xl md:text-2xl text-muted-foreground max-w-3xl mx-auto mb-12 leading-relaxed">
            A luxury creative house in Amsterdam, guiding women in the art of presence, identity, and digital performance.
          </p>
          <Button 
            asChild 
            size="lg" 
            className="text-lg px-10 py-7 border-2 border-rose-gold bg-transparent hover:bg-rose-gold/10 glow-gold text-rose-gold"
          >
            <Link to="/signup">Become a Creator</Link>
          </Button>
        </div>
      </section>

      {/* Section 2: Who We Are + Compare Preview */}
      <section id="about" className="py-32 bg-background">
        <div className="container mx-auto px-6 max-w-6xl">
          <div className="grid md:grid-cols-2 gap-12">
            {/* Left: Who We Are */}
            <div>
              <h2 className="font-serif text-4xl md:text-5xl mb-8 text-rose-gold">
                Who We Are
              </h2>
              <div className="space-y-6 text-lg text-muted-foreground leading-relaxed">
                <p>
                  Bureau Boudoir is a luxury creative house based in the heart of Amsterdam's historic centre. 
                  We specialize in building creators into icons — not by following trends, but by crafting their identity 
                  from the ground up.
                </p>
                <p>
                  We don't just offer marketing tips or templates. We build your brand, persona, visual identity, 
                  content strategy, storytelling, and marketing systems — all under one roof, all designed for you.
                </p>
                <p className="text-foreground font-medium">
                  Not a modelling agency. Not a generic OF agency. A creative identity house where presence meets artistry.
                </p>
              </div>
            </div>

            {/* Right: Compare Preview */}
            <div>
              <h3 className="font-serif text-3xl md:text-4xl mb-8 text-rose-gold">
                How We Compare
              </h3>
              <div className="space-y-6">
                <div className="flex items-start gap-4">
                  <CheckCircle className="w-6 h-6 text-rose-gold flex-shrink-0 mt-1" />
                  <div>
                    <h4 className="text-xl font-semibold text-foreground mb-2">Identity over algorithms</h4>
                    <p className="text-muted-foreground">
                      We build your brand from the inside out — not based on what's trending today.
                    </p>
                  </div>
                </div>
                <div className="flex items-start gap-4">
                  <CheckCircle className="w-6 h-6 text-rose-gold flex-shrink-0 mt-1" />
                  <div>
                    <h4 className="text-xl font-semibold text-foreground mb-2">Studio-level visuals</h4>
                    <p className="text-muted-foreground">
                      Professional lighting, styling, and creative direction in our Amsterdam studio.
                    </p>
                  </div>
                </div>
                <div className="flex items-start gap-4">
                  <CheckCircle className="w-6 h-6 text-rose-gold flex-shrink-0 mt-1" />
                  <div>
                    <h4 className="text-xl font-semibold text-foreground mb-2">A real growth system</h4>
                    <p className="text-muted-foreground">
                      Scripts, funnels, retention strategies, and a dedicated team working behind the scenes.
                    </p>
                  </div>
                </div>
              </div>
              <Button
                onClick={() => scrollToSection('comparison')}
                variant="outline"
                className="mt-8 border-rose-gold text-rose-gold hover:bg-rose-gold/10"
              >
                Compare More →
              </Button>
            </div>
          </div>
        </div>
      </section>

      {/* Section 3: What We Do */}
      <section className="py-32 bg-secondary/20">
        <div className="container mx-auto px-6 max-w-5xl">
          <div className="text-center mb-16 max-w-3xl mx-auto">
            <p className="text-xl md:text-2xl text-foreground leading-relaxed mb-6">
              We help creators master <span className="text-rose-gold font-semibold">presence</span> — not by being louder, 
              but by being clearer.
            </p>
            <p className="text-lg text-muted-foreground leading-relaxed">
              Your aesthetic, identity, and digital world are shaped with intention and artistry.
            </p>
          </div>

          <div className="grid md:grid-cols-2 gap-8">
            <Card className="bg-card border-2 border-rose-gold/30 hover:border-rose-gold transition-all glow-gold">
              <CardContent className="p-8">
                <h3 className="font-serif text-2xl md:text-3xl font-bold mb-4 text-rose-gold">
                  Our Vision
                </h3>
                <p className="text-lg text-muted-foreground leading-relaxed">
                  To create a new standard of creator development — where identity, artistry, and business strategy 
                  are woven together into something iconic. We believe the best creators aren't made by algorithms — 
                  they're made by clarity, creativity, and commitment.
                </p>
              </CardContent>
            </Card>

            <Card className="bg-card border-2 border-rose-gold/30 hover:border-rose-gold transition-all glow-gold">
              <CardContent className="p-8">
                <h3 className="font-serif text-2xl md:text-3xl font-bold mb-4 text-rose-gold">
                  Our Mission
                </h3>
                <p className="text-lg text-muted-foreground leading-relaxed">
                  To guide women in mastering the art of digital presence — building brands, content systems, 
                  and revenue engines that don't just perform, but endure. We create long-term growth, not temporary spikes.
                </p>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* Section 4: Our Creator Services */}
      <section className="py-32 bg-background">
        <div className="container mx-auto px-6 max-w-6xl">
          <h2 className="font-serif text-4xl md:text-5xl text-center mb-16 text-rose-gold">
            Our Creator Services
          </h2>
          
          <div className="grid md:grid-cols-4 gap-8">
            {/* Planning */}
            <Card className="bg-card border border-border hover:border-rose-gold transition-all text-center p-8">
              <div className="flex justify-center mb-6">
                <div className="w-16 h-16 rounded-full bg-rose-gold/10 flex items-center justify-center">
                  <Lightbulb className="w-8 h-8 text-rose-gold" />
                </div>
              </div>
              <h3 className="font-serif text-xl font-bold mb-3 text-rose-gold">Planning</h3>
              <p className="text-muted-foreground">
                Persona development, boundaries, brand mapping, content strategy, and market positioning.
              </p>
            </Card>

            {/* Production */}
            <Card className="bg-card border border-border hover:border-rose-gold transition-all text-center p-8">
              <div className="flex justify-center mb-6">
                <div className="w-16 h-16 rounded-full bg-rose-gold/10 flex items-center justify-center">
                  <Camera className="w-8 h-8 text-rose-gold" />
                </div>
              </div>
              <h3 className="font-serif text-xl font-bold mb-3 text-rose-gold">Production</h3>
              <p className="text-muted-foreground">
                Studio shoots, lighting, styling, posing guidance, and high-end moodboards for visual consistency.
              </p>
            </Card>

            {/* Marketing */}
            <Card className="bg-card border border-border hover:border-rose-gold transition-all text-center p-8">
              <div className="flex justify-center mb-6">
                <div className="w-16 h-16 rounded-full bg-rose-gold/10 flex items-center justify-center">
                  <Megaphone className="w-8 h-8 text-rose-gold" />
                </div>
              </div>
              <h3 className="font-serif text-xl font-bold mb-3 text-rose-gold">Marketing</h3>
              <p className="text-muted-foreground">
                Social content hooks, captions, storytelling arcs, and audience-building strategies.
              </p>
            </Card>

            {/* Sales */}
            <Card className="bg-card border border-border hover:border-rose-gold transition-all text-center p-8">
              <div className="flex justify-center mb-6">
                <div className="w-16 h-16 rounded-full bg-rose-gold/10 flex items-center justify-center">
                  <DollarSign className="w-8 h-8 text-rose-gold" />
                </div>
              </div>
              <h3 className="font-serif text-xl font-bold mb-3 text-rose-gold">Sales</h3>
              <p className="text-muted-foreground">
                PPV funnels, retention systems, chatting scripts, and high-ticket strategy implementation.
              </p>
            </Card>
          </div>
        </div>
      </section>

      {/* Section 5: What Makes Us Different */}
      <section className="py-32 bg-secondary/20">
        <div className="container mx-auto px-6 max-w-6xl">
          <h2 className="font-serif text-4xl md:text-5xl text-center mb-16 text-rose-gold">
            What Makes Us Different
          </h2>

          <div className="grid md:grid-cols-3 gap-8">
            <Card className="bg-card border-2 border-rose-gold/30 hover:border-rose-gold transition-all glow-gold">
              <CardContent className="p-8 text-center">
                <div className="flex justify-center mb-6">
                  <Crown className="w-12 h-12 text-rose-gold" />
                </div>
                <h3 className="font-serif text-2xl font-bold mb-4 text-rose-gold">
                  The Brand Umbrella
                </h3>
                <p className="text-muted-foreground leading-relaxed">
                  A cinematic Amsterdam-inspired identity shaped uniquely around you. We don't use templates — 
                  we craft brands that feel like stories.
                </p>
              </CardContent>
            </Card>

            <Card className="bg-card border-2 border-rose-gold/30 hover:border-rose-gold transition-all glow-gold">
              <CardContent className="p-8 text-center">
                <div className="flex justify-center mb-6">
                  <Camera className="w-12 h-12 text-rose-gold" />
                </div>
                <h3 className="font-serif text-2xl font-bold mb-4 text-rose-gold">
                  Professional Creative Direction
                </h3>
                <p className="text-muted-foreground leading-relaxed">
                  Studio lighting, posing, styling, and high-end content direction. Not phone selfies — real production quality.
                </p>
              </CardContent>
            </Card>

            <Card className="bg-card border-2 border-rose-gold/30 hover:border-rose-gold transition-all glow-gold">
              <CardContent className="p-8 text-center">
                <div className="flex justify-center mb-6">
                  <Gem className="w-12 h-12 text-rose-gold" />
                </div>
                <h3 className="font-serif text-2xl font-bold mb-4 text-rose-gold">
                  The Marketing & Sales Machine
                </h3>
                <p className="text-muted-foreground leading-relaxed">
                  Not random posting — real funnels, scripts, high-ticket strategy, and retention systems. 
                  Growth backed by structure.
                </p>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* Section 6: Support & Management */}
      <section className="py-32 bg-background">
        <div className="container mx-auto px-6 max-w-6xl">
          <h2 className="font-serif text-4xl md:text-5xl text-center mb-16 text-rose-gold">
            Support & Management
          </h2>

          <div className="grid md:grid-cols-2 gap-12 items-center">
            {/* Left: Dashboard Mockup */}
            <div>
              <Card className="bg-gradient-to-br from-secondary/50 to-secondary/20 border-2 border-rose-gold/30 p-12">
                <div className="text-center space-y-6">
                  <div className="text-6xl">📊</div>
                  <h3 className="font-serif text-2xl text-rose-gold">Your Creator Dashboard</h3>
                  <p className="text-muted-foreground">
                    Track commitments, upload content, view analytics, and communicate with your team — 
                    all in one organized space.
                  </p>
                </div>
              </Card>
            </div>

            {/* Right: Feature List */}
            <div className="space-y-6">
              <div className="flex items-start gap-4">
                <CheckCircle className="w-6 h-6 text-rose-gold flex-shrink-0 mt-1" />
                <div>
                  <h4 className="text-lg font-semibold text-foreground mb-1">Weekly content commitments</h4>
                  <p className="text-muted-foreground">Clear expectations, organized week by week</p>
                </div>
              </div>

              <div className="flex items-start gap-4">
                <CheckCircle className="w-6 h-6 text-rose-gold flex-shrink-0 mt-1" />
                <div>
                  <h4 className="text-lg font-semibold text-foreground mb-1">Upload system</h4>
                  <p className="text-muted-foreground">Submit content directly through the platform</p>
                </div>
              </div>

              <div className="flex items-start gap-4">
                <CheckCircle className="w-6 h-6 text-rose-gold flex-shrink-0 mt-1" />
                <div>
                  <h4 className="text-lg font-semibold text-foreground mb-1">Personal rep</h4>
                  <p className="text-muted-foreground">Direct access to your dedicated team member</p>
                </div>
              </div>

              <div className="flex items-start gap-4">
                <CheckCircle className="w-6 h-6 text-rose-gold flex-shrink-0 mt-1" />
                <div>
                  <h4 className="text-lg font-semibold text-foreground mb-1">Scripts + menus</h4>
                  <p className="text-muted-foreground">Pre-written templates for chats, renewals, and PPV</p>
                </div>
              </div>

              <div className="flex items-start gap-4">
                <CheckCircle className="w-6 h-6 text-rose-gold flex-shrink-0 mt-1" />
                <div>
                  <h4 className="text-lg font-semibold text-foreground mb-1">Growth strategy</h4>
                  <p className="text-muted-foreground">Real-time feedback and planning for your next phase</p>
                </div>
              </div>

              <div className="flex items-start gap-4">
                <CheckCircle className="w-6 h-6 text-rose-gold flex-shrink-0 mt-1" />
                <div>
                  <h4 className="text-lg font-semibold text-foreground mb-1">Privacy & boundaries</h4>
                  <p className="text-muted-foreground">Full control over your limits and comfort zones</p>
                </div>
              </div>

              <p className="text-foreground font-medium pt-4 border-t border-border">
                Everything organised in one place.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Section 7: Rose Journey Timeline */}
      <RoseJourneyTimeline />

      {/* Section 8: Work With Us (Section 1) */}
      <section className="py-32 bg-background">
        <div className="container mx-auto px-6 text-center max-w-4xl">
          <h2 className="font-serif text-5xl md:text-6xl mb-6 text-rose-gold">
            Work With Us
          </h2>
          <p className="text-2xl md:text-3xl text-muted-foreground font-light">
            Your identity. Your story. Your growth.
          </p>
        </div>
      </section>

      {/* Section 9: Full Comparison Table */}
      <div id="comparison">
        <ComparisonTable />
      </div>

      {/* Section 10: Work With Us (Section 2) */}
      <section className="py-32 bg-background">
        <div className="container mx-auto px-6 text-center">
          <Button 
            asChild 
            size="lg" 
            className="text-xl px-12 py-8 border-2 border-rose-gold bg-transparent hover:bg-rose-gold/10 glow-gold-strong text-rose-gold"
          >
            <Link to="/signup">Become a Creator</Link>
          </Button>
        </div>
      </section>

      {/* Section 11: Location Map */}
      <section className="py-32 bg-secondary/20">
        <div className="container mx-auto px-6 max-w-6xl">
          <div className="grid md:grid-cols-2 gap-12 items-center">
            <div>
              <img 
                src={locationMap} 
                alt="Bureau Boudoir location in Amsterdam"
                className="rounded-lg border-2 border-rose-gold/30 w-full"
              />
            </div>
            <div>
              <h2 className="font-serif text-4xl md:text-5xl mb-6 text-gold">
                Located in the Heart of Amsterdam's Historic Centre
              </h2>
              <p className="text-2xl text-muted-foreground mb-8">
                Oudekerksplein 18h, Amsterdam
              </p>
              <p className="text-lg text-muted-foreground leading-relaxed">
                Our studio sits in the cultural and creative heart of the city — where history, artistry, 
                and modern storytelling converge. It's more than a location — it's part of the identity we build.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Section 12: Q&A */}
      <QAAccordion />

      {/* Section 13: Final CTA */}
      <section className="py-32 bg-background">
        <div className="container mx-auto px-6 text-center max-w-4xl">
          <h2 className="font-serif text-4xl md:text-5xl mb-8 text-rose-gold">
            Ready to Begin?
          </h2>
          <p className="text-xl text-muted-foreground mb-12 max-w-2xl mx-auto">
            Join a community of creators who've chosen clarity, artistry, and long-term growth over shortcuts and noise.
          </p>
          <Button 
            asChild 
            size="lg" 
            className="text-xl px-12 py-8 border-2 border-rose-gold bg-transparent hover:bg-rose-gold/10 glow-gold-strong text-rose-gold"
          >
            <Link to="/signup">Apply Now</Link>
          </Button>
        </div>
      </section>

      {/* Section 14: Footer */}
      <footer id="contact" className="bg-black border-t-2 border-rose-gold py-16">
        <div className="container mx-auto px-6">
          <div className="grid md:grid-cols-3 gap-12 mb-12">
            {/* Column 1: Brand */}
            <div className="text-center md:text-left">
              <h3 className="font-serif text-3xl text-rose-gold mb-4">Bureau Boudoir</h3>
              <div className="flex justify-center md:justify-start">
                <StreetLampIcon className="w-12 h-12" />
              </div>
              <p className="text-muted-foreground mt-4">
                Oudekerksplein 18h<br />
                Amsterdam, Netherlands
              </p>
            </div>

            {/* Column 2: Navigation */}
            <div className="text-center">
              <h4 className="font-serif text-xl text-rose-gold mb-6">Quick Links</h4>
              <div className="space-y-3">
                <button 
                  onClick={() => scrollToSection('about')}
                  className="block w-full text-muted-foreground hover:text-rose-gold transition-colors"
                >
                  About
                </button>
                <Link 
                  to="/signup"
                  className="block w-full text-muted-foreground hover:text-rose-gold transition-colors"
                >
                  Join
                </Link>
                <button 
                  onClick={() => scrollToSection('contact')}
                  className="block w-full text-muted-foreground hover:text-rose-gold transition-colors"
                >
                  Contact
                </button>
              </div>
            </div>

            {/* Column 3: Social */}
            <div className="text-center md:text-right">
              <h4 className="font-serif text-xl text-rose-gold mb-6">Follow Us</h4>
              <div className="flex justify-center md:justify-end gap-6">
                <a 
                  href="https://twitter.com" 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="text-rose-gold hover:text-rose-gold/70 transition-colors"
                >
                  <Twitter className="w-6 h-6" />
                </a>
                <a 
                  href="https://instagram.com" 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="text-rose-gold hover:text-rose-gold/70 transition-colors"
                >
                  <Instagram className="w-6 h-6" />
                </a>
              </div>
            </div>
          </div>

          <div className="border-t border-border pt-8 text-center text-muted-foreground text-sm">
            © 2025 Bureau Boudoir. All rights reserved.
          </div>
        </div>
      </footer>
    </div>
  );
};

export default Home;