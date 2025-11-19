import { PageContainer } from "@/components/PageContainer";
import { Camera, Video, TrendingUp, Heart } from "lucide-react";

const About = () => {
  return (
    <PageContainer>
      {/* Hero Section */}
      <section className="container mx-auto px-6 py-24 text-center">
        <h1 className="text-4xl md:text-5xl font-bold text-[#d1ae94] mb-6">
          About Bureau Boudoir
        </h1>
        <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
          Elevating Amsterdam creators through professional content management and strategic marketing
        </p>
      </section>

      {/* Brand Story Section */}
      <section className="container mx-auto px-6 py-24 max-w-4xl">
        <h2 className="text-3xl font-bold text-[#d1ae94] mb-8 text-center">Our Story</h2>
        <div className="space-y-6 text-muted-foreground text-lg leading-relaxed">
          <p>
            Born in the heart of Amsterdam's iconic Red Light District, Bureau Boudoir emerged from a simple vision: to transform the way creators approach their content business.
          </p>
          <p>
            We recognized that talented creators were spending countless hours on production, marketing, and business operations—time that could be better spent on what they do best: creating.
          </p>
          <p>
            Today, Bureau Boudoir stands as Amsterdam's premier content management agency, bringing together creative excellence, professional production standards, and strategic marketing expertise.
          </p>
        </div>
      </section>

      {/* What We Do Section */}
      <section className="container mx-auto px-6 py-24">
        <h2 className="text-3xl font-bold text-[#d1ae94] mb-12 text-center">What We Do</h2>
        <div className="grid md:grid-cols-3 gap-8 max-w-5xl mx-auto">
          <div className="text-center space-y-4">
            <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-secondary/20 border border-[#d1ae94]/30">
              <Camera className="w-8 h-8 text-[#d1ae94]" />
            </div>
            <h3 className="text-xl font-bold text-[#d1ae94]">Content Planning</h3>
            <p className="text-muted-foreground">
              Strategic content calendars, shoot planning, and creative direction tailored to your unique style and audience.
            </p>
          </div>

          <div className="text-center space-y-4">
            <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-secondary/20 border border-[#d1ae94]/30">
              <Video className="w-8 h-8 text-[#d1ae94]" />
            </div>
            <h3 className="text-xl font-bold text-[#d1ae94]">Professional Production</h3>
            <p className="text-muted-foreground">
              Studio-quality photo and video production with experienced teams who understand luxury content creation.
            </p>
          </div>

          <div className="text-center space-y-4">
            <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-secondary/20 border border-[#d1ae94]/30">
              <TrendingUp className="w-8 h-8 text-[#d1ae94]" />
            </div>
            <h3 className="text-xl font-bold text-[#d1ae94]">Strategic Marketing</h3>
            <p className="text-muted-foreground">
              Data-driven marketing strategies, platform optimization, and growth tactics that maximize your reach and revenue.
            </p>
          </div>
        </div>
      </section>

      {/* Values Section */}
      <section className="container mx-auto px-6 py-24 max-w-4xl">
        <h2 className="text-3xl font-bold text-[#d1ae94] mb-12 text-center">Our Values</h2>
        <div className="space-y-8">
          <div className="flex gap-4">
            <Heart className="w-6 h-6 text-[#d1ae94] flex-shrink-0 mt-1" />
            <div>
              <h3 className="text-xl font-bold text-foreground mb-2">Professionalism</h3>
              <p className="text-muted-foreground">
                We bring industry-leading standards to every aspect of content creation and management.
              </p>
            </div>
          </div>

          <div className="flex gap-4">
            <Heart className="w-6 h-6 text-[#d1ae94] flex-shrink-0 mt-1" />
            <div>
              <h3 className="text-xl font-bold text-foreground mb-2">Creativity</h3>
              <p className="text-muted-foreground">
                Your unique voice and vision are at the center of everything we do.
              </p>
            </div>
          </div>

          <div className="flex gap-4">
            <Heart className="w-6 h-6 text-[#d1ae94] flex-shrink-0 mt-1" />
            <div>
              <h3 className="text-xl font-bold text-foreground mb-2">Support</h3>
              <p className="text-muted-foreground">
                24/7 access to our team ensures you always have the guidance and resources you need.
              </p>
            </div>
          </div>

          <div className="flex gap-4">
            <Heart className="w-6 h-6 text-[#d1ae94] flex-shrink-0 mt-1" />
            <div>
              <h3 className="text-xl font-bold text-foreground mb-2">Empowerment</h3>
              <p className="text-muted-foreground">
                We give creators the tools, knowledge, and confidence to build sustainable, successful businesses.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="container mx-auto px-6 py-24 text-center">
        <div className="max-w-2xl mx-auto space-y-6">
          <h2 className="text-3xl font-bold text-[#d1ae94]">Ready to elevate your content?</h2>
          <p className="text-muted-foreground text-lg">
            Join Amsterdam's most professional creator community.
          </p>
          <a 
            href="/signup" 
            className="inline-block glow-red bg-primary text-primary-foreground hover:bg-[#d1ae94] rounded-full px-8 py-3 transition-colors"
          >
            Become a Creator
          </a>
        </div>
      </section>
    </PageContainer>
  );
};

export default About;
