import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import Navigation from "@/components/Navigation";
import RoseDivider from "@/components/RoseDivider";
import RedLightGlow from "@/components/RedLightGlow";
import heroImage from "@/assets/hero-bg.jpg";
import { Sparkles, Target, TrendingUp } from "lucide-react";

const Home = () => {
  return (
    <div className="min-h-screen bg-background text-foreground">
      <Navigation />
      
      {/* Hero Section - The Opening */}
      <section 
        className="relative min-h-screen flex items-center justify-center overflow-hidden"
        style={{
          backgroundImage: `linear-gradient(rgba(0, 0, 0, 0.75), rgba(0, 0, 0, 0.75)), url(${heroImage})`,
          backgroundSize: 'cover',
          backgroundPosition: 'center',
        }}
      >
        <div className="absolute inset-0 bg-gradient-to-b from-transparent via-primary/10 to-background" />
        <div className="container mx-auto px-6 text-center relative z-10 max-w-5xl">
          <p className="font-serif text-2xl md:text-3xl text-rose-gold mb-6 animate-fade-in">
            Bureau Boudoir
          </p>
          <h1 className="font-serif text-5xl md:text-7xl font-bold mb-8 text-glow-red leading-tight">
            The Art of Seduction
          </h1>
          <p className="text-xl md:text-2xl text-muted-foreground max-w-3xl mx-auto mb-12 leading-relaxed">
            A premium creative house in the heart of Amsterdam,<br className="hidden md:block" />
            where sensuality, strategy, and self-expression merge into an irresistible online presence.
          </p>
          <Button asChild size="lg" className="text-lg px-10 py-7 glow-red hover-scale">
            <Link to="/signup">Begin Your Journey</Link>
          </Button>
        </div>
      </section>

      <RoseDivider />

      {/* Chapter 1: Introduction */}
      <section className="py-32 bg-background">
        <div className="container mx-auto px-6 max-w-4xl">
          <div className="text-center space-y-8 animate-fade-in">
            <h2 className="font-serif text-4xl md:text-5xl font-bold text-primary">
              Welcome to Bureau Boudoir
            </h2>
            <p className="text-xl text-foreground leading-relaxed">
              We guide women in the art of digital seduction. Based in Amsterdam's storied Red Light District, 
              we create an exclusive environment where creativity flourishes.
            </p>
            <p className="text-lg text-muted-foreground leading-relaxed max-w-3xl mx-auto">
              Here, sensuality meets strategy. Self-expression becomes art. 
              And your unique energy transforms into an irresistible online presence that captivates and converts.
            </p>
          </div>
        </div>
      </section>

      <RedLightGlow />

      {/* Chapter 2: What We Do */}
      <section className="py-32 bg-secondary">
        <div className="container mx-auto px-6 max-w-6xl">
          <h2 className="font-serif text-4xl md:text-5xl font-bold text-center mb-16">
            What We Do
          </h2>
          
          <div className="grid md:grid-cols-2 gap-12 mb-16">
            <Card className="bg-card border-primary/20 p-10 hover:border-primary transition-all">
              <h3 className="font-serif text-2xl font-bold mb-4 text-primary">Refine Your Presence</h3>
              <p className="text-lg text-muted-foreground leading-relaxed">
                We help you refine your appearance and use your sensuality consciously on platforms 
                such as Instagram and OnlyFans.
              </p>
            </Card>
            
            <Card className="bg-card border-primary/20 p-10 hover:border-primary transition-all">
              <h3 className="font-serif text-2xl font-bold mb-4 text-primary">Build Your Brand</h3>
              <p className="text-lg text-muted-foreground leading-relaxed">
                Expert guidance in content creation, personal branding, positioning, and storytelling — 
                all tailored to your unique energy and identity.
              </p>
            </Card>
          </div>

          <div className="text-center max-w-3xl mx-auto">
            <p className="text-lg text-foreground italic">
              Every detail is crafted to amplify your natural allure and strategic positioning in the digital landscape.
            </p>
          </div>
        </div>
      </section>

      <RoseDivider />

      {/* Chapter 3: Our Philosophy */}
      <section className="py-32 bg-background">
        <div className="container mx-auto px-6 max-w-4xl">
          <h2 className="font-serif text-4xl md:text-5xl font-bold text-center mb-16">
            Our Philosophy
          </h2>
          
          <div className="space-y-12 text-center">
            <div className="space-y-6">
              <p className="font-serif text-3xl md:text-4xl text-primary italic leading-relaxed">
                "Seduction is not a pose;<br />it is an art form."
              </p>
            </div>
            
            <div className="max-w-2xl mx-auto space-y-6">
              <p className="text-xl text-foreground leading-relaxed">
                A method of communication built on subtle gestures, atmosphere, and personality.
              </p>
              <p className="text-lg text-muted-foreground leading-relaxed">
                We help you master that art, deepen it, and apply it strategically. 
                This is not about following trends — it's about creating your own gravitational pull.
              </p>
            </div>
          </div>
        </div>
      </section>

      <RedLightGlow />

      {/* Chapter 4: The Three Pillars */}
      <section className="py-32 bg-secondary">
        <div className="container mx-auto px-6">
          <h2 className="font-serif text-4xl md:text-5xl font-bold text-center mb-4">
            What Makes Us Different
          </h2>
          <p className="text-center text-muted-foreground text-lg mb-16 max-w-2xl mx-auto">
            Three core principles that set Bureau Boudoir apart from traditional agencies
          </p>
          
          <div className="grid md:grid-cols-3 gap-8 max-w-6xl mx-auto">
            <Card className="bg-card border-primary/20 p-10 text-center hover:border-primary transition-all group">
              <div className="mb-6 flex justify-center">
                <div className="p-4 rounded-full bg-primary/10 group-hover:bg-primary/20 transition-colors">
                  <Sparkles className="w-12 h-12 text-primary" />
                </div>
              </div>
              <h3 className="font-serif text-2xl font-bold mb-4">Authenticity Over Algorithms</h3>
              <p className="text-muted-foreground leading-relaxed">
                Real personalities. Real stories. Real connections. We build sustainable success on who you truly are.
              </p>
            </Card>
            
            <Card className="bg-card border-primary/20 p-10 text-center hover:border-primary transition-all group">
              <div className="mb-6 flex justify-center">
                <div className="p-4 rounded-full bg-primary/10 group-hover:bg-primary/20 transition-colors">
                  <Target className="w-12 h-12 text-primary" />
                </div>
              </div>
              <h3 className="font-serif text-2xl font-bold mb-4">Professional Creative Direction</h3>
              <p className="text-muted-foreground leading-relaxed">
                Expert guidance in content, branding, and positioning. Every frame tells your story with intention.
              </p>
            </Card>
            
            <Card className="bg-card border-primary/20 p-10 text-center hover:border-primary transition-all group">
              <div className="mb-6 flex justify-center">
                <div className="p-4 rounded-full bg-primary/10 group-hover:bg-primary/20 transition-colors">
                  <TrendingUp className="w-12 h-12 text-primary" />
                </div>
              </div>
              <h3 className="font-serif text-2xl font-bold mb-4">Real Growth, Real Team, Real Strategy</h3>
              <p className="text-muted-foreground leading-relaxed">
                Sustainable success built on solid foundations. No shortcuts, no empty promises.
              </p>
            </Card>
          </div>
        </div>
      </section>

      <RoseDivider />

      {/* Chapter 5: The Rose Journey */}
      <section className="py-32 bg-background">
        <div className="container mx-auto px-6">
          <h2 className="font-serif text-4xl md:text-5xl font-bold text-center mb-6">
            The Rose Journey
          </h2>
          <p className="text-center text-muted-foreground text-lg mb-20 max-w-2xl mx-auto">
            Your transformation from application to full bloom, guided every step of the way
          </p>
          
          <div className="grid md:grid-cols-3 gap-16 max-w-6xl mx-auto">
            {/* Stage 1: Seed */}
            <div className="text-center space-y-6">
              <div className="inline-block p-8 rounded-full bg-primary/10 mb-4 glow-red">
                <span className="text-5xl">🌱</span>
              </div>
              <div>
                <h3 className="font-serif text-3xl font-bold mb-3 text-primary">Seed</h3>
                <p className="text-sm uppercase tracking-wider text-muted-foreground mb-4">Getting Started</p>
              </div>
              <div className="space-y-3 text-left bg-card p-6 rounded-lg border border-border">
                <p className="text-muted-foreground flex items-start">
                  <span className="text-primary mr-2">•</span>
                  Complete your application
                </p>
                <p className="text-muted-foreground flex items-start">
                  <span className="text-primary mr-2">•</span>
                  Meet your dedicated rep
                </p>
                <p className="text-muted-foreground flex items-start">
                  <span className="text-primary mr-2">•</span>
                  Initial consultation call
                </p>
              </div>
            </div>
            
            {/* Stage 2: Plant */}
            <div className="text-center space-y-6">
              <div className="inline-block p-8 rounded-full bg-primary/10 mb-4 glow-red">
                <span className="text-5xl">🌿</span>
              </div>
              <div>
                <h3 className="font-serif text-3xl font-bold mb-3 text-primary">Plant</h3>
                <p className="text-sm uppercase tracking-wider text-muted-foreground mb-4">Building Foundation</p>
              </div>
              <div className="space-y-3 text-left bg-card p-6 rounded-lg border border-border">
                <p className="text-muted-foreground flex items-start">
                  <span className="text-primary mr-2">•</span>
                  Complete onboarding process
                </p>
                <p className="text-muted-foreground flex items-start">
                  <span className="text-primary mr-2">•</span>
                  Professional photo & video shoots
                </p>
                <p className="text-muted-foreground flex items-start">
                  <span className="text-primary mr-2">•</span>
                  Brand identity & persona creation
                </p>
              </div>
            </div>
            
            {/* Stage 3: Rose */}
            <div className="text-center space-y-6">
              <div className="inline-block p-8 rounded-full bg-primary/10 mb-4 glow-red">
                <span className="text-5xl">🌹</span>
              </div>
              <div>
                <h3 className="font-serif text-3xl font-bold mb-3 text-primary">Rose</h3>
                <p className="text-sm uppercase tracking-wider text-muted-foreground mb-4">Full Bloom</p>
              </div>
              <div className="space-y-3 text-left bg-card p-6 rounded-lg border border-border">
                <p className="text-muted-foreground flex items-start">
                  <span className="text-primary mr-2">•</span>
                  Marketing launch campaign
                </p>
                <p className="text-muted-foreground flex items-start">
                  <span className="text-primary mr-2">•</span>
                  Sales setup & funnel system
                </p>
                <p className="text-muted-foreground flex items-start">
                  <span className="text-primary mr-2">•</span>
                  Official Bureau Boudoir creator
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      <RedLightGlow />

      {/* Chapter 6: Our Promise & CTA */}
      <section className="py-32 bg-secondary">
        <div className="container mx-auto px-6 max-w-4xl text-center">
          <h2 className="font-serif text-4xl md:text-5xl font-bold mb-12">
            Our Promise to You
          </h2>
          
          <div className="space-y-8 mb-16">
            <p className="text-xl text-muted-foreground">
              Visibility alone is not enough.
            </p>
            <p className="text-2xl md:text-3xl text-foreground font-light leading-relaxed">
              At Bureau Boudoir, we teach you how to be <span className="text-primary font-semibold italic">present</span>.
            </p>
            <div className="flex flex-col md:flex-row gap-4 justify-center items-center text-2xl font-serif italic text-primary">
              <span>Confident.</span>
              <span className="hidden md:block">•</span>
              <span>Elegant.</span>
              <span className="hidden md:block">•</span>
              <span>Unforgettable.</span>
            </div>
          </div>

          <div className="pt-8">
            <Button asChild size="lg" className="text-xl px-12 py-8 glow-red hover-scale">
              <Link to="/signup">Start Your Transformation</Link>
            </Button>
            <p className="mt-6 text-sm text-muted-foreground">
              Join the exclusive community of Bureau Boudoir creators
            </p>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-16 border-t border-border bg-background">
        <div className="container mx-auto px-6 text-center">
          <div className="mb-6">
            <p className="font-serif text-3xl font-bold text-primary text-glow-red mb-2">Bureau Boudoir</p>
            <p className="text-sm text-muted-foreground italic">The Art of Seduction</p>
          </div>
          <div className="space-y-2">
            <p className="text-xs text-muted-foreground">Amsterdam, Netherlands</p>
            <p className="text-xs text-muted-foreground">Where Real Creators Bloom</p>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default Home;
