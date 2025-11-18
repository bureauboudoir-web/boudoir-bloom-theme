import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import Navigation from "@/components/Navigation";
import RoseDivider from "@/components/RoseDivider";
import RedLightGlow from "@/components/RedLightGlow";
import heroImage from "@/assets/hero-bg.jpg";
import roseJourney from "@/assets/rose-journey.png";
import { Sparkles, Target, TrendingUp } from "lucide-react";

const Home = () => {
  return (
    <div className="min-h-screen bg-background text-foreground">
      <Navigation />
      
      {/* Hero Section */}
      <section 
        className="relative min-h-screen flex items-center justify-center overflow-hidden"
        style={{
          backgroundImage: `linear-gradient(rgba(0, 0, 0, 0.7), rgba(0, 0, 0, 0.7)), url(${heroImage})`,
          backgroundSize: 'cover',
          backgroundPosition: 'center',
        }}
      >
        <div className="absolute inset-0 bg-gradient-to-b from-transparent via-primary/10 to-background" />
        <div className="container mx-auto px-6 text-center relative z-10">
          <h1 className="font-serif text-5xl md:text-6xl font-bold mb-6 text-glow-red">
            Where Real Creators Bloom
          </h1>
          <p className="text-xl md:text-2xl text-muted-foreground max-w-3xl mx-auto mb-12">
            A premium creative house inspired by Amsterdam's Red Light District.<br />
            Focused on authenticity, artistry, and long-term growth.
          </p>
          <Button asChild size="lg" className="text-lg px-8 py-6 glow-red">
            <Link to="/signup">Become a Creator</Link>
          </Button>
        </div>
      </section>

      <RoseDivider />

      {/* Introduction */}
      <section className="py-24 bg-background">
        <div className="container mx-auto px-6 max-w-4xl text-center">
          <p className="font-serif text-2xl md:text-3xl text-primary mb-4">The Art of Seduction</p>
          <p className="text-lg text-muted-foreground leading-relaxed">
            Welcome to Bureau Boudoir — the high-end agency that guides women in the art of digital seduction.
            Based in the heart of Amsterdam, we create an exclusive environment where sensuality, strategy, and self-expression merge into an irresistible online presence.
          </p>
        </div>
      </section>

      <RedLightGlow />

      {/* What We Do */}
      <section className="py-24 bg-secondary">
        <div className="container mx-auto px-6 max-w-5xl">
          <h2 className="font-serif text-4xl md:text-5xl font-bold text-center mb-12">
            What We Do
          </h2>
          <div className="text-center space-y-6">
            <p className="text-lg text-foreground leading-relaxed">
              At Bureau Boudoir, we help women refine their appearance and use their sensuality consciously on platforms such as Instagram and OnlyFans.
            </p>
            <p className="text-lg text-muted-foreground leading-relaxed">
              We offer guidance in content creation, personal branding, positioning, and storytelling — all tailored to your unique energy and identity.
            </p>
          </div>
        </div>
      </section>

      <RoseDivider />

      {/* Our Philosophy */}
      <section className="py-24 bg-background">
        <div className="container mx-auto px-6 max-w-4xl">
          <h2 className="font-serif text-4xl md:text-5xl font-bold text-center mb-12">
            Our Philosophy
          </h2>
          <div className="text-center space-y-6">
            <p className="text-xl text-primary font-serif italic">
              Seduction is not a pose; it is an art form.
            </p>
            <p className="text-lg text-muted-foreground leading-relaxed">
              A method of communication built on subtle gestures, atmosphere, and personality.
              We help you master that art, deepen it, and apply it strategically.
            </p>
          </div>
        </div>
      </section>

      <RedLightGlow />

      {/* Our Promise */}
      <section className="py-24 bg-secondary">
        <div className="container mx-auto px-6 max-w-4xl">
          <h2 className="font-serif text-4xl md:text-5xl font-bold text-center mb-12">
            Our Promise
          </h2>
          <div className="text-center space-y-6">
            <p className="text-lg text-muted-foreground leading-relaxed">
              Visibility alone is not enough.
            </p>
            <p className="text-xl text-foreground leading-relaxed">
              At Bureau Boudoir, we teach you how to be <span className="text-primary font-semibold">present</span>.
            </p>
            <p className="text-lg text-primary font-serif italic">
              Confident. Elegant. Unforgettable.
            </p>
          </div>
        </div>
      </section>

      <RoseDivider />

      {/* What Makes Us Different */}
      <section className="py-24 bg-secondary">
        <div className="container mx-auto px-6">
          <h2 className="font-serif text-4xl md:text-5xl font-bold text-center mb-16">
            What Makes Us Different
          </h2>
          
          <div className="grid md:grid-cols-3 gap-8 max-w-6xl mx-auto">
            <Card className="bg-card border-primary/20 p-8 text-center hover:border-primary transition-all">
              <Sparkles className="w-12 h-12 mx-auto mb-4 text-primary" />
              <h3 className="font-serif text-2xl font-bold mb-4">Authenticity Over Algorithms</h3>
              <p className="text-muted-foreground">
                Real personalities, real stories, real connections.
              </p>
            </Card>
            
            <Card className="bg-card border-primary/20 p-8 text-center hover:border-primary transition-all">
              <Target className="w-12 h-12 mx-auto mb-4 text-primary" />
              <h3 className="font-serif text-2xl font-bold mb-4">Professional Creative Direction</h3>
              <p className="text-muted-foreground">
                Expert guidance in content, branding, and positioning.
              </p>
            </Card>
            
            <Card className="bg-card border-primary/20 p-8 text-center hover:border-primary transition-all">
              <TrendingUp className="w-12 h-12 mx-auto mb-4 text-primary" />
              <h3 className="font-serif text-2xl font-bold mb-4">Real Growth, Real Team, Real Strategy</h3>
              <p className="text-muted-foreground">
                Sustainable success built on solid foundations.
              </p>
            </Card>
          </div>
        </div>
      </section>

      <RedLightGlow />

      {/* Rose Journey */}
      <section className="py-24">
        <div className="container mx-auto px-6">
          <h2 className="font-serif text-4xl md:text-5xl font-bold text-center mb-16">
            The Rose Journey
          </h2>
          
          
          <div className="grid md:grid-cols-3 gap-8 max-w-5xl mx-auto">
            <div className="text-center">
              <div className="inline-block p-4 rounded-full bg-primary/10 mb-4">
                <span className="text-3xl">🌱</span>
              </div>
              <h3 className="font-serif text-2xl font-bold mb-3">Seed — Getting Started</h3>
              <ul className="text-muted-foreground space-y-2">
                <li>Complete signup form</li>
                <li>Meet your rep</li>
                <li>Introductory call</li>
              </ul>
            </div>
            
            <div className="text-center">
              <div className="inline-block p-4 rounded-full bg-primary/10 mb-4">
                <span className="text-3xl">🌿</span>
              </div>
              <h3 className="font-serif text-2xl font-bold mb-3">Plant — Building Foundation</h3>
              <ul className="text-muted-foreground space-y-2">
                <li>Full onboarding process</li>
                <li>Professional shoots</li>
                <li>Brand identity creation</li>
                <li>Persona development</li>
              </ul>
            </div>
            
            <div className="text-center">
              <div className="inline-block p-4 rounded-full bg-primary/10 mb-4">
                <span className="text-3xl">🌹</span>
              </div>
              <h3 className="font-serif text-2xl font-bold mb-3">Rose — Becoming a BB Creator</h3>
              <ul className="text-muted-foreground space-y-2">
                <li>Marketing launch</li>
                <li>Sales setup</li>
                <li>Chat + PPV systems</li>
                <li>Final launch</li>
              </ul>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-12 border-t border-border">
        <div className="container mx-auto px-6 text-center">
          <p className="font-serif text-2xl font-bold mb-2">Bureau Boudoir</p>
          <p className="text-sm text-muted-foreground">The Art of Seduction</p>
          <p className="text-xs text-muted-foreground mt-4">Amsterdam, Netherlands</p>
        </div>
      </footer>
    </div>
  );
};

export default Home;
