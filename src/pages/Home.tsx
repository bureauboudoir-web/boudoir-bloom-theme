import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import Navigation from "@/components/Navigation";
import RoseJourneyTimeline from "@/components/RoseJourneyTimeline";
import ComparisonTable from "@/components/ComparisonTable";
import QAAccordion from "@/components/QAAccordion";
import StreetLampIcon from "@/components/StreetLampIcon";
import heroBg from "@/assets/hero-curtains-amsterdam.jpg";
import { Lightbulb, Camera, Megaphone, DollarSign, Crown, Gem, CheckCircle, Twitter, Instagram, Shield, Target, TrendingUp, Users, MapPin, Sparkles, HeadphonesIcon } from "lucide-react";
const Home = () => {
  const scrollToSection = (sectionId: string) => {
    const element = document.getElementById(sectionId);
    if (element) {
      element.scrollIntoView({
        behavior: 'smooth',
        block: 'start'
      });
    }
  };
  return <div className="min-h-screen bg-background text-foreground">
      <Navigation />
      
      {/* Section 1: Hero Banner */}
      <section className="relative min-h-screen flex items-center justify-center overflow-hidden" style={{
      backgroundImage: `linear-gradient(rgba(0, 0, 0, 0.65), rgba(0, 0, 0, 0.65)), url(${heroBg})`,
      backgroundSize: 'cover',
      backgroundPosition: 'center'
    }}>
        <div className="absolute inset-0 bg-gradient-to-b from-transparent via-primary/5 to-background" />
        <div className="container mx-auto px-6 text-center relative z-10 max-w-5xl">
          <h1 className="font-serif text-5xl font-bold mb-8 text-glow-red leading-tight md:text-7xl">
            Where Real Creators Become Iconic
          </h1>
          <p className="text-xl text-muted-foreground max-w-3xl mx-auto mb-12 leading-relaxed md:text-xl">
            A luxury creative agency  in heart of Amsterdam iconic district, guiding women in the art of presence, identity, and digital performance.
          </p>
          <Button asChild size="lg" className="glow-red bg-primary text-primary-foreground hover:bg-primary/90 px-8 py-6 text-lg">
            <Link to="/signup" className="mx-[240px]">Become a Creator</Link>
          </Button>
        </div>
      </section>

      {/* Section 2: Who We Are & How We Compare */}
      <section className="py-24 px-6 bg-secondary/30">
        <div className="container mx-auto max-w-6xl">
          <div className="grid md:grid-cols-2 gap-16 items-center">
            <div>
              <h2 className="font-serif text-5xl mb-6 text-primary">Who We Are</h2>
              <p className="text-lg text-muted-foreground mb-6 leading-relaxed">
                Bureau Boudoir is an exclusive creator management agency based in Amsterdam's iconic Red Light District. 
                We blend artistic vision with business intelligence to build sustainable creator careers.
              </p>
              <p className="text-lg text-muted-foreground mb-8 leading-relaxed">
                From professional photoshoots to AI-powered marketing, we handle everything so you can focus on being creative.
              </p>
              
              <h3 className="font-serif text-2xl mb-4 text-primary">How We Compare</h3>
              <div className="space-y-4 mb-6">
                <div className="flex items-start gap-3">
                  <Shield className="w-6 h-6 text-primary flex-shrink-0 mt-1" />
                  <div>
                    <p className="font-semibold text-foreground">Full-Service Management</p>
                    <p className="text-sm text-muted-foreground">Unlike solo creators, you get a complete team: photographers, marketers, and account managers.</p>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <Crown className="w-6 h-6 text-primary flex-shrink-0 mt-1" />
                  <div>
                    <p className="font-semibold text-foreground">Premium Positioning</p>
                    <p className="text-sm text-muted-foreground">We don't compete on price—we compete on quality, exclusivity, and creator success.</p>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <Target className="w-6 h-6 text-primary flex-shrink-0 mt-1" />
                  <div>
                    <p className="font-semibold text-foreground">Data-Driven Growth</p>
                    <p className="text-sm text-muted-foreground">AI-powered analytics and proven marketing strategies maximize your revenue potential.</p>
                  </div>
                </div>
              </div>
            </div>
            
            <Card className="p-8 bg-card border-primary/20 shadow-xl">
              <h3 className="font-serif text-3xl mb-6 text-center text-primary">Your Benefits</h3>
              <div className="space-y-6">
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center flex-shrink-0">
                    <Camera className="w-6 h-6 text-primary" />
                  </div>
                  <div>
                    <p className="font-semibold text-foreground">Professional Production</p>
                    <p className="text-sm text-muted-foreground">Studio shoots, editing, and content curation</p>
                  </div>
                </div>
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center flex-shrink-0">
                    <TrendingUp className="w-6 h-6 text-primary" />
                  </div>
                  <div>
                    <p className="font-semibold text-foreground">Revenue Optimization</p>
                    <p className="text-sm text-muted-foreground">Pricing strategy and upselling automation</p>
                  </div>
                </div>
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center flex-shrink-0">
                    <Users className="w-6 h-6 text-primary" />
                  </div>
                  <div>
                    <p className="font-semibold text-foreground">24/7 Support Team</p>
                    <p className="text-sm text-muted-foreground">Dedicated account manager and creative director</p>
                  </div>
                </div>
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center flex-shrink-0">
                    <MapPin className="w-6 h-6 text-primary" />
                  </div>
                  <div>
                    <p className="font-semibold text-foreground">Amsterdam Location</p>
                    <p className="text-sm text-muted-foreground">Iconic backdrop for authentic content</p>
                  </div>
                </div>
              </div>
            </Card>
          </div>
        </div>
      </section>

      {/* Section 3: What We Do */}
      <section className="py-32 px-6">
        <div className="container mx-auto max-w-5xl text-center">
          <p className="text-xl text-primary mb-4 font-medium">What We Do</p>
          <h2 className="font-serif text-5xl mb-8 text-foreground leading-tight">
            We Help Creators Build Profitable Personal Brands Through Professional Content & Smart Marketing
          </h2>
          
          <div className="grid md:grid-cols-2 gap-12 mt-16 text-left">
            <Card className="p-8 hover:shadow-xl transition-shadow">
              <div className="w-16 h-16 rounded-full bg-primary/10 flex items-center justify-center mb-6 mx-auto">
                <Sparkles className="w-8 h-8 text-primary" />
              </div>
              <h3 className="font-serif text-2xl mb-4 text-center text-primary">Our Vision</h3>
              <p className="text-muted-foreground leading-relaxed">
                To be the premier creator agency in Europe, setting the standard for luxury adult content creation. 
                We envision a world where creators are empowered with world-class tools, support, and opportunities 
                to build sustainable, fulfilling careers on their own terms.
              </p>
            </Card>
            
            <Card className="p-8 hover:shadow-xl transition-shadow">
              <div className="w-16 h-16 rounded-full bg-primary/10 flex items-center justify-center mb-6 mx-auto">
                <Target className="w-8 h-8 text-primary" />
              </div>
              <h3 className="font-serif text-2xl mb-4 text-center text-primary">Our Mission</h3>
              <p className="text-muted-foreground leading-relaxed">
                To transform creators into successful entrepreneurs by providing end-to-end support: from professional 
                content production in our Amsterdam studio to AI-driven marketing and personalized account management. 
                We handle the business so you can focus on creativity.
              </p>
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
          
          <div className="grid md:grid-cols-5 gap-6">
            {/* Planning */}
            <Card className="bg-card border-2 border-primary/30 hover:border-primary transition-all text-center p-6 hover:shadow-[0_0_20px_rgba(220,38,38,0.3)]">
              <div className="flex justify-center mb-4">
                <div className="w-14 h-14 rounded-full bg-primary/20 flex items-center justify-center">
                  <Lightbulb className="w-7 h-7 text-primary" />
                </div>
              </div>
              <h3 className="font-serif text-lg font-bold mb-2 text-primary">Planning</h3>
              <p className="text-sm text-muted-foreground">
                Persona development, boundaries, brand strategy, and market positioning.
              </p>
            </Card>

            {/* Production */}
            <Card className="bg-card border-2 border-primary/30 hover:border-primary transition-all text-center p-6 hover:shadow-[0_0_20px_rgba(220,38,38,0.3)]">
              <div className="flex justify-center mb-4">
                <div className="w-14 h-14 rounded-full bg-primary/20 flex items-center justify-center">
                  <Camera className="w-7 h-7 text-primary" />
                </div>
              </div>
              <h3 className="font-serif text-lg font-bold mb-2 text-primary">Production</h3>
              <p className="text-sm text-muted-foreground">
                Studio shoots, lighting, styling, posing, and high-end visual content.
              </p>
            </Card>

            {/* Marketing */}
            <Card className="bg-card border-2 border-primary/30 hover:border-primary transition-all text-center p-6 hover:shadow-[0_0_20px_rgba(220,38,38,0.3)]">
              <div className="flex justify-center mb-4">
                <div className="w-14 h-14 rounded-full bg-primary/20 flex items-center justify-center">
                  <Megaphone className="w-7 h-7 text-primary" />
                </div>
              </div>
              <h3 className="font-serif text-lg font-bold mb-2 text-primary">Marketing</h3>
              <p className="text-sm text-muted-foreground">
                Content strategy, storytelling, social hooks, and audience building.
              </p>
            </Card>

            {/* Sales */}
            <Card className="bg-card border-2 border-primary/30 hover:border-primary transition-all text-center p-6 hover:shadow-[0_0_20px_rgba(220,38,38,0.3)]">
              <div className="flex justify-center mb-4">
                <div className="w-14 h-14 rounded-full bg-primary/20 flex items-center justify-center">
                  <DollarSign className="w-7 h-7 text-primary" />
                </div>
              </div>
              <h3 className="font-serif text-lg font-bold mb-2 text-primary">Sales</h3>
              <p className="text-sm text-muted-foreground">
                PPV funnels, retention systems, scripts, and revenue optimization.
              </p>
            </Card>

            {/* Support */}
            <Card className="bg-card border-2 border-primary/30 hover:border-primary transition-all text-center p-6 hover:shadow-[0_0_20px_rgba(220,38,38,0.3)]">
              <div className="flex justify-center mb-4">
                <div className="w-14 h-14 rounded-full bg-primary/20 flex items-center justify-center">
                  <HeadphonesIcon className="w-7 h-7 text-primary" />
                </div>
              </div>
              <h3 className="font-serif text-lg font-bold mb-2 text-primary">Support</h3>
              <p className="text-sm text-muted-foreground">
                24/7 team access, analytics, guidance, and ongoing optimization.
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
              <Card className="bg-gradient-to-br from-secondary/50 to-secondary/20 border-2 border-primary/30 p-8 space-y-6">
                <div className="text-center mb-6">
                  <h3 className="font-serif text-2xl text-primary mb-2">Your Creator Dashboard</h3>
                  <p className="text-sm text-muted-foreground">
                    Everything organized in one professional platform
                  </p>
                </div>
                
                {/* Mock Dashboard UI */}
                <div className="space-y-4">
                  {/* Mock Stats Cards */}
                  <div className="grid grid-cols-3 gap-3">
                    <div className="bg-background/50 rounded-lg p-3 text-center border border-primary/20">
                      <div className="text-2xl font-bold text-primary">12</div>
                      <div className="text-xs text-muted-foreground">Active Shoots</div>
                    </div>
                    <div className="bg-background/50 rounded-lg p-3 text-center border border-primary/20">
                      <div className="text-2xl font-bold text-primary">8</div>
                      <div className="text-xs text-muted-foreground">Commitments</div>
                    </div>
                    <div className="bg-background/50 rounded-lg p-3 text-center border border-primary/20">
                      <div className="text-2xl font-bold text-primary">45</div>
                      <div className="text-xs text-muted-foreground">Content Pieces</div>
                    </div>
                  </div>
                  
                  {/* Mock Upload Area */}
                  <div className="bg-background/50 rounded-lg p-4 border-2 border-dashed border-primary/30">
                    <div className="flex items-center gap-3">
                      <Camera className="w-8 h-8 text-primary" />
                      <div className="flex-1">
                        <div className="text-sm font-semibold text-foreground">Content Upload</div>
                        <div className="text-xs text-muted-foreground">Drag & drop or click to upload</div>
                      </div>
                    </div>
                  </div>
                  
                  {/* Mock Commitment List */}
                  <div className="bg-background/50 rounded-lg p-4 border border-primary/20 space-y-2">
                    <div className="text-xs font-semibold text-foreground mb-2">This Week's Commitments</div>
                    <div className="flex items-center gap-2 text-xs">
                      <div className="w-2 h-2 rounded-full bg-primary"></div>
                      <span className="text-muted-foreground">Solo photo set - Red Light theme</span>
                    </div>
                    <div className="flex items-center gap-2 text-xs">
                      <div className="w-2 h-2 rounded-full bg-primary/50"></div>
                      <span className="text-muted-foreground">Story content - Behind the scenes</span>
                    </div>
                    <div className="flex items-center gap-2 text-xs">
                      <div className="w-2 h-2 rounded-full bg-primary/30"></div>
                      <span className="text-muted-foreground">PPV video - Amsterdam canal shoot</span>
                    </div>
                  </div>
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

      {/* Section 8: Q&A */}
      <QAAccordion />

      {/* Section 9: Final CTA - Ready to Begin */}
      <section className="py-32 bg-background">
        <div className="container mx-auto px-6 text-center max-w-4xl">
          <h2 className="font-serif text-4xl md:text-5xl mb-6 text-primary text-glow-red">
            Ready to Begin Your Journey?
          </h2>
          <p className="text-xl text-muted-foreground mb-10 max-w-2xl mx-auto leading-relaxed">
            Join a community of creators who've chosen clarity, artistry, and long-term growth 
            over shortcuts and noise. Let's build something extraordinary together.
          </p>
          <Button asChild size="lg" className="glow-red bg-primary text-primary-foreground hover:bg-primary/90 px-8 py-6 text-lg">
            <Link to="/signup">Apply Now</Link>
          </Button>
        </div>
      </section>

      {/* Section 10: Footer */}
      <footer className="border-t border-border py-12 px-6 bg-secondary/20">
        <div className="container mx-auto max-w-6xl">
          <div className="flex flex-col items-center gap-8">
            {/* Logo in Lamp Light */}
            <div className="flex flex-col items-center gap-4">
              <div className="relative">
                <StreetLampIcon className="w-16 h-16 opacity-80" />
                <div className="absolute -bottom-2 left-1/2 -translate-x-1/2 w-32 h-8 bg-primary/20 rounded-full blur-xl" />
              </div>
              <span className="font-serif text-2xl font-bold text-primary" style={{
              textShadow: '0 0 20px hsl(var(--glow-red)), 0 0 40px hsl(var(--glow-red) / 0.5)'
            }}>
                Bureau Boudoir
              </span>
            </div>

            {/* Horizontal Navigation */}
            <nav className="flex items-center gap-6 text-sm">
              <Link to="/" className="text-muted-foreground hover:text-primary transition-colors">
                About
              </Link>
              <span className="text-muted-foreground">•</span>
              <Link to="/contact" className="text-muted-foreground hover:text-primary transition-colors">
                Contact
              </Link>
              <span className="text-muted-foreground">•</span>
              <Link to="/terms" className="text-muted-foreground hover:text-primary transition-colors">
                Terms & Conditions
              </Link>
            </nav>

            {/* Social Icons */}
            <div className="flex gap-6">
              <a href="https://twitter.com" target="_blank" rel="noopener noreferrer" className="text-muted-foreground hover:text-primary transition-colors">
                <Twitter className="w-5 h-5" />
              </a>
              <a href="https://instagram.com" target="_blank" rel="noopener noreferrer" className="text-muted-foreground hover:text-primary transition-colors">
                <Instagram className="w-5 h-5" />
              </a>
            </div>

            {/* Copyright */}
            <p className="text-sm text-muted-foreground text-center">
              © 2024 Bureau Boudoir. All rights reserved.
            </p>
          </div>
        </div>
      </footer>
    </div>;
};
export default Home;