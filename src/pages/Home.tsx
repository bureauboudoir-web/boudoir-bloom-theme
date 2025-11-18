import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import Navigation from "@/components/Navigation";
import RoseDivider from "@/components/RoseDivider";
import RedLightGlow from "@/components/RedLightGlow";
import heroImage from "@/assets/hero-bg.jpg";
import { Lightbulb, FileText, Camera, Megaphone, MessageCircle } from "lucide-react";

const Home = () => {
  return (
    <div className="min-h-screen bg-background text-foreground">
      <Navigation />
      
      {/* Hero Section */}
      <section 
        className="relative min-h-screen flex items-center justify-center overflow-hidden"
        style={{
          backgroundImage: `linear-gradient(rgba(0, 0, 0, 0.8), rgba(0, 0, 0, 0.8)), url(${heroImage})`,
          backgroundSize: 'cover',
          backgroundPosition: 'center',
        }}
      >
        <div className="absolute inset-0 bg-gradient-to-b from-transparent via-primary/5 to-background" />
        <div className="container mx-auto px-6 text-center relative z-10 max-w-5xl">
          <p className="font-serif text-2xl md:text-3xl text-rose-gold mb-6 animate-fade-in">
            Bureau Boudoir
          </p>
          <h1 className="font-serif text-5xl md:text-7xl font-bold mb-8 text-glow-red leading-tight">
            The Art of Seduction
          </h1>
          <p className="text-xl md:text-2xl text-muted-foreground max-w-3xl mx-auto mb-12 leading-relaxed">
            A premium creative house in Amsterdam where sensuality, strategy, and self-expression 
            merge into an irresistible online presence.
          </p>
          <Button asChild size="lg" className="text-lg px-10 py-7 bg-primary hover:bg-primary/90 glow-red">
            <Link to="/signup">Begin Your Journey</Link>
          </Button>
        </div>
      </section>

      <RoseDivider />

      {/* Introduction */}
      <section className="py-24 bg-background">
        <div className="container mx-auto px-6 max-w-4xl text-center">
          <h2 className="font-serif text-4xl md:text-5xl font-bold mb-8 text-rose-gold">
            Welcome to Bureau Boudoir
          </h2>
          <p className="text-xl text-foreground leading-relaxed mb-6">
            We guide women in the art of digital seduction. Based in Amsterdam's storied Red Light District, 
            we create an exclusive environment where creativity flourishes.
          </p>
          <p className="text-lg text-muted-foreground leading-relaxed">
            Here, sensuality meets strategy. Self-expression becomes art. 
            And your unique energy transforms into an irresistible online presence.
          </p>
        </div>
      </section>

      <RedLightGlow />

      {/* What We Do */}
      <section className="py-24 bg-secondary/50">
        <div className="container mx-auto px-6 max-w-5xl">
          <h2 className="font-serif text-4xl md:text-5xl font-bold text-center mb-16 text-rose-gold">
            What We Do
          </h2>
          
          <div className="grid md:grid-cols-2 gap-8">
            <Card className="bg-card border border-primary/20 p-8 hover:border-rose-gold transition-all">
              <h3 className="font-serif text-2xl font-bold mb-4 text-rose-gold">Refine Your Presence</h3>
              <p className="text-lg text-foreground leading-relaxed">
                We help you refine your appearance and use your sensuality consciously on platforms 
                such as Instagram and OnlyFans.
              </p>
            </Card>
            
            <Card className="bg-card border border-primary/20 p-8 hover:border-rose-gold transition-all">
              <h3 className="font-serif text-2xl font-bold mb-4 text-rose-gold">Build Your Brand</h3>
              <p className="text-lg text-foreground leading-relaxed">
                Expert guidance in content creation, personal branding, positioning, and storytelling — 
                all tailored to your unique energy and identity.
              </p>
            </Card>
          </div>
        </div>
      </section>

      <RoseDivider />

      {/* Our Philosophy */}
      <section className="py-24 bg-background">
        <div className="container mx-auto px-6 max-w-4xl text-center">
          <h2 className="font-serif text-4xl md:text-5xl font-bold mb-12 text-rose-gold">
            Our Philosophy
          </h2>
          
          <div className="space-y-8">
            <p className="font-serif text-3xl md:text-4xl text-primary italic leading-relaxed">
              "Seduction is not a pose;<br />it is an art form."
            </p>
            
            <p className="text-xl text-foreground leading-relaxed max-w-2xl mx-auto">
              A method of communication built on subtle gestures, atmosphere, and personality.
            </p>
            
            <p className="text-lg text-muted-foreground leading-relaxed max-w-2xl mx-auto">
              We help you master that art, deepen it, and apply it strategically. 
              This is not about following trends — it's about creating your own gravitational pull.
            </p>
          </div>
        </div>
      </section>

      <RedLightGlow />

      {/* Our Process */}
      <section className="py-24 bg-secondary/50">
        <div className="container mx-auto px-6">
          <h2 className="font-serif text-4xl md:text-5xl font-bold text-center mb-6 text-rose-gold">
            Our Process
          </h2>
          <p className="text-center text-muted-foreground text-lg mb-20 max-w-2xl mx-auto">
            From strategy to success — a proven five-step journey
          </p>
          
          <div className="grid md:grid-cols-5 gap-6 max-w-7xl mx-auto">
            {/* Step 1 */}
            <Card className="bg-card border-2 border-primary/30 p-6 text-center hover:border-rose-gold transition-all group">
              <div className="mb-4">
                <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-primary/10 group-hover:bg-primary/20 transition-colors">
                  <Lightbulb className="w-8 h-8 text-rose-gold" />
                </div>
              </div>
              <h3 className="font-serif text-xl font-bold mb-2 text-rose-gold uppercase">Plan</h3>
              <p className="text-sm font-semibold mb-2 text-foreground">Create Strategy</p>
              <p className="text-xs text-muted-foreground leading-relaxed">
                Define your unique positioning
              </p>
            </Card>
            
            {/* Step 2 */}
            <Card className="bg-card border-2 border-primary/30 p-6 text-center hover:border-rose-gold transition-all group">
              <div className="mb-4">
                <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-primary/10 group-hover:bg-primary/20 transition-colors">
                  <FileText className="w-8 h-8 text-rose-gold" />
                </div>
              </div>
              <h3 className="font-serif text-xl font-bold mb-2 text-rose-gold uppercase">Editorial</h3>
              <p className="text-sm font-semibold mb-2 text-foreground">Create Scripts</p>
              <p className="text-xs text-muted-foreground leading-relaxed">
                Craft compelling narratives
              </p>
            </Card>
            
            {/* Step 3 */}
            <Card className="bg-card border-2 border-primary/30 p-6 text-center hover:border-rose-gold transition-all group">
              <div className="mb-4">
                <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-primary/10 group-hover:bg-primary/20 transition-colors">
                  <Camera className="w-8 h-8 text-rose-gold" />
                </div>
              </div>
              <h3 className="font-serif text-xl font-bold mb-2 text-rose-gold uppercase">Studio</h3>
              <p className="text-sm font-semibold mb-2 text-foreground">Create Content</p>
              <p className="text-xs text-muted-foreground leading-relaxed">
                Professional shoots
              </p>
            </Card>
            
            {/* Step 4 */}
            <Card className="bg-card border-2 border-primary/30 p-6 text-center hover:border-rose-gold transition-all group">
              <div className="mb-4">
                <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-primary/10 group-hover:bg-primary/20 transition-colors">
                  <Megaphone className="w-8 h-8 text-rose-gold" />
                </div>
              </div>
              <h3 className="font-serif text-xl font-bold mb-2 text-rose-gold uppercase">Marketing</h3>
              <p className="text-sm font-semibold mb-2 text-foreground">Create Hooks</p>
              <p className="text-xs text-muted-foreground leading-relaxed">
                Strategic campaigns
              </p>
            </Card>
            
            {/* Step 5 */}
            <Card className="bg-card border-2 border-primary/30 p-6 text-center hover:border-rose-gold transition-all group">
              <div className="mb-4">
                <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-primary/10 group-hover:bg-primary/20 transition-colors">
                  <MessageCircle className="w-8 h-8 text-rose-gold" />
                </div>
              </div>
              <h3 className="font-serif text-xl font-bold mb-2 text-rose-gold uppercase">Chat</h3>
              <p className="text-sm font-semibold mb-2 text-foreground">High-Ticket</p>
              <p className="text-xs text-muted-foreground leading-relaxed">
                Premium offerings
              </p>
            </Card>
          </div>
        </div>
      </section>

      <RoseDivider />

      {/* The Journey */}
      <section className="py-24 bg-background">
        <div className="container mx-auto px-6">
          <h2 className="font-serif text-4xl md:text-5xl font-bold text-center mb-6 text-rose-gold">
            Your Journey
          </h2>
          <p className="text-center text-muted-foreground text-lg mb-16 max-w-2xl mx-auto">
            Three stages of transformation — from seed to full bloom
          </p>
          
          {/* Timeline */}
          <div className="relative max-w-4xl mx-auto mb-16">
            <div className="absolute top-1/2 left-0 right-0 h-1 bg-gradient-to-r from-primary via-rose-gold to-primary transform -translate-y-1/2" />
            
            <div className="relative grid grid-cols-3 gap-8">
              <div className="text-center">
                <div className="inline-block w-12 h-12 rounded-full bg-primary border-4 border-background mb-4 relative z-10" />
                <h3 className="font-serif text-xl font-bold text-rose-gold">Starter</h3>
              </div>
              
              <div className="text-center">
                <div className="inline-block w-12 h-12 rounded-full bg-rose-gold border-4 border-background mb-4 relative z-10" />
                <h3 className="font-serif text-xl font-bold text-rose-gold">Growing</h3>
              </div>
              
              <div className="text-center">
                <div className="inline-block w-12 h-12 rounded-full bg-primary border-4 border-background mb-4 relative z-10" />
                <h3 className="font-serif text-xl font-bold text-rose-gold">Top</h3>
              </div>
            </div>
          </div>
          
          {/* Stages Detail */}
          <div className="grid md:grid-cols-3 gap-8 max-w-6xl mx-auto">
            {/* Seed */}
            <div className="text-center space-y-4">
              <div className="inline-block p-6 rounded-full bg-primary/10 mb-2">
                <span className="text-4xl">🌱</span>
              </div>
              <h3 className="font-serif text-2xl font-bold text-rose-gold">Seed</h3>
              <p className="text-sm uppercase tracking-wider text-muted-foreground mb-4">Getting Started</p>
              <Card className="bg-card p-6 border border-primary/20 text-left">
                <ul className="space-y-2 text-sm text-muted-foreground">
                  <li className="flex items-start">
                    <span className="text-rose-gold mr-2">•</span>
                    Application & consultation
                  </li>
                  <li className="flex items-start">
                    <span className="text-rose-gold mr-2">•</span>
                    Meet your dedicated rep
                  </li>
                  <li className="flex items-start">
                    <span className="text-rose-gold mr-2">•</span>
                    Initial strategy session
                  </li>
                </ul>
              </Card>
            </div>
            
            {/* Plant */}
            <div className="text-center space-y-4">
              <div className="inline-block p-6 rounded-full bg-rose-gold/10 mb-2">
                <span className="text-4xl">🌿</span>
              </div>
              <h3 className="font-serif text-2xl font-bold text-rose-gold">Plant</h3>
              <p className="text-sm uppercase tracking-wider text-muted-foreground mb-4">Building</p>
              <Card className="bg-card p-6 border border-rose-gold/20 text-left">
                <ul className="space-y-2 text-sm text-muted-foreground">
                  <li className="flex items-start">
                    <span className="text-rose-gold mr-2">•</span>
                    Onboarding process
                  </li>
                  <li className="flex items-start">
                    <span className="text-rose-gold mr-2">•</span>
                    Professional content shoots
                  </li>
                  <li className="flex items-start">
                    <span className="text-rose-gold mr-2">•</span>
                    Brand & persona development
                  </li>
                </ul>
              </Card>
            </div>
            
            {/* Rose */}
            <div className="text-center space-y-4">
              <div className="inline-block p-6 rounded-full bg-primary/10 mb-2">
                <span className="text-4xl">🌹</span>
              </div>
              <h3 className="font-serif text-2xl font-bold text-rose-gold">Rose</h3>
              <p className="text-sm uppercase tracking-wider text-muted-foreground mb-4">Full Bloom</p>
              <Card className="bg-card p-6 border border-primary/20 text-left">
                <ul className="space-y-2 text-sm text-muted-foreground">
                  <li className="flex items-start">
                    <span className="text-rose-gold mr-2">•</span>
                    Marketing launch
                  </li>
                  <li className="flex items-start">
                    <span className="text-rose-gold mr-2">•</span>
                    Sales funnel system
                  </li>
                  <li className="flex items-start">
                    <span className="text-rose-gold mr-2">•</span>
                    Official BB creator
                  </li>
                </ul>
              </Card>
            </div>
          </div>
        </div>
      </section>

      <RedLightGlow />

      {/* Final CTA */}
      <section className="py-24 bg-secondary/50">
        <div className="container mx-auto px-6 max-w-4xl text-center">
          <h2 className="font-serif text-4xl md:text-5xl font-bold mb-8 text-rose-gold">
            Our Promise
          </h2>
          
          <div className="space-y-6 mb-12">
            <p className="text-xl text-muted-foreground">
              Visibility alone is not enough.
            </p>
            <p className="text-2xl md:text-3xl text-foreground font-light leading-relaxed">
              At Bureau Boudoir, we teach you how to be <span className="text-rose-gold font-semibold italic">present</span>.
            </p>
            <div className="flex flex-wrap justify-center gap-4 text-xl font-serif italic text-rose-gold">
              <span>Confident</span>
              <span>•</span>
              <span>Elegant</span>
              <span>•</span>
              <span>Unforgettable</span>
            </div>
          </div>

          <Button asChild size="lg" className="text-xl px-12 py-8 bg-primary hover:bg-primary/90 glow-red">
            <Link to="/signup">Start Your Transformation</Link>
          </Button>
          <p className="mt-6 text-sm text-muted-foreground">
            Join the exclusive community of Bureau Boudoir creators
          </p>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-12 border-t border-border bg-background">
        <div className="container mx-auto px-6 text-center">
          <p className="font-serif text-2xl font-bold text-rose-gold mb-1">Bureau Boudoir</p>
          <p className="text-xs text-muted-foreground italic">The Art of Seduction</p>
          <p className="text-xs text-muted-foreground mt-4">Amsterdam, Netherlands</p>
        </div>
      </footer>
    </div>
  );
};

export default Home;
