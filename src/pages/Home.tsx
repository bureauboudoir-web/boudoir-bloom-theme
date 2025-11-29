import { Link } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import Navigation from "@/components/Navigation";
import RoseJourneyTimeline from "@/components/RoseJourneyTimeline";
import ComparisonTable from "@/components/ComparisonTable";
import QAAccordion from "@/components/QAAccordion";
import StreetLampIcon from "@/components/StreetLampIcon";
import heroBg from "@/assets/hero-curtains-amsterdam.jpg";
import { Lightbulb, Camera, Megaphone, DollarSign, Crown, Gem, CheckCircle, Twitter, Instagram, Shield, Target, TrendingUp, Users, MapPin, Sparkles, HeadphonesIcon, Eye, Upload } from "lucide-react";
import { SharedFooter } from "@/components/SharedFooter";

const Home = () => {
  const { t } = useTranslation();
  
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
      backgroundImage: `linear-gradient(rgba(0, 0, 0, 0.50), rgba(0, 0, 0, 0.50)), url(${heroBg})`,
      backgroundSize: 'cover',
      backgroundPosition: 'center'
    }}>
        <div className="absolute inset-0 bg-gradient-to-b from-transparent via-primary/5 to-background" />
        <div className="container mx-auto px-6 text-center relative z-10 max-w-5xl">
          <h1 className="font-serif text-5xl font-bold mb-8 leading-tight text-[#d1ae94] md:text-5xl">
            {t('homepage.hero.title')}
          </h1>
          <p className="text-xl text-muted-foreground max-w-3xl mx-auto mb-12 leading-relaxed md:text-xl">
            {t('homepage.hero.subtitle')}
          </p>
          <Button asChild size="default" className="glow-red bg-primary text-primary-foreground hover:bg-[#d1ae94] rounded-full px-6 inline-flex">
            <Link to="/signup">{t('homepage.hero.cta')}</Link>
          </Button>
        </div>
      </section>

      {/* Section 2: Who We Are & How We Compare */}
      <section className="py-20 px-4 sm:px-6 bg-secondary/30">
        <div className="container mx-auto max-w-6xl">
          <div className="grid md:grid-cols-2 gap-8 sm:gap-12 items-start">
            <div>
              <h2 className="font-serif text-4xl md:text-5xl mb-8 text-[#d1ae94]">{t('homepage.whoWeAre.title')}</h2>
              <p className="text-lg text-muted-foreground mb-6 leading-relaxed">
                {t('homepage.whoWeAre.para1')}
              </p>
              <p className="text-lg text-muted-foreground mb-12 leading-relaxed">
                {t('homepage.whoWeAre.para2')}
              </p>
            </div>
            
            <Card className="p-8 bg-card border-2 border-primary/40 hover:border-rose-gold transition-all rounded-xl shadow-xl">
              <h3 className="font-serif text-2xl sm:text-3xl mb-8 text-center text-primary">{t('homepage.whoWeAre.benefits.title')}</h3>
              <div className="space-y-6">
                <div className="flex items-center gap-4">
                  <div className="w-14 h-14 rounded-full bg-rose-gold/10 flex items-center justify-center flex-shrink-0 border-2 border-primary/40">
                    <Camera className="w-7 h-7 text-rose-gold" />
                  </div>
                  <div>
                    <p className="font-semibold text-foreground">{t('homepage.whoWeAre.benefits.production.title')}</p>
                    <p className="text-sm text-muted-foreground">{t('homepage.whoWeAre.benefits.production.description')}</p>
                  </div>
                </div>
                <div className="flex items-center gap-4">
                  <div className="w-14 h-14 rounded-full bg-rose-gold/10 flex items-center justify-center flex-shrink-0 border-2 border-primary/40">
                    <TrendingUp className="w-7 h-7 text-rose-gold" />
                  </div>
                  <div>
                    <p className="font-semibold text-foreground">{t('homepage.whoWeAre.benefits.revenue.title')}</p>
                    <p className="text-sm text-muted-foreground">{t('homepage.whoWeAre.benefits.revenue.description')}</p>
                  </div>
                </div>
                <div className="flex items-center gap-4">
                  <div className="w-14 h-14 rounded-full bg-rose-gold/10 flex items-center justify-center flex-shrink-0 border-2 border-primary/40">
                    <Users className="w-7 h-7 text-rose-gold" />
                  </div>
                  <div>
                    <p className="font-semibold text-foreground">{t('homepage.whoWeAre.benefits.support.title')}</p>
                    <p className="text-sm text-muted-foreground">{t('homepage.whoWeAre.benefits.support.description')}</p>
                  </div>
                </div>
                <div className="flex items-center gap-4">
                  <div className="w-14 h-14 rounded-full bg-rose-gold/10 flex items-center justify-center flex-shrink-0 border-2 border-primary/40">
                    <MapPin className="w-7 h-7 text-rose-gold" />
                  </div>
                  <div>
                    <p className="font-semibold text-foreground">{t('homepage.whoWeAre.benefits.location.title')}</p>
                    <p className="text-sm text-muted-foreground">{t('homepage.whoWeAre.benefits.location.description')}</p>
                  </div>
                </div>
              </div>
            </Card>
          </div>
        </div>
      </section>

      {/* Section 3: What We Do */}
      <section className="py-20 px-4 sm:px-6">
        <div className="container mx-auto max-w-5xl text-center">
          <p className="text-sm text-[#d1ae94] mb-4 font-medium">{t('homepage.whatWeDo.label')}</p>
          <h2 className="font-serif mb-6 sm:mb-8 text-[#d1ae94] leading-tight text-2xl sm:text-3xl md:text-4xl">
            {t('homepage.whatWeDo.title')}
          </h2>
          
          <div className="grid md:grid-cols-2 gap-12 mt-16 text-left">
            <Card className="p-8 border-2 border-primary/40 hover:border-rose-gold transition-all rounded-xl hover:shadow-xl">
              <div className="w-16 h-16 rounded-full bg-rose-gold/10 flex items-center justify-center mb-6 mx-auto border-2 border-primary/40">
                <Sparkles className="w-8 h-8 text-rose-gold" />
              </div>
              <h3 className="font-serif text-2xl mb-4 text-center text-rose-gold">{t('homepage.whatWeDo.vision.title')}</h3>
              <p className="text-muted-foreground leading-relaxed">
                {t('homepage.whatWeDo.vision.description')}
              </p>
            </Card>
            
            <Card className="p-8 border-2 border-primary/40 hover:border-rose-gold transition-all rounded-xl hover:shadow-xl">
              <div className="w-16 h-16 rounded-full bg-rose-gold/10 flex items-center justify-center mb-6 mx-auto border-2 border-primary/40">
                <Target className="w-8 h-8 text-rose-gold" />
              </div>
              <h3 className="font-serif text-2xl mb-4 text-center text-rose-gold">{t('homepage.whatWeDo.mission.title')}</h3>
              <p className="text-muted-foreground leading-relaxed">
                {t('homepage.whatWeDo.mission.description')}
              </p>
            </Card>
          </div>
        </div>
      </section>

      {/* Section 4: Our Creator Services */}
      <section className="py-20 bg-background">
        <div className="container mx-auto px-4 sm:px-6 max-w-6xl">
          <h2 className="font-serif text-3xl sm:text-4xl md:text-5xl text-center mb-12 sm:mb-16 text-[#d1ae94]">
            {t('homepage.services.title')}
          </h2>
          
          <div className="grid md:grid-cols-2 gap-12 items-center">
            {/* Left: Main Content */}
            <div className="space-y-8">
              <p className="text-xl text-muted-foreground leading-relaxed font-light">
                {t('homepage.services.intro')}
              </p>
              
              <div className="space-y-5">
                <div className="flex gap-3 items-start">
                  <CheckCircle className="w-5 h-5 text-rose-gold flex-shrink-0 mt-0.5" />
                  <p className="text-base text-foreground">{t('homepage.services.list.brandStrategy')}</p>
                </div>
                
                <div className="flex gap-3 items-start">
                  <CheckCircle className="w-5 h-5 text-rose-gold flex-shrink-0 mt-0.5" />
                  <p className="text-base text-foreground">{t('homepage.services.list.studioShoots')}</p>
                </div>
                
                <div className="flex gap-3 items-start">
                  <CheckCircle className="w-5 h-5 text-rose-gold flex-shrink-0 mt-0.5" />
                  <p className="text-base text-foreground">{t('homepage.services.list.marketing')}</p>
                </div>
                
                <div className="flex gap-3 items-start">
                  <CheckCircle className="w-5 h-5 text-rose-gold flex-shrink-0 mt-0.5" />
                  <p className="text-base text-foreground">{t('homepage.services.list.support')}</p>
                </div>
              </div>
              
              <Button asChild size="default" className="bg-primary text-primary-foreground hover:bg-[#d1ae94] rounded-full mt-4 px-6 inline-flex">
                <Link to="/signup">{t('homepage.services.cta')}</Link>
              </Button>
            </div>
            
            {/* Right: Service Cards */}
            <div className="grid grid-cols-1 gap-4">
              {/* Planning */}
              <Card className="bg-card border-2 border-primary/40 hover:border-rose-gold transition-all p-6 rounded-xl hover:shadow-[0_0_20px_rgba(209,174,148,0.3)]">
                <div className="flex items-start gap-4">
                  <div className="flex-shrink-0 w-14 h-14 rounded-full bg-rose-gold/10 flex items-center justify-center border-2 border-primary/40">
                    <Lightbulb className="w-7 h-7 text-rose-gold" />
                  </div>
                  <div>
                    <h3 className="font-serif text-lg font-bold mb-1 text-primary">{t('homepage.services.planning.title')}</h3>
                    <p className="text-sm text-muted-foreground">
                      {t('homepage.services.planning.description')}
                    </p>
                  </div>
                </div>
              </Card>

              {/* Production */}
              <Card className="bg-card border-2 border-primary/40 hover:border-rose-gold transition-all p-6 rounded-xl hover:shadow-[0_0_20px_rgba(209,174,148,0.3)]">
                <div className="flex items-start gap-4">
                  <div className="flex-shrink-0 w-14 h-14 rounded-full bg-rose-gold/10 flex items-center justify-center border-2 border-primary/40">
                    <Camera className="w-7 h-7 text-rose-gold" />
                  </div>
                  <div>
                    <h3 className="font-serif text-lg font-bold mb-1 text-primary">{t('homepage.services.production.title')}</h3>
                    <p className="text-sm text-muted-foreground">
                      {t('homepage.services.production.description')}
                    </p>
                  </div>
                </div>
              </Card>

              {/* Marketing */}
              <Card className="bg-card border-2 border-primary/40 hover:border-rose-gold transition-all p-6 rounded-xl hover:shadow-[0_0_20px_rgba(209,174,148,0.3)]">
                <div className="flex items-start gap-4">
                  <div className="flex-shrink-0 w-14 h-14 rounded-full bg-rose-gold/10 flex items-center justify-center border-2 border-primary/40">
                    <Megaphone className="w-7 h-7 text-rose-gold" />
                  </div>
                  <div>
                    <h3 className="font-serif text-lg font-bold mb-1 text-primary">{t('homepage.services.marketing.title')}</h3>
                    <p className="text-sm text-muted-foreground">
                      {t('homepage.services.marketing.description')}
                    </p>
                  </div>
                </div>
              </Card>

              {/* Support */}
              <Card className="bg-card border-2 border-primary/40 hover:border-rose-gold transition-all p-6 rounded-xl hover:shadow-[0_0_20px_rgba(209,174,148,0.3)]">
                <div className="flex items-start gap-4">
                  <div className="flex-shrink-0 w-14 h-14 rounded-full bg-rose-gold/10 flex items-center justify-center border-2 border-primary/40">
                    <HeadphonesIcon className="w-7 h-7 text-rose-gold" />
                  </div>
                  <div>
                    <h3 className="font-serif text-lg font-bold mb-1 text-primary">{t('homepage.services.supportCard.title')}</h3>
                    <p className="text-sm text-muted-foreground">
                      <span className="font-bold text-[#d1ae94]">{t('homepage.services.supportCard.emphasis')}</span> {t('homepage.services.supportCard.description')}
                    </p>
                  </div>
                </div>
              </Card>
            </div>
          </div>
        </div>
      </section>

      {/* Section 5: What Makes Us Different */}
      <section className="py-20 bg-secondary/20">
        <div className="container mx-auto px-6 max-w-6xl">
          <h2 className="font-serif text-4xl md:text-5xl text-center mb-16 text-[#d1ae94]">
            {t('homepage.different.title')}
          </h2>

          <div className="grid md:grid-cols-3 gap-8">
            <Card className="bg-card border-2 border-primary/40 hover:border-rose-gold transition-all rounded-xl">
              <CardContent className="p-8 text-center">
                <div className="flex justify-center mb-6">
                  <div className="w-16 h-16 rounded-full bg-rose-gold/10 flex items-center justify-center border-2 border-primary/40">
                    <Crown className="w-8 h-8 text-rose-gold" />
                  </div>
                </div>
                <h3 className="font-serif text-2xl font-bold mb-4 text-rose-gold">
                  {t('homepage.different.brand.title')}
                </h3>
                <p className="text-muted-foreground leading-relaxed">
                  {t('homepage.different.brand.description')}
                </p>
              </CardContent>
            </Card>

            <Card className="bg-card border-2 border-primary/40 hover:border-rose-gold transition-all rounded-xl">
              <CardContent className="p-8 text-center">
                <div className="flex justify-center mb-6">
                  <div className="w-16 h-16 rounded-full bg-rose-gold/10 flex items-center justify-center border-2 border-primary/40">
                    <Camera className="w-8 h-8 text-rose-gold" />
                  </div>
                </div>
                <h3 className="font-serif text-2xl font-bold mb-4 text-rose-gold">
                  {t('homepage.different.content.title')}
                </h3>
                <p className="text-muted-foreground leading-relaxed">
                  {t('homepage.different.content.description')}
                </p>
              </CardContent>
            </Card>

            <Card className="bg-card border-2 border-primary/40 hover:border-rose-gold transition-all rounded-xl">
              <CardContent className="p-8 text-center">
                <div className="flex justify-center mb-6">
                  <div className="w-16 h-16 rounded-full bg-rose-gold/10 flex items-center justify-center border-2 border-primary/40">
                    <Gem className="w-8 h-8 text-rose-gold" />
                  </div>
                </div>
                <h3 className="font-serif text-2xl font-bold mb-4 text-rose-gold">
                  {t('homepage.different.marketingMachine.title')}
                </h3>
                <p className="text-muted-foreground leading-relaxed">
                  {t('homepage.different.marketingMachine.description')}
                </p>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* Section 6: Support & Management */}
      <section className="py-20 bg-background">
        <div className="container mx-auto px-6 max-w-6xl">
          <h2 className="font-serif text-4xl md:text-5xl text-center mb-16 text-[#d1ae94]">
            {t('homepage.management.title')}
          </h2>

          <div className="grid md:grid-cols-2 gap-12 items-center">
            {/* Left: Dashboard Mockup with Browser Frame */}
            <div>
              {/* Browser Chrome - Mac Style */}
              <div className="bg-gray-800 rounded-t-xl px-4 py-3 flex items-center gap-3 shadow-lg">
                <div className="flex gap-2">
                  <div className="w-3 h-3 rounded-full bg-[#ff5f57]"></div>
                  <div className="w-3 h-3 rounded-full bg-[#ffbd2e]"></div>
                  <div className="w-3 h-3 rounded-full bg-[#28ca42]"></div>
                </div>
                <div className="flex-1 bg-gray-700 rounded px-4 py-1.5 text-xs text-gray-300 font-mono">
                  dashboard.bureaububoir.com
                </div>
              </div>
              
              <Card className="bg-gradient-to-br from-secondary/50 to-secondary/20 border-2 border-primary/40 p-8 space-y-6 rounded-t-none border-t-0">
                <div className="text-center mb-6">
                  <h3 className="font-serif text-2xl text-[#d1ae94] mb-2">{t('homepage.management.dashboard.title')}</h3>
                  <p className="text-sm text-muted-foreground">
                    {t('homepage.management.dashboard.subtitle')}
                  </p>
                </div>
                
                {/* Mock Dashboard UI */}
                <div className="space-y-4">
                  {/* Mock Stats Cards */}
                  <div className="grid grid-cols-3 gap-3">
                    <div className="bg-background/50 rounded-lg p-3 text-center border-2 border-primary/40">
                      <div className="text-2xl font-bold text-rose-gold">12</div>
                      <div className="text-xs text-muted-foreground">{t('homepage.management.dashboard.stats.shoots')}</div>
                    </div>
                    <div className="bg-background/50 rounded-lg p-3 text-center border-2 border-primary/40">
                      <div className="text-2xl font-bold text-rose-gold">8</div>
                      <div className="text-xs text-muted-foreground">{t('homepage.management.dashboard.stats.commitments')}</div>
                    </div>
                    <div className="bg-background/50 rounded-lg p-3 text-center border-2 border-primary/40">
                      <div className="text-2xl font-bold text-rose-gold">45</div>
                      <div className="text-xs text-muted-foreground">{t('homepage.management.dashboard.stats.content')}</div>
                    </div>
                  </div>
                  
                  {/* Mock Upload Area */}
                  <div className="bg-background/50 rounded-lg p-4 border-2 border-dashed border-primary/40">
                    <div className="flex items-center gap-3">
                      <Upload className="w-8 h-8 text-rose-gold" />
                      <div className="flex-1">
                        <div className="text-sm font-semibold text-rose-gold">{t('homepage.management.dashboard.upload.title')}</div>
                        <div className="text-xs text-muted-foreground">{t('homepage.management.dashboard.upload.subtitle')}</div>
                      </div>
                    </div>
                  </div>
                  
                  {/* Mock Commitment List */}
                  <div className="bg-background/50 rounded-lg p-4 border-2 border-primary/40 space-y-2">
                    <div className="text-xs font-semibold text-foreground mb-2">{t('homepage.management.dashboard.weeklyCommitments')}</div>
                    <div className="flex items-center gap-2 text-xs">
                      <div className="w-2 h-2 rounded-full bg-primary"></div>
                      <span className="text-muted-foreground">{t('homepage.management.dashboard.mockItem1')}</span>
                    </div>
                    <div className="flex items-center gap-2 text-xs">
                      <div className="w-2 h-2 rounded-full bg-primary/50"></div>
                      <span className="text-muted-foreground">{t('homepage.management.dashboard.mockItem2')}</span>
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
                  <h4 className="text-lg font-semibold text-foreground mb-1">{t('homepage.management.features.commitments.title')}</h4>
                  <p className="text-muted-foreground">{t('homepage.management.features.commitments.description')}</p>
                </div>
              </div>

              <div className="flex items-start gap-4">
                <CheckCircle className="w-6 h-6 text-rose-gold flex-shrink-0 mt-1" />
                <div>
                  <h4 className="text-lg font-semibold text-foreground mb-1">{t('homepage.management.features.organized.title')}</h4>
                  <p className="text-muted-foreground">{t('homepage.management.features.organized.description')}</p>
                </div>
              </div>

              <div className="flex items-start gap-4">
                <CheckCircle className="w-6 h-6 text-rose-gold flex-shrink-0 mt-1" />
                <div>
                  <h4 className="text-lg font-semibold text-foreground mb-1">{t('homepage.management.features.manager.title')}</h4>
                  <p className="text-muted-foreground">{t('homepage.management.features.manager.description')}</p>
                </div>
              </div>

              <div className="flex items-start gap-4">
                <CheckCircle className="w-6 h-6 text-rose-gold flex-shrink-0 mt-1" />
                <div>
                  <h4 className="text-lg font-semibold text-foreground mb-1">{t('homepage.management.features.growth.title')}</h4>
                  <p className="text-muted-foreground">{t('homepage.management.features.growth.description')}</p>
                </div>
              </div>

              <div className="flex items-start gap-4">
                <CheckCircle className="w-6 h-6 text-rose-gold flex-shrink-0 mt-1" />
                <div>
                  <h4 className="text-lg font-semibold text-foreground mb-1">{t('homepage.management.features.privacy.title')}</h4>
                  <p className="text-muted-foreground">{t('homepage.management.features.privacy.description')}</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Section 7: Rose Journey Timeline */}
      <RoseJourneyTimeline />

      {/* Section 8: Newsletter */}
      <section className="py-20 bg-secondary/30">
        <div className="container mx-auto px-6 max-w-4xl text-center">
          <h2 className="font-serif text-4xl md:text-5xl mb-6 text-[#d1ae94]">
            {t('homepage.newsletter.title')}
          </h2>
          <p className="text-lg text-muted-foreground mb-8 max-w-2xl mx-auto">
            {t('homepage.newsletter.description')}
          </p>
          <form className="flex flex-col sm:flex-row gap-4 max-w-md mx-auto">
            <input type="email" placeholder={t('homepage.newsletter.placeholder')} className="flex-1 px-4 py-2.5 rounded-full bg-background border-2 border-primary/40 focus:border-rose-gold focus:outline-none focus:ring-2 focus:ring-rose-gold/20 text-foreground" required />
            <Button type="submit" size="default" className="glow-red bg-primary text-primary-foreground hover:bg-[#d1ae94] rounded-full px-6 sm:w-auto">
              {t('homepage.newsletter.button')}
            </Button>
          </form>
          <p className="text-xs text-muted-foreground mt-4">
            {t('homepage.newsletter.privacy')}
          </p>
        </div>
      </section>

      {/* Section 9: Q&A */}
      <QAAccordion />

      {/* Section 10: Final CTA - Ready to Begin */}
      <section className="py-20 bg-background">
        <div className="container mx-auto px-6 text-center max-w-4xl">
          <h2 className="font-serif text-4xl md:text-5xl mb-6 text-[#d1ae94]">
            {t('homepage.finalCta.title')}
          </h2>
          <p className="text-xl text-muted-foreground mb-10 max-w-2xl mx-auto leading-relaxed">
            {t('homepage.finalCta.description')}
          </p>
          <Button asChild size="default" className="glow-red bg-primary text-primary-foreground hover:bg-[#d1ae94] rounded-full px-6 inline-flex">
            <Link to="/signup">{t('homepage.finalCta.button')}</Link>
          </Button>
        </div>
      </section>

      <SharedFooter />
    </div>;
};

export default Home;
