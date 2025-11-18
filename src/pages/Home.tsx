import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import Navigation from "@/components/Navigation";
import RedLightGlow from "@/components/RedLightGlow";
import HeroAnimation from "@/components/HeroAnimation";
import heroImage from "@/assets/hero-bg.jpg";
import { Lightbulb, FileText, Camera, Megaphone, DollarSign, Crown, Heart, BookOpen, Users, ShieldCheck, Gem } from "lucide-react";
const Home = () => {
  return <div className="min-h-screen bg-background text-foreground">
      <Navigation />
      
      {/* Hero Section */}
      <section className="relative min-h-screen flex items-center justify-center overflow-hidden" style={{
      backgroundImage: `linear-gradient(rgba(0, 0, 0, 0.8), rgba(0, 0, 0, 0.8)), url(${heroImage})`,
      backgroundSize: 'cover',
      backgroundPosition: 'center'
    }}>
        <HeroAnimation />
        <div className="absolute inset-0 bg-gradient-to-b from-transparent via-primary/5 to-background" />
        <div className="container mx-auto px-6 text-center relative z-10 max-w-5xl">
          <p className="font-serif text-2xl text-rose-gold mb-6 animate-fade-in text-yellow-600 md:text-5xl">
            Bureau Boudoir
          </p>
          <h1 className="font-serif text-5xl font-bold mb-8 text-glow-red leading-tight md:text-6xl">
            The Art of Seduction
          </h1>
          <p className="text-xl md:text-2xl text-muted-foreground max-w-3xl mx-auto mb-12 leading-relaxed">
            A premium creative house in Amsterdam where sensuality, strategy, and self-expression 
            merge into an irresistible online presence.
          </p>
          <Button asChild size="lg" className="text-lg px-10 py-7 bg-primary hover:bg-primary/90 glow-red">
            <Link to="/signup" className="text-xl">A premium creative agency in Amsterdam where sensuality, strategy, and self-expression merge into an irresistible online presence.</Link>
          </Button>
        </div>
      </section>

      {/* Introduction */}
      <section className="py-32 bg-background">
        <div className="container mx-auto px-6 max-w-4xl text-center">
          <h2 className="font-serif text-4xl md:text-5xl font-bold mb-12 text-rose-gold">
            Welcome to Bureau Boudoir
          </h2>
          <p className="text-xl text-foreground leading-relaxed mb-8">
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
                  <DollarSign className="w-8 h-8 text-rose-gold" />
                </div>
              </div>
              <h3 className="font-serif text-xl font-bold mb-2 text-rose-gold uppercase">Sale</h3>
              <p className="text-sm font-semibold mb-2 text-foreground">Convert Fans</p>
              <p className="text-xs text-muted-foreground leading-relaxed">
                Premium monetization
              </p>
            </Card>
          </div>
        </div>
      </section>

      <RedLightGlow />

      {/* Why Bureau Boudoir */}
      <section className="py-24 bg-background">
        <div className="container mx-auto px-6 max-w-5xl">
          <h2 className="font-serif text-4xl md:text-5xl font-bold text-center mb-16 text-rose-gold">
            Why Bureau Boudoir
          </h2>
          
          <div className="grid md:grid-cols-2 gap-8 max-w-4xl mx-auto">
            <Card className="bg-card border border-primary/20 p-8 hover:border-rose-gold transition-all group">
              <div className="mb-6">
                <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-primary/10 group-hover:bg-primary/20 transition-colors">
                  <Crown className="w-8 h-8 text-rose-gold" />
                </div>
              </div>
              <p className="text-lg text-foreground leading-relaxed">
                Bureau Boudoir gives creators a real brand to belong to
              </p>
            </Card>
            
            <Card className="bg-card border border-primary/20 p-8 hover:border-rose-gold transition-all group">
              <div className="mb-6">
                <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-primary/10 group-hover:bg-primary/20 transition-colors">
                  <Heart className="w-8 h-8 text-rose-gold" />
                </div>
              </div>
              <p className="text-lg text-foreground leading-relaxed">
                Crafting personas fans fall in love with
              </p>
            </Card>
            
            <Card className="bg-card border border-primary/20 p-8 hover:border-rose-gold transition-all group">
              <div className="mb-6">
                <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-primary/10 group-hover:bg-primary/20 transition-colors">
                  <BookOpen className="w-8 h-8 text-rose-gold" />
                </div>
              </div>
              <p className="text-lg text-foreground leading-relaxed">
                A compelling creator storyline that makes them unforgettable
              </p>
            </Card>
            
            <Card className="bg-card border border-primary/20 p-8 hover:border-rose-gold transition-all group">
              <div className="mb-6">
                <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-primary/10 group-hover:bg-primary/20 transition-colors">
                  <Users className="w-8 h-8 text-rose-gold" />
                </div>
              </div>
              <p className="text-lg text-foreground leading-relaxed">
                Full dedicated team handling operations*
              </p>
            </Card>
            
            <Card className="bg-card border border-primary/20 p-8 hover:border-rose-gold transition-all group">
              <div className="mb-6">
                <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-primary/10 group-hover:bg-primary/20 transition-colors">
                  <ShieldCheck className="w-8 h-8 text-rose-gold" />
                </div>
              </div>
              <p className="text-lg text-foreground leading-relaxed">
                We prioritise safety, autonomy, and respect
              </p>
            </Card>
            
            <Card className="bg-card border border-primary/20 p-8 hover:border-rose-gold transition-all group">
              <div className="mb-6">
                <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-primary/10 group-hover:bg-primary/20 transition-colors">
                  <Gem className="w-8 h-8 text-rose-gold" />
                </div>
              </div>
              <p className="text-lg text-foreground leading-relaxed">
                We work with carefully selected, high-quality creators
              </p>
            </Card>
          </div>
          
          <p className="text-center text-2xl md:text-3xl font-serif italic text-primary mt-16">
            "We see sensuality as strength"
          </p>
        </div>
      </section>

      <RedLightGlow />

      {/* What We Do - Detailed */}
      <section className="py-24 bg-secondary/50">
        <div className="container mx-auto px-6 max-w-4xl">
          <h2 className="font-serif text-4xl md:text-5xl font-bold text-center mb-16 text-rose-gold">
            What We Do
          </h2>
          
          <div className="space-y-6">
            <Card className="bg-card border border-primary/20 p-8 hover:border-rose-gold transition-all">
              <p className="text-lg text-foreground leading-relaxed">
                • Online positioning (Instagram, OnlyFans, premium platforms)
              </p>
            </Card>
            
            <Card className="bg-card border border-primary/20 p-8 hover:border-rose-gold transition-all">
              <p className="text-lg text-foreground leading-relaxed">
                • Content strategy & visual branding
              </p>
            </Card>
            
            <Card className="bg-card border border-primary/20 p-8 hover:border-rose-gold transition-all">
              <p className="text-lg text-foreground leading-relaxed">
                • Coaching in posture, presence & storytelling
              </p>
            </Card>
            
            <Card className="bg-card border border-primary/20 p-8 hover:border-rose-gold transition-all">
              <p className="text-lg text-foreground leading-relaxed">
                • Safety, boundaries & identity development
              </p>
            </Card>
            
            <Card className="bg-card border border-primary/20 p-8 hover:border-rose-gold transition-all">
              <p className="text-lg text-foreground leading-relaxed">
                • Long-term management & guidance
              </p>
            </Card>
          </div>
        </div>
      </section>

      <RedLightGlow />

      {/* Final CTA */}
      <section className="py-24 bg-background">
        <div className="container mx-auto px-6 max-w-4xl text-center">
          <h2 className="font-serif text-4xl md:text-5xl font-bold mb-8 text-rose-gold">
            Start Your Transformation
          </h2>
          
          <p className="text-xl md:text-2xl text-foreground mb-12 leading-relaxed max-w-2xl mx-auto">
            Join the exclusive community of Bureau Boudoir creators
          </p>

          <Button asChild size="lg" className="text-xl px-12 py-8 bg-primary hover:bg-primary/90 glow-red">
            <Link to="/signup">Begin Your Journey</Link>
          </Button>
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
    </div>;
};
export default Home;