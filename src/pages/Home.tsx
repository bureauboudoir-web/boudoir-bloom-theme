import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";
import { Sparkles, Users, TrendingUp, Lightbulb, FileText, Camera, Megaphone, MessageCircle } from "lucide-react";
import amsterdamNight from "@/assets/amsterdam-night.jpg";

const Home = () => {
  return (
    <div className="min-h-screen bg-black">
      {/* Navigation */}
      <nav className="fixed top-0 left-0 right-0 z-50 bg-black/80 backdrop-blur-sm border-b border-deep-red/20">
        <div className="container mx-auto px-6 py-4">
          <div className="flex items-center justify-end">
            <div className="flex gap-6">
              <Link to="/login" className="text-cream hover:text-gold transition-colors">
                Login
              </Link>
              <Link to="/signup">
                <Button variant="outline" className="border-gold text-gold hover:bg-gold hover:text-black">
                  Get Started
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="relative min-h-screen flex items-center justify-center overflow-hidden pt-20">
        {/* Amsterdam Background Image */}
        <div 
          className="absolute inset-0 bg-cover bg-center"
          style={{
            backgroundImage: `url(${amsterdamNight})`,
            filter: 'brightness(0.4)'
          }}
        />
        
        {/* Red Overlay */}
        <div className="absolute inset-0 bg-gradient-to-b from-deep-red/40 via-deep-red/20 to-black/90" />
        
        {/* Spotlight Glow */}
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] bg-gradient-radial from-deep-red/30 via-deep-red/10 to-transparent rounded-full blur-3xl pointer-events-none" />

        {/* Content */}
        <div className="relative z-10 text-center px-6 max-w-5xl mx-auto">
          <div className="mb-8 inline-block">
            <div className="h-px w-32 bg-gradient-to-r from-transparent via-gold to-transparent mb-8" />
          </div>
          
          <h1 className="font-serif text-6xl md:text-8xl font-bold text-cream mb-6 leading-tight">
            Where Real Creators<br />
            <span className="text-gold">Bloom</span>
          </h1>
          
          <p className="text-xl md:text-2xl text-cream/80 mb-4 max-w-3xl mx-auto leading-relaxed">
            Bureau Boudoir is a luxury creative house in Amsterdam.
          </p>
          <p className="text-lg md:text-xl text-cream/70 mb-12 max-w-3xl mx-auto">
            We transform ambitious women into unforgettable digital personalities — authentic, powerful, and in demand.
          </p>

          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link to="/signup">
              <Button 
                size="lg" 
                className="bg-transparent border-2 border-gold text-gold hover:bg-gold hover:text-black transition-all px-8 py-6 text-lg font-light"
              >
                Become a Creator
              </Button>
            </Link>
            <Button 
              size="lg" 
              variant="ghost"
              className="border-2 border-cream/30 text-cream hover:border-cream hover:bg-cream/10 px-8 py-6 text-lg font-light"
            >
              How It Works
            </Button>
          </div>

          <div className="mt-16 inline-block">
            <div className="h-px w-32 bg-gradient-to-r from-transparent via-gold to-transparent" />
          </div>
        </div>
      </section>

      {/* Why Work With Us */}
      <section className="py-24 px-6 relative">
        <div className="container mx-auto max-w-6xl">
          <h2 className="font-serif text-5xl md:text-6xl font-bold text-center text-cream mb-20">
            Why Work With Us
          </h2>

          <div className="grid md:grid-cols-3 gap-12">
            {/* Pillar 1 */}
            <div className="relative group">
              <div className="absolute inset-0 bg-gradient-radial from-deep-red/20 to-transparent rounded-lg blur-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
              <div className="relative p-8 space-y-4">
                <Sparkles className="w-12 h-12 text-gold mb-6" />
                <h3 className="font-serif text-2xl font-bold text-gold">
                  We Don't Outsource — We Build You
                </h3>
                <p className="text-cream/70 leading-relaxed">
                  No spam. No templates. We develop creators into characters the world wants to know, follow, and fall in love with. Your story, your energy, your identity — crafted properly.
                </p>
              </div>
            </div>

            {/* Pillar 2 */}
            <div className="relative group">
              <div className="absolute inset-0 bg-gradient-radial from-deep-red/20 to-transparent rounded-lg blur-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
              <div className="relative p-8 space-y-4">
                <Users className="w-12 h-12 text-gold mb-6" />
                <h3 className="font-serif text-2xl font-bold text-gold">
                  Inspired by Amsterdam's Creative Heart
                </h3>
                <p className="text-cream/70 leading-relaxed">
                  We take the iconic atmosphere of the Red Light District — the artistry, the light, the confidence — and turn it into a luxury brand identity for each creator.
                </p>
              </div>
            </div>

            {/* Pillar 3 */}
            <div className="relative group">
              <div className="absolute inset-0 bg-gradient-radial from-deep-red/20 to-transparent rounded-lg blur-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
              <div className="relative p-8 space-y-4">
                <TrendingUp className="w-12 h-12 text-gold mb-6" />
                <h3 className="font-serif text-2xl font-bold text-gold">
                  Full Growth Engine, Not Just Posts
                </h3>
                <p className="text-cream/70 leading-relaxed">
                  We don't "send content out." We build the entire ecosystem: persona, storyline, professional studio content, marketing strategy, sales systems, chat funnels, retention, high-ticket development.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Creator Journey */}
      <section className="py-24 px-6 relative">
        <div className="container mx-auto max-w-6xl">
          <h2 className="font-serif text-5xl md:text-6xl font-bold text-center text-cream mb-8">
            Your Journey
          </h2>
          <p className="text-center text-cream/70 text-xl mb-20 max-w-2xl mx-auto">
            From seed to full bloom — a transformation guided by expertise
          </p>

          {/* Journey Timeline */}
          <div className="relative">
            {/* Timeline Line */}
            <div className="absolute top-12 left-0 right-0 h-0.5 bg-gradient-to-r from-deep-red via-gold to-deep-red hidden md:block" />

            <div className="grid md:grid-cols-3 gap-12 relative">
              {/* Stage 1: Seed */}
              <div className="text-center">
                <div className="relative inline-block mb-6">
                  <div className="w-24 h-24 rounded-full bg-deep-red/20 border-2 border-gold flex items-center justify-center text-5xl backdrop-blur-sm">
                    🌱
                  </div>
                </div>
                <h3 className="font-serif text-2xl font-bold text-gold mb-4">Seed</h3>
                <p className="text-cream/70 leading-relaxed mb-4">Simple signup form</p>
                <ul className="text-cream/60 text-sm space-y-2">
                  <li>• Name, Email, Phone</li>
                  <li>• Experience level</li>
                  <li>• Initial consultation</li>
                </ul>
              </div>

              {/* Stage 2: Plant */}
              <div className="text-center">
                <div className="relative inline-block mb-6">
                  <div className="w-24 h-24 rounded-full bg-deep-red/30 border-2 border-gold flex items-center justify-center text-5xl backdrop-blur-sm glow-red">
                    🌿
                  </div>
                </div>
                <h3 className="font-serif text-2xl font-bold text-gold mb-4">Plant</h3>
                <p className="text-cream/70 leading-relaxed mb-4">Development & creation</p>
                <ul className="text-cream/60 text-sm space-y-2">
                  <li>• Creator dashboard access</li>
                  <li>• Persona development</li>
                  <li>• Story & character mapping</li>
                  <li>• Studio shoots</li>
                  <li>• Content bank creation</li>
                </ul>
              </div>

              {/* Stage 3: Bloom */}
              <div className="text-center">
                <div className="relative inline-block mb-6">
                  <div className="w-24 h-24 rounded-full bg-deep-red/40 border-2 border-gold flex items-center justify-center text-5xl backdrop-blur-sm glow-red">
                    🌹
                  </div>
                </div>
                <h3 className="font-serif text-2xl font-bold text-gold mb-4">Bloom</h3>
                <p className="text-cream/70 leading-relaxed mb-4">Full ecosystem live</p>
                <ul className="text-cream/60 text-sm space-y-2">
                  <li>• Marketing funnels</li>
                  <li>• Sales systems</li>
                  <li>• Chat team support</li>
                  <li>• Retention flows</li>
                  <li>• High-ticket offers</li>
                </ul>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Our Process - 5 Boxes */}
      <section className="py-24 px-6 relative">
        <div className="container mx-auto max-w-7xl">
          <h2 className="font-serif text-5xl md:text-6xl font-bold text-center text-cream mb-8">
            Our Process
          </h2>
          <p className="text-center text-cream/70 text-xl mb-20 max-w-2xl mx-auto">
            Five pillars of transformation
          </p>

          <div className="grid md:grid-cols-5 gap-6">
            {/* Plan */}
            <div className="group relative overflow-hidden rounded-lg border border-deep-red/30 bg-card p-8 hover:border-gold transition-all duration-300">
              <div className="absolute inset-0 bg-gradient-radial from-deep-red/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
              <div className="relative z-10">
                <Lightbulb className="w-12 h-12 text-gold mb-6" />
                <h3 className="font-serif text-2xl font-bold text-cream mb-4">Plan</h3>
                <p className="text-cream/70 text-sm leading-relaxed">
                  Strategy, persona design, content themes, and growth roadmap
                </p>
              </div>
            </div>

            {/* Editorial */}
            <div className="group relative overflow-hidden rounded-lg border border-deep-red/30 bg-card p-8 hover:border-gold transition-all duration-300">
              <div className="absolute inset-0 bg-gradient-radial from-deep-red/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
              <div className="relative z-10">
                <FileText className="w-12 h-12 text-gold mb-6" />
                <h3 className="font-serif text-2xl font-bold text-cream mb-4">Editorial</h3>
                <p className="text-cream/70 text-sm leading-relaxed">
                  Story development, scripts, messaging frameworks
                </p>
              </div>
            </div>

            {/* Studio */}
            <div className="group relative overflow-hidden rounded-lg border border-deep-red/30 bg-card p-8 hover:border-gold transition-all duration-300">
              <div className="absolute inset-0 bg-gradient-radial from-deep-red/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
              <div className="relative z-10">
                <Camera className="w-12 h-12 text-gold mb-6" />
                <h3 className="font-serif text-2xl font-bold text-cream mb-4">Studio</h3>
                <p className="text-cream/70 text-sm leading-relaxed">
                  Professional photo and video shoots, content bank
                </p>
              </div>
            </div>

            {/* Marketing */}
            <div className="group relative overflow-hidden rounded-lg border border-deep-red/30 bg-card p-8 hover:border-gold transition-all duration-300">
              <div className="absolute inset-0 bg-gradient-radial from-deep-red/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
              <div className="relative z-10">
                <Megaphone className="w-12 h-12 text-gold mb-6" />
                <h3 className="font-serif text-2xl font-bold text-cream mb-4">Marketing</h3>
                <p className="text-cream/70 text-sm leading-relaxed">
                  Social hooks, funnels, posting strategy, optimization
                </p>
              </div>
            </div>

            {/* Sales */}
            <div className="group relative overflow-hidden rounded-lg border border-deep-red/30 bg-card p-8 hover:border-gold transition-all duration-300">
              <div className="absolute inset-0 bg-gradient-radial from-deep-red/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
              <div className="relative z-10">
                <MessageCircle className="w-12 h-12 text-gold mb-6" />
                <h3 className="font-serif text-2xl font-bold text-cream mb-4">Sales</h3>
                <p className="text-cream/70 text-sm leading-relaxed">
                  PPV, retention, chat support, high-ticket offers
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Final CTA */}
      <section className="py-32 px-6 relative">
        <div className="absolute inset-0 bg-gradient-radial from-deep-red/20 via-transparent to-transparent" />
        <div className="container mx-auto max-w-4xl text-center relative z-10">
          <h2 className="font-serif text-5xl md:text-7xl font-bold text-cream mb-8 leading-tight">
            Ready to Transform?
          </h2>
          <p className="text-xl md:text-2xl text-cream/80 mb-12 max-w-2xl mx-auto leading-relaxed">
            Join the creators who chose craft over content, and presence over posts.
          </p>
          <Link to="/signup">
            <Button 
              size="lg" 
              className="bg-transparent border-2 border-gold text-gold hover:bg-gold hover:text-black transition-all px-12 py-8 text-xl font-light"
            >
              Begin Your Journey
            </Button>
          </Link>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-deep-red/20 py-12 px-6">
        <div className="container mx-auto max-w-7xl">
          <div className="flex flex-col md:flex-row justify-between items-center gap-6">
            <p className="text-cream/60 text-sm">
              © 2024 Bureau Boudoir. Amsterdam's luxury creative house.
            </p>
            <div className="flex gap-6 text-sm text-cream/60">
              <a href="#" className="hover:text-gold transition-colors">Privacy</a>
              <a href="#" className="hover:text-gold transition-colors">Terms</a>
              <a href="#" className="hover:text-gold transition-colors">Contact</a>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default Home;
